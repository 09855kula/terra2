import {HeaderToggleWrapper, HeaderWrapper, Toggle} from './styled'
import React, { useEffect } from 'react'
import { SET_ORDER_COMMENT_READ, SET_USER_COMMENT_READ } from '../../../api'

import useElementSize from '../../../hooks/useElementSize'
import { useMutation } from '@apollo/client'

const Header = ({toggle, setToggle, noOrders, isMoreThanOne, isUserRead, isDriverRead, reloadUser, reloadDriver, id, phone}: PropsType) => {
    const [squareRef] = useElementSize()
    const [setOrderComment] = useMutation(SET_ORDER_COMMENT_READ)
    const [setUserComment] = useMutation(SET_USER_COMMENT_READ)
    // console.log('header', isDriverRead)

    const loadDriver = () => {
        if (id && isDriverRead) {
            setOrderComment({
                variables: {id}
            })
            setTimeout(() => reloadDriver(), 2000) 
        }

        setToggle('Driver')
    }

    const loadUser = () => {
        if (phone && isUserRead) {
            setUserComment({
                variables: {phone}
            })
            setTimeout(() => reloadUser(), 2000)
        }
        
        setToggle('Customer')
    }

    useEffect(() => {
        if(toggle === 'Driver') {
            if (id && isDriverRead) {
                loadDriver()
            }
        }
        if(toggle === 'Customer') {
            if (id && isUserRead) {
                loadUser()
            }
        }
    },[isDriverRead, isUserRead, toggle])

    return (
        <HeaderWrapper ref={squareRef}>
            <HeaderToggleWrapper>
                    {!noOrders && 
                    <Toggle className={toggle === 'Driver' ? 'active' : ''}
                            onClick={loadDriver}
                            indicate={toggle !== 'Driver' && isDriverRead}
                            >
                        <span>Driver</span>
                    </Toggle>}
                    <Toggle 
                        className={toggle === 'Customer' ? 'active' : ''} 
                        noOrders={noOrders}
                        onClick={loadUser}
                        isCustomer={true}
                        indicate={toggle !== 'Customer' && isUserRead}
                        >
                        <span>Customer service</span>
                    </Toggle>
            </HeaderToggleWrapper>
            <p className={toggle === 'Customer' ? 'active' : 'hide'}>
                Here you can ask all your questions! We appreciate feedback 
                and suggestions so be honest, say whatever you want :)
                <br />
                <br /> 
                We also send info here about sales, news, events, etc
            </p>
            <p className={toggle === 'Driver' ? 'active' : 'hide'} >
                Here is the chat with your driver. Send any details 
                which may help your delivery, need change, etc
                <br />
                <br /> 
                {!isMoreThanOne ? 
                    <>Questions about the website? Switch to <span>Customer Service</span></>
                        :
                    <>
                        You’re chatting with the driver of the nearest order, scheduled on  28nov.
                        <br />
                        <br /> 
                        If you want to discuss another order, please switch to <span>Customer Service</span>
                    </>}
            </p>
        </HeaderWrapper>
    )
}

export default Header

interface PropsType {
    toggle: string
    setToggle: (toggle: string) => void
    noOrders: boolean
    isMoreThanOne: boolean
    isUserRead: boolean | undefined
    isDriverRead: boolean | undefined
    reloadDriver: () => void
    reloadUser: () => void
    id?: string
    phone: string | null
}