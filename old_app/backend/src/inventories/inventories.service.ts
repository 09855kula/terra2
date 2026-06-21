import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GetInventoryArgs} from "./dto/args/get-inventory.args";
import {createInventoriesInput} from "./dto/input/create-inventory.input";
import {updateInventoriesInput} from "./dto/input/update-inventory.input";
import {deleteInventoriesInput} from "./dto/input/delete-inventory.input";
import {Inventories, InventoriesDocument} from "./schemas/inventories.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {ProductsService} from "../products/products.service";
import {ProductWeb} from "../products/interfaces/products.interface";
import {UsersWebDocument, UsersWeb} from "../users/schemas/users.schemas";
import {OrdersController} from "../orders/orders.controller";

const moment = require("moment");

@Injectable()
export class InventoriesService {
    constructor(@InjectModel(Inventories.name) private inventoriesModel: Model<InventoriesDocument>,
                private googleSheetsService: GoogleSheetsService,
                @Inject(forwardRef(() => OrdersController)) private readonly ordersController: OrdersController,
                @InjectModel('ProductsWeb') private readonly productModel: Model<ProductWeb>,
                @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService) {
    }

    products: []

    async createInventory(createInventoriesData: createInventoriesInput): Promise<InventoriesDocument> {
        const createdCategories = new this.inventoriesModel(createInventoriesData);
        return await createdCategories.save();

    }

    async updateInventory(id, updateInventoriesData: updateInventoriesInput): Promise<InventoriesDocument> {
        return this.inventoriesModel.findOneAndUpdate(id, updateInventoriesData, {new: true})
    }

    async getInventoryMy(getInventoryArgs: GetInventoryArgs): Promise<InventoriesDocument> {
        return await this.inventoriesModel.findOne(getInventoryArgs).exec();

    }

    async getInventories(): Promise<InventoriesDocument[]> {
        return await this.inventoriesModel.find().exec();
    }

    async deleteInventory(deleteInventoryData: deleteInventoriesInput): Promise<InventoriesDocument> {
        return this.inventoriesModel.findOneAndRemove(deleteInventoryData)

    }

    async create({owner_id}): Promise<null | object> {
        const created = moment().format();
        await this.inventoriesModel.updateMany({inventories_for_web: true}, {$set: {inventories_for_web: false}})
        const inventory = new this.inventoriesModel({
            created,
            owner_id,
            products: [],
            reserved: [],
            sold: [],
            orders: [],
            inventories_for_web: true
        });
        const id = inventory.id = inventory._id;
        await inventory.save();
        return inventory;
    }

    async getInventory({id}): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;
            return inventory.toObject();
        } catch (err) {
            console.error(`Could not get Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async clearProducts({id}): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;

            const updated = await this.inventoriesModel.updateOne({id}, {
                $set: {
                    products: []
                }
            }).exec();

            return await this.getInventory({id});
        } catch (err) {
            console.error(`Could not add product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async clearReserved({id}): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;

            const updated = await this.inventoriesModel.updateOne({id}, {
                $set: {
                    reserved: []
                }
            }).exec();

            return await this.getInventory({id});
        } catch (err) {
            console.error(`Could not add product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async setProduct({id, product, count}): Promise<null | number> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;

            const transformed = inventory.products.map(
                p => ((p.id === product.id) ? {...p, count} : p)
            );

            const updated = this.inventoriesModel.updateOne({id}, {
                $set: {products: transformed}
            }).exec();
            await this.inventoriesModel.findOne({id}).exec();
        } catch (err) {
            console.error(`Could not set product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async changeProducts({id, product}) {
        try {
            let inventory = await this.inventoriesModel.findOne({id, inventories_for_web: true}).exec();
            if (inventory == null) return null;

            const transformed = inventory.products.map(
                p => {
                    if (p.id === product.id) {
                        return {
                            id: p.id,
                            count: p.count - product.count,
                            name: p.name,
                            category: p.category,
                            available: p.available - product.count
                        }
                    }
                    return p
                }
            )
            const available = await this.productModel.findOne({id: product.id}).exec()
            const newAvailable = await this.productModel.findOneAndUpdate({id: product.id}, {
                available: available.available - product.count
            }).exec()

            return this.inventoriesModel.updateOne({id, inventories_for_web: true}, {
                $set: {products: transformed}
            }).exec()
        } catch (err) {
            console.error(`Could not set product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async changeProductsTGBOT({driver_id, product, order_id}) {
        try {
            const driver = await this.usersModel.findOne({phone: driver_id}).exec()
            const idDriver = driver.id.toString()
            let inventory = await this.inventoriesModel.findOne({working: true, driver_id: idDriver}).exec();
            if (inventory == null) return null;
            const currentProduct = await this.productModel.findOne({id: product.id}).exec();
            let idProductTGBOT
            let available
            const transformed = inventory.products.map(
                p => {
                    if (p.name === currentProduct.name && p.category === currentProduct.category) {
                        idProductTGBOT = p.id
                        available = p.count - product.count
                        return {
                            id: p.id,
                            count: p.count - product.count,
                            name: p.name,
                            category: p.category
                        }
                    }
                    return p
                }
            )

            // const produtsUpdated = await this.inventoriesModel.updateOne(
            //     {
            //         working: true, driver_id: idDriver
            //     }, {
            //         $set: {products: transformed}
            //     }).exec()
            const availableProduct = await this.productModel.findOne({id: product.id}).exec();
            // console.log('availableProduct.available:',availableProduct.available)
            if(availableProduct.available === 1){
                await this.ordersController.getAvailableWarning({id: idProductTGBOT, count: 1, phone: driver_id})
            }
            if(availableProduct.available === 2){
                await this.ordersController.getAvailableWarning({id: idProductTGBOT, count: 2, phone: driver_id})
            }
            if(availableProduct.available === 3){
                await this.ordersController.getAvailableWarning({id: idProductTGBOT, count: 3, phone: driver_id})
            }
            // return produtsUpdated
        } catch (err) {
            console.error(`Could not set product to Inventory TGBOT id ${driver_id}, err = ${err}`);
            throw err;
        }
    }


    async redeemProductTGBOT({
                            id,
                            driver_id,
                            order_id,
                            product: {
                                count = 1,
                                ...product
                            }
                        }): Promise<null | object> {
        try {
            const driver = await this.usersModel.findOne({phone: driver_id}).exec()
            const idDriver = driver.id.toString()
            let inventory = await this.inventoriesModel.findOne({working: true, driver_id: idDriver}).exec();
            if (inventory == null) return null;
            console.log('inventory:', inventory)
            return await this.reserveProductTGBOT({
                id,
                driver_id,
                order_id,
                product: {
                    id: product.id,
                    count: -count
                }
            });
        } catch (err) {
            console.error(`Could not add product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    };
    async reserveProductTGBOT({
                                  id, driver_id, order_id, product: {
            count = 1,
            ...product
        }}) {
        try {
            const driver = await this.usersModel.findOne({phone: driver_id}).exec()
            const idDriver = driver.id.toString()
            let inventory = await this.inventoriesModel.findOne({working: true, driver_id: idDriver}).exec();
            if (inventory == null) return null;

            if (!inventory.orders.includes(order_id)) {
                await this.inventoriesModel.updateOne({working: true, driver_id: idDriver}, {
                    $push: {orders: order_id}
                }).exec();
            }
            const currentProduct = await this.productModel.findOne({id: product.id}).exec();
            const _product = inventory.products.find(
                p => p.name === currentProduct.name && p.category === currentProduct.category
            );
            // console.log('_product:',_product)
            // console.log('_product.id:',_product.id)
            // console.log('inventory.reserved:',inventory.reserved)

            const reserved = inventory.reserved.find(
                r => r.id === _product.id
            );
            if (!_product || !_product.count) return null;

            // console.log('reserved:',reserved)
            if (!reserved) {
                const result = await this.inventoriesModel.updateOne({working: true, driver_id: idDriver}, {
                    $push: {
                        reserved: {
                            id: _product.id,
                            count: count
                        }
                    }
                }).exec();
                return {[_product.id]: count};
            } else {
                const transformed = inventory.reserved.map(
                    p => (p.id === _product.id)
                        ? ({id: _product.id, count: p.count + count})
                        : p
                ).filter(i => i.count !== 0);

                const updated = await this.inventoriesModel.updateOne({working: true, driver_id: idDriver}, {
                    $set: {
                        reserved: transformed
                    }
                }).exec();

                return {[_product.id]: product.count};

            }

        } catch (err) {
            console.error(`Could not set reserved products Inventory ${id}, err = ${err}`);
            throw err;
        }
    }
    async changeAvailableProductsTGBOT({driver_id, id, product}) {
        try {
            const driver = await this.usersModel.findOne({phone: driver_id}).exec()
            const idDriver = driver.id.toString()
            let inventory = await this.inventoriesModel.findOne({working: true, driver_id: idDriver}).exec();
            if (inventory == null) return null;
            const currentProduct = await this.productModel.findOne({id: product.id}).exec();
            const transformed = inventory.products.map(
                p => {
                    if (p.name === currentProduct.name && p.category === currentProduct.category) {
                        return {
                            id: p.id,
                            count: p.count + product.count,
                            name: p.name,
                            category: p.category
                        }
                    }
                    return p
                }
            ).filter(i => i.count !== 0)

            return this.inventoriesModel.updateOne({working: true, driver_id: idDriver}, {
                $set: {products: transformed}
            }).exec()
        } catch (err) {
            console.error(`Could not set product to Inventory TG_BOT ${driver_id}, err = ${err}`);
            throw err;
        }
    }

    async changeAvailableProducts({id, product}) {
        try {
            let inventory = await this.inventoriesModel.findOne({id, inventories_for_web: true}).exec();
            if (inventory == null) return null;

            const transformed = inventory.products.map(
                p => {
                    if (p.id === product.id) {
                        return {
                            id: p.id,
                            count: p.count + product.count
                        }
                    }
                    return p
                }
            ).filter(i => i.count !== 0)
            const available = await this.productModel.findOne({id: product.id}).exec()
            await this.productModel.findOneAndUpdate({id: product.id}, {
                available: available.available + product.count
            }).exec()
            return this.inventoriesModel.updateOne({id, inventories_for_web: true}, {
                $set: {products: transformed}
            }).exec()
        } catch (err) {
            console.error(`Could not set product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    }

    async canReserve({id, products}): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;

            const count = inventory.products.reduce(
                (a, c) => Object.assign(a, {
                    [c.id]: c.count
                }), {}
            );

            const reserved = inventory.reserved.reduce(
                (a, c) => Object.assign(a, {
                    [c.id]: c.count
                }), {}
            );

            const sold = inventory.sold.reduce(
                (a, c) => Object.assign(a, {
                    [c.id]: c.count
                }), {}
            );

            const can = Object.keys(products).reduce(
                (a, i) => Object.assign(a, {
                    [i]: Math.min(
                        products[i],
                        (count[i] || 0) - (reserved[i] || 0) - (sold[i] || 0)
                    )
                }), {}
            );

            const cant = Object.keys(products).reduce(
                (a, i) => Object.assign(a, {
                    [i]: products[i] - can[i]
                }), {}
            );

            return {can, cant};

        } catch (err) {
            console.error(`Could not get reserved products Inventory ${id}, err = ${err}`);
            throw err;
        }
    }

    async reserveProduct({
                             id, order_id, product: {
            count = 1,
            ...product
        }
                         }): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id, inventories_for_web: true}).exec();
            if (inventory == null) return null;
            if (!inventory.orders.includes(order_id)) {
                await this.inventoriesModel.updateOne({id}, {
                    $push: {orders: order_id}
                }).exec();
            }
            const _product = inventory.products.find(
                p => p.id === product.id
            );
            if (!_product || !_product.count) return null;
            const reserved = inventory.reserved.find(
                r => r.id === product.id
            );
            if (!reserved) {
                const result = await this.inventoriesModel.updateOne({id, inventories_for_web: true}, {
                    $push: {
                        reserved: {
                            id: product.id,
                            count: count
                        }
                    }
                }).exec();
                return {[product.id]: count};
            } else {
                const transformed = inventory.reserved.map(
                    p => (p.id === product.id)
                        ? ({id: product.id, count: p.count + count})
                        : p
                ).filter(i => i.count !== 0);
                const updated = await this.inventoriesModel.updateOne({id, inventories_for_web: true}, {
                    $set: {
                        reserved: transformed
                    }
                }).exec();
                return {[product.id]: product.count};
            }
        } catch (err) {
            console.error(`Could not set reserved products Inventory ${id}, err = ${err}`);
            throw err;
        }
    }

    async addSold({
                      id,
                      order_id,
                      product: {
                          count = 1,
                          ...product
                      }
                  }): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id}).exec();
            if (inventory == null) return null;

            const _product = inventory.products.find(
                p => p.id === product.id
            );

            // not in inventory products
            if (!_product || !_product.count) return null;

            const sold = inventory.sold.find(
                r => r.id === product.id
            );

            // not reserved yet
            if (!sold) {
                const _count = Math.min(count, _product.count);

                const result = await this.inventoriesModel.updateOne({id}, {
                    $push: {
                        sold: {
                            id: product.id,
                            count: _count
                        }
                    }
                }).exec();
                return {[product.id]: _count};
            }

            const delta = Math.min(count, _product.count - sold.count);

            const transformed = inventory.sold.map(
                p => (p.id === product.id)
                    ? ({id: product.id, count: sold.count + delta})
                    : p
            );

            const updated = await this.inventoriesModel.updateOne({id}, {
                $set: {
                    sold: transformed
                }
            }).exec();

            return {[product.id]: delta};
        } catch (err) {
            console.error(`Could not set sold products Inventory ${id}, err = ${err}`);
            throw err;
        }
    }

    async redeemProduct({
                            id,
                            order_id,
                            product: {
                                count = 1,
                                ...product
                            }
                        }): Promise<null | object> {
        try {
            let inventory = await this.inventoriesModel.findOne({id, inventories_for_web: true}).exec();
            if (inventory == null) return null;

            return await this.reserveProduct({
                id,
                order_id,
                product: {
                    id: product.id,
                    count: -count
                }
            });
        } catch (err) {
            console.error(`Could not add product to Inventory id ${id}, err = ${err}`);
            throw err;
        }
    };
}
