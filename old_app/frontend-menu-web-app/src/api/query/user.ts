import {gql} from '@apollo/client'

export const GET_USER_COMMENTS = gql`
    query GetUserComments($phone: String!) {
        getUserComments(phone: $phone) { 
            role
            user_id
            text
            created
            image
            isRead
        }
    }
`
export const GET_USER = gql`
    query GetUser($phone: String!) {
        getUser(phone: $phone) {
            id
            username
            first_name
            tokens
            orders
            tokens
            phones
            addresses
            phone
            role
            new_profile
            first_name
            last_name 
            last_profile
            use_safari
            username
            inventory
            limited
            points
            cart {
                id
                address
                delivery_date
                timeslot
                total_after_discount
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
                        id
                        gift_holder
                        cost
                    }
                    costs {
                        unit
                        cost
                    }
                    
                }
            }
        }
    }
`
export const GET_NEW_USER = gql`
    query GetNewUser($id: Float!) {
        getNewUser(id: $id) {
            id
            username
            first_name
            tokens
            orders
            tokens
            phones
            addresses
            phone
            role
            first_name
            last_name
            last_profile
            username
            inventory
            limited
            new_profile
            use_safari
            points
            cart {
                id
                address
                delivery_date
                timeslot
                total_after_discount
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
                        id
                        gift_holder
                        cost
                    }
                    costs {
                        unit
                        cost
                    }

                }
            }
        }
    }
`
export const GET_USER_NOTIFICATION = gql`
    query GetUserNotification($phone: String!) {
        getUserNotification(phone: $phone) { 
            title
            description
            created
        }
    }
`

export const GET_CART = gql`
query GetUser($phone: String!) {
        getUser(phone: $phone) {
            addresses
            first_name
            points
            role
            phone
            id
            cart {
                id
                address
                delivery_date
                timeslot
                cut_offs
                total_after_discount
                status
                created
                products_list
                comments {
                    text
                    isRead
                }
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
                        id
                        gift_holder
                        cost
                    }
                    costs {
                        unit
                        cost
                    }
                    
                }
            }
        }
    }
`