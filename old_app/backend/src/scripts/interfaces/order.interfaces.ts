interface updateOrderType {
    lastProducts: {name: string, count: number}[]
    products: {name: string, count: number}[]
    orderId: string
    driverId: string
}

interface ProductType{
    name: string
    pack: number
    measure: string
    category: string
    id: string
    img_url: string
    group: string
    cost: number
    count: number
    costs: {unit: number, cost: number}[]
    got_gift_pairs?: {cost: number, gift_holder: string, id: string, name: string, is_gift: string}
}