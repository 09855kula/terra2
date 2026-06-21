import {Chat, ContentWrapper, CreatedContent, CreatedLabel, Order, OrderEditButton, OrderFlexBox, OrderSubText, OrderWrapper} from './styled';
import {Flex, Image} from "../../common";

import { Link } from 'react-router-dom';
import {OrderType} from "../../../types";
import React, {useState} from 'react';
import calendar from "../../../assets/icons/calendar.svg";
import chat from "../../../assets/icons/chat.svg";
import location from "../../../assets/icons/location.png";
import moment from 'moment';
import money from "../../../assets/icons/money.svg";
import newMessage from "../../../assets/icons/newMessage.svg";
import timeImage from "../../../assets/icons/time.svg";
import useDriverComments from '../../../hooks/subscription/useDriverComments';

const Created = ({cart, phone}: PropsType) => {
    const date = cart.delivery_date && moment(cart?.delivery_date).format('dddd, D MMM')
    //
    const {getComments} = useDriverComments(phone)
    const comments = getComments?.filter(o => !o.isRead)
    const isComments = Boolean(comments?.length)

    return (
        <>
            <OrderWrapper>
                <div>
                    <CreatedContent>
                        <ContentWrapper>
                            <Flex margin={'0 0 22px 0'}>
                                    <Order>Order № {cart?.id}</Order>
                                {/*<Link to="/customer_service">*/}
                                <Link to={'/'} >
                                    <Chat newMessage={isComments}>
                                        <Image src={isComments ? newMessage : chat}/>
                                        {isComments ? `${comments?.length} new`: 'Chat'}
                                    </Chat>
                                </Link>
                                </Flex>
                                <OrderFlexBox>
                                    <Image src={timeImage}/>
                                    <OrderSubText>{cart?.timeslot}</OrderSubText>
                                </OrderFlexBox>
                                <OrderFlexBox>
                                    <Image src={calendar}/>
                                    <OrderSubText>{date}</OrderSubText>
                                </OrderFlexBox>
                                <OrderFlexBox>
                                    <Image src={location}/>
                                    <OrderSubText>{cart?.address}</OrderSubText>
                                </OrderFlexBox>
                                <OrderFlexBox>
                                    <Image src={money}/>
                                    <OrderSubText>${cart?.total_after_discount}</OrderSubText>
                                </OrderFlexBox>
                        </ContentWrapper>
                            <Flex>
                                <OrderEditButton to='/order/edit'>Edit order</OrderEditButton>
                                <CreatedLabel>{cart?.status === 'draft' ? 'Created' : cart?.status}</CreatedLabel>
                            </Flex>
                    </CreatedContent>
                </div>
            </OrderWrapper>
        </>
    )
}

export default Created;

interface PropsType {
    cart: OrderType
    phone: string
}