import {
    AnotherText,
    BackGround,
    PlusButton,
    SubText
} from '../styled';

import {Flex} from '../../common'
import { ProductsType } from '../../../types';
import React from 'react'

export default function AddAnother({addToCart, availableProduct, discount, product} : PropsType) {
    const {costs, measure, pack} = product
    const defaultMeasure = measure === 'g' || measure === 'oz';

    return (
        <>
            <SubText>The more you get - the less you pay!</SubText>
            <Flex margin={'27px 0 0 0'}>
                    <AnotherText>
                        Add another {pack}{defaultMeasure ? 'g' : measure} <br/>
                        for only ${costs[0].cost} 
                        {discount > 0 && <span>{discount}% off</span>}
                    </AnotherText>
                    <PlusButton disabled={availableProduct === 0} onClick={() => addToCart(1)}>
                    {`+ ${pack === 7 ? pack : 1}`}
                    </PlusButton>
                <BackGround/>
            </Flex>
        </>
    )
}

interface PropsType {
    addToCart: (unit?: number) => void
    setUnit: (unit: number) => void
    availableProduct: number
    discount: number
    unit: number
    product: ProductsType
}
