import {Link} from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div<{padding?: string}>`
  height: 100%;
  display: flex;
  flex-direction: column; 
  justify-content: flex-end;
  width: 100%;
  padding:  ${({padding}) => padding};
`

export const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: translateX(0);
  visibility: visible;
  opacity: 1;
  transition: 0.3s 0.2s;
  padding-bottom: 100px;

  &.hide {
    transform: translateX(-120%);
    visibility: hidden;
    opacity: 0;
    transition: 0.3s 0s;
  }

  &:last-child {
    border: none;
  }

  @media screen and (min-width: 743px){
    /* width: 193px; */
    margin-top: 26px;
    padding-bottom: 0;
    background: #c4c4c41a;
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
  }

  @media screen and (min-width: 1280px){
    display: flex;
    width: 291px;
    margin-top: 0;
    padding-bottom: 0;
    background: #FFFFFF;
    border-radius: 0px 36px 36px 0px;
    overflow: hidden;
    justify-self: start;
    box-shadow: 0px 2.5px 5px rgba(73, 129, 47, 0.1);
  }
`

export const Item = styled(Link)`
  font-weight: 600;
  font-size: 30px;
  line-height: 120%;
  color: #445A3B;
  opacity: 0.9;
  
  padding: 24px;
  text-align: center;
  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #fff;
    background-color: #37751a33;
  }

  @media screen and (min-width: 743px){
    font-size: 24px;
    padding: 37px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #00000026;
    }

    border-left: 1px solid #00000026;
    

    &:hover {
      color: #445A3B;
      background-color: #c4c4c44d;
      opacity: 0.6;
    }
  }

  
  
  @media screen and (min-width: 1280px){
    padding: 37px 0;
    width: 209px;
    margin: 0 auto;

    border-left: none;
    &:hover {
      background-color: transparent;
    }
  }
`

export const ItemDisabled = styled(Link)`
  font-weight: 600;
  font-size: 30px;
  line-height: 120%;
  color: #445A3B;
  opacity: 0.5;

  padding: 24px;
  text-align: center;
  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #fff;
    background-color: #37751a33;
  }

  @media screen and (min-width: 743px){
    font-size: 24px;
    padding: 37px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #00000026;
    }

    border-left: 1px solid #00000026;


    &:hover {
      color: #445A3B;
      background-color: #c4c4c44d;
      opacity: 0.6;
    }
  }



  @media screen and (min-width: 1280px){
    padding: 37px 0;
    width: 209px;
    margin: 0 auto;

    border-left: none;
    &:hover {
      background-color: transparent;
    }
  }
 
`

export const Header = styled.div`
  position: absolute;
  top: 0;

  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 82px;
  padding: 18px;
  background-color: #F3F3F3;
`

export const Logo = styled(Link)`

`

export const InfoLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1.8px solid #49812F;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 11px 14px 10px 10px;
  font-weight: 400;
  width: 103px;
  height: 50px;
  font-size: 26px;
  line-height: 120%;
  color: #49812F;
  transition: 0.3s;

  &:hover {
    opacity: 0.7;
  }

  img {
    margin-right: 10px;
  }
`