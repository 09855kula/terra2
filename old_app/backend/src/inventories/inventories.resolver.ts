import {Query, Resolver, Args, Mutation} from "@nestjs/graphql";
import {InventoriesType} from "./models/inventory";
import {InventoriesService} from "./inventories.service";
import {GetInventoryArgs} from "./dto/args/get-inventory.args";
import {createInventoriesInput} from "./dto/input/create-inventory.input";
import {updateInventoriesInput} from "./dto/input/update-inventory.input";
import {deleteInventoriesInput} from "./dto/input/delete-inventory.input";

@Resolver(() => InventoriesType)
export class InventoriesResolver {
    constructor(private readonly inventoriesService: InventoriesService) {
    }

    @Query(() => InventoriesType, {name: 'getInventory', nullable: true})
    async getInventory(@Args() getInventoryArgs: GetInventoryArgs): Promise<InventoriesType> {
        return this.inventoriesService.getInventoryMy(getInventoryArgs)
    }

    @Query(() => [InventoriesType], {name: 'getInventories', nullable: 'items'})
    async getInventories(): Promise<InventoriesType[]> {
        return this.inventoriesService.getInventories()
    }

    @Mutation(() => InventoriesType)
    async createInventory(@Args('input') input: createInventoriesInput): Promise<InventoriesType> {
        return this.inventoriesService.createInventory(input)
    }

    @Mutation(() => InventoriesType)
    async updateInventory(@Args('input') input: updateInventoriesInput): Promise<InventoriesType> {
        return this.inventoriesService.updateInventory(input.id, input)
    }

    @Mutation(() => InventoriesType)
    async deleteInventory(@Args('input') input: deleteInventoriesInput): Promise<InventoriesType> {
        return this.inventoriesService.deleteInventory(input)
    }
}