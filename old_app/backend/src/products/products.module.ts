import {forwardRef, Module} from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductWebSchema } from './products.schema';
import { ProductsService } from './products.service';
import {GoogleSheetsModule} from "../sheets/google-sheets.module";
import {UsersModule} from "../users/users.module";
import {SchedulesModule} from "../schedules/schedules.module";
import {SchedulesWeb, SchedulesWebSchemas} from "../schedules/schemas/schedules.schemas";
import {Inventories, InventoriesWebSchemas} from "../inventories/schemas/inventories.schemas";
import {InventoriesModule} from "../inventories/inventories.module";
import {ProductsController} from "./products.contoller";
import {CategoriesModule} from "../categories/categories.module";
import {ScriptsModule} from "../scripts/scripts.module";
import {OrdersModule} from "../orders/orders.module";
import {OrdersWeb, OrdersWebSchemas} from "../orders/schemas/orders.schemas";
import {UsersWeb, UsersWebSchemas} from "../users/schemas/users.schemas";

@Module({
  imports: [
      MongooseModule.forFeature([
          {name: 'ProductsWeb', schema: ProductWebSchema },
          {name: SchedulesWeb.name, schema: SchedulesWebSchemas},
          {name: Inventories.name, schema: InventoriesWebSchemas},
          {name: OrdersWeb.name, schema: OrdersWebSchemas},
          {name: UsersWeb.name, schema: UsersWebSchemas},
      ]),
      GoogleSheetsModule,
      SchedulesModule,
      forwardRef(() => InventoriesModule),
      CategoriesModule,
      ScriptsModule,
      forwardRef(() => OrdersModule),
      forwardRef(() => UsersModule)

  ],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
    controllers: [ProductsController]
})
export class ProductsModule {}
