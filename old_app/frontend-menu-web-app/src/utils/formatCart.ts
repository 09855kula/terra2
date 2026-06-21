import { ProductsType } from "../types"

export const formedCart = (cart: ProductsType[]) => {
    return cart.map(el => {
        let {name, category, measure, cost, pack, img_url, id, group, count, costs } = el
        costs = formedCosts(costs)
        // if (got_gift_pairs) {
        //     got_gift_pairs = formedGifts(got_gift_pairs)
        // }
        return {name, category, measure, cost, pack, img_url, id, group,count, costs}
    })
}

export const formedCosts = (costs: {cost: number, unit: number}[]) => {
    return costs.map(el => {
        const {cost, unit} = el
        return {cost, unit}
    })
}

export const formedGifts = (gifts: any) => {
    // console.log(gifts);
    const {name, is_gift, id, gift_holder, cost} = gifts
    
    return {name, is_gift, id, gift_holder, cost} 
}
