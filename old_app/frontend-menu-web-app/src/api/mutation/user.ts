import {gql} from '@apollo/client'

export const LOGIN = gql`
    mutation Login($phone: String!) {
        login(phone: {phone: $phone}) {
            token
            last_profile
            new_profile
        }
    }
`

export const CONFIRM = gql`
    mutation ConfirmUser($phone: String!, $token: Float!) {
        confirmUser(input: {phone: $phone, token: $token}) {
            phone
            is_token_right
            is_token_reverse
            is_token_invalid
        }
    }
`

// export const ADD_TOKEN = gql`
//     mutation CreateToken($phone: String!) {
//         createToken(phone: $phone) {
//             tokens,
//         }
//     }
// `
export const CREATE_USER_COMMENT = gql`
    mutation userComments($id: Float!, $comment: String!, $role: String!, $image: String!) {
        userComments(input: {user_id: $id, text: $comment, role: $role, image: $image}) {
            role
            user_id
            text
            created
            image
        }
    }
`

export const SET_USER_COMMENT_READ = gql`
    mutation setUserCommentRead($phone: String!) {
        setUserCommentRead(input: {phone: $phone}) {
            role
            user_id
            text
            created
            isRead
        }
    }
`

export const SET_USER_NOTIFICATION = gql`
    mutation SetUserNotification($phone: String! $title: String!, $description: String!) {
        setUserNotification(input: {phone: $phone title: $title, description: $description}) {
            title
            description
            created
        }
    }
`

export const ADD_ADDRESS = gql`
    mutation AddAddress($phone: String!, $address: String!) {
        addAddress(input: {phone: $phone, address: $address}) {
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
            username
            inventory
            cart{
                id
                products {
                id
             }
      
            }
        }
    }
`
export const SET_FIRST_NAME = gql`
    mutation SetUserFirstName($phone: String!, $first_name: String!) {
        setUserFirstName(input: {phone: $phone, first_name: $first_name}) {
            first_name
            phone

        }
    }
`
export const SET_USE_SAFARI = gql`
    mutation SetUseSafari($phone: String!) {
        setUseSafari(input: {phone: $phone}) {
            phone
            use_safari
        }
    }
`

export const SET_NEW_PROFILE_FALSE = gql`
    mutation NewProfileFalse($phone: String!) {
        newProfileFalse(input: {phone: $phone}) {
            phone

        }
    }
`

export const ADD_CART = gql`
    mutation AddCart($phone: String!, $products: [Product], $delivery: Delivery) {
        addCart(phone: $phone, products: $products, delivery: $delivery) {
            id
    cart{
      products{
        id
        name
        cost
      }
      id
      status
      created
      delivery {
        id
        time
        day
        district
        change
      }
    }
    phone
        }
    }
`

export const REFER_FRIEND = gql`
    mutation ReferFriend($phone: String! $address_friend: String!, $phone_friend: String!) {
        referFriend(input: {phone: $phone address_friend: $address_friend, phone_friend: $phone_friend}) {
            referral_code
        }
    }
`