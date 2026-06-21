import {ProductsType} from '../../types'

const productDiscount = (cart: ProductsType[], productId: string) => {
     const result = cart.find(el => el.id === productId) as ProductsType
     const first = result.costs[result?.count - 1]?.cost
     const second = result.costs[result.count]?.cost
     let discount = 0

     if (first > second) {
          discount = +((((first - second) / first) * 100).toFixed(0))
     }

     return discount
}

export default productDiscount;