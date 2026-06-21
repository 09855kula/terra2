import {forwardRef, Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrdersResolver } from "./orders.resolver";
import { OrdersService } from "./orders.service";
import {OrdersWeb,  OrdersWebSchemas} from "./schemas/orders.schemas";
import {UsersModule} from "../users/users.module";
import {UsersWeb, UsersWebSchemas} from "../users/schemas/users.schemas";
import {RoutesWebSchema} from "../routes/routes.schema";
import {ScriptsModule} from "../scripts/scripts.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {OrdersController} from "./orders.controller";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {ProductsModule} from "../products/products.module";
import {InventoriesModule} from "../inventories/inventories.module";
@Module({
    providers: [OrdersResolver, OrdersService, OrdersController],
    imports: [
        forwardRef(() => UsersModule),

        MongooseModule.forFeature([
            {name: OrdersWeb.name, schema: OrdersWebSchemas},
            {name: UsersWeb.name, schema: UsersWebSchemas},
            {name: 'RoutesWeb', schema: RoutesWebSchema}
        ]),
        forwardRef(() => ScriptsModule),
        ClientsModule.register([
            {
                name: 'CREATE_ORDER',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.URL_RMQ],
                    queue: 'orders_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
        GoogleSheetsModule,
        forwardRef(() => ProductsModule),
        forwardRef(() => InventoriesModule),



    ],
    controllers: [OrdersController],

    exports: [OrdersService, OrdersController]

})
export class OrdersModule {}