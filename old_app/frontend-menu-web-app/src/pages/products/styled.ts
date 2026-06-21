import { Link } from "react-router-dom";
import styled from "styled-components";

export const Layout = styled.ul`
  display: grid;
  grid-template-columns: 1fr;

  @media screen and (min-width: 743px) {
    grid-template-columns: repeat(2, minmax(290px, calc((100% - 31px) / 2)));
    align-items: start;
    justify-items: center;
    margin-top: 61px;
    /* padding: 0 31px 0 0; */
    grid-gap: 44px 8.5px;
  }

  @media screen and (min-width: 1080px) { 
      grid-template-columns: repeat(3, minmax(290px, calc((100% - 51px) / 3)));
    
  }

  @media screen and (min-width: 1280px) { 
      grid-template-columns: repeat(3, minmax(290px, calc((100% - 51px)/ 3)));
      justify-items: start;
      
      li {
        margin: 0;
      }
  }

  @media screen and (min-width: 1600px) { 
      grid-template-columns: repeat(4, minmax(290px, calc((100% - 82px) / 4)));
  }
`

export const LayoutFree = styled.ul`
  display: grid;
  grid-template-columns: 1fr;

  @media screen and (min-width: 743px) {
    grid-template-columns: repeat(2, minmax(290px, calc(100% / 2)));
    align-items: start;
    justify-items: center;
    margin-top: 61px;
    /* padding: 0 31px 0 0; */
    grid-gap: 44px 8.5px;
  }

  @media screen and (min-width: 1080px) { 
      grid-template-columns: repeat(3, minmax(290px, calc(100% / 3)));
  }

  @media screen and (min-width: 1280px) { 
      grid-template-columns: repeat(3, minmax(290px, calc(100%/ 3)));
  }

  @media screen and (min-width: 1600px) { 
      grid-template-columns: repeat(4, minmax(290px, calc(100% / 4)));
  }
`

export const ReadMore = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 120%;
  text-decoration-line: underline;
  color: #3E6D28;
  opacity: 0.7;
  cursor: pointer;

  @media screen and (min-width: 743px) { 
      display: none;
  }
`

export const ContentWrapper = styled.div`
    width: 100%;
    margin: 0 auto;

    @media screen and (min-width: 743px) {
        /* padding-left: 100px; */
        margin-right: 31px;
    }

    @media screen and (min-width: 1280px) {
        padding-left: 321px;
        margin-right: 51px;

        &:after {
          content: '';
          position: absolute;
          top: 175px;
          left: 291px;
          height: 100%;
          width: 1px;
          background: #49812f4d;
        }
    }
`

export const Container = styled.div`
    padding: 0 15px;
  
    div:first-child {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    @media screen and (min-width: 743px) {
      /* padding: 31px 0 0 0; */
      margin: 31px auto 0 5%;
      width: 591px;
    }

    @media screen and (min-width: 1280px) {
      width: 678px;
      margin: 76px auto 0 0;
    }
`

export const Description = styled.div`
    overflow: hidden;

    p {
        font-weight: 400;
        word-break: break-word;
        font-size: 18px;
        text-align: left;
        line-height: 120%; 
        color: #254615;
        opacity: 0.9;
        transition: 0.4s;
        margin-top: 11px;
        

        &.desktop {
            display: none;
            white-space: wrap;

            span {
                font-size: 16px;
                line-height: 120%;
                text-decoration: underline;
                color: #3E6D28;
                cursor: pointer;
                margin-left: 5px;
            }
        }
    }

    @media screen and (min-width: 743px) {
        overflow: auto;

        p {
            display: none;

            &.desktop {
                display: block;
                font-size: 16px;
                line-height: 150%; 
                margin-top: 17px;
                
            }
        }
    }

    @media screen and (min-width: 1080px) {
        p.desktop {
          font-size: 18px;
          span {
                font-size: 18px;
            }  
        }
    }

    @media screen and (max-width: 743px) {
        &.hide { 
            p {
                transition: 0.4s;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden; 
                white-space: nowrap;
            }
        }
        &.show {
            p {
                transition: 0.4s;
                white-space: wrap;
            
            }
            height: 100%;
        } 
    }
`

export const ProductTitle = styled.h3<{color?: string}>`
  font-weight: 400;
  font-size: 32px;
  line-height: 120%;
  color: #37751A;
  opacity: 0.9;

  @media screen and (max-width: 400px) { 
        width: 200px;
        overflow:hidden;
        display:inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
  }

  @media screen and (min-width: 743px) {
    font-size: 36px;
  }
`

export const Title = styled.h3<{color?: string}>`
  font-size: 32px;
  line-height: 120%;
  color: ${({color}) => color || '#FFFFFF'};
`

export const BackBtn = styled.button`
  font-size: 18px;
  line-height: 120%;
  text-decoration: underline;
  color: #3E6D28;
  margin-left: 30px;
`

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 380px;
  margin: 10px auto 0 auto;

  @media screen and (min-width: 743px) {
    margin: 50px auto 0 auto;
  }
`

export const WrapperFree = styled.div`
  position: relative;
  padding-top: 90px;
  padding-bottom: 100px;

  @media screen and (max-width: 743px) {
      &:after {
        content: '';
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 110px;
        background: linear-gradient(0deg, rgba(23, 45, 13, 0.2) 36.85%, rgba(255, 255, 255, 0) 100%);
      }
  }
`

export const TabletWrapper = styled.div`
  top: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 190px);
  height: calc((var(--vh, 1vh) * 100) - 190px);
  width: 100px;

`

export const Wrapper = styled.div`
  position: relative;
  padding-top: 90px;
  padding-bottom: 100px;

  @media screen and (max-width: 743px) {
          
      &:after {
        content: '';
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 110px;
        background: linear-gradient(0deg, rgba(23, 45, 13, 0.2) 36.85%, rgba(255, 255, 255, 0) 100%);
      }
  }

  @media screen and (min-width: 743px) {
      display: flex;
  }

  @media screen and (min-width: 1280px) {
      display: flex;
      min-height: 100vh;
      min-height: calc(var(--vh, 1vh) * 100);
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