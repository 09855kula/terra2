import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {TokenResolver} from "./token.resolver";
import {TokenService} from "./token.service";
import {TokensWeb, TokenSchemas} from "./schemas/token.schemas";

@Module({
    providers: [TokenResolver, TokenService],
    imports: [
        MongooseModule.forFeature([{name: TokensWeb.name, schema: TokenSchemas}])
    ]

})
export class TokenModule {
}