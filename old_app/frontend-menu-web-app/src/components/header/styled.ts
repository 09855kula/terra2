import { Link } from 'react-router-dom';
import styled from "styled-components";

export const Wrapper = styled.div<{color?: string, position?: string}>`
  position: ${({position}) => position || 'fixed'};
  top: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  padding: 5px;
  background: ${({color}) => color ? 'linear-gradient(92.28deg, #6CAC4F 0%, #84BC6B 98.72%)' : '#F3F3F3'};

  @media screen and (min-width: 743px) {
      &.mobile__header {
          display: none;
      }
      z-index: 102;
      padding: 5px 3px 5px 0;
      background: rgba(251, 251, 251, 0.95);
  }

  @media screen and (min-width: 824px) {
      padding: 24px 12px 24px 12px;
  }

  @media screen and (min-width: 1080px) {
      padding: 24px 31px; 
  }

  @media screen and (min-width: 1280px) {
      padding: 28px 32px 28px 35px; 
      background: transparent;  
  }
`

export const LogoTitle = styled.h4`
    font-weight: 600;
    font-size: 32px;
    line-height: 120%;
    color: #3B6B26; 
    opacity: 0.9;
    margin: 0 41px 0 17px;

    @media screen and (max-width: 1279px) { 
        display: none
    }
`

export const Logo = styled(Link)`
  @media screen and (min-width: 743px) {
    display: none;
  }

  @media screen and (min-width: 824px) {
    display: block;
    height: 26px;

    img, button {
        width: 80px;
        height: 26px;
    }
  }
  
  @media screen and (min-width: 1080px) {
    height: 38px;
    
    img, button {
        width: 120px;
        height: 38px;
    }
  }
`

export const ListWrapper = styled.div<{isCat?: boolean}>`
    position: relative;
    display: none;
    width: 100%;
    padding-top: 5px;
    padding-left: 24px;

    @media screen and (min-width: 743px) {
        display: block;
    }
    
    @media screen and (min-width: 824px) { 
        padding-left: 14px;
    }

    @media screen and (min-width: 1280px) {
        padding-left: 30px;
        
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: -2px;
            height: ${({isCat}) => isCat ? '74px' : '44px'};
            width: 1px;
            background: #49812F;
            opacity: 0.3;
        }
    }
`

export const List = styled.ul`
  width: 100%;
  padding-right: 24px;
  display: flex;
  justify-content: space-between;

  &.category {
    position: absolute;
    top: 0;
    justify-content: flex-start;
    margin-top: 24px;
    opacity: 0;
    transition: 0.4s;

    &.active {
        top: 24px;
        opacity: 1;
    }

    li + li {
        margin-left: 50px;
    }
  }
  
  li {
    font-weight: 400;
    font-size: 20px;
    line-height: 120%;
    color: #3B6B26;
    cursor: pointer;
    transition: 0.2s;

    &.active {
        font-weight: 700 ;
    }
    &::after {
        display:block;
        content: attr(title);
        font-weight: 700;
        height:1px;
        color:transparent;
        overflow:hidden;
        visibility:hidden;
        margin-bottom:-1px;
    }
  }
    @media screen and (min-width: 1080px) {
        li {
            font-size: 24px;
        }
    }

    @media screen and (min-width: 916px) { 
        li {
            font-size: 22px;
        }
    }

    @media screen and (min-width: 1080px) {
        li {
            font-size: 24px;
        }
    }
`

export const Title = styled.h3<{color?: string}>`
  font-size: 32px;
  line-height: 120%;
  color: ${({color}) => color || '#FFFFFF'};

    @media screen and (max-width: 400px) { 
        width: 200px;
        overflow:hidden;
        display:inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

export const Info = styled(Link)<{color?: string}>`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1.8px solid ${({color}) => color};
  backdrop-filter: blur(8px);
  font-weight: 400;
  border-radius: 12px;
  padding: 11px 14px 10px 10px;
  width: 103px;
  height: 50px;
  font-size: 26px;
  line-height: 120%;
  color: ${({color}) => color};
  transition: 0.3s;

  &:hover {
    opacity: 0.7;
  }

  img {
    margin-right: 10px;
  }
`

