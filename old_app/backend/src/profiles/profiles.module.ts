import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ProfilesResolver} from "./profiles.resolver";
import {ProfilesService} from "./profiles.service";
import {ProfilesWeb, ProfilesSchemas} from "./schemas/profiles.schemas";
import {UsersWeb, UsersWebSchemas} from "../users/schemas/users.schemas";
import {RoutesModule} from "../routes/routes.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ProfilesController} from "./profiles.controller";
import {ScriptsModule} from "../scripts/scripts.module";

@Module({
    providers: [ProfilesResolver, ProfilesService, ProfilesController],
    imports: [
        MongooseModule.forFeature([
            {name: ProfilesWeb.name, schema: ProfilesSchemas},
            {name: UsersWeb.name, schema: UsersWebSchemas}]),
        forwardRef(() => RoutesModule),
        ClientsModule.register([
            {
                name: 'CHANGE_ADDRESS',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.URL_RMQ],
                    queue: 'address_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
        ScriptsModule
    ],
    controllers: [ProfilesController],
    exports: [ProfilesService, ProfilesResolver, ProfilesController]

})
export class ProfilesModule {
}