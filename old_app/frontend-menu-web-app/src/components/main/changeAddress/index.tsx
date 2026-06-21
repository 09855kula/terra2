import {BackButton, ButtonFlex, Flex, Image, MainContainerAddress} from '../../common';
import {Content, Head, ImageContainer, Instructions, Notification, Numbers, SubText, Title} from './styled';
import React, {useEffect, useState} from 'react';

import AnimatePage from '../../common/animation/animatePage';
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import current from "../../../assets/icons/checked.svg";
import {local} from '../../../utils'
import useGetDraftOrder from '../../../hooks/useGetDraftOrders';
import useGetProfile from '../../../hooks/useGetProfiles'
import {useLocation, useNavigate} from 'react-router-dom';
import {useToasts} from 'react-toast-notifications';
import {useWindowDimension} from "../../../hooks/useWindowDimension";
interface PropsType {
    userId: number
    token?: string
    isNewAddress?: boolean
    setIsNewAddress?: (isNewAddress: boolean) => void
    setProfileId?: (profileId: string) => void
    profileId?: string
    setChangeAddress?: (changeAddress: boolean) => void
    changeAddress?: boolean
}

const ChangeAddress = ({
                           userId, setIsNewAddress,
                           setProfileId,
                           setChangeAddress,
                           changeAddress,
    isNewAddress,
    profileId

                       }: PropsType) => {
        const navigate = useNavigate()
        const defaultAddress = local.getUserSettings()
        const [width] = useWindowDimension();
        const is743 = width >= 743
        const token = local.getToken() || ''
        const location = useLocation()
        const [address, setAddress] = useState<string>(defaultAddress?.address || '')
        const {isDraft} = useGetDraftOrder(token)
        const {profiles} = useGetProfile(userId)
        const {addToast} = useToasts();
    console.log('location:', location)

    const addressChange = (id: number, address: string, district: string) => {

        console.log('defaultAddresssdsd:', defaultAddress)
            addToast('address changed successfully', {appearance: 'success', autoDismiss: true})
            if (setProfileId) {
                setProfileId(id.toString())


            }

            setAddress(address)
        local.setUserSettings({profileId: id, address: address, district: district})
            // if (isDraft) {
            //
            //
            //
            // }
            //  else {
            //     addToast('you cannot change the address, you have undelivered goods at a different address', {
            //         appearance: 'error',
            //         autoDismiss: true
            //     })
            // }


                if(is743) {
                    if(location.pathname === '/delivery_window' || '/delivery_window/') {
                        if(location.pathname === '/delivery_window'){
                            navigate('/delivery_window/')
                        }
                        if(location.pathname === '/delivery_window/'){
                            navigate('/delivery_window')
                        }
                    }
                    if(location.pathname === '/checkout' ){
                        navigate('/checkout')
                    }
                } else {
                    console.log('location:', location)

                            navigate(-1)

                }

        }

        // useEffect(() => {
        //     // if (setIsNewAddress) {
        //     //     setIsNewAddress(true)
        //     //
        //     // }
        // }, [])

        return (
            <AnimatePage>
                <MainContainerAddress padding='39px' translateY='0' className="change__address">
                    <Title>{'Choose an address'}</Title>
                    <Head>We’ll deliver to the chosen address</Head>
                    <Content>
                        {profiles && profiles.map((item, idx) =>
                            <Flex
                                className={`${item.address === address ? 'address__item active' : 'address__item'}`}
                                key={item.id}
                                // direction={'column'}
                                justify={'flex-start'}
                                align={'flex-start'}
                                onClick={() => {addressChange(item.id, item.address, item.district)}}
                            >
                                {item.address === address ? <ImageContainer><Image className={'address__item-image'}
                                                                                   src={current}/></ImageContainer> :
                                    <Numbers>{idx + 1}.</Numbers>}
                                <Flex direction={'column'} align={'flex-start'} justify={'flex-start'}>
                                    <SubText>{item.address}</SubText>
                                    {item.special_instructions && <Instructions>{item.special_instructions}</Instructions>}
                                </Flex>
                            </Flex>
                        )}

                    </Content>
                    <Notification>
                        If you want to add a new address,
                        <br/>
                        go to <span>Info</span> {'->'} <span>Your Profile</span>
                    </Notification>
                    <ButtonFlex justify={'center'} className='tablet__hide'>
                        <BackButton width={'170px'} onClick={() => navigate(-1)}>
                            <Image src={arrowLeft}/>
                            Back
                        </BackButton>
                    </ButtonFlex>
                </MainContainerAddress>
            </AnimatePage>
        )
    }
;

export default ChangeAddress;
