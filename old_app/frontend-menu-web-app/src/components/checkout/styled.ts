import { Link } from "react-router-dom";
import checkedGray from "../../assets/icons/checkedGray.svg";
import styled from "styled-components";

export const InputWrapper = styled.div`
  width: 122px;
  height: 65px;
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  padding: 17px 22px;
  opacity: 0.7;
  margin-top: 30px;
  display: flex;
  align-items: center;

  @media screen and (min-width: 743px) {
    width: 205px;
    height: 65px;
    padding: 23px 14px;

    img {
      width: 20px;
    }
  }
`

export const AmountInput = styled.input`
  border: none;
  width: 70px;
  font-size: 16px;
  line-height: 120%;
  font-weight: 700;
  color: #2F521F;
  opacity: 0.7;
  
  @media screen and (min-width: 743px) {
    font-size: 24px;
    width: 160px;
    
  }
`

export const AnotherAmount = styled.button`
  background: rgba(81, 170, 39, 0.2);
  border-radius: 12px;
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  padding: 19px 14px;
  text-align: center;
  color: #4B8331;
  transition: 0.3s;

  &.active {
    background: rgba(81, 170, 39, 0.5);
  }

  @media screen and (min-width: 743px) {
    width: 205px;
    padding: 23px 14px;
    font-size: 24px;
    margin-top: 30px;
    
  }
  @media screen and (max-width: 742px) {
    margin-top: 30px;
    //margin-bottom: -10px;
    width: 120px;
    padding: 23px 14px;
    font-size: 18px;
  }
`

export const AmountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;

  @media screen and (min-width: 743px) {
    margin: 34px 0
  }
`

export const Amount = styled.button`
  background: rgba(81, 170, 39, 0.2);
  border-radius: 12px;
  width: 56px;
  font-weight: 700;
  font-size: 22px;
  line-height: 100%;
  padding: 17px 5px;
  text-align: center;
  color: #4B8331;
  transition: 0.3s;

  &.active {
    background: rgba(81, 170, 39, 0.5);
  }
  
  span {
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
  }

  @media screen and (min-width: 743px) {
    width: 91px;
    height: 91px;
    font-size: 36px;
    
    span {
      font-size: 26px;
    }
  }
`

export const Notification = styled.p<{margin?: string, color?: string, size?: string, align?: string}>`
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
    font-size: 24px;
  }
`

export const SubText = styled.p<{margin?: string, color?: string, size?: string, width?: string}>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: ${({size}) => size || '110%'};
  width: ${({width}) => width};
  color: ${({color}) => color || '#3A6426'};
  margin: ${({margin}) => margin || 0};  

  text-overflow: ellipsis;
  overflow: hidden; 
  height: 1.2em; 
  white-space: nowrap;
`

export const Text = styled.p<{margin?: string, color?: string, size?: string}>`
  font-weight: 600;
  font-size: ${({size}) => size || '16px'};
  line-height: ${({size}) => size || '18px'};
  color: ${({color}) => color || '#37751A'};
  opacity: 0.6;
`

export const WrapperLeft = styled.div<{margin?: string, padding?: string}>`
  // position: fixed;
  // top: 51px;
  // left: 0;
  // right: 0;
  margin: ${({margin}) => margin || '0 auto'};
  padding: ${({padding}) => padding};
  max-width: 100vw;
  //min-height: calc(100vh - 51px); /* Fallback for browsers that do not support Custom Properties */
  //min-height: calc((var(--vh, 1vh) * 100) - 51px);
  height: 100% ;

  &.hide {
    display: none;
    transform: translateX(-150%);
    opacity: 0;
    visibility: hidden;
    transition: 0.5s 0.1s;
  }

  &.active {
    visibility: visible;
    transform: translateX(0);
    opacity: 1;
    transition: 0.3s 0.4s;
  }
`

export const ChangeButton = styled.button`
  border: 1.3px dashed #3A6426;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  color: #3A6426;
  padding: 10px 9px;
  //cursor: pointer;
  transition: 0.3s;

  &:hover {
    border: 1.3px dashed #84ec4f;
  }
`

export const ButtonFlex = styled.div<{ margin?: string, justify?: string }>`
  // position: fixed;
  // bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content:  ${({justify}) => justify || 'space-between'};;
  margin: ${({margin}) => margin || '15px 0 10px 0'};
  flex-grow: 1;
  width: 100%;
`

export const WrapperRight = styled.div<{margin?: string, padding?: string}>`
  // position: fixed;
  // top: 51px;
  // left: 0;
  // right: 0;
  // height: 100%;
  // min-height: 100vh;
  margin: ${({margin}) => margin || '0 auto'};
  padding: ${({padding}) => padding};
  //height: calc(100vh - 51px); /* Fallback for browsers that do not support Custom Properties */
  //height: calc((var(--vh, 1vh) * 100) - 51px);
  max-width: 100vw;
  transition: 0.3s 0s;
  flex-shrink: 0;
  
  &.hide {
    display: none;
    transform: translateX(150%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s 0s;
  }
  
  &.active {
    visibility: visible;
    transform: translateX(0);
    opacity: 1;
    transition: 0.3s 0.5s;
  }

  // div.container {
  //   display: flex;
  //   flex-direction: column;
  //   min-height: calc(100vh - 51px);
  //   max-width: 400px;
  //   width: 100%;
  //   margin: 0 auto;
  // }
`

export const Container = styled.div<{padding?: string}>`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 51px); /* Fallback for browsers that do not support Custom Properties */
  min-height: calc((var(--vh, 1vh) * 100) - 51px);
  max-width: 336px;
  width: 100%;
  margin: 0 auto;
  padding: ${({padding}) => padding};

  @media screen and (min-width: 743px) {
    min-height: calc(100vh - 120px); /* Fallback for browsers that do not support Custom Properties */
    min-height: calc((var(--vh, 1vh) * 100) - 120px);
    padding: 0 0 13px 0;
    max-width: 689px;

    .checkout__back-btn {
      margin-top: 50px;
      /* margin-top: auto; */
    }
  }

  @media screen and (min-width: 1280px) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      max-width: 100%;
      padding: 0 108px 13px 24px;

      .desktop__notif {
            margin-top: 72px;
      }

      .checkout__back-btn {
          position: absolute;
          left: 24px;
          bottom: 28px;
      }

      .checkout__btn-wrapper {
          position: absolute;
          bottom: 28px;
          width: 100%;
          padding: 0 48px 0 0;
          margin: 0;
      }
  }

  @media screen and (max-width: 390px) {
    
    .checkout__back-btn {
      img {
        margin-right: 13px;
      }
    }
  }
`

export const Header = styled.div<{size?: string}>`
  background: #ffffff99;
  /* opacity: 0.6; */
  border-radius: 24px 24px 0 0;
  width: 280px;
  padding: 15px 0;
  text-align: center;
  margin: 0 auto;

  font-weight: 600;
  font-size: ${({size}) => size || '20px'};
  line-height: 120%;
  color: #2f521fcc;

  @media screen and (min-width: 743px) {
    width: 540px;
    height: 70px;
    background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
    border-radius: 36px 36px 0px 0px;
    font-size: 32px;
    padding: 17px 0;
    opacity: 1;
    color: #FFFFFF;

    &.checkout__small-header {
      font-size: 28px;
      padding: 19px 0;
    }
  }
`

export const Content = styled.div<{margin?: string}>`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  padding: 22px 20px 17px;
  width: 336px;
  margin: ${({margin}) => margin || '0 auto;'};

  @media screen and (min-width: 743px) {
    width: 636px;
    padding: 34px 42px 32px;
    box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1);
    border-radius: 32px;
    /* margin-bottom: 86px; */

    text-align: center;
  }
`

export const CheckBox = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
  
  &+label {
    margin: 18px auto 0 auto;
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  & + label {
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    color: #616A5C;
    opacity: 0.8;
  }

  &+label::before {
    box-sizing: border-box;
    content: '';
    display: inline-block;
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    flex-grow: 0;
    opacity: 0.5;
    border: 2px solid #616A5C;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
    cursor: pointer;
  }
  

  &:checked+label::before {
    background-image: url(${checkedGray});
  }
`

export const Instructions = styled.input`
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  padding: 17px 15px;
  margin-top: 12px;
  width: 292px;
  font-size: 16px;
  line-height: 120%;
  color: #616A5C;
  opacity: 0.8;

  @media screen and (min-width: 743px) {
    width: 400px;
    height: 88px;
    margin: 35px auto 22px auto;
    font-size: 20px;
    line-height: 130%;
    padding: 19px 23px;
  }
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
  color: #616A5C;
  opacity: 0.7;
`

export const FlexBox = styled.div<{ margin?: string, direction?: string, align?: string, width?: string, height?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${({margin}) => margin || '15px 0 0 60px'};

  @media screen and (min-width: 743px) {
    padding: 0;
    /* &:not(:first-child) {
        padding: 32px 0 0 0;
    } */
    &.place { grid-area: place; width: 330px; }
    &.day { grid-area: day; }
    &.time { grid-area: time; }
    &.money { grid-area: money; }
  }

  @media screen and (min-width: 1280px) {
    &:not(:first-child) {
        padding: 32px 0 0 0;
    }
  }
`

export const OrderInfoWrapper = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;

  @media screen and (min-width: 743px) {
    margin: 31px 0 104px 50px;
    padding-bottom: 30px;
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
    gap: 37px 36px; 
    align-items: center;
    grid-template-areas: 
    "place time"
    "day money"; 


    p {
      font-size: 27px;
      margin: 0 0 0 22px;
      text-overflow: ellipsis;
      overflow: hidden; 
      height: 1.2em; 
      white-space: nowrap;
    }
    
    img {
      width: 30px;
    }
  }

  @media screen and (min-width: 1280px) {
    margin: 102px 0 0 96px;
    display: block;
  }
`

export const EditButton = styled(Link)<{ margin?: string}>`
  margin: ${({margin}) => margin || '10px auto 0 auto;'};
  border: 2px solid rgba(58, 100, 38, 0.2);
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  padding: 8px 12px;
  color: #3A6426;
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