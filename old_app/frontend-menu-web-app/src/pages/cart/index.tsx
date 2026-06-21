import {AnimatePage, Cart} from '../../components/'
import {BackButton, Image, NotEnoughProduct} from '../../components/common'
import React, {useContext, useEffect} from 'react';

import { CartContext } from '../../context/cartContext';
import arrowLeft from "../../assets/icons/arrowLeftWhite.svg";
import danger from '../../assets/danger_desktop.svg'
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const CartDesktop = ({points}: {points: number | undefined}) => {
    const navigate = useNavigate()
    const {available, cart} = useContext(CartContext);
    // console.log(cart)
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/products')
        }
    }, [cart])

    return (
        <AnimatePage>
            <Wrapper error={available.error}>
                {available.error &&
                <NotEnoughProduct className='desktop__notif'>
                        <h6>Sorry! Low Stock</h6>
                        <p>
                            Due to low inventory, someone <br/> 
                            got to the checkout before you! 
                            <br/> 
                            <br/> 
                            Your cart has been adjusted
                        </p>
                        <Image src={danger}/>
                </NotEnoughProduct>}
                <Cart points={points}/>
                <BackButton onClick={() => navigate(-1)} className='cart__back-btn'>
                        <Image src={arrowLeft}/>
                        Back
                </BackButton>
            </Wrapper>
        </AnimatePage>
    );
};

export default CartDesktop;

export const Wrapper = styled.div<{error?: boolean}>`
    position: relative;
    padding-top: 113px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: column;
    justify-content:  center;
    align-items: center;
    width: 675px;
    height: 100%;
    /* margin: ${({error}) => error ? '0 auto' : '273px auto 0 auto'}; */
    /* min-height: calc(100vh - 273px) ; /* Fallback for browsers that do not support Custom Properties */
    /* min-height: calc((var(--vh, 1vh) * 100) - 273px); */ 
    min-height: calc(100vh) ; /* Fallback for browsers that do not support Custom Properties */
    min-height: calc((var(--vh, 1vh) * 100));
    margin: 0 auto;

    .desktop__notif {
        margin: 0 0 63px 0
    }

    .cart__back-btn {
        align-self: flex-start;
        margin-top: auto;
    }

    @media screen and (min-width: 743px) {
        .desktop__notif {
            width: 428px;
            height: 208px;
            border-radius: 24px;
        }
    }

    @media screen and (min-width: 1280px) {
        flex-direction: row-reverse;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        padding: 113px 108px 13px 24px;
        min-height: 100vh ; /* Fallback for browsers that do not support Custom Properties */
        min-height: calc(var(--vh, 1vh) * 100);
        min-height: ${({error}) => error ? '570px' : '100%'};
        margin: 0 auto;


        .desktop__notif {
                position: absolute;
                left: 24px;
                top: 194px;
        }

        .cart__back-btn {
            align-self: flex-end;
            margin-bottom: 15px;
        }
    }
`
