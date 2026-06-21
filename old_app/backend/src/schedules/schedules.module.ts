import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {SchedulesResolver} from "./schedules.resolver";
import {SchedulesService} from "./schedules.service";
import {SchedulesWeb, SchedulesWebSchemas} from "./schemas/schedules.schemas";
import {GoogleSheetsModule} from "../sheets/google-sheets.module";

@Module({
    providers: [SchedulesResolver, SchedulesService],
    imports: [
        MongooseModule.forFeature([{name: SchedulesWeb.name, schema: SchedulesWebSchemas}]),
        GoogleSheetsModule
    ],
    exports: [SchedulesService]
})
export class SchedulesModule {
}