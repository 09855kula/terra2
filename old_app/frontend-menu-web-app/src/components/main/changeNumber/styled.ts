import { BackButton } from '../../common'
import styled from 'styled-components'

export const Wrapper = styled.div<{ width?: string, direction?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  min-height: calc(100vh - 82px); /* Fallback for browsers that do not support Custom Properties */
  min-height: calc((var(--vh, 1vh) * 100) - 82px);

  @media screen and (min-width: 743px) {
    min-height: 100%;
  }

  @media screen and (min-width: 1280px) {
    transform: translateY(-54px);
  }
`

export const Container = styled.div<{ width?: string, direction?: string }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;

  @media screen and (min-width: 743px) {
    width: 430px;
    height: 306px;
    background: #FFFFFF;
    box-shadow: 0px 2.50877px 5.01754px rgba(73, 129, 47, 0.1);
    border-radius: 30.1053px;
    padding: 0 18px 8px 18px;
  }
`

export const Title = styled.div<{ margin?: string }>`
  font-weight: 600;
  font-size: 28px;
  line-height: 120%;
  opacity: 0.8;
  color: #2F521F;

  margin: ${props => props.margin};

  @media screen and (min-width: 743px) {
    h3 {
      font-size: 24px;
      color: #FFFFFF;
    }
    
    margin: 0 auto;
    padding-top: 12px;
    width: 370px;
    height: 54px;
    background: linear-gradient(113.41deg, rgba(91, 160, 59, 0.6) 21.91%, rgba(36, 115, 0, 0.6) 88.74%);
    border-radius: 36px 36px 0px 0px;
  } 
`

export const Text = styled.p<{ margin?: string }>`
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  color: #616A5C;
  margin: 25px 0 25px 0;
  opacity: 0.8;

  @media screen and (min-width: 743px) {
    margin: 29px 0 29px 0;
    font-size: 18px;
  }
`
export const Button = styled.button<{ margin?: string }>`
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  width: 264px;
  padding: 18px;
  font-size: 24px;
  line-height: 120%;
  color: #FFFFFF;
  opacity: 0.8;
  transition: 0.3s;
  margin: 37px 0 0 0;

  &:hover {
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.5;
  }
`

export const Input = styled.input<{ font?: string}>`
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  width: 100%;
  font-size: ${({size}) => size || '20px'};
  line-height: 120%;
  color: #616A5C;
  padding: 18px;
  text-align: center;
  opacity: 0.8;
  outline: none;
  width: 264px;

  @media screen and (min-width: 743px) {
    width: 360px;
    border: 2.30357px solid rgba(217, 217, 217, 0.3);
    border-radius: 13.8214px;
    font-size: 18px;
    opacity: 0.7;
    text-align: left;
  }
`

export const DefaultButton = styled(BackButton)`
    border-radius: 18px;
    font-size: 24px;
    width: ${({width}) => width || '133px'};
    padding: 17px 25px;
    height: 64px;

    &disabled {
        background: rgba(39, 122, 0, 0.65);
        opacity: 0.3;
    }
    
    img {
        height: 18px;
        margin-right: 16px;
    }
    @media screen and (max-width: 390px) {
      img {
        margin-right: 13px;
      }
    }
    
`