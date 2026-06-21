import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {InventoriesResolver} from "./inventories.resolver";
import {InventoriesService} from "./inventories.service";
import {Inventories, InventoriesWebSchemas} from "./schemas/inventories.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {ProductsModule} from "../products/products.module";
import {ProductWebSchema} from "../products/products.schema";
import {UsersWebSchemas, UsersWeb} from "../users/schemas/users.schemas";
import {OrdersModule} from "../orders/orders.module";

@Module({
    providers: [InventoriesResolver, InventoriesService],
    imports: [
        MongooseModule.forFeature([
            {name: Inventories.name, schema: InventoriesWebSchemas},
            {name: 'ProductsWeb', schema: ProductWebSchema},
            {name: UsersWeb.name, schema: UsersWebSchemas}
        ]),
        GoogleSheetsModule,
        forwardRef(() => ProductsModule),
        forwardRef(() => OrdersModule)

    ],
    exports: [InventoriesService]
})
export class InventoriesModule {
}