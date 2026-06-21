import styled from "styled-components";

export const RoutesText = styled.p`
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: 18px 0 0 0;
`

export const Content = styled.ul`
  background: #FFFFFF;
  box-shadow: 0px 2px 4px rgba(73, 129, 47, 0.1);
  border-radius: 0px 0px 24px 24px;
  width: 312px;
  left: 24px;
  top: 244px;
  margin: 0 auto;

  @media screen and (min-width: 743px) {
    width: 312px;
    height: 372px;
    padding-top: 17px;
  }
`
export const ContentTablet = styled.ul`
  width: 430px;
  //height: 368px;
  left: 142px;
  top: 165px;
  background: #FFFFFF;
  box-shadow: 0px 2.50877px 5.01754px rgba(73, 129, 47, 0.1);
  border-radius: 30.1053px;


`
export const ContentHeader = styled.div`
  background: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 32px 32px 0 0;
  width: 312px;
  height: 42px;
  left: 24px;
  top: 202px;
  margin: 0 auto;
  opacity: 0.6;

  @media screen and (min-width: 743px) {
    width: 312px;
    height: 42px;
    padding-top: 17px;
  }
`

export const ContentHeaderTablet = styled.div`
  width: 430px;
  height: 40px;
  left: 142px;
  top: 244px;
  background: #F3F3F3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

export const ContentHeaderDay = styled.div`
  width: 29px;
  height: 19px;
  padding-left: 11px;
  left: 38px;
  top: 213px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
`
export const ContentHeaderDayTablet = styled.div`
  width: 110px;
  height: 17px;
  left: 184px;
  top: 255px;
  margin-right: 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  
`
export const ContentHeaderTimeslot = styled.div`
  width: 64px;
  height: 19px;
  left: 146px;
  top: 213px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
`

export const ContentHeaderTimeslotTablet = styled.div`
  width: 56px;
  height: 17px;
  left: 267px;
  top: 255px;
  padding-left: 10px;
  margin-right: 30px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
`

export const ContentHeaderCutoff = styled.div`
  width: 50px;
  height: 19px;
  left: 258px;
  top: 213px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
`

export const ContentHeaderCutoffTablet = styled.div`
  width: 44px;
  height: 17px;
  left: 350px;
  top: 255px;
  margin-right: 30px;
  padding-left: 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
`
export const Block = styled.div`
  margin-top: 20px;

  @media screen and (min-width: 743px) {
    margin-top: 0;
    z-index: 103;
  }
`

export const AnotherAddress = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  text-decoration-line: underline;
  color: #616A5C;
  opacity: 0.8;
  margin-top: 18px;
  width: 100%;
  cursor: pointer;
`
export const TextBox = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

`
export const Italic = styled.p`
  //height: 80px;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;
  margin: 10px 0 24px 0;
  &.inner {
    display: none;
  }
  @media screen and (min-width: 743px) {
    margin: 0;
    display: none;
    &.inner {
      display: block;
    }
  }

`

export const ItalicTablet = styled.p`
  width: 278px;
  height: 46px;
  left: 218px;
  top: 182px;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;

  &.inner {
    display: none;
  }

  //@media screen and (min-width: 1280px) {
  //  margin: 0;
  //  display: none;

    &.inner {
      display: block;
    }
  }

`

export const TextAround = styled.p`
  width: 310px;
  height: 42px;
  left: 25px;
  top: 139px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  color: #616A5C;
  opacity: 0.8;

`
export const Route = styled.li`
  height: 64px;
  display: flex;
  align-self: center;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }

  @media screen and (min-width: 743px) {
    p {
      line-height: 160%;
    }
  }
`
export const RouteSpanCutoff = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 94px;
  height: 62px;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  color: #616A5C;
  opacity: 0.6;
  margin-right: 7px;

`
export const RouteSpanTimeslot = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 3px;
  width: 112px;
  height: 62px;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  color: #616A5C;
  opacity: 0.9;

`
export const RouteSpanDay = styled.div`
  width: 106px;
  height: 62px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  color: #616A5C;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RouteTwoTimeslots = styled.li`
  height: 124px;
  display: flex;
  justify-content: space-around;
  align-self: center;


  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }

  @media screen and (min-width: 743px) {
    p {
      line-height: 160%;
    }
  }
`
export const RouteTwoTimeslotsTablet = styled.li`
  height: 62px;
  display: flex;
  justify-content: flex-start;
  align-self: center;


  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }

  @media screen and (min-width: 743px) {
    p {
      line-height: 160%;
    }
  }
`
export const RouteSpanDayTwoTimeslots = styled.div`
  width: 106px;
  height: 124px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  color: #616A5C;
  display: flex;
  align-items: center;
  justify-content: center;
  
`

export const RouteSpanDayTwoTimeslotsTablet = styled.div`
  width: 106px;
  height: 62px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  padding-right: 12px;
  line-height: 120%;
  color: #616A5C;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
`

export const RouteSpanTimeslotAndCutoffBlockTwoColumn = styled.div`
  width: 206px;
  height: 124px;
  display: flex;
  flex-direction: column;
  
`
export const RouteSpanTimeslotAndCutoffBlockTwoRows = styled.div`
  width: 324px;
  height: 62px;
  display: flex;
  flex-direction: row;
  
`
export const RouteSpanTimeslotAndCutoffBlockOneRow = styled.div`
  width: 206px;
  height: 62px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }
  
`

export const RouteSpanTimeslotAndCutoffBlockOneRowTablet = styled.div`
  width: 162px;
  height: 62px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &:not(:last-child) {
    border-bottom: 1px solid #37751a33;
  }
  
`

export const RouteSpanCutoffTwo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 94px;
  height: 62px;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  color: #616A5C;
  opacity: 0.6;
  margin-right: 7px;
`

export const RouteSpanCutoffTwoTablet = styled.div`
  width: 61px;
  height: 18px;
  text-align: center;
 
  display: flex;
  flex-direction: row;
  
`
export const CutoffNumber = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  color: #616A5C;
  opacity: 0.6;
  &.mobile__cutoff-number {
    font-size: 18px;
  }
  
`

export const CutoffText = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  color: #616A5C;
  opacity: 0.6;
  @media screen and (min-width: 743px) {
    margin-top: 1px;
  }
  @media screen and (min-width: 1280px) {
    margin-top: 2px;
  }
  &.mobile__cutoff-text {
    font-size: 14px;
    margin-top: 1px;
  }
  
`
export const RouteSpanTimeslotTwo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 112px;
  height: 62px;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  color: #616A5C;
  opacity: 0.9;

`

export const RouteSpanTimeslotTwoTablet = styled.div`
  width: 94px;
  height: 18px;
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 100%;
  text-align: center;
  color: #616A5C;
  opacity: 0.9;
  flex: none;
  order: 0;
  flex-grow: 0

`