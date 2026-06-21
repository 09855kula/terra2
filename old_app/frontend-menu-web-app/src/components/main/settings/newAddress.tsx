import { AddressInput, ChangeAddressText } from './styled';
import {BackButton, ButtonFlex, Image, MainContainerAddress} from "../../common";
import {Button, Content, DefaultButton, Header, TitleBlock} from '../styled';
import React, {KeyboardEvent, useState} from 'react';

import { AnimatePage } from '../..';
import { CREATE_PROFILE } from '../../../api/mutation/profile';
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import { useMutation } from '@apollo/client';
import {useNavigate} from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';

const NewAddress = ({phone}: PropsType) => {
    const navigate = useNavigate()
    const { addToast } = useToasts();
    //
    const [createProfile] = useMutation(CREATE_PROFILE)
    //
    const [special_instruction, setInstruction] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const disable = (address.length < 6)

    const create = async () => {
        await createProfile({
            variables: {
                phone,
                address,
                special_instruction}
            }).then(({ data }) => {
                //console.log(data)
                setAddress('')
                setInstruction('')
                addToast(`Your request was sent, please wait the admin to approve your new address` , {appearance: 'success', autoDismiss: true});
                navigate('/profile')
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
                <Header className='mobile__header'>Add new delivery profile</Header>
                <TitleBlock className='desktop__header'><h3>Add new address</h3></TitleBlock>
                    <Content>
                        <ChangeAddressText>
                            Еnter new address and special
                            instruction which will be attached to
                            this profile
                        </ChangeAddressText>
                        <AddressInput type='text' placeholder='Address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyPress={handleKeypress}
                                />
                        <AddressInput type='text' placeholder='Special instruction'
                                value={special_instruction}
                                className='instruction'
                                onChange={(e) => setInstruction(e.target.value)}
                                onKeyPress={handleKeypress}
                                />
                        <ButtonFlex className="desktop__btn-wrapper">
                            <DefaultButton width={'133px'} onClick={() => navigate(-1)}>
                                <Image src={arrowLeft}/>
                                Back
                            </DefaultButton>
                            <DefaultButton width={'198px'} padding='17px 25px' disabled={disable} onClick={create}>Send request</DefaultButton>
                        </ButtonFlex>
                    </Content>
                <ButtonFlex className="reffer__buttons">
                    <BackButton width={'133px'} onClick={() => navigate(-1)}>
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton>
                    <Button width={'183px'} disabled={disable} onClick={create}>Send request</Button>
                </ButtonFlex>
            </MainContainerAddress>
        </AnimatePage>
    );
};

export default NewAddress;

interface PropsType {
    phone: string
}
