import {Query, Resolver, Args, Mutation} from "@nestjs/graphql";
import {EntrysessionsType} from "./models/entrysessions";
import {EntrysessionsService} from "./entrysessions.service";
import {GetEntrysessionArgs} from "./dto/args/get-entrysession.args";
import {createEntrysessionInput} from "./dto/input/create-entrysession.input";
import {updateEntrysessionInput} from "./dto/input/update-entrysession.input";
import {deleteEntrysessionInput} from "./dto/input/delete-entrysession.input";

@Resolver(() => EntrysessionsType)
export class EntrysessionsResolver {
    constructor(private readonly entrysessionsService: EntrysessionsService) {
    }

    @Query(() => EntrysessionsType, {name: 'getEntrysession', nullable: true})
    async getEntrysession(@Args() getEntrysessionArgs: GetEntrysessionArgs): Promise<EntrysessionsType> {
        return this.entrysessionsService.getEntrysession(getEntrysessionArgs)
    }

    @Query(() => [EntrysessionsType], {name: 'getEntrysessions', nullable: 'items'})
    async getEntrysessions(): Promise<EntrysessionsType[]> {
        return this.entrysessionsService.getEntrysessions()
    }

    @Mutation(() => EntrysessionsType)
    async createEntrysession(@Args('input') input: createEntrysessionInput): Promise<EntrysessionsType> {
        return this.entrysessionsService.createEntrysession(input)
    }

    @Mutation(() => EntrysessionsType)
    async updateEntrysession(@Args('input') input: updateEntrysessionInput): Promise<EntrysessionsType> {
        return this.entrysessionsService.updateEntrysession(input)
    }

    @Mutation(() => EntrysessionsType)
    async deleteEntrysession(@Args('input') input: deleteEntrysessionInput): Promise<EntrysessionsType> {
        return this.entrysessionsService.deleteEntrysession(input)
    }
}