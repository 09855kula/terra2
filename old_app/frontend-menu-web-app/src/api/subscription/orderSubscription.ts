import {gql} from '@apollo/client'

export const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    messages {
        role
        user_id
        text
        created
        isRead
    }
  }
`;