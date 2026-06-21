import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {ProductsService} from './products.service';
import {ProductType} from './models/product';
import {GetProductArgs} from "./dto/args/get-product.args";
import {deleteProductInput} from "./dto/inputs/delete-product.input";
import {createProductInput} from "./dto/inputs/create-product.input";
import {updateProductInput} from "./dto/inputs/update-product.input";
import {GetProductsByIdArgs} from "./dto/args/get-productsbyid";

@Resolver()
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {
    }

    @Query(() => [ProductType], {name: 'getProducts', nullable: 'items'})
    async getProducts() {
        return this.productsService.findAllProducts();
    }


    @Query(() => ProductType, {name: 'getProduct', nullable: true})
    async getProduct(@Args() getProductArgs: GetProductArgs): Promise<ProductType> {
        return this.productsService.findOneProduct(getProductArgs)
    }

    @Query(() => [ProductType], {name: 'getProductsById', nullable: 'items'})
    async getProductsById(@Args('ids', {type: () => [String]}) getProductsByIdArgs: GetProductsByIdArgs): Promise<ProductType[]> {
        return this.productsService.getProductsById(getProductsByIdArgs)
    }

    @Mutation(() => ProductType)
    async createProduct(@Args('input') input: createProductInput) {
        return this.productsService.createProducts(input);
    }

    @Mutation(() => ProductType, {name: 'removeProduct', nullable: true})
    async removeProduct(@Args('input') input: deleteProductInput): Promise<ProductType> {
        return this.productsService.deleteProduct(input)
    }

    @Mutation(() => ProductType)
    async updateProduct(@Args('input') updateProductData: updateProductInput): Promise<ProductType> {
        return this.productsService.updateProduct(updateProductData.id, updateProductData)
    }
}
