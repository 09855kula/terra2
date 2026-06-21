import {BackButton, Image, MainButton} from '../common'
import {Flex, NotEnoughContainer, NotEnoughImage, NotEnoughText} from './styled'

import React from 'react'
import arrowLeft from "../../assets/icons/arrowLeftWhite.svg";
import danger from '../../assets/danger.svg'

export default function NotEnoughProduct({setBack, setConfirm, maxHeight}: PropsType) {
    
    return (
        <NotEnoughContainer>
            <NotEnoughImage src={danger} />
            <NotEnoughText>
                Due to low inventory, someone 
                got to the checkout before you! 
                <br />
                <br />
                Your cart has been adjusted
            </NotEnoughText>
            <Flex margin={'25px auto 0 auto'} width={'380px'}>
                    <BackButton onClick={setBack}>
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton>
                    <MainButton width={'218px'} onClick={setConfirm}>
                        {maxHeight ? 'Continue' : 'OK, proceed'}
                    </MainButton>
            </Flex>
        </NotEnoughContainer>
    )
}

interface PropsType {
   setBack: () => void
   setConfirm: () => void
   maxHeight: boolean
}