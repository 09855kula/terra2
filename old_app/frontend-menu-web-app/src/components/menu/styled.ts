import styled from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  height: 111px;
  width: 100%;
  background: linear-gradient(0deg, rgba(9, 30, 0, 0.2) 36.85%, rgba(255, 255, 255, 0) 100%);
  z-index: 100;
  left: 0;

  @media screen and (min-width: 743px) {
       display: none;
  }
`


export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  // height: 100vh;
  width: 100%;
  /* padding: 0 5px; */

  &.hide {
    height: 0;
  }
`

export const List = styled.ul`
  width: 100%;
  text-align: center;
  border-radius: 36px 36px 0 0;
  max-height: 50vh;
  overflow-y: auto;
 
  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); */
    box-shadow: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #5f91484d;
    border-radius: 0 0 5px 5px;
  }
  
  &:last-child {
    border: none;
  }
`

export const Item = styled.li`
  font-weight: 400;
  padding: 21px 0;
  border-bottom: 1px solid #72a9598c;
  background-color: transparent;
  font-size: 28px;
  line-height: 100%;
  color: #4F9528;
  transition: 0.4s;
  cursor: pointer;
  
  &.active {
    color: #fff;
    background: #72A959;
    opacity: 0.8;
  }
  
  &:hover {
    color: #fff;
    background: #72A959;
    opacity: 0.8;
  }
`

export const MenuWrapper = styled.div`
  padding: 0 28px;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  
  div {
    margin: 0 auto;
    width: 100%;
    /* min-width: 320px; */
    /* max-width: 689px; */
    border-radius: 36px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0px -44px 100px rgba(0, 0, 0, 0.2);
    padding-bottom: 100px;
    z-index: 10;

    display: flex;
    flex-direction: column;
  }

  transition: 0.4s;
  opacity: 0;
  transform: translateY(110%);

  &.active {
    opacity: 1;
    transform: translateY(0);
  }
  
`

export const ButtonBack = styled.button`
  width: 210px;
  padding: 15px;
  background: #EFF8DD;
  backdrop-filter: blur(8px);
  border-radius: 444px;
  margin: 30px auto 0 auto;
  font-size: 28px;
  line-height: 120%;
  color: #4F9528;
  transition: 0.4s;

  &:hover {
    background: #e4f5bc;
  }
  
  img {
    margin-right: 10px;
  }
`

// export const ButtonCart = styled.div`
//   width: 85px;
//   height: 63px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: rgba(39, 122, 0, 0.65);
//   backdrop-filter: blur(8px);
//   border-radius: 444px;
//   font-size: 26px;
//   line-height: 120%;
//   color: #FCFFF8;
//   transition: 0.3s;

//   margin-left: 13px;

//   &:hover {
//     opacity: 1;
//     transform: scale(1.05);
//     background-color: #005800;
//   }

//   img {
//     margin-right: 8px;
//   }

// `

export const Button = styled.button<{isCart?: boolean, width?: string}>`
  display: flex;
  justify-content: ${({isCart}) => isCart ? 'space-between' : 'center'};;
  align-items: center;
  position: fixed;
  bottom: 19px;
  left: 0;
  right: 0;
  max-width: ${({isCart}) => isCart ? '282px' : '252px'};
  width: 100%;
  text-align: center;
  padding: ${({isCart}) => isCart ? '0 0 0 33px' : '18px'};;
  height: 64px;
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  margin: 0 auto;
  font-size: 28px;
  line-height: 120%;
  color: #fff;
  z-index: 20;
  transition: 0.4s;

  &:hover {
    opacity: 0.7;
  }
  
  img {
    margin-right: 10px;
  }
`