import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {createTokenInput} from "./dto/input/create-token.input";
import {updateTokenInput} from "./dto/input/update-token.input";
import {GetTokenArgs} from "./dto/args/get-token.args";
import {deleteTokenInput} from "./dto/input/delete-token.input";
import {TokensWeb, TokenDocument} from "./schemas/token.schemas";

@Injectable()
export class TokenService {
    constructor(@InjectModel(TokensWeb.name) private tokenModel: Model<TokenDocument>) {
    }

    async createToken(createTokenData: createTokenInput): Promise<TokenDocument> {
        const createdToken = new this.tokenModel(createTokenData);
        return await createdToken.save();

    }

    async updateToken(id, updateTokenData: updateTokenInput): Promise<TokenDocument> {
        return this.tokenModel.findOneAndUpdate(id, updateTokenData, {new: true})
    }

    async getToken(GetTokenArgs: GetTokenArgs): Promise<TokenDocument> {
        return await this.tokenModel.findOne(GetTokenArgs).exec();

    }

    async getTokens(): Promise<TokenDocument[]> {
        return await this.tokenModel.find().exec();
    }

    async deleteToken(deleteTokenData: deleteTokenInput): Promise<TokenDocument> {
        return this.tokenModel.findOneAndRemove(deleteTokenData)

    }


}
