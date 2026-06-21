import {Image} from "../../common";
import styled from "styled-components";

export const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  height: 80px;

  .product__item_text-wrapper {
    margin-left: 15px;
    width: 160px;
    
    @media screen and (max-width: 440px) {
      margin-left: 8px;
      width: 45%;
    }
  }

  @media screen and (min-width: 743px) {
    height: 104px;
    justify-content: flex-start;

    .product__item_text-wrapper { 
      width: 284px;
      margin-left: 22px;
    }
  }
`

export const Icon = styled(Image)`
  width: 18px;
  height: 18px;
  margin-right: 6px;

  @media screen and (min-width: 743px) { 
    width: 24px;
    height: 24px;
    margin-right: 10px;
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

export const TextWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;

  @media screen and (min-width: 743px) {
    justify-content: flex-start;
    
    .product__item_subtext-wrapper {
        margin-left: 24px;
    }
  }
`

export const Title = styled.h5`
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  color: #37751A;
  opacity: 0.9;
  // width: 160px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 8px;

  @media screen and (max-width: 414px) {
    font-size: 14px;
  }

  @media screen and (min-width: 743px) {
    font-size: 24px;
  }
`

export const Text = styled.p`
  font-weight: bold;
  font-size: 12px;
  line-height: 120%;
  color: #6D9A59;
  opacity: 0.7;
  word-break: break-word;

  @media screen and (min-width: 743px) {
    font-size: 18px;
  }
`

export const Cost = styled.div<{error?: boolean}>`
  font-weight: 700;
  font-size: 18px;
  line-height: 0;
  color: #37751A;
  opacity: 0.8;
  display: flex;
  
  flex-direction: column;
  
  //margin-left: 16px;

  span {
    font-size: 14px;
    line-height: 0;
  }

  div.changed {
    font-weight: 400;
    text-decoration: line-through;
    font-size: 14px;
    line-height: 120%;
    opacity: 0.7;
    margin-top: 10px;
    
  }

  @media screen and (max-width: 414px) {
      margin-right: 10px;
    //text-align: left;
    max-width: 30px;
  }

  @media screen and (min-width: 743px) {
    font-size: 22px;
    line-height: 0px;
    margin: ${({error}) => error ? '15px 15px 0 22px' : '0 15px 0 22px'};
    
    span {
      font-size: 18px;
      font-weight: 700;
      
    }

    div:not(.changed) {
      font-weight: 700;
      
    }

    div.changed {
      font-size: 16.5px;
      margin-top: 14px;
      
    }
  }
`

export const Delete = styled.button`
  position: absolute;
  top: -10px;
  left: -5px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  z-index: 100;
  background: #FFFFFF;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  transition: 0.3s;

  color: #4F743E;

  @media screen and (min-width: 743px) {
      width: 28px;
      height: 28px;
      box-shadow: 0px 1.764px 1.764px rgba(0, 0, 0, 0.25);

      img {
          width: 12px;
          height: 12px;
          padding: 0;
      }
  }
`

export const CartImage = styled(Image)`
  box-shadow: 0 1px 1px rgba(0, 36, 6, 0.25);
  border-radius: 12px;
  width: 82px;
  height: 58px;
  object-fit: cover;
  margin-right: 10px;

  @media screen and (max-width: 414px) {
      width: 60px;
      height: 58px;
  }

  @media screen and (min-width: 743px) {
      width: 120px;
      height: 84px;
      margin-right: 0;
  }
`

export const CustomSelect = styled.select`
    min-width: 56px;
    height: 48px;
    background: rgba(83, 184, 38, 0.1);
    border-radius: 12px;
    margin-left: 12px;
    font-size: 18px;
    line-height: 120%;
    opacity: 0.9;
    color: #37751A;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    /* border: 7px solid rgba(83, 184, 38, 0.1); */
    outline: none;
  
    -webkit-appearance: none;
    -moz-appearance: none;
  &.product__webkit-select {
    text-indent: 10px;
    text-align: -webkit-center;
  }
  &.product__chrome-select {
    text-indent: 1px;
  }
    text-overflow: '';

    option {
      text-align: -webkit-center;
      text-align: center;
      
    }

    @media screen and (max-width: 414px) {
      font-size: 16px;
      margin-left: 6px;
      min-width: 48px;
      height: 48px ;
      &.product__webkit-select {
        text-indent: 10px;
        text-align: -webkit-center;
      }
    }

    @media screen and (min-width: 743px) {
      font-weight: 400;
      font-size: 26px;
      min-width: 104px;
      height: 65px ;
      margin-left: 22px;
      border-radius: 21.168px;
      padding: 10px;
      &.product__webkit-select {
        text-indent: 20px;
        text-align: -webkit-center;

      }
    }
`

export const Pack = styled.button<{error?: boolean, editMode?: boolean}>`
  min-width: 56px;
  height: 48px;
  background: ${({error}) => error ? 'rgba(255, 61, 0, 0.6)' : 'rgba(83, 184, 38, 0.1)'};
  ${({editMode}) => !editMode && {background: 'transparent'}};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-left: 12px;
  font-size: 18px;
  line-height: 120%;
  opacity: 0.9;
  color: ${({error}) => error ? '#FFFFFF' : '#37751A'};;
  

  span {
    font-weight: 400;
    text-decoration: line-through;
    font-size: 14px;
    line-height: 120%;
    font-feature-settings: 'tnum' on, 'lnum' on;
  }

  @media screen and (max-width: 414px) {
      font-size: 16px;
      margin-left: 6px;
      min-width: 48px;
      height: 48px ;
  }

  @media screen and (min-width: 743px) {
      font-weight: ${({error}) => error ? '500' : '400'};
      font-size: ${({error}) => error ? '24px' : '26px'};
      margin-left: 22px;
      min-width: 104px;
      padding: 10px;
      height: 65px;
      flex-direction: row-reverse;
      border-radius: 21.168px;

      span {
          font-size: 22px;
          margin: 0 7px 0 0;
      }
  }
`

export const Content = styled.div`
  position: relative;
  // max-width: 380px;
  // padding: 12px 0;
  padding-right: 5px;

  transform: translateX(0);
  visibility: visible;
  opacity: 1;
  transition: 0.3s 0.2s;

  &.active {
    transform: translateX(120%);
    visibility: hidden;
    opacity: 0;
    transition: 0.3s 0s;
  }

  @media screen and (min-width: 743px) {
      padding: 0;
  }
`

export const Container = styled.div`
    position: relative;
    width: 82px;
    height: 58px;
    border-radius: 12px;

    @media screen and (max-width: 414px) {
      width: 60px;
      height: 58px;
    }

    @media screen and (min-width: 743px) {
      width: 120px;
      height: 84px;
    }
`

export const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  box-shadow: 0 1px 1px rgba(0, 36, 6, 0.15);
  border-radius: 12px;
  color: #FFFFFF;
  font-weight: bold;
  line-height: 120%;
`