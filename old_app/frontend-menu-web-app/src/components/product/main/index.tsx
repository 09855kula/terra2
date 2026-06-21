import { AnimatedPulse, FadeInWrapper, HeightAnimation } from '../..';
import {
    BackGround,
    DescText,
    Description,
    DesktopDescription,
    PlusButton,
    Size,
    SizeButton,
    SizeContainer,
    SizeNotification,
} from '../styled';
import React, {useEffect, useState} from 'react'
import {availablePack, getAllProductDiscount, packConverter} from '../../../utils/';

import AddButton from '../addButton';
import {Flex} from '../../common'
import { ProductsType } from '../../../types';

const getMeasure = (measure: string) => {

    switch (measure) {
        case 'g':
        case 'oz': 
            return 'g'
    
        default:
            return ' ea'
    }

}

export default function MainProduct({addToCart, setUnit, availableProduct, unit, product, cart}: PropsType) {
    const {costs, measure, pack, description} = product
    const mea = getMeasure(measure)
    const defaultMeasure = measure === 'g' || measure === 'oz';
    // const single = (pack === 1  && ' ea') || (pack === 6  && ' ea');
    const single = (mea === ' ea' && mea);
    //
    const [open, setOpen] = useState(false)
    const [showText, setShowText] = useState(false)
    const [current, setCurrent] = useState(0)
    const [available, setAvailable] = useState(availableProduct)
    //
    const isOpen = unit > 0 && open;
    const isOpenUnit0 = unit === 0 && open;
    const isNotOpen = unit === 0 && !open;
    
    
    const addUnit = (count: number) => {
        let total = count + unit
        setAvailable(available - count)
        setCurrent(count)
        setTimeout(() => setCurrent(0), 700)
        setUnit(total)
    }
    
    const cancelUnits = () => {
        setAvailable(availableProduct)
        setUnit(0)
    }

    
    useEffect(() => {
        if (unit === 0) {
            setAvailable(availableProduct)
        }
    },[unit, availableProduct])
    
    return (
        <>
            <SizeContainer>
                {isOpen || isNotOpen || isOpenUnit0 
                ? 
                    <DescText onClick={() => setOpen(!open)}>{open ? 'Close description' : 'Read description'}</DescText> 
                : 
                    <DescText onClick={cancelUnits}>Cancel</DescText>}
                <Size>
                    {isOpen || isNotOpen || isOpenUnit0 ? 
                    <>
                        from
                        <p className='cost'>${(costs[0]?.cost / pack).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                        {!single && <p>/</p>}
                        <p className="size">{single ? single  : 'g'}</p>
                    </>
                    :
                    <>
                        total:
                        <p className='cost cost-total'><span>$</span>{getAllProductDiscount(product, cart, unit)}</p> 
                    </>}
                </Size>
            </SizeContainer>
            <DesktopDescription fade={showText}>
                <FadeInWrapper keyElement={showText ? 1 : 0}>
                    <p>{description.slice(0, showText ? 1000 : 55)}{showText ? null : '...'}
                        <span onClick={() => setShowText(!showText)}>{showText ? 'close' : 'read more'}</span>
                    </p>
                </FadeInWrapper>
            </DesktopDescription>
            <Description className={open ? 'show' : 'hide'}>
                <p>{description}</p>
            </Description>
            {unit > 0 && open && 
            <SizeContainer>
                <DescText onClick={cancelUnits}>Cancel</DescText>
                <Size>
                    total:
                    <p className='cost cost-total'><span>$</span>{getAllProductDiscount(product, cart, unit)}</p> 
                </Size>
            </SizeContainer>}
            <Flex margin={'27px 0 0 0'}>
            {[1,2,4].map((el, idx) => {
                let isActive = current === el;
                return <SizeButton key={idx ** 18} 
                            className={`${isActive ? 'active' : ''}`}
                            onClick={() => addUnit(el)}
                            disabled={available < el}
                            >
                    
                    {available < el && 
                    <SizeNotification>Only {availablePack(pack, available)}{single ? single  : 'g'} left!</SizeNotification>}
                    {!defaultMeasure && !isActive && <span className="ex">x</span>}
                    <>{isActive && <span>+</span>}{packConverter(pack, el)}</>
                    <span>{defaultMeasure && 'g'}</span>
                </SizeButton>})}
                <AddButton disabled={!unit} addToCart={addToCart} pack={pack} unit={unit}/>
            </Flex>
        </>
    )
}

interface PropsType {
    addToCart: (unit?: number) => void
    setUnit: (unit: number) => void
    availableProduct: number
    cart: ProductsType[]
    unit: number
    product: ProductsType
}
