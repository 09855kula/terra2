import * as Scroll from 'react-scroll';

import {AnimatePage, Loader, Product} from "../../components";
import {BackBtn, HeaderWrapper, Title, Wrapper} from '../products/styled';
import { LayoutFree, WrapperFree } from '../products/styled';
import React, {useContext, useEffect} from 'react';

import { CartContext } from "../../context/cartContext";
import { Link } from "react-router-dom";

let scroll  = Scroll.animateScroll;

const FreePods = () => {
    const {setCart, filteredProducts, cart, loading, categoryHandler} = useContext(CartContext);

    const goBack = () => {
        categoryHandler('Starter Kit (Dab)', 'Dab Pod System')
    }

    useEffect(() => {
        scroll.scrollToTop()
    },[])


    return (
        <AnimatePage>
            <WrapperFree>
                <HeaderWrapper>
                    <Title color={'#37751A'}>Pick a free pod</Title>
                    <Link to="/products">
                        <BackBtn onClick={goBack}>Go Back</BackBtn>
                    </Link>
                </HeaderWrapper>
                <LayoutFree>
                    {!loading && filteredProducts?.map((item, idx) =>
                    <Product key={idx ** 15} product={item} cart={cart} setCart={setCart} free={true} categoryHandler={categoryHandler}/>)}
                </LayoutFree>
                {loading && <Loader/>}
            </WrapperFree>
        </AnimatePage>
    );
};

export default FreePods;
