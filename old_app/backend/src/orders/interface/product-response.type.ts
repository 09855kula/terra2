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
