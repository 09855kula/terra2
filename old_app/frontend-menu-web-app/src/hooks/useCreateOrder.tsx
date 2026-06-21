import React, {useEffect, useState} from 'react'
import {local, users} from '../utils'

import { CREATE_ORDER } from '../api';
import { RouteResponseType } from '../types';
import {countOrder} from "../utils/order";
import { formedCart } from '../utils/formatCart';
import { useMutation } from '@apollo/client';
import { OrderProductsType } from "../types"

export default function useCreateOrder() {
    const [createUserOrder, {loading}] = useMutation(CREATE_ORDER)
    //
    const create = async (delivery: RouteResponseType | null, change: number) => {
        const cart = local.getCart()
        const token = local.getToken();
        const savings = local.getDiscount() || 0;
        const {availablePoints} = users.countPoints(savings)
        let {products, withDiscount, defaultCost} = countOrder(cart)
        const changedCart = formedCart(products)
        withDiscount = Math.floor(withDiscount - availablePoints)
        const settings = local.getUserSettings()
        
        // console.log(savings)
        return await createUserOrder({
            variables: {
                phone: token,
                products: changedCart,
                delivery: {
                    date: delivery?.weekday,
                    timeslot: delivery?.timeslot,
                    cut_offs: delivery?.cutOff,
                    address: settings?.address,
                    district: settings?.district || '',
                    customer_comment: settings?.instructions || '',
                    change: change > 0 ? `${change}` : 'no change',
                    total: defaultCost,
                    total_after_discount: withDiscount,
                    used_discount:  {
                        amount: savings,
                        informed: !!savings,
                        start_date: ''
                    }
                }
            }
        })
    }
    
    return {create, loadingOrder: loading};
}
