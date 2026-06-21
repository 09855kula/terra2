import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { CategoriesType } from "./models/category";
import { CategoriesService} from "./categories.service";
import { GetCategoryArgs } from "./dto/args/get-category.args";
import { createCategoriesInput } from "./dto/input/create-category.input";
import { updateCategoriesInput } from "./dto/input/update-category.input";
import { deleteCategoryInput } from "./dto/input/delete-category.input";

@Resolver(() => CategoriesType)
export class CategoriesResolver {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Query(() => CategoriesType, {name: 'getCategory', nullable: true})
    async getCategory(@Args() getCategoryArgs: GetCategoryArgs): Promise<CategoriesType> {
        return this.categoriesService.getCategory(getCategoryArgs)
    }

    @Query(() => [CategoriesType], {name: 'getCategories', nullable: 'items'})
    async getCategories(): Promise<CategoriesType[]> {
        return this.categoriesService.getCategories()
    }

    @Mutation(() => CategoriesType)
    async createCategory(@Args('input') input: createCategoriesInput): Promise<CategoriesType> {
        return this.categoriesService.createCategory(input)
    }
    @Mutation(() => CategoriesType)
    async updateCategory(@Args('input') input: updateCategoriesInput): Promise<CategoriesType> {
        return this.categoriesService.updateCategory(input.name, input)
    }

    @Mutation(() => CategoriesType)
    async deleteCategory(@Args('input') input: deleteCategoryInput): Promise<CategoriesType> {
        return this.categoriesService.deleteCategory(input)
    }
}