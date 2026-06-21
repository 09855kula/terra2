import {ProductsType} from '../../types'

interface PropsType {
    id: string
    name: string
    available: number
    error: boolean
}

const order = {
    checkAvailableProducts: function (products: ProductsType[], check: ProductsType[], isOrder: boolean, lastOrder?: ProductsType[]) {
        const res = {error: false, products: {} as {[key: string]: PropsType}}
        const temp = {} as {[key: string]: PropsType}

        if (check) {
            check.forEach(prod => {
                const {name, id, available} = prod
                temp[prod.id] = {name,id,available, error: false}
            })
        }

        if (isOrder) {
            lastOrder?.forEach(prod => {
                if(temp[prod.id]) {
                    temp[prod.id].available += prod.count
                }
            })
        } 

        products.forEach(prod => {
            if(temp[prod.id]) {
                if (prod.count > temp[prod.id].available) {
                    res.error = true
                    res.products[prod.id] = {...temp[prod.id], error: true}
                } else {
                    res.products[prod.id] = temp[prod.id]
                }
            }
        })
        
        
        return res
    },
    

}

export default order