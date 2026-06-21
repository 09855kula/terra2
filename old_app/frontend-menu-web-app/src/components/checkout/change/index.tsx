import {Container, FlexBox, OrderInfoWrapper, SubText, WrapperRight} from "../styled";
import React, {useState} from 'react';

import ChangeContent from './changeContent';
import Confirm from '../confirm';
import {FadeInWrapper} from '../../'
import {Image} from "../../common";
import { RouteResponseType } from "../../../types";
import calendar from "../../../assets/icons/calendar.svg";
import location from "../../../assets/icons/location.png";
import money from "../../../assets/icons/money.svg";
import timeImage from "../../../assets/icons/time.svg";
import moment from "moment";

interface PropsType {
    address: string
    setRoute: (route: string) => void
    route: string
    time: RouteResponseType | null
    cost: number
    setOrder: () => void
    setChange: (change: number) => void
    userId: number
    loadingOrder: boolean
}

const Change = ({route, setRoute, time, cost, setOrder, setChange, address, userId, loadingOrder}: PropsType) => {
    const [noChange, setNoChange] = useState<boolean | null>(null)
    const currentDay = moment().format('dddd')
    const tomorrow = moment().add(1, 'day').format('dddd');
    const dayAfterTomorrow = moment().add(2, 'day').format('dddd');
    let day
    console.log('loading:', loadingOrder)
    if(time?.weekday===currentDay) {

        day = 'Today'
    }
    else if(time?.weekday===tomorrow) {
        day = 'Tomorrow'
    }
    else {
        day = time?.weekday
    }
    return (
        <>
            <WrapperRight className={route === 'change' ? 'active' : 'hide'}>
                <Container>
                    <OrderInfoWrapper>
                        <FlexBox className='place'>
                            <Image src={location}/>
                            <SubText margin={'0 0 0 15px'}>{address}</SubText>
                        </FlexBox>
                        <FlexBox className='day'>
                            <Image src={calendar}/>
                            <SubText margin={'0 0 0 15px'}>{day}</SubText>
                        </FlexBox>
                        <FlexBox className='time'>
                            <Image src={timeImage}/>
                            <SubText margin={'0 0 0 15px'}>{time?.timeslot}</SubText>
                        </FlexBox>
                        <FlexBox margin={'15px 0 20px 60px'} className='money'>
                            <Image src={money}/>
                            <SubText margin={'0 0 0 15px'}>${cost}</SubText>
                        </FlexBox>
                    </OrderInfoWrapper>
                {!noChange && <ChangeContent setChange={setChange}
                                            noChange={noChange}
                                            setNoChange={setNoChange}
                                            route={route}
                                            setRoute={setRoute}/>}
                {noChange && <Confirm loadingOrder={loadingOrder} setOrder={setOrder} setNoChange={setNoChange} route={route} setRoute={setRoute} userId={userId}/>}
                </Container>
            </WrapperRight>
        </>
    );
};

export default Change;
