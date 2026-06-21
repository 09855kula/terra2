import { Link } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import styled from 'styled-components'

export const WrapperNoWork = styled.div<{ width?: string}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  
  div {
    max-width: 320px;
    text-align: center;
  }
  
`

export const Wrapper = styled.div<{ width?: string, direction?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  
  div {
    max-width: 320px;
    text-align: center;
  }
`

export const Title = styled.h4<{ margin?: string }>`
  font-weight: 600;
  font-size: 28px;
  line-height: 120%;
  opacity: 0.8;
  color: #2F521F;

  margin: ${props => props.margin};
`

export const Refer = styled.p<{ margin?: string }>`
  margin-top: 41px;
  .nav__link {
    width: 213px;
    height: 21px;
    left: 81px;
    top: 603px;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    /* identical to box height, or 21px */

    text-align: center;
    text-decoration-line: underline;

    color: #616A5C;
  }
`
export const Text = styled.p<{ margin?: string }>`
  font-size: 16px;
  white-space: pre-wrap;
  line-height: 130%;
  text-align: center;
  color: #616A5C;
  margin: ${props => props.margin || '14px 0 18px 0'};
  opacity: 0.8;
`
export const InputCode = styled(ReactCodeInput)`
  display: flex !important;
  justify-content: space-between;
  width: 100%;

  input {
    width: 72px;
    height: 72px;
    background: #FFFFFF;
    border: 2px solid rgba(217, 217, 217, 0.3);
    border-radius: 12px;
    font-weight: bold;
    font-size: 36px;
    line-height: 120%;
    color: #616A5C;
    opacity: 0.8;
    text-align: center;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type=number] {
      -moz-appearance: textfield;
    }
  }
`

export const Logout = styled.button`
  font-size: 16px;
  line-height: 130%;
  
  text-align: center;
  text-decoration-line: underline;
  color: #616A5C;
  opacity: 0.8;
`

export const Block = styled.div`
  width: 279px;
  height: 62px;
  padding: 10px 16px;
  background: #FFFFFF;
  margin: 27px auto 0 auto;
  opacity: 0.8;
  border-radius: 8px;
  display: flex;
  align-items: center;
`
