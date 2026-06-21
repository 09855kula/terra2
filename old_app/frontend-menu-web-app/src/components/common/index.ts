//@ts-nocheck

import {Link} from "react-router-dom";
import React from "react";
import checked from '../../assets/icons/checked.svg'
import styled from 'styled-components'

export const ButtonFlex = styled.div<{ margin?: string, justify?: string }>`
  // position: fixed;
  // bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content:  ${({justify}) => justify || 'space-between'};
  margin: ${({margin}) => margin || '15px 0 10px 0'};
  flex-grow: 1;
  width: 100%;

  @media screen and (max-width: 414px) {
    gap: 10px;
  }

  @media screen and (min-width: 743px) {
    &.desktop__hide {
      display: none;
    }

    &.tablet__hide {
      margin: 15px 0 0 0;
      justify-content:  flex-start;
      position: absolute;
      bottom: 24px;
      left: 28px;
    }
  }

  @media screen and (min-width: 1280px) {
    &.tablet__hide {
      display: none;
    }
  }
`

export const NotEnoughProduct = styled.div`
  position: relative;
  background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
  border-radius: 24px;
  width: 100%;
  height: 110px;
  overflow: hidden;
  margin: 11px 0 18px 0;
  padding: 15px 0 15px 100px;

  p {
    font-size: 16px;
    line-height: 120%;
    color: #FFFFFF;
  }

  @media screen and (max-width: 743px) {
      img {
        width: 112px;
        height: 112px;
        position: absolute;
        bottom: -18px;
        left: -18px;
      }
  }

  @media screen and (min-width: 743px) {
    border-radius: 24px 0 0 24px;
    width: 375px;
    height: 220px;
    padding: 23px 76px 27px 34px;

    h6 {
      font-size: 32px;
      line-height: 120%;
      color: #FFFFFF;
      margin-bottom: 24px;
    }
    
    img { 
      position: absolute;
      width: 211px;
      height: 211px;
      bottom: -46px;
      right: -51px;
    }
  }
  
  @media screen and (min-width: 1280px) {
    border-radius: 24px;
    width: 428px;
    height: 208px;
    padding: 23px 76px 27px 34px;

    h6 {
      font-size: 32px;
      line-height: 120%;
      color: #FFFFFF;
      margin-bottom: 24px;
    }
    
    img { 
      position: absolute;
      width: 211px;
      height: 211px;
      bottom: -46px;
      right: -51px;
    }
  }
`

export const  CheckBox = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
  
  &+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  & + label {
    font-size: 24px;
    line-height: 120%;
    color: #49812F;
  }

  &+label::before {
    box-sizing: border-box;
    content: '';
    display: inline-block;
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 2px solid #49812F;
    border-radius: 7px;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
    cursor: pointer;
  }
  

  &:checked+label::before {
    background-image: url(${checked});
    
  }
`

export const MainContainerAddress = styled.div<{padding?: string, maxWidth?: string, translateY?: string}>`
  padding-top: ${({padding}) => padding};
  margin: 0 auto;
  width: 100%;
  max-width: ${({maxWidth}) => maxWidth || '336px'};
  min-height: 90vh;
  //min-height: calc(100vh + 200px); /* Fallback for browsers that do not support Custom Properties */
  //min-height: calc((var(--vh, 1vh) * 100) + 200px);
  display: flex;
  flex-direction: column;
  

  &.reffer__container {
    padding-top: 72px;
    
  }

  .desktop__header, .desktop__btn-wrapper {
        display: none;
  }

  @media screen and (min-width: 743px) {
    transform: ${({translateY}) => translateY || 'translateY(-22px)'};
    min-height: 100%;
    /* min-height: calc(100vh - 124px); /* Fallback for browsers that do not support Custom Properties */
    //min-height: calc((var(--vh, 1vh) * 100) - 124px); */
    /* max-width: 343px; */
    max-width: 430px;
    z-index: 103;
    padding-top: 0;

    .mobile__header, .reffer__buttons {
      display: none;
    }
    
    &.reffer__container {
      padding-top: 0;
      display: flex;
      align-items: self-start;
    }

    .reffer__buttons {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    &.change__address {
      max-width: 493px;
      //min-height: calc(100vh - 174px); /* Fallback for browsers that do not support Custom Properties */
      //min-height: calc((var(--vh, 1vh) * 100) - 174px);
      margin-top: 50px;
    }

    .desktop__btn-wrapper {
      display: flex;
      margin-bottom: 0;
    }
    .desktop__header {
      display: block
    }
    
    .friend__content {
       height: 435px;
    }
  }

  @media screen and (min-width: 1280px) {
    transform: ${({translateY}) => translateY || 'translateY(-54px)'};
      &.change__address {
        max-width: 351px;
        min-height: 100%;
        margin-top: 0;
      }
  }
`
export const MainContainer = styled.div<{padding?: string, maxWidth?: string, translateY?: string}>`
  padding-top: ${({padding}) => padding};
  margin: 0 auto;
  width: 100%;
  max-width: ${({maxWidth}) => maxWidth || '336px'};
  
  //min-height: calc(100vh + 200px); /* Fallback for browsers that do not support Custom Properties */
  min-height: calc((var(--vh, 1.5vh) * 100));
  display: flex;
  flex-direction: column;
  

  &.reffer__container {
    padding-top: 72px;
    
  }

  .desktop__header, .desktop__btn-wrapper {
        display: none;
  }

  @media screen and (min-width: 743px) {
    transform: ${({translateY}) => translateY || 'translateY(-22px)'};
    //min-height: 100%;
    /* min-height: calc(100vh - 124px); /* Fallback for browsers that do not support Custom Properties */
    //min-height: calc((var(--vh, 1vh) * 100) - 124px); */
    /* max-width: 343px; */
    max-width: 430px;
    z-index: 103;
    padding-top: 0;

    .mobile__header, .reffer__buttons {
      display: none;
    }
    
    &.reffer__container {
      padding-top: 0;
      display: flex;
      align-items: self-start;
    }

    .reffer__buttons {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    &.change__address {
      max-width: 493px;
      //min-height: calc(100vh - 174px); /* Fallback for browsers that do not support Custom Properties */
      //min-height: calc((var(--vh, 1vh) * 100) - 174px);
      margin-top: 50px;
    }

    .desktop__btn-wrapper {
      display: flex;
      margin-bottom: 0;
    }
    .desktop__header {
      display: block
    }
    
    .friend__content {
       height: 435px;
    }
  }

  @media screen and (min-width: 1280px) {
    transform: ${({translateY}) => translateY || 'translateY(-54px)'};
      &.change__address {
        max-width: 351px;
        min-height: 100%;
        margin-top: 0;
      }
  }
`

export const MainContainerWindow = styled.div<{padding?: string, maxWidth?: string, translateY?: string}>`
  padding-top: ${({padding}) => padding};
  margin: 0 auto;
  width: 100%;
  max-width: ${({maxWidth}) => maxWidth || '336px'};

  height: calc(100vh + 500px); /* Fallback for browsers that do not support Custom Properties */
  min-height: calc((var(--vh, 1vh) * 100) + 500px);
  display: flex;
  flex-direction: column;

  &.reffer__container {
    padding-top: 72px;
    
  }

  .desktop__header, .desktop__btn-wrapper {
        display: none;
  }

  @media screen and (min-width: 743px) {
    transform: ${({translateY}) => translateY || 'translateY(-22px)'};
    
     //min-height: calc(100vh - 124px); /* Fallback for browsers that do not support Custom Properties */
    min-height: calc((var(--vh, 1vh) * 100) - 124px);
    /* max-width: 343px; */
    max-width: 430px;
    z-index: 103;
    padding-top: 0;

    .mobile__header, .reffer__buttons {
      display: none;
    }
    
    &.reffer__container {
      padding-top: 0;
      display: flex;
      align-items: self-start;
    }

    .reffer__buttons {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    &.change__address {
      max-width: 493px;
      //min-height: calc(100vh - 174px); /* Fallback for browsers that do not support Custom Properties */
      //min-height: calc((var(--vh, 1vh) * 100) - 174px);
      margin-top: 50px;
    }

    .desktop__btn-wrapper {
      display: flex;
      margin-bottom: 0;
    }
    .desktop__header {
      display: block
    }
    
    .friend__content {
       height: 435px;
    }
  }

  @media screen and (min-width: 1280px) {
    transform: ${({translateY}) => translateY || 'translateY(-54px)'};
      &.change__address {
        max-width: 351px;
        min-height: 100%;
        margin-top: 0;
      }
  }
`
export const Instructions = styled.div<{ margin?: string, color?: string, size?: string }>`
  font-weight: 600;
  font-size: ${({size}) => size || '16px'};
  line-height: ${({size}) => size || '18px'};
  color: ${({color}) => color || '#616A5C'};
  margin: 10px 0 0 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 90%;
  white-space: nowrap;
  opacity: 0.6;

  @media screen and (min-width: 743px) {
    font-size: 14px;
  }
`

export const MainButton = styled.button<{ width?: string, padding?: string, size?: string, direction?: string}>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  height: 64px;
  font-size: ${({size}) => size || '24px'};
  line-height: 100%;
  padding:  ${({padding}) => padding || '18px 22px'};
  color: #FFFFFF;
  width: ${({width}) => width || '133px'};
  opacity: 0.9;
  display: flex;
  flex-direction: ${({direction}) => direction ? 'column' : 'row'};
  justify-content: center;
  align-items: center;
  
  transition: 0.3s;
  
  &:hover {
    opacity: 0.7;
  }
  
  &.disabled {
    opacity: 0.5;
  }
  
  span {
    font-size: 14px;
    line-height: 120%;
    font-weight: bold;
    color: #FFFFFF;
    opacity: 0.8;
    margin-top: 4px;
  }
  
  img {
    margin-right: 16px;
  }

  @media screen and (max-width: 390px) {
      img {
        margin-right: 13px;
      }
    }

  @media screen and (min-width: 743px) {
    width: ${({width}) => width || '222px'};
    height: 72px;
    font-size: 32px;
    padding:  ${({padding}) => padding || '18px 25px 18px 25px'};

    img {
      margin-right: 22px;
      width: 18px;
      height: 25px;
    }
  }
`

export const BackButton = styled(MainButton)`
  padding:  ${({padding}) => padding || '18px 30px 18px 22px'};
  flex-direction: row;

  @media screen and (min-width: 743px) {
    width: 182.25px;
    height: 72px;
    font-size: 32px;
    padding:  ${({padding}) => padding || '18px 40px 18px 30px'};
    
    img {
      margin-right: 22px;
      width: 18px;
      height: 25px;
    }
  }
  
`

export const Button = styled.button<{ margin?: string }>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  width: 100%;
  padding: 18px;
  font-size: 24px;
  line-height: 120%;
  color: #FFFFFF;
  opacity: 0.8;
  transition: 0.3s;
  margin: ${props => props.margin};

  &:hover {
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.5;
  }
`
export const Image: React.FC<{src: string, onError?: JSXattribute, className?: string, height?: string, width?: string, padding?: string}> =
    styled.img.attrs(({src}) => ({src: src}))`
    padding: ${({padding}) => padding};
    width: ${({width}) => width};
    height: ${({height}) => height};
`;

export const Flex = styled.div<{ margin?: string, direction?: string,
  align?: string, width?: string, height?: string, justify?: string, padding?: string, grow?: number }>`
  position: relative;
  display: flex;
  flex-grow: ${({grow}) => grow};
  align-items: ${({align}) => align || 'center'};
  flex-direction: ${({direction}) => direction || 'row'};
  justify-content: ${({justify}) => justify || 'space-between'};
  margin: ${({margin}) => margin};
  padding: ${({padding}) => padding};
  width: ${({width}) => width};
  height: ${({height}) => height};
  
`
export const TextField = styled.textarea`
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  width: 100%;
  height: 90px;
  font-size: 16px;
  line-height: 130%;
  color: #616A5C;
  padding: 11px 25px;
  opacity: 0.8; 
  outline: none;
  resize: none
`
export const Input = styled.input<{ font?: string}>`
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  width: 100%;
  font-size: ${({size}) => size || '20px'};
  line-height: 120%;
  color: #616A5C;
  padding: 18px;
  text-align: center;
  opacity: 0.8;
  outline: none;
`

export const ButtonLink = styled(Link)<{ width?: string }>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  font-size: 24px;
  line-height: 100%;
  padding: 18px;
  color: #FFFFFF;
  width: ${({width}) => width};
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
`


