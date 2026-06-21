import {forwardRef, Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import {UsersWeb,  UsersWebSchemas} from "./schemas/users.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {ProductsModule} from "../products/products.module";
import {ProfilesModule} from "../profiles/profiles.module";
import {OrdersModule} from "../orders/orders.module";
import {ProfilesWeb, ProfilesSchemas} from "../profiles/schemas/profiles.schemas";
import {InventoriesModule} from "../inventories/inventories.module";
import {Inventories, InventoriesWebSchemas} from "../inventories/schemas/inventories.schemas";
import {ScriptsModule} from "../scripts/scripts.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UsersController} from "./users.controller";
@Module({
    providers: [UsersResolver, UsersService, UsersController],
    imports: [
        MongooseModule.forFeature([
            {name: UsersWeb.name, schema: UsersWebSchemas},
            {name: ProfilesWeb.name, schema: ProfilesSchemas},
            {name: Inventories.name, schema: InventoriesWebSchemas}
        ]),
        ClientsModule.register([
            {
                name: 'IMPORT_FRIEND',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.URL_RMQ],
                    queue: 'refer_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
        GoogleSheetsModule,
        forwardRef(() => ProductsModule),
        ProfilesModule,
        forwardRef(() => OrdersModule),
        forwardRef(() => ScriptsModule),

        InventoriesModule
    ],
    exports: [UsersService,
        MongooseModule.forFeature([
            {name: UsersWeb.name, schema: UsersWebSchemas}
        ])
    ],
    controllers: [UsersController]

})
export class UsersModule {}