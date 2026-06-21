import {ProductsType} from '../../types'

const concatAvailableProductWithOrder = (products: ProductsType[], order: ProductsType[] | undefined) => {
        let temp = {} as any
        let prod = [] as ProductsType[]

        if (order) 
        order.forEach(order => temp[order.id] = order)
        products.forEach(product => {
            if (temp[product.id]) {
                prod.push({...temp[product.id], available: product.available})
            }
        })

        return prod
}

export default concatAvailableProductWithOrder