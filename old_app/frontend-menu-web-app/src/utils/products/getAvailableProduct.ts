import {ProductsType} from '../../types'

const getAvailableProduct = (cart: ProductsType[], available: number, productId: string) => {
    let customAvailable = available

    cart.forEach(prod => {
        if (prod.id === productId) {
            customAvailable = available - prod.count
        }
    })

    return customAvailable;
}

export default getAvailableProduct;