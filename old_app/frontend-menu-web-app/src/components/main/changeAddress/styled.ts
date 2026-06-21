//@ts-nocheck

import styled from 'styled-components'

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

export const Instructions = styled.div<{ margin?: string, color?: string, size?: string }>`
  font-size: 14px;
  line-height: 120%;
  color: ${({color}) => color || '#616A5C'};
  margin: 7px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 250px;
  white-space: nowrap;
  opacity: 0.8;

  @media screen and (min-width: 743px) and (max-width: 1279px) {
    font-size: 20px;
    margin: 8px 0 0 0;
    width: 380px;
  }
`

export const Head = styled.p<{margin?: string, color?: string, size?: string, align?: string}>`
  font-size: 16px;
  line-height: 120%;
  text-align: ${({align}) => align || 'center'};;
  color: #616A5C;
  opacity: 0.8;
  
  margin: ${({margin}) => margin || '18px 0 0 0'};

  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px) {
    margin: 15px 0 0 0;
    font-size: 27px;
  }

  @media screen and (min-width: 1280px) {
    margin: 10px 0 0 0;
    font-size: 20px;
  }
`

export const Notification = styled.p`
  display: none;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  
  margin: 18px 0 0 0;

  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px) {
      display: block;
      font-size: 26px;
      line-height: 140%;
      margin: 38px 0 20px 0;
  }

  @media screen and (min-width: 1280px) {
      margin: 27px 0 20px 10px;
      font-size: 20px;
      text-align: left;
  }
`

export const SubText = styled.p<{margin?: string, color?: string, size?: string}>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: 120%;
  color: ${({color}) => color || '#3A6426'};
  margin: ${({margin}) => margin || 0};
  text-overflow: ellipsis;
  overflow: hidden;
  width: 250px;
  white-space: nowrap;

  @media screen and (min-width: 743px) and (max-width: 1279px) {
    font-size: 26px;
    width: 380px;
  }
`

export const Numbers = styled.p<{ margin?: string, color?: string, size?: string }>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: ${({size}) => size || '20px'};
  color: ${({color}) => color || '#3A6426'};
  margin: 0 11px 0 0;
  width: 20px;
  text-align: right;

  @media screen and (min-width: 743px) and (max-width: 1279px) {
    font-size: 26px;
    margin: 0 15px 0 0;
    width: 30px;
  }

  
`

export const ImageContainer = styled.div`
  width: 20px;
  text-align: right;
  align-self: center;
  margin-right: 11px;

  @media screen and (min-width: 743px) and (max-width: 1279px) {
    width: 25px;
    margin-right: 15px;
  }
`

export const FlexContainer = styled.div`
  display: flex;
  padding: 17px 24px;

  @media screen and (min-width: 743px) {
     padding: 21px 28px;
  }

  @media screen and (min-width: 1280px) {
     padding: 18px 18px 18px 32px;
  }
`

export const Button = styled.button<{ width?: string, padding?: string}>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  height: 65px;
  font-size: 20px;
  line-height: 100%;
  padding:  ${({padding}) => padding || '18px'};
  color: #FFFFFF;
  width: ${({width}) => width};
  opacity: 0.9;
  display: flex;
  flex-direction: ${({padding}) => padding ? 'column' : 'row'};
  justify-content: center;
  align-items: center;
  
  transition: 0.3s;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.3;
  }
  
  span {
    font-size: 14px;
    line-height: 120%;
    font-weight: bold;
    color: #FFFFFF;
    opacity: 0.8;
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

export const Title = styled.h5<{padding?: string}>`
  font-weight: 600;
  font-size: 26px;
  line-height: 120%;
  text-align: center;
  color: #445A3B;
  opacity: 0.9;

  padding: ${({padding}) => padding};

  @media screen and (min-width: 743px) {
    font-size: 36px;
  }
`

export const Content = styled.div`
  margin: 41px auto 0 auto;
  max-width: 324px;
  width: 100%;
  background: #ffffff80;
  border-radius: 16px;
  
  display: flex;
  flex-direction: column;
  /* justify-content: center; */

  max-height: 303px;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: flex-start;
  
  .address__item-image {
      /* transform: translateY(15px); */
      /* margin-right: 11px; */
  }
    
  div.address__item {
    padding: 15px 14px!important;
    cursor: pointer;
    transition: 0.2s;
   

    &:hover {
        opacity: 0.7;
    }
  }

  div.address__item.active {
    background: rgba(81, 170, 39, 0.2);
  }

  div.address__item:not(:last-child) {
      position: relative;
    // border-bottom: 1px solid #5F9148 
  
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 280px;
        height: 1px;
        background: #5F9148;
        opacity: 0.2;
    }
  }

  @media screen and (min-width: 743px) {
    max-width: 493px;
    width: 493px;
    box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1);
    margin: 49px auto 0 auto;


    .address__item-image {
      width: 18px;
      height: 12px;
      margin-top: 10px;
      /* margin-right: 15px; */
    }

    div.address__item {
      padding: 19px !important;
    }

    div.address__item:not(:last-child) {
      &:after {
        width: 430px;
      }
    }
  }

  @media screen and (min-width: 1280px) {
    max-width: 351px;
    width: 351px;
    margin: 22px auto 0 auto;
    max-height: 289px;

    div.address__item {
      padding: 13px !important;
    }
    .address__item-image {
      width: 13px;
      height: 8px;
      margin-top: 5px;
    }

    div.address__item:not(:last-child) {
      &:after {
        width: 305px;
      }
    }
  }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 4px;
      /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); */
      box-shadow: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #e7e7e7ab;
      border-radius: 5px;
    }
`

