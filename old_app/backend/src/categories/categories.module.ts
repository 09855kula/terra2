import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {CategoriesResolver} from "./categories.resolver";
import {CategoriesService} from "./categories.service";
import {CategoriesWeb, CategoriesSchemas} from "./schemas/categories.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {CategoriesController} from "./categories.controller";

@Module({
    providers: [CategoriesResolver, CategoriesService],
    imports: [
        MongooseModule.forFeature([{name: CategoriesWeb.name, schema: CategoriesSchemas}]),
        GoogleSheetsModule
    ],
    exports: [CategoriesService],
    controllers: [CategoriesController],

})
export class CategoriesModule {
}