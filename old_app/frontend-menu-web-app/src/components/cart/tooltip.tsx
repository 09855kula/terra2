import {TooltipContent, TooltipWrapper} from './styled'

import { Image } from '../common'
import Info from '../../assets/icons/infoImage.svg';
import React from 'react'

const Tooltip = ({allSavings, availableSavings}: PropsType) => {
  return (
    <TooltipWrapper>
        <Image src={Info} className='cart__info-image'/>
        <TooltipContent className="tooltip">
            <div className="text">
                Only up to <span>20%</span> of your total order <span>(${availableSavings})</span> can be covered by your savings.               
                <p className="below__text">Total savings: <span>${allSavings}</span></p>
            </div>
        </TooltipContent>
    </TooltipWrapper>
  )
}

export default Tooltip

interface PropsType {
  allSavings: number
  availableSavings: number
}