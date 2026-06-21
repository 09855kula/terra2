import {Controller} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import {ProductsService} from "./products.service";
import {InjectModel} from "@nestjs/mongoose";
import {Inventories, InventoriesDocument} from "../inventories/schemas/inventories.schemas";
import {Model} from "mongoose";
import {ProductWeb} from "./interfaces/products.interface";

@Controller()
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        @InjectModel(Inventories.name) private inventoriesModel: Model<InventoriesDocument>,
        @InjectModel('ProductsWeb') private readonly productModel: Model<ProductWeb>,
    ) {
    }
    @EventPattern("IMPORT_ORDER")
    async importOrderBOT(data: Record<string, unknown>) {
        if (data) {
            // @ts-ignore
            const orderBot = JSON.parse(data)
            console.log(`Create order from TG_BOT: id -- ${orderBot.id} phone -- ${orderBot.phone}`);
            let inventory = await this.inventoriesModel.findOne({id: orderBot.inventory}).exec();
            if(inventory) {
                inventory.products.map(async i => {
                    orderBot.product_list.map(async product => {
                        if(i.id === product.id) {
                            const productWeb = await this.productModel.findOne({name: i.name, category: i.category}).exec()
                            const available = productWeb.available
                            await this.productModel.findOneAndUpdate(
                                {id: productWeb.id},
                                {$set: {available: available - product.count}}).exec()
                        }
                    })
                })
            }
        }


    }

    @EventPattern("DELETE_PRODUCTS")
    async importDeleteOrderBOT(data: Record<string, unknown>) {
        if (data) {
            // @ts-ignore
            const deleteOrderBot = JSON.parse(data)
            console.log(`Delete order from TG_BOT: id - ${deleteOrderBot.id} phone - ${deleteOrderBot.phone}`);
            let inventory = await this.inventoriesModel.findOne({id: deleteOrderBot.inventory}).exec();
            if(inventory) {
                inventory.products.map(async i => {
                    deleteOrderBot.product_list.map(async product => {
                        if(i.id === product.id) {
                            const productWeb = await this.productModel.findOne({name: i.name, category: i.category}).exec()
                            // console.log('productWeb:',productWeb)
                            // console.log('product.count:',product.count)
                            const available = productWeb.available
                            // console.log('available:',available)
                            await this.productModel.findOneAndUpdate(
                                {id: productWeb.id},
                                {$set: {available: available + product.count}}).exec()
                        }
                    })
                })
            }
            // console.log('inventory:', inventory)
            // console.log('orderBot.inventory:', deleteOrderBot.inventory)
            // console.log('orderBot.product_list:', deleteOrderBot.product_list)
        }


    }

    @EventPattern("IMPORT_PRODUCTS")
    async handleMessagePrinted(data: Record<string, unknown>) {
        console.log(` Started importing products for next week: ${data.toString()}`);
        const PRODUCT_SHEET = data.toString()
        setTimeout(async () => {
            await this.productsService.importsProductsForApp(PRODUCT_SHEET)
            // await this.productsService.importInventories(PRODUCT_SHEET)
            // console.log('PRODUCT_SHEET:',PRODUCT_SHEET)
            //const info = await this.productsService.updateInventories()
            // console.log('info:', info)
            //await this.productsService.exportInventories(PRODUCT_SHEET, info, false)
        }, 10000)

    }

}