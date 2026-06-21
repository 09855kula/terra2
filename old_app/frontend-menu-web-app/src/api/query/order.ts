import {gql} from "@apollo/client";

export const GET_LAST_ORDER = gql`
    query GetLastOrder($phone: String!) {
        getLastOrder(phone: $phone) {
            id
            products
            total_after_discount
            timeslot
            district
            address
            delivery_date
        }
    }
`

export const GET_DRAFT_ORDERS = gql`
    query GetDraftOrders($phone: String!) {
        getDraftOrders(phone: $phone) {
            isClose
            address
        }
    }
`

export const GET_ORDERS = gql`
    query GetAllOrders($phone: String!) {
        getAllOrders(phone: $phone) {
            status
            delivery_date
            id
        }
    }
`

export const GET_COMMENTS = gql`
    query GetComments($phone: String!) {
        getComments(phone: $phone) {
                role
                user_id
                text
                created
                isRead
            
        }
    }
`

export const GET_ORDER = gql`
    query GetOrder($id: String!) {
        getOrder(id: $id) {
            id
            products {
                name
                pack
                measure
                category
                id
                img_url
                group
                cost
                count
                got_gift_pairs {
                    name
                    is_gift
                    gift_holder
                    cost
                }
                costs {
                    unit
                    cost
                }
            }
            total_after_discount
            timeslot
            district
            cut_offs
            address
            delivery_date
            comments {
                text
                isRead
            }
        }
    }
`