import { GET_USER_COMMENTS, USER_COMMENTS_SUBSCRIPTION } from '../../api';
import React, {useCallback, useEffect} from 'react'

import { CommentType } from '../../types';
import { useQuery } from '@apollo/client';

export default function useUserComments(phone:  string) {
    const {data: getUserComments, subscribeToMore, refetch} = useQuery<{getUserComments: CommentType[]}>(GET_USER_COMMENTS, {variables: {phone}, fetchPolicy: "cache-and-network"})

    const reloadUser = useCallback(() => {refetch()},[refetch])
    
    useEffect(() => {

        subscribeToMore({
            document: USER_COMMENTS_SUBSCRIPTION,
        
            updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            return Object.assign({}, prev, {
                getUserComments: [...prev.getUserComments, subscriptionData.data]
            })}
        })
    }, [subscribeToMore])
    
    return {getUserComments: getUserComments?.getUserComments, reloadUser}
}
