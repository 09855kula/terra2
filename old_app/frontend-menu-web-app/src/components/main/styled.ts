import { BackButton } from "../common";
import styled from "styled-components";

export const Flex = styled.div<{margin?: string}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({margin}) => margin};
`
export const Container = styled.div<{padding?: string, maxWidth?: string}>`
  padding-top: ${({padding}) => padding};
  margin: 0 auto;
  width: 100%;
  max-width: ${({maxWidth}) => maxWidth || '336px'};
  min-height: calc(100vh - 82px); /* Fallback for browsers that do not support Custom Properties */
  min-height: calc((var(--vh, 1vh) * 100) - 82px);
  // min-height: calc(100vh - 82px);
  display: flex;
  flex-direction: column;
`

export const TabletContainer = styled.div<{isMain?: boolean}>`
  @media screen and (min-width: 743px) and (max-width: 1279px) {
    ${({isMain}) => !isMain && {'grid-area': 'order', width: "100%", padding: '0'}}
    //padding: '139px 0 90px 0'
  }

  /* @media screen and (min-width: 1280px) {
    width: 50%;
    display: flex;
    justify-content: center;
  } */
`

export const RefferFrienText = styled.p<{margin?: string}>`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: 0 auto;
  width: 271px;

  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px) {
      width: 380px;
      font-size: 18px;
      margin: 0 auto 10px auto;
  }
`

export const DefaultButton = styled(BackButton)`
    border-radius: 18px;
    font-size: 24px;
    width: ${({width}) => width || '133px'};
    
    height: 64px;

    &disabled {
        background: rgba(39, 122, 0, 0.65);
        opacity: 0.3;
    }
    
    img {
        height: 18px;
        margin-right: 16px;
    }

    @media screen and (max-width: 390px) {
      img {
        margin-right: 13px;
      }
    }
`

export const Wrapper = styled.div`
  margin: 50px auto 20px auto;
  transition: 0.3s 0s;
  flex-grow: 1;
  
  &.hide {
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    transform: translateY(-150%);
    opacity: 0;
    visibility: hidden;
  }
  
  &.active {
    position: relative;
    visibility: visible;
    transform: translateY(0);
    opacity: 1;
  }
`

export const Header = styled.div`
  background: #ffffffcc;
  border-radius: 24px 24px 0 0;
  width: 280px;
  padding: 15px 0;
  text-align: center;
  margin: 0 auto;
  opacity: 0.8;
  font-weight: 600;
  font-size: 20px;
  line-height: 120%;
  color: #2F521F;
`
export const Content = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  padding: 22px 22px 17px;
  width: 336px;
  margin: 0 auto;

  /* @media screen and (min-width: 743px) {
    width: 343px;
  } */

  @media screen and (min-width: 743px) {
    width: 430px;
    height: 526px;
    padding: 28px 18px 18px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
`

export const Text = styled.p<{margin?: string}>`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: ${({margin}) => margin};

  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px) {
    
  }
`

export const TitleBlock = styled.div`
  h3 {
    font-weight: 600;
    font-size: 26px;
    line-height: 120%;
    text-align: center;
    color: #445A3B;
    opacity: 0.9;
  }

  @media screen and (min-width: 743px) {
    h3 {
      font-size: 24px;
      color: #FFFFFF;
    }
    margin: 0 auto;
    padding-top: 12px;
    width: 370px;
    height: 54px;
    background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
    border-radius: 36px 36px 0px 0px;
  }  
`

export const Title = styled.h3`
  font-weight: 600;
  font-size: 26px;
  line-height: 120%;
  text-align: center;
  color: #445A3B;
  opacity: 0.9;
`

export const Input = styled.input`
  width: 100%;
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  padding: 17px 22px;
  margin-top: 18px;
  font-size: 16px;
  line-height: 120%;
  font-weight: 500;
  color: #616A5C;
  opacity: 0.7;
  height: 53px;
  width: 292px;

  @media screen and (min-width: 743px) {
    margin: 18px auto 0 auto;
    width: 366px;
    height: 60px;
    font-size: 18px;
    border-radius: 13.8214px;
  }
`


export const Button = styled.button<{ width?: string}>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  font-size: 24px;
  line-height: 100%;
  padding: 18px;
  color: #FFFFFF;
  Height: 64px;
  width: ${({width}) => width || '170px'};
  opacity: 0.9;
  
  transition: 0.3s;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.3;
  }
  
  img {
    margin-right: 16px;
  }

  @media screen and (max-width: 390px) {
      img {
        margin-right: 13px;
      }
    }

  @media screen and (min-width: 743px){
    height: 72px;
    font-size: 32px;
    width: 250px;
  }
`

export const ContentWrapper = styled.div<{ isMain?: boolean}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
  height: 100%;
  padding: 80px 0 0 0;
  overflow: hidden;

  @media screen and (min-width: 743px){
    /* padding: 124px 12px 0 13px; */
    padding: 124px 0 0 0;
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: 1fr 320px; 
    justify-items: center; 
    /* align-items: start; */
    align-items: ${({isMain}) => isMain ? 'start' : 'center'};
    gap: 0px 33px; 
    /* grid-template-areas: 
        "order Notification"
        "menu menu";  */
    grid-template-areas: ${({isMain}) => isMain 
    ? "'order Notification' 'menu menu'" 
    : "'order order' 'menu menu'"};


    .menu__wrapper {
      grid-area: menu;
      width: 100%;
      align-self: end;
    }
  }

  @media screen and (min-width: 1280px){
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    align-items: start;
    padding: 152px 31px 0 0;

    .menu__wrapper {
      grid-area: menu;
      width: 291px;
      align-self: flex-start;
    }
  }
`

export const OrderContent = styled.div<{isChat?: boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: ${({isChat}) => isChat ? "flex-start" : 'flex-end'};
    min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    min-height: calc(var(--vh, 1vh) * 100);
    height: 100%;
    padding: 80px 0 0 0;
    overflow: hidden;

  @media screen and (min-width: 743px){
    padding: ${({isChat}) => isChat ? "124px 0 0 0" : '124px 12px 0 13px'};
    justify-content: flex-start;
  }

  @media screen and (min-width: 1280px){
    padding:  ${({isChat}) => isChat ? "112px 0 0 0" : '112px 108px 0 0'};
    /* justify-content: flex-start; */
    ${({isChat}) => isChat && {flexDirection: 'row', }};

    .chat__menu {
      margin-top: 40px;
    }
  }
`

export const CartWrapper = styled.div`
    /* margin: 20px auto 20px auto;  */
    
    @media screen and (min-width: 1280px){
        margin: 40px auto 0 auto; 
   }
  //@media screen and (min-width: 743px){
  //  margin: 0 auto;
  //}
`