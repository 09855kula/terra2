import {gql} from '@apollo/client'

export const CHANGE_INSTRUCTION = gql`
    mutation UpdateInstruction($profileId: String!, $instruction: String!) {
        updateInstruction(input: {id: $profileId, special_instructions: $instruction}) {
            special_instructions
            
        }
    }
`

export const CHANGE_PHONE = gql`
    mutation ChangeUserPhone($userId: Float!, $phone: String!) {
        changeUserPhone(input: {user_id: $userId, phone: $phone}) {
            special_instructions
            phone
        }
    }
`

export const CREATE_PROFILE = gql`
    mutation CreateProfile($phone: String!, $address: String!, $special_instruction: String) {
        createProfile(input: {phone: $phone, address: $address, special_instructions: $special_instruction}) {
            id
            address
            district
            phone
            user_id
            token_id
            special_instructions
            created
            status
            
        }
    }
`

export const CHANGE_PROFILE = gql`
    mutation ChangeProfile($phone: String!, $address: String!, $special_instruction: String) {
        changeProfile(input: {phone: $phone, address: $address, special_instructions: $special_instruction}) {
            id
            address
            district
            phone
            user_id
            token_id
            special_instructions
            created
            status

        }
    }
`