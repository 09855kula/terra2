import { Link } from "react-router-dom";
import styled from "styled-components";

export const OrderWrapper = styled.div`
  margin: 10px auto 20px auto;
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

  @media screen and (min-width: 743px){
    margin: 0;
    grid-area: order;
  }

  @media screen and (min-width: 1280px){
    flex-grow: 0;
  }
`

export const OrderSubText = styled.p`
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  color: #3A6426;
  margin: 0 0 0 15px;

  @media screen and (min-width: 1280px){
    font-size: 22.5px;
    margin: 0 0 0 19px;
  }
`

export const OrderEditButton = styled(Link)<{ margin?: string}>`
  margin: 0 16px 0 auto;
  border: 2px solid rgba(58, 100, 38, 0.2);
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  padding: 8px 12px;
  text-align: center;
  color: #3A6426;

  @media screen and (min-width: 1280px){
    width: 152.25px;
    height: 54px;
    border-radius: 15px;
    padding: 15px 0;
    font-size: 20px;
    opacity: 0.8;
    margin: 0 auto 12px 44px;
  }
`

export const OrderFlexBox = styled.div<{ margin?: string, direction?: string, align?: string, width?: string, height?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 0 20px 0;

  @media screen and (min-width: 1280px){
    img {
      width: 25px;
    }
    padding: 0 0 25px 0;
  }
`

export const Order = styled.h5`
  font-weight: 800;
  font-size: 24px;
  line-height: 120%;
  color: #385928;
  opacity: 0.85;
  align-self: flex-start;

  @media screen and (min-width: 1280px){
    font-size: 30px;
  } 
`

export const Chat = styled.button<{newMessage?: boolean}>`
  font-weight: 800;
  font-size: 14px;
  line-height: 120%;
  //Цвет чата в draft order
  // color: ${({newMessage}) => newMessage ? '#57AB30' : '#4C6A3E'};
  color: gray;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s;
  
  &:hover {
    opacity: 0.6;
  }
  
  img {
    margin-bottom: 7px;
  }
`

export const ContentWrapper = styled.div`
  padding: 31px 23px 6px 31px;

  @media screen and (min-width: 743px){
    padding: 26px 20px 7px 36px;
  }

  @media screen and (min-width: 1280px){
    padding: 38px 34px 9px 44px;
  }
`

export const CreatedContent = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  width: 342px;
  margin: 16px auto 42px auto;

  @media screen and (min-width: 743px){
    margin: 0;
    width: 342px;
    margin-left: 12px;
  }

  @media screen and (min-width: 1280px){
    margin: 0;
    width: 430px;
    /* height: 434px; */
  }
`

export const CreatedLabel = styled.div`
  width: 164px;
  height: 72px;
  background: #72A859;
  opacity: 0.9;
  border-radius: 24px 0 24px 0;
  font-weight: 800;
  font-size: 28px;
  line-height: 120%;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: inherit;
  //font-feature-settings:'tnum' on, 'lnum' on;

  @media screen and (min-width: 1280px){
    font-size: 28px;
    width: 198px;
    height: 90px;
  }
`

export const Wrapper = styled.div`
  /* max-width: 414px;
  width: 100%;  */
  padding: 0 10px;
  margin: 0 auto 120px auto;
`