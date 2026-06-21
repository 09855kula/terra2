import {InfoPanelWrapper} from '../styled'
import { ProductsType } from '../../../types';
import React from 'react';
import { getAllProductDiscount } from '../../../utils';

const getMeasure = (measure: string) => {

    switch (measure) {
        case 'g':
        case 'oz': 
            return 'g'
    
        default:
            return ' ea'
    }

}

const InfoPanel = ({unit, product, cart, setUnit}: PropsType) => {
    const {costs, pack, measure, type} = product
    const isUnit = unit === 0
    const mea = getMeasure(measure)
    const single = (mea === ' ea' && mea);
    // const single = (pack === 1  && ' ea') || (pack === 6  && ' ea');
    const noType = "No Type"
    //console.log('type',type)
    return (
        <InfoPanelWrapper>
            {isUnit ? 
            <p className="info">
                {
                    type === noType
                    ? ''
                    : type
                }
            </p>
            :
            <button className="cancel" onClick={() => setUnit(0)}>
                Cancel
            </button>
            }
            <div>
                <p className="from">{isUnit ? 'from' : 'total:'}</p>
                <p className="cost">
                    $
                    {unit !== 0 ? getAllProductDiscount(product, cart, unit)
                    :
                    <>
                        {(costs[0]?.cost / pack).toLocaleString('en-US', {maximumFractionDigits: 0})}
                        <span>{single}</span>
                    </>}
                </p>
                {!single && isUnit &&
                <p className="size">
                    /<span>g</span>
                </p>}
            </div>
        </InfoPanelWrapper>
    )
};

export default InfoPanel;

interface PropsType {
    unit: number
    product: ProductsType
    cart: ProductsType[]
    setUnit: (unit: number) => void
}
