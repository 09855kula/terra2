import {MainButton} from '../../../common'
import dashes from '../../../../assets/menuDashes.svg';
import dashesDesc from '../../../../assets/menuDashesDesc.svg';
import styled from "styled-components";

export const NoOrderContainer = styled.div<{is1280?: boolean}>`
    width: 320px;
    border-radius: 48px;
    padding: 39px 20px 41px;
    text-align: center;
    margin: 20px auto;
    background-image: url(${({is1280}) => is1280 ? `${dashesDesc}` : `${dashes}`});
    background-repeat: no-repeat;
   
    @media screen and (min-width: 743px){
        margin: 0;
    }

    @media screen and (min-width: 1280px){
        padding: 39px 46px 41px;
        width: 430px;
        height: 324px;
    }
`

export const NoOrderTitle = styled.h6`
    font-weight: 600;
    font-size: 24px;
    line-height: 120%;
    color: #414F3B;
    opacity: 0.9;
    margin-bottom: 34px;
`

export const NoOrderText = styled.p`
    font-size: 22px;
    line-height: 120%;
    text-align: center;
    color: #616A5C;
    opacity: 0.8;
    margin-bottom: 41px;
`

export const NoOrderButton = styled(MainButton)`
    width: 275px;
    height: 62px;
    font-weight: 800;
    font-size: 24px;
    line-height: 120%;
    margin: 0 auto;
`