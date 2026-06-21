import {forwardRef, Module} from "@nestjs/common";
import {ScriptsService} from "./scripts.service";
import {MongooseModule} from "@nestjs/mongoose";
import {UsersWeb, UsersWebSchemas} from "../users/schemas/users.schemas";
import {UsersModule} from "../users/users.module";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {OrdersWeb, OrdersWebSchemas} from "../orders/schemas/orders.schemas";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: UsersWeb.name, schema: UsersWebSchemas},
            {name: OrdersWeb.name, schema: OrdersWebSchemas},
        ]),
        forwardRef(() => UsersModule),
        GoogleSheetsModule

    ],
    providers: [ScriptsService],
    exports: [ScriptsService],

})
export class ScriptsModule {}