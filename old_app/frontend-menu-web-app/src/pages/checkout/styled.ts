import styled from "styled-components";

export const Header = styled.div<{margin?: string}>`
  width: 280px;
  height: 51px;
  background: linear-gradient(0deg, #6CAC4F, #6CAC4F);
  box-shadow: 0 3px 2px 0 #6cac4f85;
  opacity: 0.9;
  border-radius: 0 0 34px 34px;
  text-align: center;
  padding-top: 10px;
  margin: 0 auto;

  font-weight: 600;
  font-size: 24px;
  line-height: 120%;
  color: #FFFFFF;

  @media screen and (min-width: 743px) {
    display: none;
  }
`

export const SubText = styled.p<{margin?: string, color?: string, size?: string}>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: ${({size}) => size || '20px'};
  color: ${({color}) => color || '#3A6426'};
  opacity: 0.9;
`

export const Text = styled.p<{margin?: string, color?: string, size?: string}>`
  font-weight: 600;
  font-size: ${({size}) => size || '16px'};
  line-height: ${({size}) => size || '18px'};
  color: ${({color}) => color || '#37751A'};
  opacity: 0.6;
`

export const Wrapper = styled.div<{margin?: string}>`
  //width: 360px;
  margin: 0 auto;
  // padding: 0 12px;
`

export const Button = styled.button<{ width?: string}>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  font-size: 24px;
  line-height: 100%;
  padding: 18px;
  color: #FFFFFF;
  width: ${({width}) => width};
  opacity: 0.9;
  
  transition: 0.3s;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.3;
  }
  
  img {
    margin-right: 16px;
  }

  @media screen and (max-width: 390px) {
      img {
        margin-right: 13px;
      }
    }
`