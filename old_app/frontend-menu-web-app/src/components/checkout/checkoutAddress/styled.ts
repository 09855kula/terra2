import { Link } from "react-router-dom";
import dashes from '../../../assets/buttonDashess.svg'
import dashesDesc from '../../../assets/buttonDashesDesc.svg'
import dashesTablet from '../../../assets/buttonDashesTablet.svg'
import styled from "styled-components";

export const TextChangeDay = styled.p`
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  color: #3D7B20;
  width: 154px;
  padding: 0 10px;
  text-align: center;
  
  @media screen and (min-width: 743px) {
    font-size: 31.3px;
    width: 214px;
  }
`

export const CutoffText = styled.p<{margin?: string, color?: string, size?: string}>`
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  color: #37751A;
  opacity: 0.6;
  margin-top: 3px;

  @media screen and (min-width: 743px) {
    font-size: 24.3571px; 
    margin-top: 5px; 
  }

  @media screen and (min-width: 1280px) {
    font-size: 24.3571px; 
  }
`

export const ChoiceTime = styled.button`
  background: rgba(81, 170, 39, 0.2);
  border-radius: 12px;
  width: 154px;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  padding: 17px 5px;
  text-align: center;
  color: #4B8331;
  transition: 0.3s;
  
  &.active {
    background: rgba(81, 170, 39, 0.5);
  }

  @media screen and (min-width: 743px) {
    border-radius: 20.8776px;
    font-size: 31.3163px;
    padding: 29px 32px;
    width: 268px;
  }
`

export const CutoffTitle  = styled.p<{margin?: string, color?: string, size?: string, width?: string}>`
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: right;
  color: #4B8331;

  @media screen and (min-width: 743px) {
    font-size: 31.3px;
  }
`

export const AddressBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 52px 21px;

  img {
    width: 19px;
  }

  .address__block {
    margin: 0 12px 0 13px;
  }

  .address__text{
    margin-top: 4px;
    max-width: 183px;
  }

  @media screen and (min-width: 743px) {
    margin: 47px auto 116px auto;
    width: 489px;
    border-radius: 18px;
    padding: 18px 0 18px 0;
    
    img {
      margin-right: 8px;
      width: 29px;
    }

    .address__block {
      margin: 0 19px 0 13px;
    }
    .address__title {
      font-size: 24px;
    }
    .address__text {
      font-size: 26px;
      margin-top: 7px;
      max-width: 289px;
    }
  }

  @media screen and (min-width: 1280px) {
      width: 402px;
      margin: 0;
      box-shadow: 0px 2px 6px rgba(31, 71, 13, 0.1);
      background: #FFFFFF;
      padding: 18px 19px 18px 21px;

    img {
      margin-right: 2px;
      width: 21px;
    }

    .address__title {
      font-size: 17.5px;
    }
    .address__text {
      font-size: 19.75px;
      margin-top: 7px;
    }
  }
`

export const DeliveryContent = styled.div<{margin?: string}>`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  padding: 22px 20px 17px;
  width: 336px;
  margin: ${({margin}) => margin || '0 auto;'};

  @media screen and (min-width: 743px) {
    width: 689px;
    padding: 0;
  }
`

export const DeliveryItem = styled.div<{margin?: string}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 22px 0;

  .checkout__day-wrapper {
      width: 35%;
  }

  @media screen and (min-width: 743px) {
    padding: 23px 55px;
    margin: 0;
    &:not(:last-child) {
      border-bottom: 2.3px solid #5f914833;
    }

    .checkout__day-wrapper {
      margin-right: 60px;
    }
  }
`

export const Notification = styled.p`
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
      font-size: 20px;
      line-height: 140%;
      margin: 24px 0 20px 0;
  }

  @media screen and (min-width: 1280px) {
      margin: 24px 0 20px 21px;
      text-align: left;
  }
`

export const LinkToProfile = styled(Link)<{is744?: boolean, is1280?: boolean}>`
  /* border: 1.3px dashed #3A6426; */
  /* border-radius: 12px; */
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
  color: #3A6426;
  padding: 10px 9px;
  //cursor: pointer;
  text-align: center;
  transition: 0.3s;
  width: 83px;
  height: 43px;

  background-image: url(${({is744, is1280}) => is744 ? `${dashesTablet}` : is1280 ? `${dashesDesc}` : `${dashes}`});
  

  &:hover {
    /* border: 1.3px dashed #84ec4f; */
  }

  @media screen and (min-width: 743px) {
    width: 131px;
    height: 68px;
    padding: 17px 9px;
    
    font-size: 28px;
  }

  @media screen and (min-width: 1280px) {
    width: 83px;
    height: 53px;
    padding: 15px 9px;
    font-size: 18px;
  }
`