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
    used_discount: {
        amount: number
        informed: boolean
        start_date: string
    }
}