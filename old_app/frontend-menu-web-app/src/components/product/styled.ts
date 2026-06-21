import {Image} from '../common'
import styled from "styled-components";

export const ProductWrapper = styled.li`
  position: relative;
  padding: 33px 0 0 0;
  max-width: 414px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  @media screen and (min-width: 743px) {
    max-width: 290px;
    padding: 0;
  }
`

export const TooltipProductWrapper  = styled.div`
  transition: 0.1s;
  position: relative;
        
  /* margin-top: 4px; */
  height: 60px;
  
  .cart__info-image {
    z-index: 102;
  }
  
  .cart__info-image:hover~.tooltip {
    transform: translateY(0);
    opacity: 1;
    z-index: 100;

    &:after {
      opacity: 1;
    }
  }

  
  @media screen and (min-width: 743px) {
    height: 31px;
  }
`


export const TooltipProductContent = styled.div<{maxHeight?: boolean, isError?: boolean}>`
  //position: absolute;
  //top: -200px;
  //left: -155px;
  right: 0;
  //width: 342px;
        position: absolute;
        width: 154px;
        height: 83px;
        left: -95px;
        top: -115px;

        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        /* Note: backdrop-filter has minimal browser support */

        border-radius: 20px;
  //height: 169px;
  //background: rgba(0, 0, 0, 0.8);
  //backdrop-filter: blur(8px);
  //border-radius: 20px;
  padding: 22px 18px;
  transition: 0.3s;
  transform: translateY(-100px); 
  opacity: 0; 
  z-index: -100; 
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 100px;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 15px solid rgba(0, 0, 0, 0.8);
    transition: 0.3s 0.1s;
    opacity: 0; 
  }
  

  .text, .below__text {
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 22.4px !important;
    color: #FFFFFF !important;
    opacity: 1 !important;
    //b {
    //        font-size: 18px !important;
    //}

    .below__text {
      margin-top: 45px;
    }
  }

  @media screen and (max-width: 743px) {
          left: -77px;
    &:after {
      left: 90px;
    }
  }

  @media screen and (max-width: 414px) {
          left: -77px;
  .text {
    .below__text {
      margin-top: 20px;
    }
  }
    &:after {
            left: 90px;
            //border-left: 17px solid transparent;
            //border-right: 17px solid transparent;
            //border-top: 19px solid rgba(0, 0, 0, 0.8);
            //bottom: -18px;
    }
  }
`

export const TooltipEffectWrapper  = styled.div`
  transition: 0.1s;
  position: relative;
        
  /* margin-top: 4px; */
  height: 60px;
  
  .cart__info-image {
    z-index: 102;
  }
  
  .cart__info-image:hover~.tooltip {
    transform: translateY(0);
    opacity: 1;
    z-index: 100;

    &:after {
      opacity: 1;
    
    }
  }

  
  @media screen and (min-width: 743px) {
    height: 31px;
  }
`


export const TooltipEffectContent = styled.div<{maxHeight?: boolean, isError?: boolean}>`
        //position: absolute;
        //top: -200px;
        //left: -155px;
        right: 0;
        //width: 342px;
        position: absolute;
        width: 154px;
        height: 83px;
        left: -20px;
        top: -115px;

        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        /* Note: backdrop-filter has minimal browser support */

        border-radius: 20px;
        //height: 169px;
        //background: rgba(0, 0, 0, 0.8);
        //backdrop-filter: blur(8px);
        //border-radius: 20px;
        padding: 22px 18px;
        transition: 0.4s;
        transform: translateY(-100px);
        opacity: 0;
        z-index: -100;

        &:after {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 25px;
                width: 0;
                height: 0;
                border-left: 14px solid transparent;
                border-right: 14px solid transparent;
                border-top: 15px solid rgba(0, 0, 0, 0.8);
                transition: 0.4s 0.1s;
                opacity: 0;
        }
  

  .text, .below__text {
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 22.4px !important;
    color: #FFFFFF !important;
    opacity: 1 !important;
    //b {
    //    font-weight: 900;
    //}

    .below__text {
      margin-top: 45px;
    }
  }

  @media screen and (max-width: 743px) {  
          left: -17px;
    &:after {
      left: 30px;
    }
  }

  @media screen and (max-width: 414px) {
          left: -17px;
  .text {
    .below__text {
      margin-top: 20px;
    }
  }
    &:after {
            left: 30px;
    }
  }
`
export const Overlay = styled.div`
  position: relative;
  width: 100%;
  padding: 120px 25px 32px 25px;
  /* background: #F3F3F3; */
  box-shadow: 0px -12px 40px rgba(31, 71, 13, 0.1);
  border-radius: 24px;
  

  @media screen and (min-width: 744px) {
    box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1); 
    border-radius: 16.75px; 
    padding: 120px 23.34px 30px 13px;
    margin-top: 110px;
    /* background: #FFF; */
  }

  @media screen and (max-width: 386px) {
    padding: 120px 15px 32px 15px;

  }
`

export const Img = styled(Image)`
  height: 100%;
  width: 100%;
  object-fit: cover;
        border-radius: 24px;
  
`

export const IconWrapper = styled.div`
  max-width: 364px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px;
       

  @media screen and (min-width: 743px) {
    padding: 12px 11px;
     
    img {
      width: 37.5px;
      height: 37.5px;
    }
  }

`

export const ImageWrapper = styled.div`
  position: relative;
  overflow: visible;
  max-width: 364px;
  width: 100%;
  height: 255px;
  margin: 0 auto;
  box-shadow: 0px 1px 1px rgba(0, 36, 6, 0.15);
  border-radius: 24px;
  position: absolute;
  top: -150px;
  left: 0;
  right: 0;

  @media screen and (min-width: 743px) {
    height: 204px;
    top: -95px;
    box-shadow: none;
  }

  @media screen and (max-width: 386px) {
    max-width: 90%;
  }
`

export const Flex = styled.div<{ margin?: string, height?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({margin}) => margin};
  height: ${({height}) => height};
`

export const SizeContainer = styled.div<{ margin?: string, height?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;

  @media screen and (min-width: 743px) {
    display: none;
  }
`

export const Title = styled.h4`
  font-weight: 600;
  font-size: 34px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #37751A;
  opacity: 0.9;

  @media screen and (min-width: 743px) {
    font-size: 20px;
    width: 253px;
    /* line-height: 21px; */
    height: 48px;
    margin: 0 auto 0 auto;
    display: -webkit-box;
    -webkit-line-clamp: 2 ;
    -webkit-box-orient: vertical
  }
`

export const DesriptionPanel = styled.div`
  font-size: 16px;
  line-height: 130%;
  color: #1B1B1B;
  opacity: 0.8;
  -webkit-line-clamp: 2; /* Число отображаемых строк */
  display: -webkit-box; /* Включаем флексбоксы */
  -webkit-box-orient: vertical; /* Вертикальная ориентация */
  overflow: hidden;
`

export const InfoPanelWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 268px;
  height: 48px;
  background: radial-gradient(54.69% 222.48% at 41.42% 0%, rgba(73, 129, 47, 0.7) 0%, rgba(44, 139, 0, 0.7) 100%);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 11px 13px; 

  display: none;
  align-items: center;
  justify-content: space-between;

  color: #FFFFFF;
  line-height: 16px;
  

  .info {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap; /* Запрещаем перенос строк */
    overflow: hidden;
    width: 85px;
    text-align: left;
          
  }

  button.cancel {
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    text-decoration: underline;
    transition: 0.3s;
    &:hover {
      opacity: 0.6;
    }
  }
  
  div {
    display: flex;
    align-items: flex-end;
    .from {
        font-size: 16px;
        font-weight: 600;
        margin-right: 5px;
        line-height: 14px;
    }
    .cost {
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 1px;
       span {
         font-size: 22.35px;
       }
    }

    .size {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      line-height: 14px;
      margin: 0 0 1px 3px;
      span {
         font-size: 18px;
       }
    }
  }

  @media screen and (min-width: 743px) {
    display: flex
  }
`

export const DescText = styled.p`
  font-size: 20px;
  line-height: 120%;
  text-decoration: underline;
  color: #2D6016;
  opacity: 0.7;
  cursor: pointer;

  @media screen and (max-width: 375px) {
    font-size: 17px;
  }
`

export const DesktopDescription = styled.div<{fade?: boolean}>`
  display: none;
  margin-top: 10px;
  
  p {
        font-family: Red Hat Display;
        font-size: 16px;
        font-weight: 400;
        line-height: 130%;
        color: #1B1B1B;
        opacity: 1;
        text-align: left;
        transition: height 0.7s ease-out;
        height: 42px;
        overflow: hidden;
        opacity: 0.8;
      
        ${({fade}) => fade && {height: '100%', transition: 'height 0.7s ease-in'}}
        
        span {
          font-family: Red Hat Display;
          font-size: 16px;
          font-weight: 400;
          line-height: 130%;
          color: #1B1B1B;
          text-decoration: underline;
          cursor: pointer;
          white-space: nowrap; /* Запрещаем перенос строк */
          margin-left: 5px;
        }
  }
  
  @media screen and (min-width: 743px) {
    display: block;
  }
`

export const Description = styled.div`
  overflow: hidden;
  
  p {
    font-family: "Gilroy";
    word-break: break-word;
    font-size: 16px;
    text-align: left;
    line-height: 140%;
    color: #1B1B1B;
    opacity: 0.9;
    transition: 0.4s;
  }
  
  &.hide{ p {
    transform: translateY(-100%);
    transition: all 0.4s;
    opacity: 0;
    
  }
    height: 0;
  }
  &.show {
    p{
      transition: all 0.4s;
      transform: translateY(0);
      opacity: 1;
      
    }
    height: 100%;
  } 
  
  @media screen and (min-width: 743px) {
    display: none;
  }
`

export const OutStock = styled.h4`
  font-weight: bold;
  font-size: 32px;
  line-height: 120%;
  color: #2B6410;
  opacity: 0.8;

  @media screen and (min-width: 743px) {
    font-size: 24px;
    line-height: 100%;
  }
`

export const MessageText = styled.p<{margin?: string}>`
  font-weight: 400;
  font-size: 22px;
  line-height: 130%;
  color: #619349;
  margin-left: ${({margin}) => margin || '20px'};
  letter-spacing: 1px;

  @media screen and (min-width: 743px) {
    font-size: 16px;
    letter-spacing: 0.5px;
    margin-left: 0;
  }
`

export const Text = styled.p<{size?: string}>`
  font-size: ${({size}) => size || '20px'};
  line-height: 120%;
  color: #315B1D;
  opacity: 0.8;
  margin-top: 5px;

  @media screen and (min-width: 743px) {
    font-size: 15px;
    text-align: left;
  }
`

export const SubText = styled.p<{size?: string}>`
  font-weight: 400;
  font-size: 22px;
  line-height: 140%;
  color: #2B6410;
  opacity: 0.8;
`

export const AnotherText = styled.p`
  font-weight: 400;
  text-align: left;
  font-size: 28px;
  line-height: 120%;
  letter-spacing: 0.01em;
  color: #2B6410;
  opacity: 0.8;

  span {
    font-size: 20px;
    line-height: 140%;
    color: #78C255;
    margin-left: 7px;
  }
`

export const Cost = styled.p`
  font-weight: bold;
  font-size: 44px;
  line-height: 120%;
  color: #37751A;
  opacity: 0.9;
  margin-left: auto;
  margin-right: 20px;
  transition: 0.3s;

  span {
    font-size: 24px;
    line-height: 24px;
  }
`

export const SizeNotification = styled.div`
  position: absolute;
  top: -2px;
  /* right: -16px; */
  /* left: calc(50% - 50%)*/
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center; 
  font-weight: bold;
  font-size: 13px;
  line-height: 120%;
  color: #709B5B;
  height: 10px;
  white-space: nowrap;
  z-index: 10;

  background: #f3f3f3f7;
  box-shadow: 0px 8px 15px 3px #f3f3f3;

  @media screen and (min-width: 744px) {
    /* right: -10px; */
    font-size: 9px;
    background: rgba(251, 251, 251, 0.95);
    box-shadow: 0px 8px 18px 3px rgba(251, 251, 251, 0.95);
  }
`

export const SizeButton = styled.button`
  position: relative;
  width: 68px;
  height: 68px;
  border: 2px solid #72AE56;
  border-radius: 50%;
  font-weight: 600;
  font-size: 28px;
  line-height: 120%;
  text-transform: inherit;
  //font-feature-settings:'tnum' on, 'lnum' on;
  color: #72AE56;
  transition: 0.2s;

  &:hover {
    background-color: rgb(173 245 141 / 25%);
  }

  span {
    font-weight: 600;
    font-size: 28px;
  }

  &.active {
    color: #F3F3F3;
    background-color: #3F881D;
    opacity: 0.7;
    border: 2px solid #3F881D;
    font-size: 19.77px;
    
    span {
      font-size: 17px;
      margin-left: 2px;
    }
  
  }

  &:disabled {
    //opacity: 0.5;
    color: #72ae5670;

    /* &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ffffff3b;
      -webkit-backdrop-filter: blur(1px);
      backdrop-filter: blur(1px);
    } */


    &:hover {
      background-color: transparent;
    }

  }


  @media screen and (min-width: 744px) {
    width: 51px;
    height: 51px;
    font-size: 20px;
    line-height: 24px;

    span {
      font-size: 18px;
      &.ex {
        font-size: 18px;
      }
    }

    &.active {
      font-size: 16px;
    
      span {
        font-size: 12px;
        margin-left: 2px;
      }
    }
  }
`

export const PlusButton = styled.button`
  position: relative;
  width: 68px;
  height: 68px;
  background: #8DC573;
  color: #fff;
  font-size: 28px;
  line-height: 100%;
  font-weight: 700;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: 0.3s;

  span {
    font-weight: 600;
    font-size: 14px;
    line-height: 120%;
  }

  &:hover {
    background: #60BE34;
    opacity: 0.6;
  }

  /* &:after {
    content: '';
    position: absolute;
    background: #D6E8CD;
    height: 66px;
    width: 94px;
    border-radius: 30px 0 0 30px;
    top: 0;
    right: -25px;
    z-index: -1;

    @media screen and (min-width: 744px) {
      height: 48px;
      width: 71px;
    }
  } */

  &:before {
    content: '';
    position: absolute;
    background: #60BE34;
    border-radius: 50%;
    opacity: 0.2;
    top: -10px;
    left: -10px;
    width: 88px;
    height: 88px;
  }

  &:disabled {
    opacity: 0.5;
  }

  @media screen and (min-width: 744px) {
    width: 48px;
    height: 48px;
    font-size: 16px;
    line-height: 16px;
    padding: 13px;

    img {
      height: auto;
      width: 100%;
      object-fit: cover;
    }
    
    &:before {
      top: -8.5px;
      left: -8.5px;
      width: 65px;
      height: 65px;
    } 
  }

`

export const BackGround = styled.div`
  display: block;
  position: absolute;
  background: #D6E8CD;
  height: 66px;
  width: 94px;
  border-radius: 30px 0 0 30px;
  top: 0;
  right: -25px;
  z-index: -1;

  @media screen and (min-width: 744px) {
    height: 48px;
    width: 71px;
  }
`

export const Size = styled.div`
  font-weight: 500;
  font-size: 26px;
  line-height: 100%;
  color: #37751A;
  opacity: 0.7;
  margin-left: 10px;
  display: flex;
  align-items: flex-end;

  p.cost {
    font-weight: 700;
    font-size: 36px;
    margin: 0 3px 0 3px;
    line-height: 29px;

    &.cost-total {
      line-height: 23px;
      margin-left: 6px;
    }
    span {
      /* font-weight: 700; */
      font-size: 26px;
    }
  }

  p.size {
    font-size: 32px;
    font-weight: 700;
    /* margin-bottom: 2px; */
  }

  p {
    font-weight: 700;
    font-size: 22px;
  }

  @media screen and (min-width: 744px) {
    display: none;
  }

  @media screen and (max-width: 380px) {
    font-size: 22px;
  }
`

export const SubTitle = styled.p`
  font-size: 18px;
  line-height: 120%;
  color: #000000;
  opacity: 0.4;
  margin: 8px 0 172px;

  @media screen and (min-width: 743px) {
    display: none;
  }
`