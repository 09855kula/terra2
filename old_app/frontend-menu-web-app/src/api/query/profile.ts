import {gql} from '@apollo/client'

export const GET_PROFILE = gql`
    query GetProfile($userId: Float!) {
        getProfile(user_id: $userId) {
            id
            address
            district
            phone
            user_id
            token_id
            special_instructions
        }
    }
`

export const GET_LAST_PROFILE = gql`
    query GetLastProfile($profileId: String!) {
        getLastProfile(id: $profileId) {
            id
            address
            district
            phone
            user_id
            token_id
            special_instructions
        }
    }
`