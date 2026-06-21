import styled from 'styled-components'

export const DialogueScroll = styled.div<{view?: string}>`
    overflow: auto;
    padding: 5px 0 10px 5px;
    height: calc(100vh - (var(--chatHeader) + 180px));
    flex-grow: 1;
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 4px;
        box-shadow: none;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(108, 172, 79, 0.4);
        border-radius: 5px;
    }

    
    @media screen and (min-width: 743px){
        height: calc(100vh - (var(--chatHeader) + 210px));
        background: #FFFFFF;
        box-shadow: 0px 3px 2px rgba(67, 86, 59, 0.2);
        padding: 12px 0 30px 0;
    }

    @media screen and (min-width: 1280px){
        /* padding: 12px 0 20px; */
        height: calc(100vh - (var(--chatHeader) + 170px));
    }
`


export const DialogueWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 17px;
    padding: 0 10px;
    

    @media screen and (min-width: 743px){
        gap: 14px;
        padding: 0 33px;
    }
    
    @media screen and (min-width: 1280px){
        gap: 14px;
        padding: 0 12px 0 25px;
    }
`

export const Customer = styled.div`
    padding: 14px 11px 9px 17px;
    background: #c4c4c433;
    border-radius: 12px;
    margin-left: 33px;
    width: calc(100% - 33px);
    display: flex;
    flex-direction: column;

    @media screen and (min-width: 743px){
        margin-left: 58px;
        width: calc(100% - 58px);
    }
`

export const DriverWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    /* gap: 14px; */

    img {
        align-self: flex-end;
        transform: translateX(-14px);
    }

    @media screen and (min-width: 743px){
        gap: 18px;
        img {
            transform: translateX(0px);
            height: 40px;
        }
    }
`
 
export const Driver = styled.div`
    background: #55b4284d;
    border-radius: 12px;
    padding: 13px 11px 9px 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 7px;

        p {
            font-weight: bold;
            font-size: 8px;
            line-height: 130%;
            text-transform: uppercase;
            color: #616A5C;
            opacity: 0.6;
        }
    }
`

export const Time = styled.span`
    font-weight: 600;
    font-size: 12px;
    line-height: 130%;
    color: #616A5C;
    opacity: 0.6;
    align-self: flex-end;
`

export const Date = styled.p`
    font-weight: bold;
    font-size: 14px;
    line-height: 120%;
    text-align: center;
    color: #616A5C;
    opacity: 0.8;

    @media screen and (min-width: 743px){
        font-size: 16px;
    }
`

export const Text = styled.p`
    font-size: 16px;
    line-height: 130%;
    color: #616A5C;
    opacity: 0.8;

    @media screen and (min-width: 743px) and (max-width: 1279px){
        font-size: 18px;
    }
`