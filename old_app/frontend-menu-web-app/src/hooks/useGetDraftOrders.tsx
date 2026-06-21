import React, {useEffect, useState} from 'react'

import { GET_DRAFT_ORDERS } from '../api';
import { useQuery } from '@apollo/client';

interface ResponseType {
    isClose: boolean
    address: string
}

export default function useGetDraftOrder(phone: string) {  
    const {data, loading, refetch} = useQuery(GET_DRAFT_ORDERS, {variables: {phone}, fetchPolicy: "cache-and-network"})
    const [isDraft, setOrder] = useState<ResponseType>();
    // console.log(data);
    
    useEffect(() => {
        if (data?.getDraftOrders) {


            setOrder(data?.getDraftOrders)
        }
    }, [data, phone]);
    // console.log('isDraft:', isDraft)
    return {isDraft, refetch, loading};
}
