import {ProductsType} from '../../types'

const checkGiftProduct = (productId: string, cart: ProductsType[]): boolean => {
    const result = cart.find(el => el.id === productId) as ProductsType
    
    if (result?.gift_product) {
        return true
    } else {
        return false
    }
}

export default checkGiftProduct;