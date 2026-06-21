import {AddressBlock, ChoiceTime, CutoffText, CutoffTitle, DeliveryContent, DeliveryItem, LinkToProfile, Notification, TextChangeDay} from './styled'
import {BackButton, ButtonFlex, Flex, Image, MainButton} from "../../common";
import { ChangeAddress, FadeInWrapper } from '../..';
import {
    Container,
    Header,
    SubText,
    Text,
    WrapperRight
} from '../styled';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {delivery, local} from '../../../utils'

import { Loader } from '../..';
import { RouteResponseType } from '../../../types';
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import location from "../../../assets/icons/location.png";
import useGetRoutes from '../../../hooks/useGetRoutes'
import { useNavigate } from 'react-router';
import { useWindowDimension } from '../../../hooks/useWindowDimension';
import moment from "moment";
import MergeOrder from "../mergeOrder";
const map = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
} as { [key: string]: number }
const mapIfSaturday = {
    'Monday': 3,
    'Saturday': 1,
    'Sunday': 2
} as { [key: string]: number }
const mapIfSunday = {
    'Monday': 2,
    'Tuesday': 3,
    'Sunday': 1
} as { [key: string]: number }

const CheckoutAddress = ({
                             route,
                             setRoute,
                             setAddress,
                             setActiveCart, 
                             address,
                             timeOfDelivery,
                             setTimeOfDelivery,
                             addAddress,
                             userId,
                             profileId,
                             setProfileId
                         }: PropsType) => {

    const {chooseDeliveryWindow, loading} = useGetRoutes(profileId)
    // console.log('profileIdchooseDeliveryWindow:',profileId)
    const [choiceTime, setChoiceTime] = useState<number | null>()
    const [width] = useWindowDimension()
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    const is744 = width >= 744;
    const is1280 = width >= 1280;
    const [changeAddress, setChangeAddress] = useState<boolean>(false)
    const [isNewAddress, setIsNewAddress] = useState(false)
    // console.log('changeAddress', changeAddress)
    // console.log('address', address)
    const navigate = useNavigate()
    const editOrderTime = local.getEditGoods()
    const confirm = !!(timeOfDelivery && address)
    let deliveryTime = delivery.formatTimeForDelivery2(chooseDeliveryWindow)
    const currentTime = deliveryTime?.findIndex(route => !route.changedPeriod && !route.isCutoff && !route.dayOff)
    const currentDelivery = confirm ? timeOfDelivery : deliveryTime[currentTime]
    const today = moment().format('dddd')
    const tomorrow = moment().add(1, 'day').format('dddd');
    const dayAfterTomorrow = moment().add(2, 'day').format('dddd')
    console.log('confirm:',confirm)
   const timeWinnipeg = chooseDeliveryWindow?.map((route) => {
        const {delivery_date, current_date, currentDay} =
            delivery.formatTimeForDelivery(route.weekday, route.cutOff)
       return current_date
    })[0]
    // console.log('currentTime:', currentTime)
    // if(chooseDeliveryWindow) {
    //     chooseDeliveryWindow.sort((a, b) => map[a.weekday] - map[b.weekday])
    //     if(today === 'Sunday'){
    //          chooseDeliveryWindow.sort((a, b) => mapIfSunday[a.weekday] - mapIfSunday[b.weekday])
    //     }
    //     if(today === 'Saturday'){
    //         chooseDeliveryWindow.sort((a, b) => mapIfSaturday[a.weekday] - mapIfSaturday[b.weekday])
    //     }
    //
    // }
    // console.log('currentDelivery:', currentDelivery )

    const changeTime = (inx?: number) => {
        const idx = inx ? inx : currentTime
        setChoiceTime(idx)
        setTimeOfDelivery(chooseDeliveryWindow[idx])
        checkDeliveryTime(chooseDeliveryWindow[idx])
    }

    const backToCart = () => {
        setActiveCart(true)
        navigate('/products')
    }
    const checkDeliveryTime = (deliveryRoute?: RouteResponseType) => {
        // console.log('deliveryRoute:', deliveryRoute )
        if (deliveryRoute) {
            setTimeOfDelivery(deliveryRoute)
            const {delivery_date} = delivery.formatTimeForDelivery(deliveryRoute?.weekday, deliveryRoute?.timeslot)
            if (editOrderTime && delivery_date === editOrderTime?.date) {
                setRoute('mergeOrder')
            } else {
                setRoute('change')
            }
        }
    }
    const everyTime = deliveryTime.every(i => i.cutOff === '')
    console.log('chooseDeliveryWindow:', chooseDeliveryWindow)
    if (loading) return <Loader/>
    return (<>
            <WrapperRight className={route === 'address' ? 'active' : 'hide'}>
                <Container padding={'31px 0 0 0'}>
                    <div className='desktop__notif'>
                        {!changeAddress && 
                        <>
                        <AddressBlock>
                            <Image src={location}/>
                            <Flex className='address__block' margin={'0 5px 0 13px'} direction={'column'} align={'start'} grow={1}>
                                <Text className='address__title'>Current address:</Text>
                                <SubText className='address__text'>{address ? address : 'Create your first address'}</SubText>
                            </Flex>
                        {address ? 
                            <>
                                {!is1280 && <LinkToProfile is744={is744 && !is1280} is1280={is1280} to={'/change_address'} >Change</LinkToProfile>}
                                {is1280 && <LinkToProfile is744={is744 && !is1280} is1280={is1280} to={'/checkout'} onClick={() => setChangeAddress(true)}>Change</LinkToProfile>}
                            </>
                            : <button onClick={() => setActiveCart(false)}>
                            <LinkToProfile to={'/'}>Create</LinkToProfile>
                            </button>}
                        </AddressBlock>
                            {is1280 && 
                            <Notification>
                                After <span>Cutoff*</span> time same day <br/> delivery will not be possible
                                <br/>
                                <br/>
                                {delivery.isSaturdayOrSunady() && 'Come on Monday for a new menu!'}
                            </Notification>}
                        </>}
                        {changeAddress && <ChangeAddress
                            userId={userId}
                            isNewAddress={isNewAddress}
                            setIsNewAddress={setIsNewAddress}
                            setProfileId={setProfileId}
                            profileId={profileId}
                            setChangeAddress={setChangeAddress}
                            changeAddress={changeAddress}
                        />}
                    </div>
                    <div>
                        {/*<div>{timeWinnipeg*/}
                        {/*? timeWinnipeg*/}
                        {/*    :"Not time"*/}

                        {/*}</div>*/}
                    <Header>Choose delivery window</Header>


                    <DeliveryContent>

                        {chooseDeliveryWindow?.map((route, idx) => {
                            const {delivery_date, current_date, currentDay} =
                            delivery.formatTimeForDelivery(route.weekday, route.cutOff)
                            let cutoff
                            if(currentDay === 'Sunday') {
                                if( tomorrow === 'Monday' && !cutoff) {
                                    cutoff = chooseDeliveryWindow[idx].weekday === currentDay
                                        && moment(delivery_date).subtract(7,'d').isBefore(timeWinnipeg)
                                } else {
                                    cutoff = chooseDeliveryWindow[idx].weekday === currentDay
                                        && moment(delivery_date).isBefore(timeWinnipeg)
                                }


                            } else {
                                cutoff = chooseDeliveryWindow[idx].weekday === currentDay
                                    && moment(delivery_date).isBefore(timeWinnipeg)
                            }

                            // console.log('cutoff:', cutoff)
                            // console.log('current_date:',current_date)
                            // console.log('delivery_date:',delivery_date)
                            // console.log('timeWinnipeg:',timeWinnipeg)
                            let dayOff = route.timeslot === 'Day Off!'
                            let changeTimeslot = route.timeslot.slice(0,4) === 'Menu'

                            return <DeliveryItem  key={idx*14}>
                                        <Flex direction={'column'} align={'flex-end'} className='checkout__day-wrapper'>

                                            {today === route.weekday
                                                ?chooseDeliveryWindow[idx] &&
                                                <CutoffTitle>Today:</CutoffTitle>
                                                : ''}
                                            {tomorrow === route.weekday
                                                ?chooseDeliveryWindow[idx] &&
                                                <CutoffTitle>Tomorrow:</CutoffTitle>
                                                : ''}
                                            {dayAfterTomorrow === route.weekday
                                                ?chooseDeliveryWindow[idx] &&
                                                <CutoffTitle>{route.weekday}:</CutoffTitle>
                                                : ''}
                                            {route.cutOff && <CutoffText size='14px'>Cutoff {route.cutOff}</CutoffText>}
                                        </Flex>
                                        {dayOff || changeTimeslot ? 
                                        <> 
                                            {dayOff && <CutoffTitle>{route.timeslot}</CutoffTitle> }
                                            {changeTimeslot && <TextChangeDay>{route.timeslot}</TextChangeDay> }
                                        </>
                                            :
                                        <>
                                            {cutoff ? <CutoffTitle>Cutoff has passed!</CutoffTitle>
                                            :
                                            <ChoiceTime className={choiceTime === idx ? 'active' : ''}
                                                    onClick={() => changeTime(idx)}>
                                                {route.timeslot}
                                            </ChoiceTime>}
                                        </>}

                                    </DeliveryItem>

                        })}
                    </DeliveryContent>
                    </div>
                    {!is744 && 
                    <Notification>
                        After <span>Cutoff*</span> time same day <br/> delivery will not be possible
                        <br/>
                        <br/>
                        {delivery.isSaturdayOrSunady() && 'Come on Monday for a new menu!'}
                    </Notification>}
                <ButtonFlex className='checkout__back-btn'>
                    <BackButton onClick={backToCart}>
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton>
                    {!is744 && 
                    <MainButton 
                            padding='12px'
                            direction={'column'}
                            size={'20px'}
                            width={'170px'}
                            onClick={() => checkDeliveryTime(currentDelivery)}
                            className={everyTime ? 'disabled' : ''}
                            >
                        {!confirm
                            ?
                            <>
                                {deliveryTime[currentTime+1]?.day}
                                <span>{deliveryTime[currentTime+1]?.timeslot}</span>

                            </>
                            :
                            <> {
                                deliveryTime[currentTime]?.day }
                        <span>{timeOfDelivery?.timeslot}</span></>
                        }
                    </MainButton>}
                </ButtonFlex>
                </Container>
            </WrapperRight>
        </>
    );
};

export default memo(CheckoutAddress);

interface PropsType {
    setAddress: (address: string) => void
    address: string
    setRoute: (route: string) => void
    setActiveCart: (active: boolean) => void
    route: string
    timeOfDelivery: RouteResponseType | null
    setTimeOfDelivery: (a: RouteResponseType) => void
    addAddress: () => void
    userId: number
    profileId: string
    setProfileId: (profileId: string) => void


}
