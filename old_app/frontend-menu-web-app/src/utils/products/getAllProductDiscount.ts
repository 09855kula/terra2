import {ProductsType} from '../../types'

const getAllProductDiscount = (product: ProductsType, cart: ProductsType[], amount: number): number => {
    const result = cart.find(el => el.id === product.id) as ProductsType
    let summ = 0
    
    if (result) {
        for (let i = result.count; i < result.count + amount; i++) {
            summ += product?.costs[i]?.cost
        }
        
    } else {
        for (let i = 0; i < amount; i++) {
            //console.log(i)
            summ += product?.costs[i]?.cost
        }
        
    }

    return summ;
}

export default getAllProductDiscount;