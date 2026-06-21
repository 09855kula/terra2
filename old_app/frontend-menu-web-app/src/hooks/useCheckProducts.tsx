import React, {useEffect, useState} from 'react'

import { GET_PRODUCTS_BY_ID } from '../api';
import { ProductsType } from '../types';
import {order} from '../utils'
import { useLazyQuery } from '@apollo/client';

export default function useCheckProducts() {
    const [checkProducts, {loading}] = useLazyQuery(GET_PRODUCTS_BY_ID)
    //
    const checkProduct = async (products: ProductsType[], ids: string[], isOrder: boolean = false, lastOrder?: ProductsType[]) => {
        const response = await checkProducts({variables: {id: ids}})
        // console.log(response?.data?.getProductsById);
        
        if (response) {
            const res = order.checkAvailableProducts(products, response?.data?.getProductsById, isOrder, lastOrder)
            
            if (!res.error) {
                return ({allProducts: true, products: res})
            } else {
                return ({allProducts: false, products: res})
            }
        }
    }
    
    return {checkProduct, loading};
}
