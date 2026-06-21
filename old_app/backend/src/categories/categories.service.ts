import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {createCategoriesInput} from "./dto/input/create-category.input";
import {updateCategoriesInput} from "./dto/input/update-category.input";
import {GetCategoryArgs} from "./dto/args/get-category.args";
import {deleteCategoryInput} from "./dto/input/delete-category.input";
import {CategoriesWeb, CategoriesDocument} from "./schemas/categories.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(CategoriesWeb.name) private categoriesModel: Model<CategoriesDocument>,
                private googleSheetsService: GoogleSheetsService) {
    }

    async createCategory(createCategoriesData: createCategoriesInput): Promise<CategoriesDocument> {
        const createdCategories = new this.categoriesModel(createCategoriesData);
        return await createdCategories.save();

    }

    async updateCategory(name, updateCategoriesData: updateCategoriesInput): Promise<CategoriesDocument> {
        return this.categoriesModel.findOneAndUpdate(name, updateCategoriesData, {new: true})
    }

    async getCategory(GetCategoryArgs: GetCategoryArgs): Promise<CategoriesDocument> {
        return await this.categoriesModel.findOne(GetCategoryArgs).exec();

    }

    async getCategories(): Promise<CategoriesDocument[]> {
        // power rabbitMQ
        // await this.importCategories()
        const activeCategories = await this.categoriesModel.find().exec();
        // await console.log('activeCategories:', `received ${activeCategories.length} categories`);
        return activeCategories;

    }
    async importCategories() {
        const data = await this.googleSheetsService.importCategories()
        await this.categoriesModel.deleteMany({});
        const groups = data[0];
        const categories = data[1];
        const packs = data[2];
        const measures = data[3];
        const giftables = data[4];
        const pic_urls = data[5];
        const indicas = data[6];
        const LSO = data[7];
        const effects = data[8];
        await this.createFromRows(categories, groups, giftables, measures, pic_urls, indicas, LSO, effects);
        await this.updatePacks(packs);
        // @ts-ignore
        for (let i = 6; i < data.length; i++) {
            await this.updateCost(data[i], i);
        }
        const categories_with_costs = await this.categoriesModel.find().exec();
        console.log('Attention! Categories and costs successful updated');
        const info = categories_with_costs.map(({name, group, costs, pack}) => ({
            name, group, pack, costs: costs?.length
        }));
        console.log('Attention! Updated: ' + Object.values(info).length + '  categories');
        return await this.categoriesModel.find().exec();
    }
    async deleteCategory(deleteCategoryData: deleteCategoryInput): Promise<CategoriesDocument> {
        return this.categoriesModel.findOneAndRemove(deleteCategoryData)

    }

    async createFromRows(categories, groups, giftables, measures, pic_urls, indicas, LSO, effects) {
        try {
            if (categories.length) {
                for (let i = 1; i < categories.length; i++) {
                    const name = categories[i];
                    const group = groups[i];
                    const giftable = giftables[i];
                    const measure = measures[i]
                    const pic_url = pic_urls[i]
                    const indica = indicas[i];
                    const lso = LSO[i]
                    const effect = effects[i]
                    if (name) {
                        const category_at = await this.categoriesModel.findOne({index: i}).exec();
                        if (category_at) {
                            await this.categoriesModel.updateOne({index: i}, {
                                $set: {
                                    name,
                                    group,
                                    giftable: giftable === 'TRUE',
                                    measure,
                                    pic_url,
                                    indica: indica === 'TRUE',
                                    lso: lso === 'TRUE',
                                    effect: effect === 'ЛОЖЬ' || effect === '' ? null : effect,
                                    costs: []
                                }
                            }).exec();
                        } else {
                            const category = new this.categoriesModel({
                                index: i,
                                group,
                                name,
                                giftable: giftable === 'TRUE',
                                measure,
                                pic_url,
                                indica: indica === 'TRUE',
                                lso: lso === 'TRUE',
                                effect: effect === 'ЛОЖЬ' || effect === '' ? null : effect,
                            });
                            await category.save();
                        }
                    }
                }
                return await this.categoriesModel.find({}).exec();
            }
            return;
        } catch (err) {
            console.error(`Could not create Category # ${categories[0]}, err = ${err}`);
            throw err;
        }
    }

    async updatePacks(row) {
        try {
            if (row.length) {
                for (let i = 1; i < row.length; i++) {
                    const pack = parseInt(row[i]);
                    if (pack) {
                        await this.categoriesModel.updateOne({index: i}, {
                            $set: {
                                pack
                            }
                        }).exec();
                    }
                }
                return await this.categoriesModel.find().exec();
            }
            return;
        } catch (err) {
            console.error(`Could not create Category # ${row[0]}, err = ${err}`);
            throw err;
        }
    }

    async updateCost(row, index) {
        try {
            if (row.length) {
                const units = row[0];

                const unit = parseInt(units);
                if (unit) {
                    for (let i = 1; i < row.length; i++) {
                        const cost = parseFloat(row[i]);
                        if (cost) {
                            await this.categoriesModel.updateOne({index: i}, {
                                $push: {
                                    costs: {unit, cost}
                                }
                            }).exec();
                        }
                    }
                    return await this.categoriesModel.find({}).exec();
                }
            }
            return null;
        } catch (err) {
            console.error(`Could not create Category # ${row[0]}, err = ${err}`);
            throw err;
        }
    }

}
