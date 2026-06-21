import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {MessagesResolver} from "./messages.resolver";
import {MessagesService} from "./messages.service";
import {MessagesWeb, MessagesSchemas} from "./schemas/messages.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    providers: [MessagesResolver, MessagesService],
    imports: [
        ClientsModule.register([
            {
                name: 'MATH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.URL_RMQ],
                    queue: 'messages_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
        MongooseModule.forFeature([{name: MessagesWeb.name, schema: MessagesSchemas}]),
        GoogleSheetsModule
    ],
    exports: [MessagesService]
})
export class MessagesModule {
}