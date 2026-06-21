import { COMMENTS_SUBSCRIPTION, GET_COMMENTS } from '../../api';
import React, {useCallback, useEffect} from 'react'

import { CommentType } from '../../types';
import { useQuery } from '@apollo/client';

export default function useDriverComments(phone: string) {
    const {data: getDriverComments, subscribeToMore, refetch} = useQuery<{getComments: CommentType[]}>(GET_COMMENTS, {variables: {phone}, fetchPolicy: 'cache-and-network'})
    //
    const reloadDriver = useCallback(() => {
        // console.log('driver');
        refetch()
    },[]) 

    useEffect(() => {
        // console.log('driver rerender');
        subscribeToMore({
            document: COMMENTS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            //@ts-ignore
            const newMessages = subscriptionData.data.messages;
            return Object.assign({}, prev, {
            getComments: [...prev.getComments, newMessages]
            })}
        })
    },[])
    
    return {getComments: getDriverComments?.getComments, reloadDriver}
}
