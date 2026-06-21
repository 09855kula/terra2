import {ADD_ADDRESS, GET_USER} from "../../api";
import {Change, CheckoutAddress, FadeInWrapper, Loader, MergeOrder} from "../../components";
import {Header, Wrapper} from './styled';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {local, users} from "../../utils";
import {useMutation, useQuery} from "@apollo/client";

import {CartContext} from '../../context/cartContext';
import {RouteResponseType} from "../../types";
import {countOrder} from "../../utils/order";
import styled from "styled-components";
import useCreateOrder from "../../hooks/useCreateOrder";
import {useNavigate} from "react-router-dom";
import useGetProfile from "../../hooks/useGetProfiles";
import useGetRoutes from "../../hooks/useGetRoutes";

const Checkout = () => {
    const {setActiveCart, setCart, refetch} = useContext(CartContext);
    const {create, loadingOrder} = useCreateOrder()
    const navigate = useNavigate()
    const token = local.getToken();
    const cart = local.getCart()
    const savings = local.getDiscount() || 0;
    const {availablePoints} = users.countPoints(savings)
    const defaultAddress = local.getUserSettings()
    let {withDiscount} = countOrder(cart)
    withDiscount = Math.floor(withDiscount - availablePoints)

    const {data: User, loading, refetch: userFetch} = useQuery(GET_USER, {variables: {phone: token}})
    const [addAddress] = useMutation(ADD_ADDRESS)
    const [route, setRoute] = useState('address')
    const [address, setAddress] = useState<string>('')
    const [change, setChange] = useState(0)
    const [timeOfDelivery, setTimeOfDelivery] = useState<RouteResponseType | null>(null)
    const [profileId, setProfileId] = useState<string>(User?.getUser?.last_profile?.toString())
    const {routes} = useGetRoutes(profileId)
    const {profiles} = useGetProfile(User?.getUser.id)
    // console.log('default:',defaultAddress)
    const currentAddress = profiles?.filter(prof => prof?.address === defaultAddress?.address)[0]
    const currentProfileId = profiles?.filter(prof => prof?.id === defaultAddress?.profileId || User?.getUser?.last_profile.toString())[0]

    console.log('currentAddress54:', currentAddress)
    useEffect(() => {
        if (defaultAddress?.address) {
            setAddress(defaultAddress?.address)
            if(currentAddress) {
                setProfileId(currentAddress.id.toString())
                local.setUserSettings({profileId: currentAddress.id.toString(), address: currentAddress.address, district: currentAddress.district})
            }
        } else {
            if (defaultAddress?.profileId) {
                setProfileId(defaultAddress?.profileId)

                if(currentProfileId) {
                    setAddress(currentProfileId.address)
                    local.setUserSettings({profileId: currentProfileId.id.toString(), address: currentProfileId.address, district: currentProfileId.district})
                }
            } else {
                if (User?.getUser) {
                    const {addresses, profiles} = User.getUser

                    setProfileId(User?.getUser?.last_profile.toString())
                    if(currentProfileId) {
                        setAddress(currentProfileId.address)
                        local.setUserSettings({profileId: currentProfileId.id.toString(), address: currentProfileId.address, district: currentProfileId.district})
                    }

                }
            }
        }
    }, [defaultAddress]);




    // useEffect(() => {
    //     if (defaultAddress?.profileId) {
    //         setProfileId(defaultAddress.profileId)
    //     }
    //
    //     if (User?.getUser) {
    //         const {addresses, profiles} = User.getUser
    //         if (defaultAddress?.profileId) {
    //             setProfileId(defaultAddress.profileId)
    //         } else {
    //             setProfileId(User.getUser.last_profile.toString())
    //         }
    //         if (defaultAddress?.address) {
    //             setAddress(defaultAddress.address)
    //         } else {
    //             if(currentAddress) {
    //                 setAddress(currentAddress.address)
    //                 local.setUserSettings({address: currentAddress.address, district: currentAddress.district})
    //             } else {setAddress(addresses[0])}
    //         }
    //     }
    //
    // }, [defaultAddress]);
    // const [profileId, setProfileId] = useState<string>(defaultAddress?.profileId ||User?.getUser?.last_profile?.toString())
    // const {profiles} = useGetProfile(User?.getUser.id)
    //
    // // console.log('profiles:',profiles)
    // // const currentAddress = profiles?.filter(prof => Number(prof?.id) === defaultAddress?.profileId || User?.getUser?.last_profile)[0]
    // const currentAddress = profiles?.filter(prof => prof?.address === defaultAddress?.address)[0]
    // console.log('currentAddress54:', currentAddress)
    // useEffect(() => {
    //     if (defaultAddress?.profileId) {
    //         // @ts-ignore
    //         setProfileId(currentAddress.id)
    //     }
    //
    //     if (User?.getUser) {
    //         const {addresses, profiles} = User.getUser
    //         if (defaultAddress?.profileId) {
    //             if(currentAddress) {
    //                 // @ts-ignore
    //                 setProfileId(currentAddress.id)
    //                 local.setUserSettings({profileId: currentAddress.id, address: currentAddress.address, district: currentAddress.district})
    //             }
    //         } else {
    //             setProfileId(User.getUser.last_profile.toString())
    //             local.setUserSettings({profileId: User.getUser.last_profile.toString()})
    //         }
    //         if (defaultAddress?.address) {
    //             setAddress(defaultAddress.address)
    //             if(currentAddress) {
    //                 local.setUserSettings({address: currentAddress.address, district: currentAddress.district})
    //             }
    //
    //         } else {
    //             if(currentAddress) {
    //                 setAddress(currentAddress.address)
    //                 local.setUserSettings({address: currentAddress.address, district: currentAddress.district})
    //             }
    //         }
    //     }
    //
    // }, [defaultAddress]);
    const addAddressHandler = useCallback(async () => {
        await addAddress({
            variables: {
                phone: token,
                address: address,
            }
        }).then(({data}) => {
            console.log(data)
            userFetch()
        })
    }, [])

    const setOrder = async () => {
        const res = await create(timeOfDelivery, change)
        if (res?.data) {
            setActiveCart(false)
            setCart([])
            navigate('/')
            local.remove()
            setTimeout(() => refetch(), 1000)
        } else {
            console.log(res);
        }
    }
    if (loading) return <Loader/>
    // console.log('profileIdd:', profileId)
    return (
        <FadeInWrapper keyElement={route}>
            <Wrapper>
                <Header>
                    Checkout
                </Header>
                <Content>
                    <CheckoutAddress
                        route={route}
                        setRoute={setRoute}
                        address={address}
                        setAddress={setAddress}
                        setActiveCart={setActiveCart}
                        timeOfDelivery={timeOfDelivery}
                        setTimeOfDelivery={setTimeOfDelivery}
                        addAddress={addAddressHandler}
                        userId={User?.getUser?.id}
                        profileId={profileId}
                        setProfileId={setProfileId}

                    />
                    <Change
                        userId={User?.getUser?.id}
                        address={address}
                        setRoute={setRoute}
                        route={route}
                        time={timeOfDelivery}
                        cost={withDiscount}
                        setChange={setChange}
                        setOrder={setOrder}
                        loadingOrder={loadingOrder}
                    />
                    <MergeOrder
                        route={route}
                        time={timeOfDelivery}
                        address={address}
                        cost={withDiscount}
                        setRoute={setRoute}
                        cart={cart}
                        order={User?.getUser?.cart}
                        phone={User?.getUser?.phone}
                    />
                </Content>
            </Wrapper>
        </FadeInWrapper>
    );
};

export default Checkout;

export const Content = styled.div`
  position: relative;

  @media screen and (min-width: 743px) {
    padding-top: 120px;
  }
`
