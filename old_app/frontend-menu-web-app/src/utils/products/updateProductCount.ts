import {ProductsType} from '../../types'

const updateProductCount = (product: ProductsType, amount: number, plus = false, minus = false) => {
    if (minus) {
        if (amount >= product.count) {
            return 'you cannot delete as much or more than you have'
        } else {
            return {...product, count: product.count - amount}
        }
        // if (amount >= product.count) {
        //     return 'you cannot delete as much or more than you have'
        // } else {
        //     return {...product, count: product.count - amount, available: product.available + amount}
        // }
    }
    if (plus) {
        // console.log(product);
        // console.log(amount);
        // console.log(product.available);
        if (product.count + amount > product.available) {
            return `available product - ${product.available - product.count > 0 ? product.available - product.count : 0}`
        } else {
            return {...product, count: product.count + amount}
        }
        
        //test
        // if (amount > product.available) {
        //     return `available product - ${product.available - product.count > 0 ? product.available - product.count : 0}`
        // } else {
        //     return {...product, count: product.count + amount, available: product.available - amount}
        // }
    }
}

export default updateProductCount;