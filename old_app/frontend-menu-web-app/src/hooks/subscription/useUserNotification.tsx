import {GET_USER_NOTIFICATION, USER_NOTIFICATION} from '../../api';
import React, {useEffect} from 'react'
import {useQuery} from '@apollo/client';

interface ResponseType {
    title: string
    description: string
    created: string
}

export default function useUserNotification(phone: string) {
    const {
        subscribeToMore,
        data: getUserNotification
    } = useQuery<{ getUserNotification: ResponseType }>(GET_USER_NOTIFICATION, {
        variables: {phone},
        pollInterval: 10000,
        fetchPolicy: "cache-and-network"
    })
    useEffect(() => {

        subscribeToMore({
            document: USER_NOTIFICATION,
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                //@ts-ignore
                const newMessages = subscriptionData.data.userNotification;
                console.log('newMessages:', newMessages)

                return Object.assign({}, prev, {
                    getUserNotification: newMessages
                })
            }
        })
    }, [])
    return getUserNotification?.getUserNotification
}
