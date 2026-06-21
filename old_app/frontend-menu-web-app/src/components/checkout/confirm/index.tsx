import {BackButton, Image, MainButton} from "../../common";
import {Button, ButtonFlex, CheckBox, Content, Header, Instructions, Notification} from "../styled";
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';

import { CHANGE_INSTRUCTION } from "../../../api/mutation/profile";
import { CartContext } from "../../../context/cartContext";
import {FadeInWrapper} from '../../'
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import {local} from '../../../utils'
import useCheckProducts from "../../../hooks/useCheckProducts";
import useGetProfile from '../../../hooks/useGetProfiles'
import { useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { useWindowDimension } from "../../../hooks/useWindowDimension";
import Loader from "../../loader";

interface PropsType {
    setNoChange: (noChange: boolean  | null) => void
    setRoute: (route: string) => void
    route: string
    setOrder: () => void
    userId: number
    loadingOrder: boolean
}

const Confirm = ({setNoChange, setOrder, userId, loadingOrder}: PropsType) => {
    const settings = local.getUserSettings()
    const navigate = useNavigate()
    const {cart, setActiveCart, setAvailable} = useContext(CartContext)
    const {checkProduct} = useCheckProducts()
    const [instruction , {loading}] = useMutation(CHANGE_INSTRUCTION)
    const [width] = useWindowDimension()
    const is744 = width >= 744;
    const [instructions, setInstruction] = useState<string>('')
    const [isDefault, setDefault] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const [isDisabled, setDisabled] = useState<boolean>(false)
    const {profiles} = useGetProfile(userId)

    console.log('profiles:',profiles)
    console.log('settings:',settings)
    const currentAddress = profiles?.filter(prof => prof?.address === settings?.address)

    console.log('currentAddress:', currentAddress)
    console.log('show', show)
    const check = async () => {
        setDisabled(true)
        let ids = cart.map(prod => prod.id)
        const res = await checkProduct(cart, ids)

        if (res?.allProducts) {
            // if (show) {
            //     local.setUserSettings({instructions: instructions, district: currentAddress && currentAddress[0]?.district})
            // }
            // local.setUserSettings({district: currentAddress && currentAddress[0]?.district})
            // setOrder()


            if (show) {
                    local.setUserSettings({
                        instructions: instructions,
                        district: currentAddress && currentAddress[0]?.district,
                        address: currentAddress && currentAddress[0]?.address,

                    })


            }
                local.setUserSettings({
                    district: currentAddress && currentAddress[0]?.district,
                    address: currentAddress && currentAddress[0]?.address,
                })
            setOrder()

        } else {
            setActiveCart(true)
            navigate('/products')
            res?.products && setAvailable(res?.products)
        }

        if (isDefault) {
            let id = currentAddress && currentAddress[0]?.id.toString()
            await instruction({
                variables: {
                    profileId: id,
                    instruction: instructions
                }   
            })
        }

    }

    const changeInstruction = (e: ChangeEvent<HTMLInputElement>) => {
        setInstruction(e.currentTarget.value)
        setShow(true)
    }
    // console.log(profiles);

    useEffect(() => {
        if (currentAddress?.length) {
            const ins = currentAddress[0]?.special_instructions
            setInstruction(ins)
        }
    }, [profiles])
    if(loadingOrder) return <Loader/>
    return (
        <>  <div>
                <Header className='checkout__small-header'>Last step!</Header>
                <Content>
                    <Notification margin={'0'}>
                        Here are the special instructions
                        <br/>
                        attached to your address.
                        <br/>
                        <br/>
                        Is there anything else we could know
                        <br/>
                        to make delivery easier?
                    </Notification>
                    <Instructions value={instructions} onChange={changeInstruction}/>
                    {is744 && <>
                        <CheckBox id="instruction-check" type="checkbox" checked={isDefault} onChange={(e) => setDefault(e.currentTarget.checked)}/>
                        <label htmlFor="instruction-check">Make it default special instruction</label>
                    </>}
                    {!is744 && show && <>
                        <CheckBox id="instruction-check" type="checkbox" checked={isDefault} onChange={(e) => setDefault(e.currentTarget.checked)}/>
                        <label htmlFor="instruction-check">Make it default special instruction</label>
                    </>}
                </Content>
            </div>
            {!is744 && <Notification margin={'20px 0 0 0'}>Click “Place order” to complete checkout</Notification> }
            <ButtonFlex className='checkout__btn-wrapper'>
                <BackButton onClick={() => setNoChange(null)} disabled={isDisabled}>
                    <Image src={arrowLeft}/>
                    Back
                </BackButton>
                <MainButton width={is744 ? '222px' :'170px'} disabled={isDisabled} onClick={check}>
                    Place order
                </MainButton>
            </ButtonFlex>
        </>
    );
};

export default Confirm;

