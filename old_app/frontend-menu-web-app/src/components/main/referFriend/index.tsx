import {BackButton, ButtonFlex, Image, MainButton, MainContainerAddress} from "../../common";
import { Content, DefaultButton, Header, Input, RefferFrienText, TitleBlock } from '../styled';
import React, {KeyboardEvent, useState} from 'react';

import { AnimatePage } from '../..';
import {Link, useNavigate} from 'react-router-dom';
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import {useToasts} from "react-toast-notifications";
import {useMutation} from "@apollo/client";
import {REFER_FRIEND} from "../../../api";
import {useWindowDimension} from "../../../hooks/useWindowDimension";

const Refer = ({phone}: PropsType) => {
    const navigate = useNavigate()
    const { addToast } = useToasts();
    const [referFriend] = useMutation(REFER_FRIEND)
    const [phone_friend, setPhone] = useState<string>('')
    const [address_friend, setAddress] = useState<string>('')
    const [width] = useWindowDimension();
    const is743 = width >= 743
    const disable = phone_friend.length < 8 || address_friend.length < 6
    const create = async () => {
        await referFriend({
            variables: {
                phone,
                address_friend,
                phone_friend}
        }).then(({ data }) => {
            //console.log(data)
            setAddress('')
            setPhone('')
            addToast(`Your request was sent, please wait the admin to approve your friend` , {appearance: 'success', autoDismiss: true})

            if(!is743) {
               return  navigate('/change_address')
            }  else {
                navigate('/checkout')
            }
        }).catch((err) => console.log('error', err))
    }

    const handleKeypress = (e: KeyboardEvent) => {
        //it triggers by pressing the enter key
        if (e.key === "Enter" && e.code === "Enter") {
            create()
        }
    };
    return (
        <AnimatePage>
        <MainContainerAddress className='reffer__container'>
            <Header className='mobile__header'>Refer a friend</Header>
            <TitleBlock className='desktop__header'><h3>Refer a friend</h3></TitleBlock>
            <Content className='friend__content'>
                <RefferFrienText>
                    We will need the physical address and
                    phone number of the person you
                    want to invite
                    <br/>
                    <br/>
                    The info you give will help create their account!
                </RefferFrienText>
                <Input type='text' placeholder='Address'
                    value={address_friend}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={handleKeypress}
                />
                <Input type='text' placeholder='Phone number'
                    value={phone_friend}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={handleKeypress}
                />
                    <ButtonFlex className="desktop__btn-wrapper">
                        <Link to='/'>
                            <DefaultButton width={'133px'}>
                                <Image src={arrowLeft}/>
                                Back
                            </DefaultButton>
                        </Link>
                        <DefaultButton
                            width={'198px'}
                            padding='17px 25px'
                            disabled={disable}
                            onClick={create}
                        >Invite</DefaultButton>
                    </ButtonFlex>
            </Content>
            <ButtonFlex className="reffer__buttons">
                <Link to='/'>
                    <BackButton>
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton>
                </Link>
                <MainButton
                    disabled={disable}
                    width='170px'
                    onClick={create}
                >Invite</MainButton>
            </ButtonFlex>
        </MainContainerAddress>
        </AnimatePage>
    );
};

export default Refer;

interface PropsType {
    phone: string
}