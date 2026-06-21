import styled from "styled-components";

export const Content = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 24px;
  width: 336px;
  margin: 0 auto;
  overflow: hidden;

  /* @media screen and (min-width: 743px) {
    max-width: 343px;
  } */

  @media screen and (min-width: 743px) {
   width: 370px;
    background: #F8F8F8;
    border-radius: 32px;
    margin-bottom: 35px;
    max-height: 231px;
  }

  /* @media screen and (min-width: 1280px) {
    width: 370px;
    background: #F8F8F8;
    border-radius: 32px;
    margin-bottom: 35px;
    max-height: 231px;
  } */
`

export const ContentWrapper = styled.div`
  @media screen and (min-width: 743px) {
    width: 100%;
    max-height: 156px;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 4px;
      /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); */
      box-shadow: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #e7e7e7ab;
      border-radius: 5px;
    }
  }
`

export const AddAddress = styled.button`
  font-weight: bold;
  font-size: 16px;
  line-height: 120%;
  color: #3A6426;
  background-color: #5ba03b85;
  width: 100%;
  opacity: 0.7;
  padding: 24px 0;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.6;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 9px;
  }

  @media screen and (min-width: 743px) {
    font-size: 20px;

    img {
      margin-right: 14px;
      width: 24px;
      height: 24px;
    }
  }
`

export const AddressInput = styled.input`
  width: 100%;
  background: #F7F7F7;
  border: 2px solid rgba(217, 217, 217, 0.3);
  box-sizing: border-box;
  border-radius: 12px;
  padding: 17px 22px;
  margin-top: 18px;
  font-size: 16px;
  line-height: 120%;
  font-weight: 500;
  color: #616A5C;
  opacity: 0.7;
  height: 53px;
  width: 292px;
  
  @media screen and (min-width: 743px) {
    width: 366px;
    height: 60px;
    font-size: 18px;
    padding: 19px 24px;
    margin: 18px auto 0 auto;
    border-radius: 13.8214px;
    
    &.instruction {
      height: 96px;
      padding: 19px 24px 54px;
    }
  }
`
export const ChangeAddressText = styled.p`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  width: 272px;

  @media screen and (min-width: 743px) {
    font-size: 18px;
    text-align: center;
    width: 344px;
    margin: 0 auto 10px auto;
  }
`
export const AddressContainer = styled.div`
  @media screen and (min-width: 743px) {
    width: 430px;
    padding: 28px 31px 12px;
    background: #FFF;
    box-shadow: 0px 2.50877px 5.01754px rgba(73, 129, 47, 0.1);
    border-radius: 30.1053px;
  }
`

export const ActionButton = styled.button<{ margin?: string }>`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  text-decoration-line: underline;
  color: #616A5C;
  width: 100%;
  margin: ${({margin}) => margin || '70px 0 0 0'};

  @media screen and (min-width: 743px) {
    margin: 30px 0 0 0;
    font-size: 18px;
  }
`

export const SubText = styled.p<{ margin?: string, color?: string, size?: string }>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: ${({size}) => size || '20px'};
  color: ${({color}) => color || '#3A6426'};
  /* opacity: 0.9; */
  margin: 0 9px 0 0;

  @media screen and (min-width: 743px) {
    font-size: 20px;
  }
`

export const Numbers = styled.p<{ margin?: string, color?: string, size?: string }>`
  font-weight: 600;
  font-size: ${({size}) => size || '18px'};
  line-height: ${({size}) => size || '20px'};
  color: ${({color}) => color || '#3A6426'};
  margin: 0 9px 0 0;
  width: 20px;
  text-align: right;

  @media screen and (min-width: 743px) {
    font-size: 20px;
    width: 25px;
  }
`

export const FlexContainer = styled.div`
  display: flex;
  padding: 17px 24px;

  @media screen and (min-width: 743px) {
     padding: 21px 28px;
  }

  @media screen and (min-width: 1280px) {
     padding: 18px 18px 18px 32px;
  }
`

export const Instructions = styled.div<{ margin?: string, color?: string, size?: string }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  color: ${({color}) => color || '#616A5C'};
  margin: 5px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 255px;
  white-space: nowrap;
  opacity: 0.6;

  @media screen and (min-width: 743px) {
    margin: 4px 0 0 0;
    width: 251px;
  }
`

export const Text = styled.p<{margin?: string}>`
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: 18px 0 24px 0;

  span {
    font-weight: 700;
  }

  @media screen and (min-width: 743px) {
    margin: 0 0 24px 0;
    font-size: 18px;
    line-height: 130%;
  }
`