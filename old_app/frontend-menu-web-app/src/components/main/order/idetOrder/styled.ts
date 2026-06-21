import { Driver } from './../../../chat/dialogues/styled';
import { MainButton } from "../../../common";
import styled from "styled-components";

export const CancelOrder = styled.button`
  border: 2px solid rgba(255, 61, 0, 0.2);
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  color: #FF3D00;
  opacity: 0.6;
  padding: 12px 20px;

  @media screen and (max-width: 414px) {
    padding: 12px 15px;
  }

  @media screen and (min-width: 753px) {
    padding: 10px 15px;
    width: 136px;
    height: 43px;
  }
`

export const OrderInfoFlexBox = styled.div<{ margin?: string, direction?: string, align?: string, width?: string, height?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 0 37px 0;

  img {
      width: 30px;
  }

  @media screen and (min-width: 1280px){
    img {
      width: 30px;
    }
    padding: 0 0 35px 0;
  }
`
export const OrderInfoText = styled.p`
  font-weight: 600;
  font-size: 24px;
  line-height: 120%;
  color: #3A6426;
  margin: 0 0 0 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 260px;

  @media screen and (min-width: 1280px){
    font-size: 27px;
    margin: 0 0 0 22px;
  }
`

export const OrderInfoWrapper = styled.div`
  /* margin: 0 auto; */
  
  @media screen and (min-width: 1280px) {
     padding: 0 0 0 54px;

     .desktop__hide {
       display: none;
     }
  }
`

export const ModeContentWrapper = styled.div`
  transform: translateY(-31px);
  
  button {
    margin: 0 auto;
  }
`

export const Text = styled.p`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: 25px 0 21px 0;
`

export const OrderEdit = styled.h5`
  font-weight: 800;
  font-size: 24px;
  line-height: 120%;
  color: #385928;
  opacity: 0.85;
  margin-left: 6px;

  @media screen and (max-width: 414px) {
    font-size: 20px;
  }
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
    font-size: 28px;
    /* line-height: 24px; */
  
    span {
      font-weight: bold;
      font-size: 22px;
    }
  }
`

export const FullHeader = styled.div `
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
    color: #FFFFFF;
    text-align: center;
`

export const OrderEditButton = styled(MainButton) `
  border-radius: 24px;
  font-size: 28px;
` 


export const Container = styled.div `
    margin-top: 8px;
    display: none;
    justify-content: space-between;
    align-items: center;

    .order__total-block {
        margin-left: auto;
        margin-right: 3px;
        display: flex;
        align-items: center;

        p {
            margin-right: 22px;
        }
    }

    @media screen and (min-width: 743px) {
        display: flex;
        margin-top: 12px;
    }
`


export const ProductsWrapper = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 280px;  

  &::-webkit-scrollbar {
    width: 6px;
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


  .product__item:not(:last-child) {
    position: relative;
        &:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: -15px;
        width: 80%;
        height: 1px;
        background-color: #5f91484d;
    }
  }

  @media screen and (min-width: 743px) {
    padding: 0;
    margin: 0;
    max-height: 426px;
    
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

export const ExtraInfoWrapper = styled.div`
  width: 370px;
  min-height: 164px;
  max-height: 214px;
  position: absolute;
  right: 0;
  top: 117px;

  background: rgba(196, 196, 196, 0.1);
  box-shadow: inset -12px 12px 12px rgba(31, 67, 14, 0.02);
  border-radius: 12px 0 0 12px;
  padding: 24px 36px 40px 24px;
  color: #616A5C;
  opacity: 0.8;
  /* display: none; */
  
  h6 {
    font-weight: 400;
    font-size: 24px;
    line-height: 150%;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    line-height: 150%;
  }

  li {
    list-style: disc;
    font-size: 18px;
    line-height: 150%;
    margin-top: 7px;
  }

  &.tablet__notification {
    display: none;
  }
  @media screen and (min-width: 743px) and (max-width: 1279px) {

    &.edit__info {
      max-height: 240px;
      width: 370px;
      height: 240px;
    }
    
    &.tablet__notification {
      display: block;
    }

    &.desktop__notification {
      display: none;
    }
  }

  @media screen and (max-width: 1279px) {
    &.edit__info {
    padding: 24px 10px 20px 16px;
    max-height: 260px;
    width: 380px;
  }
  }

  @media screen and (min-width: 1280px) {
    width: 423px;
    display: block;
    position: relative;
    top: 0;
    margin-top: 10px;
    border-radius: 0px 24px 24px 0px;
  }
`

export const Wrapper = styled.div<{edit?: boolean}>`
  max-width: 414px;
  width: 100%;
  padding: ${({edit}) => edit ? '15px 12px 44px 12px' : '15px 12px 15px 12px'};
  margin-top: 29px;
  /* margin-bottom: 120px; */
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  

  @media screen and (min-width: 743px) {
    display: block;
    border-radius: 32px;
    margin: 0 auto;
    max-width: 689px;
    width: 689px;
    max-height: 534px;
    box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1);
    padding: 10px 12px 14px 12px;

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
    }

    .cart__savings-wrapper {
      margin: 7px 3px 18px 3px;
      
      
      h6 {
        margin: 0 14px 0 0;
      }
    }

    .cart__total-wrapper {
      width: 526px;
      margin: 17px 5px 11px 140px;

      h6 {
        margin-bottom: 6px;
        font-size: 18px;
      }
    }
  }
`

export const OrderContainer = styled.div<{padding?: string}>`
    position: relative;
    max-width: 414px;
    width: 100%;
    margin: 0 auto;
    padding: ${({padding}) => padding || '50px  0 0 0'};
    min-height: calc(100vh - 80px); /* Fallback for browsers that do not support Custom Properties */
    min-height: calc((var(--vh, 1vh) * 100) - 80px);
    display: flex;
    flex-direction: column;

    .order__desktop-header, .cart__back-btn, .cart__cancel-btn, .desktop__notif {
        display: none
    }

    @media screen and (min-width: 743px) {
        padding: 0 0 13px 0;
        max-width: 690px;
        margin: 0 auto;
        /* justify-content: center; */
        align-items: center;

        min-height: calc(100vh - 124px); /* Fallback for browsers that do not support Custom Properties */
        min-height: calc((var(--vh, 1vh) * 100) - 124px);
        
        .order__desktop-header, .desktop__notif {
            display: block;
            align-self: flex-start;
        }

        .order__mobile-header, .hide {
            display: none;
        }
        .cart__back-btn {
            display: block;
            align-self: flex-start;
            margin-top: auto;
        }
        .cart__wrapper-btn{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          align-self: flex-end;
        }
        .cart__cancel-btn {
          display: block;
          align-self: center;
          margin-top: 0;
        }
        .edit__notification {
          margin-bottom: 40px;
          position: fixed;
          top: 117px;
          right: 0;
        }

        .order__wrapper {
          margin-top: 52px;
          margin-bottom: 87px;
        }
    } 

    @media screen and (min-width: 1280px) {
      /* min-height: 100%; */
      flex-direction: row-reverse;
      align-items: flex-start;
      justify-content: space-between;
      max-width: 100%;
      min-height: 650px;
      /* padding: 113px 108px 13px 24px; */

      .desktop__notif {
            position: absolute;
            left: 0;
            top: 73px;
      }
      .cart__wrapper-btn{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 420px;
        align-self: flex-end;
      }
      .cart__back-btn {
          align-self: flex-end;
          margin-bottom: 18px;
          //margin-left: 24px;
      }

      .edit__notification {
        margin: 0 0 0 24px;
        position: relative;
        top: 0;
      }

      .order__wrapper {
          margin-bottom: 0;
        }
    }
`