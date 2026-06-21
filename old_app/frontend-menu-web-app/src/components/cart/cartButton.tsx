import React, {MouseEvent, memo, useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {AnimatedPulse} from '../'
import Cart from '../../assets/icons/cart.svg'
import { CartContext } from '../../context/cartContext';
import { Image } from '../common';
import { countOrder } from '../../utils/order';
import styled from 'styled-components';
import { useWindowDimension } from '../../hooks/useWindowDimension';

const CartButton = ({text = 'Open cart', isMain = false}: {text?: string, isMain?: boolean}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {cart, setActiveCart, group, setCategories} = useContext(CartContext);
    const {defaultCost} = countOrder(cart)
    const [width] = useWindowDimension()
    const isWidth = width && width > 743;
    const animate = location.pathname === '/products' ? [1, 1.1, 1.15, 1.1, 1] : [1, 1]

    const openCart = (e: MouseEvent<HTMLElement>) => {
        if (isWidth) {
            navigate('/cart')
            setCategories([])
        } else {
            e.stopPropagation()
            setActiveCart(true)
        }
        if (location.pathname === '/delivery_window') {
            navigate('/cart')
            setCategories([])

        }
    }

    return (
        <CartWrapper isMain={isMain}>
            {!!cart.length && <div className="overlay"/>}
            <AnimatedPulse keyElement={defaultCost} delay={0} scale={animate}>
                <CartBtn onClick={openCart} isBuds={group === 'Buds'} isMain={isMain} isProduct={!!cart.length}>
                    <span>{text}</span>
                    <Image src={Cart}/>
                    {cart.length}
                </CartBtn>
            </AnimatedPulse>
        </CartWrapper>
    );
};

export default memo(CartButton);

export const CartWrapper = styled.div<{isMain?: boolean}>`
  position: relative;
  order: 2;
  @media screen and (min-width: 743px) and (max-width: 1279px) {
    ${({isMain}) => !isMain &&`
      position: fixed;
      bottom: 71px;
    `}

    div.overlay {
      ${({isMain}) => !isMain &&`
        position: absolute;
        left: -11px;
        bottom: 0;
        width: 82px;
        height: 72px;
        background: #8DC573;
        opacity: 0.4;
        border-radius: 0 32px 32px 0;
        z-index: -1;
      `}
    }
  }
`

export const CartBtn = styled.div<{isBuds?: boolean, isMain?: boolean, isProduct?: boolean}>`
  width: 85px;
  height: 63px;
  display: ${({isProduct}) => isProduct ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  background: rgba(39, 122, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 444px;
  font-size: 26px;
  line-height: 100%;
  color: #FCFFF8;
  transition: 0.3s;
  cursor: pointer;
  transition: 0.4s;
  margin-left: 13px;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
    background-color: #005800;
  }

  img {
    margin-right: 8px;
  }
  span {
    display: none;
  }

  ${({isMain}) => !isMain && `
    @media screen and (min-width: 743px) and (max-width: 1279px) {
      position: relative;
      // position: fixed;
      left: 0;
      bottom: 0;
      line-height: 25px;
      width: 72px;
      height: 72px;
      background: #8DC573;
      text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);


    img {
        order: 1;
        margin: 0 0 0 6px;
    }

    &:hover {
        opacity: 0.7;
        transform: none;
        background: #8DC573;
    }

    &:before {
      content: 'Cart';
      font-size: 16px;
      line-height: 120%;
      color: #4B8231;
      position: absolute;
      bottom: -26px;
    }
  }
  `}

  @media screen and (min-width: ${({isMain}) => isMain ? '743px' : '1280px'}) {
  width: 231px;
  height: 63px;
  padding: 21px 32px;
  justify-content: space-between;
  background: rgba(64, 123, 37, 0.75);
  font-size: 22px;
  color: #FCFFF8;
  order: 3;
  margin: ${({isMain}) => isMain ? '20px auto 8px auto' : '61px auto 0 auto'};


  &:hover {
    opacity: 0.8;
    transform: none;
    background: rgba(64, 123, 37, 0.75);
  }

  img {
    order: 1;
    margin: 0 0 3px 6px;
  }

  span {
    display: block;
    margin-right: 16px;
  }
}
`
