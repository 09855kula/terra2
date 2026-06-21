import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    position: relative;
    max-width: 688px;
    width: 100%;
    margin: 0 auto;
    background: #c4c4c433;
    border-radius: 12px;
    padding: 70px 24px 10px 24px;
    margin-bottom: 15px;
    min-height: 148px;
    overflow: hidden;

    p {

        font-size: 14px;
        line-height: 120%;
        text-align: center;
        color: #616A5C;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
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

    @media screen and (min-width: 743px){
        padding: 76px 24px 32px 24px;
        margin-bottom: 0;

        p {
            text-align: left;
            font-size: 18px;
            line-height: 140%;
        }
    }

    @media screen and (min-width: 1280px){
        background: none;
        width: 484px;
        padding: 0;
        min-height: 50px;
        p, p.active {
            display: none;
        }
    }
    
`

export const HeaderToggleWrapper  = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: #8DB979;
    opacity: 0.9;
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 6px;
    display: flex;
    justify-content: space-between;
    z-index: 10;

    
    @media screen and (min-width: 743px) and (max-width: 1279px){
        height: 54px;
    }
`

export const Toggle  = styled.button<{isCustomer?: boolean, noOrders?: boolean, indicate?: boolean}>`
    background: transparent;
    opacity: 0.8;
    border-radius: 8px;
    width: ${({isCustomer}) => isCustomer ? '49%' : '47%'};
    transition: 0.4s;

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active {
        background: #49812F;
    }

    ${({noOrders}) => noOrders && {
        width: '100%',
        background: '#49812F'
    }};
    
    span {
        position: relative;
        font-weight: bold;
        font-size: 17px;
        line-height: 100%;
        color: #FFFFFF;
        
        ${({indicate}) => indicate && {
            
        }}
        &:before {
            content: '';
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            right: -13px;
            top: -3px;
            background: #FBFF28;
            opacity: ${({indicate}) => indicate ? '0.9': 0};
        }
    }

    @media screen and (min-width: 743px) and (max-width: 1279px){
        span {
            font-size: 20px;
        }
    }

    @media screen and (max-width: 390px){
        span {
            font-size: 14px;
            &:before {
                right: -8px;
            }
        }
    }
`

