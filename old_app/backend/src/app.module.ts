import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import "dotenv/config";
import {UsersModule} from "./users/users.module";
import {ProductsModule} from "./products/products.module";
import {RoutesModule} from "./routes/routes.module";
import {OrdersModule} from "./orders/orders.module";
import {CategoriesModule} from "./categories/categories.module";
import {TokenModule} from "./tokens/token.module";
import {ProfilesModule} from "./profiles/profiles.module";
import {InventoriesModule} from "./inventories/inventories.module";
import {SchedulesModule} from "./schedules/schedules.module";
import {EntrysessionModule} from "./entrysessions/entrysessions.module";
import {MessagesModule} from "./messages/messages.module";
import {ScriptsModule} from "./scripts/scripts.module";

const mongoUri = process.env.MONGODB_URI
console.log('Connect database:', mongoUri)

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            driver: ApolloDriver,
            path: "/api/graphql",
            subscriptions: {
                'subscriptions-transport-ws': true,
                'path': '/subscriptions'
            },
        }),
        ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
        MongooseModule.forRoot(mongoUri),
        UsersModule,
        ProductsModule,
        RoutesModule,
        OrdersModule,
        CategoriesModule,
        TokenModule,
        ProfilesModule,
        InventoriesModule,
        SchedulesModule,
        EntrysessionModule,
        MessagesModule,
        ScriptsModule


    ]
})
export class AppModule {
}
