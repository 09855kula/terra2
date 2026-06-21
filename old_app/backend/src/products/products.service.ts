import {Model} from 'mongoose';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {v4 as uuidv4} from 'uuid';
import {ProductWeb} from './interfaces/products.interface';
import {GetProductsArgs} from './dto/args/get-products.args';
import {deleteProductInput} from "./dto/inputs/delete-product.input";
import {updateProductInput} from "./dto/inputs/update-product.input";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {UsersService} from "../users/users.service";
import {SchedulesWeb, SchedulesDocument} from "../schedules/schemas/schedules.schemas";
import {Inventories, InventoriesDocument} from "../inventories/schemas/inventories.schemas";
import {InventoriesService} from "../inventories/inventories.service";
import {CategoriesService} from "../categories/categories.service";
import {OrdersService} from "../orders/orders.service";
import {OrdersWeb, OrdersWebDocument} from "../orders/schemas/orders.schemas";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
const {wkColsForApp, productCategoriesForApp, categoryColForApp, prodSheetNameForApp, prodSheetNameForAppNew} = require("./../sheets/sheets_const_for_app");

const moment = require('moment');


@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('ProductsWeb') private readonly productModel: Model<ProductWeb>,
        @InjectModel(SchedulesWeb.name) private schedulesModel: Model<SchedulesDocument>,
        @InjectModel(Inventories.name) private inventoriesModel: Model<InventoriesDocument>,
        @InjectModel(OrdersWeb.name) private ordersModel: Model<OrdersWebDocument>,
        @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
        private readonly googleSheetsService: GoogleSheetsService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly categoriesService: CategoriesService,
        private readonly inventoriesService: InventoriesService,
        @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService
    ) {
    }

    async createProducts(createProductDto: GetProductsArgs): Promise<ProductWeb> {
        const createdProduct = new this.productModel(createProductDto);
        return await createdProduct.save();
    }

    async findAllProducts(): Promise<ProductWeb[]> {
        // power rabbitMQ
        // await this.importsProductsForApp()
        const activeProducts = (await this.productModel.find({active: true}).exec())
        console.log('activeProducts:', `received ${activeProducts.length} products`)
        // const importedProducts = await this.importsProducts()
        // console.log('importedProducts:',importedProducts)
        return activeProducts
    }

    async importsProductsForApp(PRODUCT_SHEET) {
        await this.categoriesService.importCategories()
        const productsRows = await this.googleSheetsService.importProductsForApp(PRODUCT_SHEET)
        await this.productModel.deleteMany({}).exec();
        const productsUpdate = productsRows.map(
            async row => await this.updateFromRowForApp(row)
        );
        const productsWeek = await Promise.all(productsUpdate);
        console.log(`Attention! Import products from week ${PRODUCT_SHEET} success, update: ${productsWeek.length} products`)
        // // import  inventory drivers
        const auth = await this.googleSheetsService.authGoogleSheets()
        const rows = await this.googleSheetsService.getSheetsProductsForApp(auth);
        // console.log(rows)
        const driverRows = await this.googleSheetsService.importInventoryForApp(PRODUCT_SHEET)
        //console.log('driverRows:',driverRows)

        const header = rows[1];
        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if (splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUser({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, {column: i})
        ).filter(d => d);
        const _products = driverRows.map(
            async row => await this.productModel.findOne({
                active: true,
                name: row[0],
                category: row[6]
            }).exec()
        );
        //  connect with rows
        const products = (await Promise.all(_products)).map(
            (p, i) => p && Object.assign(p, {row: i})
        ).filter(p => p);
        const product_dict = products.reduce((a, c) => Object.assign(a, {
            [c.id]: c
        }), {});
        const _inventories = drivers.map(
            async driver => {
                const product_map = products.map(
                    ({id, row, name, category}) =>
                        ({
                            id,
                            count: parseInt(driverRows[row][driver.column]) || 0,
                            name,
                            category,
                            available: parseInt(driverRows[row][driver.column]) || 0,
                        })
                );
                const inventory = await this.usersService.getInventory({
                    id: driver.id
                });
                // console.log('product_map:',product_map[0])
                inventory.products = product_map;
                return await inventory.save();
            }
        );
        const inventories = await Promise.all(_inventories);
        // console.log('inventories[0]:',inventories[0])
        const info = inventories.map(
            i => i.products.reduce((a, c) => a + c.count, 0)
        );
        // console.log('info:',info[0])
        const updated_schedule = await this.schedulesModel.updateOne({id: 'main'}, {
            $set: {drivers: drivers.map(d => d.id)}
        }).exec();
        console.log('Attention! Imports products in inventories: ' + info.join(' | '));
        const productsFromInventories = inventories.map(i => i.products)
        // console.log('productsFromInventories:',productsFromInventories)
        const firstDriverInventory = productsFromInventories[0]
        // console.log('firstDriverInventory:',firstDriverInventory[0])
        const amountInventoryDrivers = firstDriverInventory.map(i => {
            if (productsFromInventories.length > 1) {
                const twoDriverInventory = productsFromInventories[1]
                twoDriverInventory.map(a => {
                    if (i.id === a.id) {
                        // if(i.count > a.count) {
                        //     return {
                        //         id: a.id,
                        //         count: a.count
                        //     }
                        // }
                        if (i.count > 0 && a.count > 0) {
                            if (i.count > a.count) {
                                return {
                                    id: a.id,
                                    count: a.count,
                                    name: a.name,
                                    category: a.category,
                                    available: a.avialable
                                }
                            } else {
                                return {
                                    id: i.id,
                                    count: i.count,
                                    name: i.name,
                                    category: i.category,
                                    available: i.avialable
                                }
                            }
                        } else if (i.count === 0) {
                            return {
                                id: a.id,
                                count: a.count,
                                name: a.name,
                                category: a.category,
                                available: a.avialable
                            }
                        } else if (a.count === 0) {
                            return {
                                id: i.id,
                                count: i.count,
                                name: i.name,
                                category: i.category,
                                available: i.avialable
                            }
                        }

                        return a


                    }

                })
            }
            return i
        })

        // console.log('amountInventoryDrivers:', amountInventoryDrivers)
        const _cleaned = inventories.map(async ({id}) => await this.inventoriesService.clearReserved({id}));
        const cleaned = await Promise.all(_cleaned);
        const driversInventoryCosts = await this.productModel.find({active: true}).exec()
        // console.log('driversInventoryCosts:', driversInventoryCosts[0])
        // console.log('amountInventoryDrivers:', amountInventoryDrivers[0])

        const prod = driversInventoryCosts.map( async product => {
            amountInventoryDrivers.map( async inventory => {
                if (product.id === inventory.id) {
                   return await this.productModel.findOneAndUpdate({id: product.id}, {
                        $set: {available: inventory.count}
                    }).exec();
                }
            })
            return product
        })

        const _prod = await Promise.all(prod);
        // console.log('_prod:', _prod[0])
        const productsAvailable = await this.productModel.find({}).exec()
        // console.log('продукты_после_добавления_авиалабле:', productsAvailable[0])
        return productsAvailable

    }


    async importsProducts() {
        // import products for a week
        const PRODUCT_SHEET = "Wk1";
        const productsRows = await this.googleSheetsService.importProducts(PRODUCT_SHEET)
        await this.productModel.updateMany({}, {
            $set: {active: false}
        }).exec();
        const productsUpdate = productsRows.map(
            async row => await this.updateFromRow(row)
        );
        const productsWeek = await Promise.all(productsUpdate);
        console.log(`Attention! Import products from week ${PRODUCT_SHEET} success, update: ${productsWeek.length} products`)
        // import  inventory drivers
        const auth = await this.googleSheetsService.authGoogleSheets()
        const rows = await this.googleSheetsService.getSheetsProducts(auth);
        const driverRows = await this.googleSheetsService.importInventory(PRODUCT_SHEET)

        const header = rows[1];
        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if (splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUser({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, {column: i})
        ).filter(d => d);
        const _products = driverRows.map(
            async row => await this.productModel.findOne({
                active: true,
                name: row[0],
                category: row[6]
            })
        );
        // connect with rows
        const products = (await Promise.all(_products)).map(
            (p, i) => p && Object.assign(p, {row: i})
        ).filter(p => p);

        const product_dict = products.reduce((a, c) => Object.assign(a, {
            [c.id]: c
        }), {});
        const _inventories = drivers.map(
            async driver => {
                const product_map = products.map(
                    ({id, row}) => ({
                        id,
                        count: parseInt(driverRows[row][driver.column]) || 0
                    })
                );

                const inventory = await this.usersService.getInventory({
                    id: driver.id
                });

                // mutate and commit model
                inventory.products = product_map;
                //console.log('inventory:',inventory)
                return await inventory.save();
            }
        );
        const inventories = await Promise.all(_inventories);

        const info = inventories.map(
            i => i.products.reduce((a, c) => a + c.count, 0)
        );

        const updated_schedule = await this.schedulesModel.updateOne({id: 'main'}, {
            $set: {drivers: drivers.map(d => d.id)}
        }).exec();
        console.log('Attention! Imports products in inventories: ' + info.join(' | '));
        const productsFromInventories = inventories.map(i => i.products)
        const firstDriverInventory = productsFromInventories[0]
        const twoDriverInventory = productsFromInventories[1]
        if (!twoDriverInventory) return null
        const amountInventoryDrivers = firstDriverInventory.map(i => {
            if (twoDriverInventory) {
                twoDriverInventory.map(a => {
                    if (i.id === a.id) {
                        // if(i.count > a.count) {
                        //     return {
                        //         id: a.id,
                        //         count: a.count
                        //     }
                        // }
                        if (i.count > 0 && a.count > 0) {
                            if (i.count > a.count) {
                                return {
                                    id: a.id,
                                    count: a.count
                                }
                            } else {
                                return {
                                    id: i.id,
                                    count: i.count
                                }
                            }
                        } else if (i.count === 0) {
                            return {
                                id: a.id,
                                count: a.count
                            }
                        } else if (a.count === 0) {
                            return {
                                id: i.id,
                                count: i.count
                            }
                        }

                        return a


                    }

                })
                return i

            }
        })

        // console.log('twoDriverInventory:', twoDriverInventory)
        const _cleaned = inventories.map(async ({id}) => await this.inventoriesService.clearReserved({id}));
        const cleaned = await Promise.all(_cleaned);
        const driversInventoryCosts = await this.productModel.find({active: true}).exec()
        driversInventoryCosts.map(product => {
            amountInventoryDrivers.map(inventory => {
                if (product.id === inventory.id) {
                    this.productModel.updateOne({id: product.id}, {
                        $set: {available: inventory.count}
                    }).exec();
                }
            })
        })
        return await this.productModel.find({active: true}).exec()
        // return await this.productModel.find().exec()

    }

    async updateFromRow(row) {
        try {
            if (!row.length || !row[0]) return null;
            let product = await this.productModel.findOne({
                name: row[0],
                category: row[6]
            }).exec();
            if (!product) return await this.createFromRow(row);
            const {id} = product;
            await this.productModel.updateOne({id}, {
                $set: {
                    active: true,
                    description: row[1],
                    img_url: row[5],
                    category: row[6]
                }
            });
            return await this.getProduct({id});
        } catch (err) {
            console.error(`Could not update Product # ${row[0]}, err = ${err}`);
            throw err;
        }
    }
    async updateFromRowForApp(row) {
        try {
            if (!row.length || !row[0]) return null;
            await this.productModel.deleteMany({})
            let product = await this.productModel.findOne({
                name: row[0],
                category: row[6]
            }).exec();
            if (!product) return await this.createFromRowForApp(row);
            const {id} = product;
            await this.productModel.updateOne({id}, {
                $set: {
                    active: true,
                    description: row[1],
                    top_effect: row[2] || 'No Effect',
                    top_flavour: row[3] || 'No Flavour',
                    price_tag: row[4] || '$$',
                    img_url: row[5],
                    category: row[6],
                    type: row[7] || 'No Type'
                }
            });
            return await this.getProduct({id});
        } catch (err) {
            console.error(`Could not update Product # ${row[0]}, err = ${err}`);
            throw err;
        }
    }
    async createFromRow(row) {
        try {
            let id = null
            if (row.length && row[0]) {
                const product = new this.productModel({
                    active: true,
                    name: row[0],
                    description: row[1],
                    img_url: row[5],
                    category: row[6],
                    id: uuidv4(),
                });
                id = product.id
                await product.save();
            }
            if (!id) return null;
            return await this.getProduct({id});
        } catch (err) {
            console.error(`Could not create Product # ${row[0]}, err = ${err}`);
            throw err;
        }
    };

    async createFromRowForApp(row) {
        try {
            let id = null
            if (row.length && row[0]) {
                const product = new this.productModel({
                    active: true,
                    name: row[0],
                    description: row[1],
                    top_effect: row[2] || 'No Effect',
                    top_flavour: row[3] || 'No Flavour',
                    price_tag: row[4] || '$$',
                    img_url: row[5],
                    category: row[6],
                    type: row[7] || 'No Type',
                    id: uuidv4(),
                });
                id = product.id
                await product.save();
            }
            if (!id) return null;
            return await this.getProduct({id});
        } catch (err) {
            console.error(`Could not create Product # ${row[0]}, err = ${err}`);
            throw err;
        }
    };

    async getProduct({id}) {
        try {
            return await this.productModel.findOne({id}).exec();
        } catch (err) {
            console.error(`Could not get Product # ${id}, err = ${err}`);
            throw err;
        }
    };

    async setGiftForProduct(id, gift_group, gift_category) {
        try {
            await this.productModel.updateOne({id}, {
                $set: {got_gift: {active: true, gift_group: gift_group, gift_category: gift_category}}
            }).exec();
            return await this.productModel.findOne({id}).exec();
        } catch (err) {
            console.error(`Could not get Product # ${id}, err = ${err}`);
            throw err;
        }
    };

    async findOneProduct(id): Promise<ProductWeb> {
        return await this.productModel.findOne(id).exec();
    }

    async deleteProduct(deleteProductData: deleteProductInput): Promise<ProductWeb> {
        return this.productModel.findOneAndRemove(deleteProductData)
    }

    async updateProduct(id, updateProductData: updateProductInput): Promise<ProductWeb> {
        return this.productModel.findOneAndUpdate(id, updateProductData, {new: true})
    }

    async getProductsById(getProductsById): Promise<ProductWeb[]> {
        try {
            console.log('getProductsById:', getProductsById)
            return await this.productModel.find(getProductsById.forEach(i => {
                return this.productModel.findOne({id: i})
            })).limit(getProductsById.length).exec();
        } catch (err) {
            // console.error(`Could not get Product # ${id}, err = ${err}`);
            throw err;
        }
    }

    async importInventories(PRODUCT_SHEET) {

        const auth = await this.googleSheetsService.authGoogleSheets()
        const rows = await this.googleSheetsService.getSheetsProductsForApp(auth);
        const product_rows = await this.googleSheetsService.importProductsForApp(PRODUCT_SHEET)


        const header = rows[1];

        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if(splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUserInventory({phone: splitted[1]})
            }
        );

        // connect with column numbers
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, { column: i })
        ).filter(d => d);

        const _products = product_rows.map(
            async row => await this.productModel.findOne({
                active: true,
                name: row[0],
                category: row[6]
            })
        );

        // connect with rows
        const products = (await Promise.all(_products)).map(
            (p, i) => p && Object.assign(p, { row: i })
        ).filter(p => p);

        const product_dict = products.reduce((a, c) => Object.assign(a, {
            [c.id]: c
        }), {});

        const _inventories = drivers.map(
            async driver => {
                const product_map = products.map(
                    ({ id, row }) => ({
                        id,
                        count: parseInt(product_rows[row][driver.column]) || 0
                    })
                );

                const inventory = await this.usersService.getInventory({
                    id: driver.id
                });

                // mutate and commit model
                inventory.products = product_map;
                return await inventory.save();
            }
        );

        const inventories = await Promise.all(_inventories);

        const info = inventories.map(
            i => i.products.reduce((a, c) => a + c.count, 0)
        );

        const updated_schedule = await this.schedulesModel.updateOne({ id: 'main' }, {
            $set: { drivers: drivers.map(d => d.id) }
        }).exec();

        console.log('PRODUCTS IN INVETORIES: ' + info.join(' | '));

        // const _cleaned = inventories.map(async ({ id }) => await InventoryModel.clearReserved({ id }));
        // const cleaned = await Promise.all(_cleaned);

        return inventories;
    }
    async findProduct({active,
                             name,
                             category}) {
        return this.productModel.findOne({active, name, category})

    }
    async exportInventories(PRODUCT_SHEET, info, is_automatic = false) {

        const auth = await this.googleSheetsService.authGoogleSheets()
        const rows_raw = await this.googleSheetsService.getSheetsProductsForApp(auth);
        const categories = await this.categoriesService.getCategories();

        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        //console.log('productSheetFormatted:',productSheetFormatted)
        // const rows = await this.googleSheetsService.exportProductsForApp(PRODUCT_SHEET)
        // @ts-ignore
        const rows = rows_raw.map((el,ind) =>{
            return el[0] && ((productCategoriesForApp.includes(el[categoryColForApp]) && el[wkColsForApp[productSheetFormatted]]))
                ? el
                : [];
        });
        const header = rows_raw[1];

        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                //testing if the format for driver is name/tel.num.
                if(splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) {
                    return Promise.resolve()
                }
                return await this.usersService.getUserInventory({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, { column: i })
        ).filter(d => d);
        //console.log('drivers:', drivers)

        const _products = rows.map(
            async row => {
                if (row.length===0){
                    return Promise.resolve();
                }
                const prod = await this.findProduct({
                    active: true,
                    name: row[0],
                    category: row[6]
                });
                return prod;
            }
        );
        //console.log('_products:',_products)
        const products = (await Promise.all(_products)).map(
            (p, i) => p && Object.assign(p, { row: i})
        ).filter(p => p);

        const n = products.reduce((max, { row }) => Math.max(max, row), 0) + 1;
        const m = drivers.reduce((max, { column }) => Math.max(max, column), 0) + 3;

        const export_rows = (new Array(n)).fill(null).map(
            _ => (new Array(m)).fill(null)
        );
        //console.log('products:',products)

        const _inventories = drivers.map(
            async driver => {

                // clean not exported cells with empty string
                for (let i = 2; i < n; i++) {
                    if(rows_raw[i][driver.column + 1]!=='A / R / S') {
                        export_rows[i][driver.column + 1] = '';
                    }
                }

                // from google spreadsheet
                const product_map = products.map(
                    ({ id, row }) => ({
                        id,
                        count: parseInt(rows[row][driver.column])
                    })
                );
                //console.log('product_map:',product_map);


                let inventory = await this.usersService.getInventory({
                    id: driver.id
                });
               // console.log('inventory:',inventory);

                //console.log('is_automatic:',is_automatic);

                const e_column = products.map(p => {
                    const { count: in_p } = inventory.products.find(_p => _p.id === p.id) || { count: 0 };
                    const { count: in_r } = inventory.reserved.find(_p => _p.id === p.id) || { count: 0 };
                    const { count: in_s } = inventory.sold.find(_p => _p.id === p.id) || { count: 0 };

                    const today = moment().format('dddd');
                    if(is_automatic ){//&& p.isInfinite) {
                        const available = parseInt(`${in_p - in_r - in_s}`);
                        const available_formatted = available < 0 ? 0 :available;
                        export_rows[p.row][driver.column] = available_formatted;
                    }

                    const text = `${in_p - in_r - in_s} / ${in_r} / ${in_s}`;
                    export_rows[p.row][driver.column + 1] = text;

                    let reserved_info = '', sold_info = '';
                    let additional_info = '';

                    const reserved = info.reserved[driver.phone];
                    if (reserved && reserved[p.id]) {
                        const in_orders = Object.keys(reserved[p.id].orders).map(
                            o => `${o} - x${reserved[p.id].orders[o]}`
                        ).join('\n');
                        // const in_orders = `reserved: ${reserved[p].count}\nin orders:\n${}`;
                        reserved_info = `reserved: ${reserved[p.id].count}\n${in_orders}`;
                    }

                    const sold = info.sold[driver.phone];
                    if (sold && sold[p.id]) {
                        const in_orders = Object.keys(sold[p.id].orders).map(
                            o => `${o} - x${sold[p.id].orders[o]}`
                        ).join('\n');
                        // const in_orders = `reserved: ${reserved[p].count}\nin orders:\n${}`;
                        sold_info = `sold: ${sold[p.id].count}\n${in_orders}`;
                    }

                    additional_info = `${reserved_info}\n\n${sold_info}`;
                    export_rows[p.row][driver.column + 2] = additional_info.trim();

                    return text + additional_info;
                });

                return await this.usersService.getInventory({ id: driver.id });
            }
        );

        const inventories = await Promise.all(_inventories);
        // console.log('inventories:',inventories);

        // console.log('JSON.stringify(export_rows):', JSON.stringify(export_rows));
        await this.googleSheetsService.updateSheetForAppNewt(auth, export_rows);

        return inventories;
    }


    async updateInventories() {

        const from = moment().startOf('isoWeek');
        const orders = await this.ordersModel.find({
            // delivery_date: { $gte: from },
            status: { $nin: ['draft'] }
        }).exec();

        // console.log(`total orders for week - ${orders.length}`);

        const _reserved = orders.filter(
            o => ([
                'pending',
                'approved',
                'soon',
                'in 20 min',
                'in 10 min',
                'in 5 min',
                'here',
                'today',
                'tomorrow'
            ].includes(o.status))
        ).filter(i => moment(i.delivery_date) > from);
        // console.log('approved:', orders)
        const reserved = await this.productsInOrders(_reserved);
        // console.log('reserved:',reserved)
        const _sold = orders.filter(
            o => (['completed', 'etf', 'etf-completed'].includes(o.status))
        );

        const sold = await this.productsInOrders(_sold);

        const schedule = await this.schedulesModel.findOne({id: 'main'});

        const drivers = await this.usersModel.find({ id: {
                $in: schedule.drivers
            }}).exec();
        // console.log('drivers:',drivers)
        for (let driver of drivers) {
            const inventory = await this.inventoriesModel.findOne({ id: driver.inventory }).exec();
            if (!inventory) continue;

            if (reserved[driver.phone]) {
                const reserved_array: ReservedArrayType[] = Object.keys(reserved[driver.phone]).map(
                    k => ({
                        id: k,
                        count: reserved[driver.phone][k].count
                    })
                );
                // console.log('reserved_array:',reserved_array)
                const updated = await this.inventoriesModel.updateOne({ id: inventory.id }, {
                    $set: {
                        reserved: reserved_array
                    }
                }).exec();
                // console.log('updated:',updated)
            } else {
                const updated = await this.inventoriesModel.updateOne({ id: inventory.id }, {
                    $set: {
                        reserved: []
                    }
                }).exec();
            }
            if (sold[driver.phone]) {
                const sold_array = Object.keys(sold[driver.phone]).map(
                    k => ({
                        id: k,
                        count: sold[driver.phone][k].count
                    })
                );
                const updated = await this.inventoriesModel.updateOne({ id: inventory.id }, {
                    $set: {
                        sold: sold_array
                    }
                }).exec();
            } else {
                const updated = await this.inventoriesModel.updateOne({ id: inventory.id }, {
                    $set: {
                        sold: []
                    }
                }).exec();
            }
        }

        return {
            reserved,
            sold
        };
    }

    async productsInOrders(orders) {
        const by_driver = {};
        const products = {};
        for (let o of orders) {
            const p_in_order = await o.all_products();
            // console.log('p_in_order:', p_in_order)

            for (let p of p_in_order) {
                // create new object for product collection
                if (!by_driver[o.driver_id]) by_driver[o.driver_id] = {};

                if (!by_driver[o.driver_id][p]) {
                    by_driver[o.driver_id][p] = {
                        count: 1,
                        orders: {
                            [o.id]: 1
                        }
                    };
                } else {
                    by_driver[o.driver_id][p].count++;
                    if (!by_driver[o.driver_id][p].orders[o.id]) {
                        by_driver[o.driver_id][p].orders[o.id] = 1;
                    } else {
                        by_driver[o.driver_id][p].orders[o.id]++;
                    }
                }
            }
        }
        // console.log('by_driver:',by_driver)
        return by_driver;
    }


}

interface ReservedArrayType {
    id: string
    count: number
}