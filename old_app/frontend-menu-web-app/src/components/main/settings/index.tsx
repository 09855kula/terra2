import {ActionButton, AddAddress, AddressContainer, Content, ContentWrapper, FlexContainer, Instructions, Numbers, SubText, Text} from './styled';
import {BackButton, ButtonFlex, Flex, Image, MainContainer} from "../../common";
import {Link, useNavigate} from 'react-router-dom'
import React, {useState} from 'react';
import { local, users } from '../../../utils';

import { AnimatePage } from '../..';
import {TitleBlock} from '../styled';
import { UserType } from '../../../types';
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import plus from "../../../assets/icons/plusGreen.svg";
import useGetProfile from '../../../hooks/useGetProfiles';

const Settings = ({user}: ReferType) => {
    // const {first_name, addresses, points, id} = user;
    const [phone, setPhone] = useState<string>('')
    const {profiles} = useGetProfile(user?.id)
    const navigate = useNavigate()
    const {availablePoints} = users.countPoints(user?.points)
    const [changeAddress, setChangeAddress] = useState(false)
    // const [address, setAddress] = useState<string>('')
    // const disable = (phone.length < 8 && address.length < 6)

    const logout = () => {
        local.removeAll()
        window.location.reload()
    }   

    return (
        <AnimatePage>
                <MainContainer padding='39px'>
                    <TitleBlock><h3>Hey, {user?.first_name}</h3></TitleBlock>
                    <AddressContainer>
                    <Text margin={'18px 0 24px 0'}>
                        Here you can edit your delivery <br/>
                        addresses or add another one.
                    </Text>
                    <Content>
                        <ContentWrapper>
                        {profiles?.map((profile, idx) => 
                            <FlexContainer key={idx*123}>
                                <Numbers>{idx + 1}.</Numbers>
                                <Flex direction={'column'} align={'flex-start'} justify={'flex-start'}>
                                    <SubText>{profile.address}</SubText>
                                    <Instructions>{profile.special_instructions}</Instructions>
                                </Flex>
                                
                            </FlexContainer>
                        )}                    
                        </ContentWrapper>
                        <Link to={'new_profile'}>
                            <AddAddress>
                                <Image src={plus}/>Add new delivery profile
                            </AddAddress>
                        </Link>
                    </Content>
                    {user?.points > 0 && <Text margin={'34px 0 0 0'}>You got <span>${availablePoints} off</span> your next order!</Text>}
                    </AddressContainer>
                    <Link to={'change_number'}>
                        <ActionButton>Change phone number</ActionButton>
                    </Link>
                    <ActionButton onClick={logout}>Log out</ActionButton>
                    <ButtonFlex justify={'center'} margin={'82px 0 20px 0'} className='desktop__hide'>
                        <BackButton onClick={() => navigate(-1)} width='170px'>
                            <Image src={arrowLeft}/>
                            Back
                        </BackButton>
                    </ButtonFlex>
                </MainContainer>
        </AnimatePage>
    );
};

export default Settings;

interface ReferType {
    user: UserType
}

