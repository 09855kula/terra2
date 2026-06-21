import {forwardRef, Module} from '@nestjs/common';
import {RoutesResolver} from './routes.resolver';
import {MongooseModule} from '@nestjs/mongoose';
import {RoutesWebSchema} from './routes.schema';
import {RoutesService} from './routes.service';
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {UsersModule} from "../users/users.module";
import {UsersWeb, UsersWebSchemas} from "../users/schemas/users.schemas";
import {RoutesController} from "./routes.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'RoutesWeb', schema: RoutesWebSchema},
            {name: UsersWeb.name, schema: UsersWebSchemas}
        ]),
        GoogleSheetsModule,
        forwardRef(() => UsersModule)

    ],
    providers: [RoutesResolver, RoutesService, ],
    exports: [RoutesService],
    controllers: [RoutesController],
})
export class RoutesModule {
}
