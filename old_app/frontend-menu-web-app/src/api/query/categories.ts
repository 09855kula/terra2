import {gql} from '@apollo/client'

export const GET_CATEGORIES = gql`
    query getCategories {
        getCategories {
          name
          index
          group
          pack
          measure
          costs{cost, unit}
          got_gift{active, gift_group, gift_category}
          pic_url
          giftable
          sativa
          indica
          lso
          effect
        }
    }
`