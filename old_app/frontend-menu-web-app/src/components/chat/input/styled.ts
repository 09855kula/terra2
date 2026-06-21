import styled from 'styled-components'

export const InputWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 56px;
    background: #FFFFFF;
    padding: 10px 23px 10px 15px;
    box-shadow: 0px -4px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center; 

    .chat__image-btn {
        margin-right: 18px;
        label {
            cursor: pointer;
        }
        input {
            opacity: 0;
            position: absolute;
            z-index: -1;
        }
    }

    button:hover {
        transition: 0.3s;
        opacity: 0.7;
        transform: scale(0.95);
    }

    .chat__send-btn {
        margin-left: 16px;
        transition: 0.5s;
        max-width: 24px;
        transform: translateX(200px);
        opacity: 0;
        position: absolute;
        right: 0;
        

        &.active {
            transform: translateX(0);
            opacity: 1;
            width: 100%;
            position: relative;
        }

        &:active {
            transform: scale(0.85);
        }
    }

    @media screen and (min-width: 743px) {
        height: 68px;
        padding: 12px 31px 12px 16px;
        
        .chat__image-btn {
            margin-right: 21px;
        }
    }

    @media screen and (min-width: 1280px) {
        position: relative;
        height: 60px;
        padding: 12px 25px 12px 16px;
        width: 484px;
        margin: 0 auto;

        .chat__image-btn {
            margin-right: 18px; 
        }

        .chat__send-btn, .chat__image-btn{
            img {
                height: 28px;
            }
        }
    }
`

export const Input = styled.input`
    width: 100%;
    height: 36px;
    border: 2px solid #47753233;
    border-radius: 20px;
    font-size: 14px;
    line-height: 130%;
    color: #616a5c80;
    padding: 9px 18px 9px 16px;
    transition: 0.4s;

    &::placeholder {
        color: #616a5c80;
    }

    display: block;
    max-width: 98%;
    white-space: nowrap;
    overflow: hidden ;
    text-overflow: ellipsis;

    &:focus {
        border: 2px solid #49812f8a;
        color: #2a5814b3;
        /* &::placeholder {
            color: #2a5814b3;
        } */
    }


    @media screen and (min-width: 743px) and (max-width: 1279px) {
        height: 44px;
        font-size: 18px;
        padding: 10px 22px;
    }

    @media screen and (min-width: 1280px) {
        padding: 9px 13px;
    }
    
`
