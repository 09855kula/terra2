import {Button, ButtonFlex, Container, Content, FlexBox, Header, Notification, OrderInfoWrapper, SubText, WrapperLeft} from "../styled";
import { CartType, ProductsType, RouteResponseType } from "../../../types";
import {Image, MainButton} from '../../common'
import React, {useContext, useEffect, useState} from 'react';

import { CartContext } from "../../../context/cartContext";
import { UPDATE_ORDER } from "../../../api";
import calendar from "../../../assets/icons/calendar.svg";
import {countOrder} from "../../../utils/order";
import {formedCart} from "../../../utils/formatCart";
import {local} from '../../../utils';
import location from "../../../assets/icons/location.png";
import money from "../../../assets/icons/money.svg";
import timeImage from "../../../assets/icons/time.svg";
import {useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import Loader from "../../loader";

interface PropsType {
    setRoute: (route: string) => void
    route: string
    address: string
    time: RouteResponseType | null
    cost: number
    cart: ProductsType[]
    order: CartType
    phone: string
}

const MergeOrder = ({route, time, address, cost, setRoute, cart, order, phone}: PropsType) => {
    const navigate = useNavigate()
    const [updateOrder, {loading}] = useMutation(UPDATE_ORDER)
    const {setActiveCart, setCart} = useContext(CartContext);
    const [isDisabled, setDisabled] = useState<boolean>(false)
    // let ids = products.map(prod => prod.id)

    // console.log(ids);
    
    const saveUpdatedOrder = async () => {
        setDisabled(true)
        const concatOrder = [...cart]
        const {products} = countOrder(concatOrder)
        const changedCart = formedCart(products)
        
        await updateOrder({
            variables: {
                phone: phone,
                products: changedCart,
                id: order?.id
            }
        }).then(({ data }) => {
            setCart([])
            navigate('/')
            local.remove()
        }).catch((err) => console.log('error', err))
    }

    // console.log(order);
    if(loading) return <Loader/>
    return (
        <WrapperLeft className={route === 'mergeOrder' ? 'active' : 'hide'}>
            <Container>
                <OrderInfoWrapper>
                    <FlexBox>
                        <Image src={location}/>
                        <SubText margin={'0 0 0 15px'}>{address}</SubText>
                    </FlexBox>
                    <FlexBox>
                        <Image src={calendar}/>
                        <SubText margin={'0 0 0 15px'}>{time?.weekday}</SubText>
                    </FlexBox>
                    <FlexBox>
                        <Image src={timeImage}/>
                        <SubText margin={'0 0 0 15px'}>{time?.timeslot}</SubText>
                    </FlexBox>
                    <FlexBox>
                        <Image src={money}/>
                        <SubText margin={'0 0 0 15px'}>${cost}</SubText>
                    </FlexBox>
                </OrderInfoWrapper>
                <div>
                    <Header>Add to extisting order?</Header>
                    <Content>
                        <Notification margin={'0'}>
                            You already have an order 
                            <br />
                            for this day. 
                            <br />
                            <br />
                            Do you want to add these
                            <br />
                            products to existing order? 
                        </Notification>
                    </Content>
                </div>
                <ButtonFlex className='checkout__btn-wrapper'>
                    <MainButton width={'120px'} onClick={() => setRoute('address')} disabled={isDisabled}>
                        No
                    </MainButton>
                    <MainButton width={'124px'} onClick={saveUpdatedOrder} disabled={isDisabled}>
                        Yes
                    </MainButton>
                </ButtonFlex>
            </Container>
        </WrapperLeft>
    )
}

export default MergeOrder;