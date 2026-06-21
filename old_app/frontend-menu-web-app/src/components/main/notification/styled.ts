import styled from "styled-components";

export const NotiText = styled.p<{welcome?: boolean}>`
  font-weight: 600;
  font-size: 20px;
  line-height: 120%;
  color: #414F3B;
  opacity: 0.9;
  margin-bottom: ${({welcome}) => welcome ? '24px' : '18px'};

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  
  span {
    font-weight: 500;
    font-size: 12px;
    color: #616A5C;
    margin-left: 7px;
  }

  @media screen and (min-width: 743px){
    font-size: ${({welcome}) => welcome ? '24px' : '20px'};

    span {
        font-size: 16px;
    }
  }

  @media screen and (min-width: 1280px){
    font-size: 24px;

    span {
        font-size: 16px;
    }
  }
`

export const MoreText = styled.p`
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  width: 297px;
  height: 48px;
  font-size: 16px;
  line-height: 120%;
  color: #616A5C;
  opacity: 0.8;
  padding: 13px 15px;
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;
`

export const NotiSubText = styled.p<{welcome?: boolean}>`
  font-size: ${({welcome}) => welcome ? '16px' : '18px'};
  line-height: 120%;
  color: #616A5C;
  opacity: 0.8;
  .btn__refer-copy {
    background: #72A859;
    border-radius: 44px;
    font-weight: 800;
    font-size: 20px;
    line-height: 120%;
    color: #FFFFFF;
    padding: 11px;
    height: 48px;
    width:  186px;
    transition: 0.3s;
    margin-top: 20px;
    transform: translateY(-24px);
&:disabled {
  opacity: 0.4;
}

    &:hover {
      //opacity: 0.7;
    }
  }
  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px){
    font-size: ${({welcome}) => welcome ? '16px' : '20px'};
  }

  @media screen and (min-width: 1280px){
    font-size: ${({welcome}) => welcome ? '18px' : '22px'};
  }
`

export const Content = styled.div<{margin?: string, padding?: string}>`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  padding: 22px 20px 17px;
  padding-bottom: ${({padding}) => padding || '17px'};
  width: 342px;
  margin: 40px auto 0 auto;

  @media screen and (min-width: 743px){
    margin: 0;
    /* grid-area: Notification; */
    width: 344px;
    padding: 22px 20px 24px;
    padding-bottom: ${({padding}) => padding || '24px'};
  }

  @media screen and (min-width: 1280px){
    margin: 0;
    /* grid-area: Notification; */
    width: 421px;
  }
`

export const Wrapper = styled.div<{margin?: string}>`  
  @media screen and (min-width: 743px){
    grid-area: Notification;
  }

  //@media screen and (min-width: 1280px){
  //    width: 33%;
  //    display: flex;
  //    justify-content: flex-end;
  //    /* align-items: center; */
  //}

`

export const Container = styled.div<{margin?: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`


export const Button = styled.button<{width?: string, opacity?: number}>`
  background: #72A859;
  border-radius: 44px;
  font-weight: 800;
  font-size: 20px;
  line-height: 120%;
  color: #FFFFFF;
  padding: 11px;
  height: 48px;
  width: ${({width}) => width || '186px'};
  transition: 0.3s;
  opacity:  ${({opacity}) => opacity || 0.9};
  transform: translateY(-24px);

  &:hover {
    opacity:  ${({opacity}) => opacity || 0.7};
  }
`