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

interface DeliveryType {
    address: string
    district: string
    change: string
    delivery_date: string
    timeslot: string
    cut_offs: string
    customer_comment: string;
    total: number
    total_after_discount: number
    date: string
    used_discount:  {
        amount: number
        informed: boolean
        start_date: string
    }
}