import {Amount, AmountInput, AmountWrapper, AnotherAmount, ButtonFlex, Content, Header, InputWrapper, Notification} from "../styled";
import {BackButton, Flex, Image, MainButton} from "../../common";
import React, {useEffect, useState} from 'react';

import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import arrowRight from "../../../assets/icons/arrowRight.svg";
import checked from "../../../assets/icons/checked.svg";
import desktopArrow from '../../../assets/icons/arrowForChange.svg'
import { useWindowDimension } from "../../../hooks/useWindowDimension";

const amount = [5,10, 15, 20, 25]

interface PropsType {
    setRoute: (route: string) => void
    route: string
    noChange: boolean | null
    setNoChange: (noChange: boolean) => void
    setChange: (change: number) => void
}

const ChangeContent = ({setRoute, noChange, setNoChange, setChange}: PropsType) => {
    const [choiceAmount, setChoiceAmount] = useState(0)
    const [activeAmount, setActiveAmount] = useState(false)
    const [customAmount, setCustomAmount] = useState(0)
    const defaultAmount = choiceAmount > 0 ? choiceAmount : customAmount
    const [width] = useWindowDimension()
    const is744 = width >= 744;
  
    const changeDefault = (amount: number = 0) => {
        const defaultAmount = customAmount > 0 ? customAmount : amount
        setNoChange(true)
        setChange(defaultAmount)
    }

    useEffect(() => {
        if (customAmount > 0) {
            setChoiceAmount(0)
        } else {
            setCustomAmount(0)
            setActiveAmount(false)
        }
    }, [customAmount, choiceAmount])


    return (
        <>
            <div>
            <Header size={'15px'} className='checkout__small-header'>How much change do you need?</Header>
            <Content>
                <Notification margin={'0'}>Pick an amount or enter your own</Notification>
                <AmountWrapper>
                    {amount.map((el, idx) =>
                        <Amount
                            key={idx*el}
                            className={choiceAmount === el ? 'active' : ''}
                            onClick={() => changeDefault(el)}
                        ><span>$</span>{el}</Amount>
                    )}
                </AmountWrapper>
                <Flex margin={'19px 0 14px 0'}>
                    {/*<Notification margin={'0'} align={'left'}>*/}
                    {/*    Another amount? <br/>*/}
                    {/*    Tap here to input*/}
                    {/*</Notification>*/}
                    {/*<Image src={is744 ? desktopArrow : arrowRight}/>*/}

                    {!activeAmount &&
                    <AnotherAmount
                        className={customAmount > 0 && !activeAmount ? 'active' : ''}
                        onClick={() => setActiveAmount(true)}>
                        {customAmount ? `$${customAmount}` : 'Other'}
                    </AnotherAmount>

                    }
                    {activeAmount &&
                        <InputWrapper>
                            <AmountInput type="text"
                                         value={customAmount}
                                         onChange={(e) => setCustomAmount(+e.target.value)}>

                            </AmountInput>
                            <button onClick={() => setActiveAmount(false)}>
                                <Image src={checked}/>
                            </button>
                        </InputWrapper>
                    }
                    {!noChange &&
                        <AnotherAmount onClick={() => changeDefault()}>
                            {defaultAmount ? `$${defaultAmount}` : 'No change'}
                        </AnotherAmount>}
                </Flex>
            </Content>
            </div>
            <ButtonFlex className='checkout__btn-wrapper'>
                <BackButton onClick={() => setRoute('address')}>
                    <Image src={arrowLeft}/>
                    Back
                </BackButton>
                {!noChange &&
                <MainButton width={is744 ? '256px' : '170px'} onClick={() => changeDefault()}>
                    {defaultAmount ? `$${defaultAmount}` : 'No change'}
                </MainButton>}
            </ButtonFlex>
        </>
    )
};

export default ChangeContent;
