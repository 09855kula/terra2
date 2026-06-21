import { BackGround, PlusButton } from './styled';

import { AnimatedPulse } from '..';
import { Image } from '../common';
import Plus from '../../assets/icons/plus.png'
import React from 'react';

const AddButton = ({addToCart, unit, pack, disabled, single = false}: PropsType) => {

  return <>
            <AnimatedPulse keyElement={unit}>
                {single ? 
                <PlusButton disabled={disabled} onClick={() => addToCart()}>
                    <Image src={Plus}/>
                </PlusButton>
                :
                <PlusButton disabled={disabled} onClick={() => addToCart(unit)}>
                    {unit * pack}
                    {unit > 0 && <span>ADD</span>}
                </PlusButton>}
            </AnimatedPulse>
            <BackGround/>
        </>
  
};

export default AddButton;

interface PropsType {
    disabled: boolean
    unit: number
    pack: number
    single?: boolean
    addToCart: (unit?: number) => void
}
