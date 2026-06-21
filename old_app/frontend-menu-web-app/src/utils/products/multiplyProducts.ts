import {ProductsType} from '../../types'

const multiplyProducts = (product: ProductsType, cart: ProductsType[], amount: number, giftId: string = ''): ProductsType[] => {
    if(giftId) {
    
       return cart.map(el => el.id === giftId ? 
            {...el, gift_product: product.id, got_gift_pairs: {id: '', gift_holder: giftId, is_gift: product.id, name: product.name, cost: product.cost}} : el)
        
        // return [...res, {...product, cost: product.costs[0].cost, costs: [], got_gift_pairs: [{id: '', gift_holder: giftId, is_gift: product.id}]}]
    } else {
        if (!cart.length) {
            return [{...product, count: amount}]
        } else {
            if (cart.some(el => el.id === product.id)) {
                return cart.map(el => el.id === product.id ? {...el, count: el.count + amount} : el)
            } else {
                return [...cart, {...product, count: amount}]
            }
        }
    }
}

export default multiplyProducts