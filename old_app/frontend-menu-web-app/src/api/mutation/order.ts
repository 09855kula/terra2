import {gql} from "@apollo/client";
export const CREATE_ORDER = gql`
    mutation CreateUserOrder($phone: String!, $products: [ProductResponseInput]!, $delivery: Delivery) {
        createUserOrder(input: {phone: $phone, products: $products, delivery: $delivery}) {
            id
            
        }
    }
`

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($phone: String!, $products: [ProductUpdateInput]! $id: String!) {
        updateOrder(input: {phone: $phone, products: $products, id: $id}) {
            id
        }
    }
`

export const DELETE_ORDER = gql`
    mutation DeleteOrder($phone: String!, $id: String!) {
        deleteOrder(input: {phone: $phone, id: $id}) {
            id
        }
    }
`

export const CREATE_COMMENT = gql`
    mutation OrderComments($id: String!, $comment: String!, $role: String!) {
        orderComments(id: $id, comment: $comment, role: $role) {
            role
            user_id
            text
            created
        }
    }
`

export const SET_ORDER_COMMENT_READ = gql`
    mutation SetOrderCommentRead($id: String!) {
        setOrderCommentRead(id: $id) {
            role
            user_id
            text
            created
            isRead
        }
    }
`