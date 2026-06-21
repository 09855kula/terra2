import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {EntrysessionsResolver} from "./entrysessions.resolver";
import {EntrysessionsService} from "./entrysessions.service";
import {EntrysessionsWeb, EntrysessionSchemas} from "./schemas/entrysessions.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";

@Module({
    providers: [EntrysessionsResolver, EntrysessionsService],
    imports: [
        MongooseModule.forFeature([{name: EntrysessionsWeb.name, schema: EntrysessionSchemas}]),
        GoogleSheetsModule
    ],
    exports: [EntrysessionsService]
})
export class EntrysessionModule {
}