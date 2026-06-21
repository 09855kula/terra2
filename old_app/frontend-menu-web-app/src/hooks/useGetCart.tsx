import React, {useEffect, useState} from 'react'

import { GET_CART } from '../api';
import { OrderType } from '../types';
import { useQuery } from '@apollo/client';

export default function useGetCart(phone: string) {
    const {data, loading, refetch} = useQuery(GET_CART, {variables: {phone}, fetchPolicy: "no-cache"})
    const [order, setOrder] = useState<OrderType>()
    
    useEffect(() => {
        if (data?.getUser) {
            setOrder(data?.getUser.cart)
        }
    }, [data]);

    return {order, refetch, loading};
}
