import {gql} from '@apollo/client'

export const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
           category
           name
           img_url
           id
           active
           available
           description
            type
            top_flavour
            price_tag
            top_effect
        }
    }
`

export const GET_PRODUCTS_BY_ID = gql` 
    query GetProductsById($id: [String!]!) {
        getProductsById(ids: $id) {
           category
           name
           img_url
           id
           active
           available
            description
            type
            top_flavour
            price_tag
            top_effect
        }
    }
`