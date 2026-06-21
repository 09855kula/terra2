import {Slider} from "antd";
import styled from "styled-components";
import whiteFilter from '../../assets/icons/whiteFilter.svg';

export const Overlay = styled.div<{ margin?: string, padding?: string}>`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  z-index: 101;
  background: #89898947;
  
  transform: translateY(-150%);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s 0s;

  &.active {
      visibility: visible;
      transform: translateY(0);
      opacity: 1;
      transition: 0.3s;
  }

  @media screen and (max-width: 743px) {
    left: 0;
    right: 0;
  }

  @media screen and (min-width: 743px) {
    /* position: fixed; */
    /* position: absolute; */
    transform: translateX(-150%);
    background: transparent;
    &.active {
      transform: translateX(0);
    }
  }

  @media screen and (min-width: 1280px) {
    /* position: absolute; */
    /* position: fixed; */
    top: 175px;
    transform: translate(0);
    opacity: 1;
    visibility: visible;
    width: 290px;
    margin: 0;
  }
`

export const FilterContainer = styled.div`
  @media screen and (min-width: 1280px) {
    display: none;
  }
`

export const FilterButton = styled.button<{ margin?: string, padding?: string }>`
  width: 58px;
  height: 58px;
  margin: 0 2px;
  
  img {
    transition: 0.4s;
  }
`

export const FilterButtonWrapper = styled.div<{ margin?: string, padding?: string }>`
  width: 100%;
  margin: 18px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media screen and (min-width: 1280px) {
    
  }
`

export const Range = styled(Slider)`
  position: relative;
  max-width: 350px;
  margin: 0 auto;

  .ant-slider {
    position: relative;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum', "tnum";
    height: 12px;
    margin: 10px 6px 10px;
    padding: 4px 0;
    cursor: pointer;
    touch-action: none;
  }
  .ant-slider-handle {
    background-color: #49812F !important;
    border: none !important;
    margin-top: -3px !important;
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: none;
    cursor: pointer;
    transition: border-color 0.3s, box-shadow 0.6s, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  .ant-slider-step {
    position: absolute;
    width: 100%;
    height: 4px;
    background: transparent;
  }
  .ant-slider-track {
    position: absolute;
    border-radius: 2px;
    transition: background-color 0.3s;
    background-color: #49812F !important;
    opacity: 0.8;
    height: 8px;
  }
  
  .ant-slider-mark {
    position: absolute;
    top: 14px;
    left: 0;
    width: 100%;
    font-size: 14px;
  }

  .ant-slider-rail {
    position: absolute;
    width: 100%;
    border-radius: 2px;
    transition: background-color 0.3s;
    background-color: #49812F !important;
    opacity: 0.2;
    height: 8px;
  }

  @media screen and (min-width: 743px) {
    max-width: 179px;
    .ant-slider-handle {
      width: 22px;
      height: 22px;
      margin-top: -7px !important;
    }

    .ant-slider-step {
      height: 8px;
    }
  }

  @media screen and (min-width: 1280px) {
    max-width: 238px;
    .ant-slider-handle {
      width: 12px;
      height: 12px;
      margin-top: -3px !important;
    }

    .ant-slider-rail {
      z-index: 100;
    }
 
    .ant-slider-step,.ant-slider-rail,.ant-slider-track {
      height: 5px;
    }

  }
`

export const CircleFilter = styled.button<{ margin?: string, padding?: string, isStart: boolean}>`
  transition: 0.3s;
  background: #FFFFFF;
  position: fixed;
  left: -13px;
  top: 58px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(30, 57, 16, 0.1);
  z-index: 101;
  justify-content: center;
  display: flex;
  align-items: center;
  transition: 0.2s;
  transform: translateX(-200px);
  opacity: 0;

  p {
    font-size: 24px;
    line-height: 120%;
    color: #49812F;
  }
  
  span {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #74CB4B;
    
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 20px;
    line-height: 120%;
    color: #FFFFFF;
  }
  
  &:hover {
    opacity: 0.7;
  }

  @media screen and (max-width: 743px) {
    ${({isStart}) => !isStart && ({opacity: 1, transform: 'translateX(0)'})}
  }

  @media screen and (min-width: 743px)  {
    position: fixed;
    transform: translateX(0);
    left: 11px;
    top: 127px;
    bottom: 0;
    opacity: 1;
    width: 72px;
    height: 72px;
    background: #8DC573;

    img {
      width: 32px;
      height: 32px;
      content: url(${whiteFilter});
    }

    span {
      background: #FBFBFB;
      color: #8DC573;
      right: -6px;
      top: -6px;
      box-shadow: 0 0 8px rgba(30, 57, 16, 0.1);
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: -11px;
      width: 82px;
      height: 72px;
      background: #8DC573;
      opacity: 0.4;
      border-radius: 0 32px 32px 0;
      z-index: -1;
    }

    &:before {
      content: 'Filters';
      font-size: 16px;
      line-height: 120%;
      color: #4B8231;
      position: absolute;
      bottom: -26px;
    }
  }
`

export const ActiveFiltersWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 29px 16px 0 0;
  transition: 0.5s;

  @media screen and (min-width: 743px) {
    display: none;
  }
`

export const ActiveFilters = styled.button<{ margin?: string, padding?: string, isStart: boolean}>`
  transition: 0.3s;
  background: #FFFFFF;
  position: relative;
  padding: 13px 19px 13px 20px;
  width: 227px;
  height: 66px;
  border-radius: 0 12px 12px 0;
  justify-content: space-between;
  display: flex;
  align-items: center;
  transition: 0.5s;

  transition: 0.5s;
  opacity: 1;
  transform: translateX(0)

  ${({isStart}) => !isStart && {opacity: 0, transform: 'translateX(-300px)'}};

  p {
    font-size: 24px;
    line-height: 120%;
    color: #49812F;
    margin-left: 19px;
  }

  img {
    height: 42px;
    width: 33px;
  }
  
  span {
    position: absolute;
    right: -13px;
    top: -12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #74CB4B;
    
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 20px;
    line-height: 120%;
    color: #FFFFFF;
  }
  
  &:hover {
    opacity: 0.7;
  }

  @media screen and (max-width: 386px) {
    padding: 13px 10px 13px 10px;
    width: 50%;

    p {
      font-size: 18px;
      margin-left: 5px;
    }
  }
`

export const Wrapper = styled.div<{ margin?: string, padding?: string }>`
  background-color: #fff;
  border-radius: 0 0 36px 36px;

  @media screen and (min-width: 743px) {
    border-radius: 0;
    width: 248px;
    height: 100%;
    box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.25);
    background: rgba(251, 251, 251, 0.95);
    padding-top: 96px;
  }

  @media screen and (min-width: 1280px) {
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 0;
    width: 290px;
    height: 100%;
    box-shadow: none;
    background: rgba(251, 251, 251, 0.95);
    margin-top: 0;
    padding: 0;
  }
`

export const Content = styled.div<{ margin?: string, padding?: string }>`
  max-width: 414px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 40px 25px 22px 25px;

  @media screen and (min-width: 743px) {
    padding: 25px 0;
    width: 248px;
    height: 100%;  

    display: Flex;
    flex-direction: column;

    label {
      margin: 20px auto 0 auto;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 0;
    width: 238px;
    height: 100%;  

    display: Flex;
    flex-direction: column;

    label {
      order: 3;
      margin: 52px auto 0 auto;
    }
  }
`

export const EffectText = styled.p`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin-top: 11px;
  color: #396D21;
`

export const RangeText = styled.p<{ margin?: string, size?: string }>`
  font-size: 20px;
  font-weight: 400;
  margin: ${({margin}) => margin || 0};
  text-align: center;
  line-height: 120%;
  color: #396D21;

  @media screen and (min-width: 743px) {
    font-size: 16px;
  }
`

export const RangeWrapper = styled.div`
  .range__text-center {
     margin-left: 25px;
  }

  @media screen and (min-width: 743px) {
    order: 1;
    margin-top: 32px;

    .range__text-wrapper {
      width: 200px;
      margin: 24px 24px 20px 30px;
      
      .range__text-center {
        margin-left: 8px;
      }
    }
  }

  @media screen and (min-width: 1280px) {
    margin-top: 43px;

    .range__text-center {
      margin-left: 6px;
    }

    .range__text-wrapper {
      width: 256px;
      margin: 24px auto 20px -2px;
    }
  }
`

export const EffectsWrapper = styled.div`
  margin-top: 40px;
  .effect {
    cursor: pointer;
    
  }
  
  @media screen and (min-width: 743px) and (max-width: 1279px) {
    position: relative;
    order: 0;
    
    p {
        margin: 0 0 6px 0;
    }

    div {
      display: flex;
      flex-direction: column;

      .effect {
        width: 115px;
        flex-direction: row;
        justify-content: flex-start;
        /* margin-bottom: 36px; */
        
        button {
          width: 37px;
          height: 37px;
          margin-right: 12px;
        }

        p {
          margin: 0;
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      /* left: -24px; */
      height: 1px;
      width: 248px;
      background: #49812F;
      opacity: 0.3;
    }
  }

  @media screen and (min-width: 1280px) {
    div {
      /* width: 238px; */
      .effect {
        
        button {
          width: 37px;
          height: 37px;
          /* margin-right: 12px; */
        }

        p {
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          margin-top: 6px;
        }
      }
    }
    
  }
`

export const Text = styled.p<{ margin?: string, size?: string }>`
  font-size: ${({size}) => size || '24px'};
  font-weight: 400;
  margin: ${({margin}) => margin || 0};
  text-align: center;
  line-height: 120%;
  color: #49812F;

  @media screen and (min-width: 743px) {
    font-size: 20px;
  }

  @media screen and (min-width: 1280px) {
    font-size: 22px;
    margin: 0 0 28px 0;
  }
`

export const Reset = styled.p`
  font-size: 20px;
  line-height: 120%;
  text-decoration-line: underline;
  cursor: pointer;
  color: #49812F;

  @media screen and (min-width: 743px) {
    order: 4;
    margin-top: 66px; 
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    color: #37751A;
    opacity: 0.9;
  }

  @media screen and (min-width: 1280px) {
    order: 4;
    margin-top: 30px; 
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    color: #37751A;
    opacity: 0.9;
  }
`

export const FilterTitle = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: center;
 button {
   margin-top: 2.5px;
 }
  img {
    font-weight: bold;
    font-size: 24px;
    line-height: 120%;
    text-transform: uppercase;
    color: #49812F;
    margin-right: 18px;
    
  }
  p {
    font-weight: bold;
    font-size: 24px;
    line-height: 120%;
    text-transform: uppercase;
    color: #49812F;
    margin-right: 18px;
  }
`