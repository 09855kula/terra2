import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { TokenType } from "./models/token";
import { TokenService} from "./token.service";
import { GetTokenArgs } from "./dto/args/get-token.args";
import { createTokenInput } from "./dto/input/create-token.input";
import { updateTokenInput } from "./dto/input/update-token.input";
import { deleteTokenInput } from "./dto/input/delete-token.input";

@Resolver(() => TokenType)
export class TokenResolver {
    constructor(private readonly tokenService: TokenService) {}

    @Query(() => TokenType, {name: 'getToken', nullable: true})
    async getToken(@Args() getTokenArgs: GetTokenArgs): Promise<TokenType> {
        return this.tokenService.getToken(getTokenArgs)
    }

    @Query(() => [TokenType], {name: 'getTokens', nullable: 'items'})
    async getTokens(): Promise<TokenType[]> {
        return this.tokenService.getTokens()
    }

    @Mutation(() => TokenType)
    async createToken(@Args('input') input: createTokenInput): Promise<TokenType> {
        return this.tokenService.createToken(input)
    }
    @Mutation(() => TokenType)
    async updateToken(@Args('input') input: updateTokenInput): Promise<TokenType> {
        return this.tokenService.updateToken(input.id, input)
    }

    @Mutation(() => TokenType)
    async deleteToken(@Args('input') input: deleteTokenInput): Promise<TokenType> {
        return this.tokenService.deleteToken(input)
    }
}