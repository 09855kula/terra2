import React, {useEffect, useState} from 'react'

import { GET_ORDER } from '../api';
import { OrderType } from '../types';
import { useQuery } from '@apollo/client';

export default function useGetOrder(id: string) {
    const {data, loading, refetch} = useQuery<{getOrder: OrderType}>(GET_ORDER, {variables: {id: id}, fetchPolicy: 'cache-and-network'})
    const [order, setOrder] = useState<OrderType>();

    // console.log(data);
    
    useEffect(() => {
        if (data?.getOrder) {
            setOrder(data?.getOrder)
        }
    }, [data, id]);

    return {order, refetch, loading};
}
