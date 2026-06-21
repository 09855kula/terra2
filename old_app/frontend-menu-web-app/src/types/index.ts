export interface ProductsType {
    category: string
    id: string
    img_url: string
    name: string
    active: boolean
    measure: string
    group?: string
    pack: number
    costs: { cost: number, unit: number }[]
    cost: number
    count: number
    available: number
    description: string
    gift_product?: string
    got_gift_pairs?: Gift
    points?: number
    isSavings?: boolean
    indica?: boolean
    sativa?: boolean
    lso?: boolean
    effect?: string
    type: string
    top_flavour: string
    price_tag: string
    top_effect: string
}

export interface Gift {
    id: string
    is_gift?: string
    gift_holder?: string
    name?: string
    cost?: number
}


export interface ProductType {
    id: string
    name: string
    category: string
    cost: number
    measure: string
    pack: number
    img_url: string
    group: string
    type: string
    top_flavour: string
    price_tag: string
    top_effect: string
}

export interface CategoriesType {
    name: string
    group: string
    index: number
    costs: CostType[]
    pack: number
    giftable: boolean
    got_gift: GiftType
    measure: string
    pic_url: string
}

interface CostType {
    unit: number
    cost: number
}

interface GiftType {
    active: boolean,
    gift_group: string
    gift_category: string
}

export interface OrderType {
    products: ProductsType[]
    address: string
    id: string
    delivery_date: string
    district: string
    timeslot: string
    cut_offs: string
    status: string
    created: string
    comments: CommentType[]
    total_after_discount: number
    user: UserType
}

export interface CommentType {
    role: string
    created: string
    text: string
    user_id: number
    isRead: boolean
}

export interface RouteResponseType {
    timeslot: string
    weekday: string
    cutOff: string
}

export interface CartType {
    products: ProductsType[]
    products_list?: ProductType[]
    id: number
    status: string
    created: Date
    comments: string[]
    got_gift_pairs: ProductType[]
    delivery: Delivery
}

interface Delivery {
    id: number
    day: string
    time: string
    address: string
    district: string
    totalCost: number
}

export interface UserType{
    id: number
    orders: number[]
    tokens: number[]
    phones: string[]
    addresses: string[]
    phone: string
    role: string
    first_name: string
    last_name: string
    last_profile: number
    username: string
    inventory: string
    cart: CartType
    points: number
    is_vip: boolean
    notifications: {title: string, description: string, created: string}
}

export interface UserProfileType{
    id: number
    address: string
    district: string
    phone: string
    user_id: number
    token_id: number
    special_instructions: string
    created: string
    updated: string
    approved: string
    status: string
    comment: string
}
export interface  OrderProductsType {
    name: string
    category: string
    cost: number
    pack: number
    img_url: string
    measure: string
    id: string
    group?: string
    count: number
    costs: { cost: number, unit: number }[]

}