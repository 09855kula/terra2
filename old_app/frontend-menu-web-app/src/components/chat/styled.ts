import styled from 'styled-components'
import {Link} from "react-router-dom";

export const Wrapper = styled.div`

    @media screen and (min-width: 1280px){
        flex-grow: 1;
    }
`

export const Plug = styled.div`
    width: 300px;
    margin: 100px auto 0 auto;
    text-align: center;

    h5 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
    }
    span {
        font-size: 18px;
    }

    a {
        color: blue;
    }

    @media screen and (min-width: 743px){
        width: 400px;
        h5 {
        font-size: 27px;
        span {
            font-size: 22px;
        }
    }
    }

    
`

export const ChatWrapper = styled.div`
    margin: 20px auto 0 auto;
    padding: 0 12px;
    max-width: 700px;

    @media screen and (min-width: 1280px){
        position: relative;
        background: none;
        width: 484px;
        padding: 0;
        margin: 0 auto 0 52px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        height: calc(100vh - 112px); /* Fallback for browsers that do not support Custom Properties */
        height: calc((var(--vh, 1vh) * 100) - 112px);
    }
`
export const Title = styled.h3<{color?: string}>`
  text-align: center;
  font-size: 100px;
  line-height: 120%;
  color:  #37751A;

`

export const InfoText = styled.h5`
  text-align: center;
  font-weight: 400;
  font-size: 26px;
  line-height: 120%;
  color: #37751A;

`
export const Notification = styled.div`
    width: 402px;
    /* height: 232px; */
    margin-top: 50px;
    background: #c4c4c433;
    box-shadow: inset 0px 1px 12px rgba(0, 0, 0, 0.15);
    border-radius: 12px 0 0 12px;
    padding: 25px 35px 28px 32px;
    position: absolute;
    top: 152px;
    right: 0;
    margin: 0;
    display: none;
    overflow: hidden;
    transition: 0.4s 1s;
    z-index: -1;

    p {

        font-size: 18px;
        line-height: 140%;
        color: #616A5C;
        opacity: 0;
        position: absolute;
        top: 0;
        z-index: -100;
        transform: translateY(-120%);
        transition: 0.4s;
        max-width: 516px;
        margin: 0 auto;

        span {
            font-weight: 700;
        }

        &.active {
            position: relative;
            transition: 0.5s 0.3s;
            opacity: 0.8;
            transform: translateY(0);
            z-index: 1;
        }
    }

    @media screen and (min-width: 1280px){
        
        display: block;
    }
`