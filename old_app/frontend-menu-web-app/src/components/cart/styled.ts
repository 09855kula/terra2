import {Image} from "../common";
import styled from "styled-components";

export const Wrapper = styled.div<{maxHeight?: boolean, isMobile?: boolean, error?: boolean}>`
  position: relative;
  margin-top: 70px;
  margin-bottom: 116px;

  @media screen and (min-width: 743px) {
    ${({isMobile}) => isMobile && {display: 'none'}}
    margin-bottom: ${({error}) => error ? '116px' : '0'};;
    margin-top: ${({error}) => error ? '70px' : 'auto'};
  }

  
  @media screen and (max-width: 743px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    transition: 0.3s 0s;
    z-index: 103;
    max-height: 0; /* Fallback for browsers that do not support Custom Properties */
    transition: 0.4s;
    
    transform: translateY(150%);
    opacity: 0;
    visibility: hidden;
    ${({maxHeight}) => maxHeight ? ({position: 'absolute', top: 0, display: 'flex', transform: 'translateY(-150%)'}) : null}
    
    &.active {
      visibility: visible;
      transform: translateY(0);
      opacity: 1;
      max-height: 100vh;
      max-height: calc(var(--vh, 1vh) * 100);
    }
  }

  @media screen and (min-width: 1280px) {
      margin: 72px 0 0 0;
  }
`

export const FullHeader = styled.div<{margin?: string}>`
  position: absolute;
  width: 280px;
  height: 51px;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, #6CAC4F, #6CAC4F);
  box-shadow: 0 3px 2px 0 #6cac4f85;
  opacity: 0.9;
  border-radius: 0 0 34px 34px;
  text-align: center;
  padding-top: 10px;
  margin: 0 auto 20px auto;

  font-weight: 600;
  font-size: 24px;
  line-height: 120%;
  color: #FFFFFF;


  @media screen and (min-width: 743px) {
    width: 540px;
    height: 70px;
    top: -70px;
    box-shadow: none;
    border-radius: 0 0 34px 34px;
    background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
    border-radius: 46.2222px 46.2222px 0px 0px;
    margin: 0 auto;
    font-weight: 600;
    font-size: 32px;
    padding-top: 17px;
  }
`

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  z-index: 100;

  &.hide {
    height: 0;
  }
`

export const Flex = styled.div<{display?: string, margin?: string, gap?: string; direction?: string, justify?: string, align?: string, width?: string, height?: string, padding?: string }>`
  position: relative;
  display: ${({display}) => display || 'flex'};;
  align-items: ${({align}) => align || 'center'};
  flex-direction: ${({direction}) => direction || 'row'};
  justify-content: ${({justify}) => justify || 'space-between'};
  margin: ${({margin}) => margin};
  padding: ${({padding}) => padding};
  width: ${({width}) => width};
  height: ${({height}) => height};
  gap: ${({gap}) => gap};
`

export const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 328px;
  height: 38px;
  background: linear-gradient(0deg, #5F9148, #5F9148);
  opacity: 0.8;
  border-radius: 50px 50px 0 0;
  margin: 0 auto;
  padding: 10px 0 0 0;
  z-index: 0;
  transform: translateY(-2px);
`

export const  Header = styled.div`
  background: #FFFFFF;
  border-radius: 30px 30px 0 0;
  width: 252px;
  padding: 12px 0 4px 0;
  transform: translateY(8px);
  text-align: center;
  margin: 0 auto;
  font-weight: 600;
  font-size: 20px;
  line-height: 1;
  color: #37751acc;
  opacity: 0.99;
`

export const BillTitle = styled.h6<{margin?: string}>`
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: ${({margin}) => margin || '0 0 6px 0'};

  @media screen and (min-width: 743px) {
    color: #616A5C;
    font-size: 22px;
    opacity: 0.8;
  }
`

export const BillSubTitle = styled.p`
  font-weight: bold;
  font-size: 28px;
  line-height: 100%;
  color: #4C922C;
  
  span {
    font-size: 17px;
  }
  
  &.discount {
    text-decoration: line-through;
    opacity: 0.5;
  }

  @media screen and (min-width: 743px) {
    font-size: 22px;
    /* line-height: 24px; */
  
    span {
      font-weight: bold;
      font-size: 16px;
    }
  }
`

export const TooltipWrapper  = styled.div<{maxHeight?: boolean, isError?: boolean}>`
  transition: 0.4s;
  position: relative;
  /* margin-top: 4px; */
  height: 18px;
  
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



export const TooltipContent = styled.div<{maxHeight?: boolean, isError?: boolean}>`
  position: absolute;
  top: -200px;
  left: -155px;
  right: 0;
  width: 342px;
  
  height: 169px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 22px 18px;
  transition: 0.7s;
  transform: translateY(-100px); 
  opacity: 0; 
  z-index: -100; 
  
  &:after {
    content: '';
    position: absolute;
    bottom: -19px;
    left: 160px;
    width: 0;
    height: 0;
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-top: 19px solid rgba(0, 0, 0, 0.8);
    transition: 0.7s 0.2s;
    opacity: 0; 
  }
  

  .text, .below__text {
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 140% !important;
    color: #FFFFFF !important;
    opacity: 1 !important;
    span {
        font-weight: 700;
    }

    .below__text {
      margin-top: 45px;
    }
  }

  @media screen and (max-width: 743px) {
    &:after {
      left: 155px;
    }
  }

  @media screen and (max-width: 414px) {
    width: 300px;
    left: -166px;
  .text {
    .below__text {
      margin-top: 20px;
    }
  }
    &:after {
      left: 166px;
    }
  }
`



export const ContentWrapper = styled.div<{maxHeight?: boolean, isError?: boolean}>`
  background-color: #fff;
  padding: 20px 0 0 0;
  width: 100%;
  box-shadow: 0px -44px 100px rgba(0, 0, 0, 0.2);

  .cart__wrapper {
      max-width:  444px;
      box-sizing: border-box;
      margin: 0 auto;
      width: 100%;
      padding: 0 15px;

      @media screen and (min-width: 414px) {
        .cart__wrapper {
          padding: 0 10px;
        }
      }
  }

  .cart__total-wrapper { 
    padding: 13px 0;
  }

  .cart__savings-wrapper {
    justify-content: start;
    .cart__total {
      margin-left: auto;
    }
    .cart-check {
      font-size: 18px;
    }

    .cart__info-image {
      margin-left: 7px;
      cursor: help;
    }
    p {
      color: #37751A;
      opacity: 0.8;
    }
  }
  

  @media screen and (max-width: 743px) {
    ${({maxHeight}) => maxHeight ? 
    ({padding: 0, display: 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end', }) : null};
    .cart__info-image {
        width: 18px;
    } 

    .back__btn-mobile {
      padding: 18px 33px 18px 24px;
    }

    .checkout__btn-mobile {
      padding: 18px 33px 18px 22px;
    }
  }

  @media screen and (max-width: 390px) {
    .checkout__btn-mobile, .back__btn-mobile {
      font-size: 22px;
      img {
        margin-right: 13px;
      }
    }
    .checkout__btn-mobile {
      width: 170px;
      padding: 0;
      img {
        height: 15px;
      }
    }

    .back__btn-mobile {
      width: 115px;
      img {
        margin-right: 13px;
      }
    }
  }

  @media screen and (min-width: 743px) {
    border-radius: 32px;
    margin: 0 auto;
    max-width: 689px;
    width: 689px;
    max-height: 524px;
    box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1);
    padding: 10px 0 19px 0;

    .cart__wrapper {
      max-width: 100%;
      padding: 0 10px;
    }

    .checkout__btn {
      background: rgba(39, 122, 0, 0.65);
      backdrop-filter: blur(8px);
      border-radius: 24px;
      width: 171px;
      font-size: 28px;
      margin-left: 18px;
    }

    .cart__info-image {
      width: 31px;
    }

    .cart__savings-wrapper {
      margin: 13px 8px 0 3px;
      justify-content: start;

      

      h6 {
        margin: 0 14px 0 15.6px;
      }
    }

    .cart__total-wrapper {
      width: 526px;
      margin: 15px 5px 0 140px;
      align-items: flex-start;
      padding: 0;

      div {
        margin-top: 5px;
      }

      h6 {
        margin-bottom: 12px;
        font-size: 18px;
      }

      p {
        font-size: 28px;
        span {
          font-size: 17px;
        }
      }
    }
  }

  @media screen and (max-width: 414px) {
    .cart__savings-wrapper {
      .cart-check {
        font-size: 17px;
      }
      

      h6 {
        font-size: 17px;
        margin: 3px 8px 0 5px;
      }

      p {
        font-size: 28px;
        span {
          font-size: 14px;
        }
      }
    }
  }

  @media screen and (max-width: 360px) {
    .cart__savings-wrapper {
      .cart-check {
        font-size: 15px;
      }
      h6 {
        font-size: 15px;
      }
  }
`

export const Scroll = styled.div<{maxHeight?: boolean, height?: string}>`
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 416px;  
  position: relative;

  @media screen and (max-width: 743px) { 
    max-height: ${({maxHeight, height}) => maxHeight ? `calc(100vh - ${height})` : `calc(75vh - 100px)`};
    max-height: ${({maxHeight, height}) => maxHeight ? `calc((var(--vh, 1vh) * 100) - ${height})` : `calc(75vh - 100px)`};
    padding: 5px 0 0 0;
    
    .product__item:not(:last-child) {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 77%;
        height: 1px;
        background-color: #5f91484d;
      }
    }
  }


  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); */
    box-shadow: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(108, 172, 79, 0.4);
    border-radius: 5px;
  }
  
  li:last-child {
    border: none;
  }
  
  @media screen and (min-width: 743px) { 
    .product__item {
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        width: 80%;
        right: -10px;
        bottom: 0;
        height: 2px;
        background-color: #5f91484d;
      }
    }
  }
`

export const NotEnoughContainer = styled.div`
  position: relative;
  bottom: 0;
  height: 227px;
  width: 100%;
  background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
  // margin-top: 25px;
  padding: 30px 0 0 0;
  text-align: center;
`

export const NotEnoughText = styled.p`
  font-size: 18px;
  line-height: 120%;
  color: #FFFFFF;
  z-index: 10;
  width: 268px;
  text-align: left;
  margin: 0 auto 0 auto;
`

export const NotEnoughImage = styled(Image)`
  position absolute;
  top: -12px;
  left: 0;
`