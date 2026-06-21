import {gql} from '@apollo/client'

export const USER_COMMENTS_SUBSCRIPTION = gql`
    subscription{ 
        userMessage{
            role
            user_id
            text
            created
            image
            isRead
        }
    }
`;

export const USER_NOTIFICATION = gql`
    subscription {
        userNotification {
            title
            description
            created
        }
    }
`;