import {Cart, Header, Home, Menu} from '../../components';
import {CartDesktop, Checkout, FreePods, Products} from '../';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

import {AnimatePresence} from 'framer-motion'
import { UserType } from '../../types';
import { useWindowDimension } from '../../hooks/useWindowDimension';

const routes = {
    home: '/*',
    auth: '/auth',
    products: '/products',
    checkout: '/checkout/*',
    FreePod: '/products/free/:id',
    cart: '/cart',
}

const path = ['/', '/products', '/cart']
const include = ['/checkout', '/profile/change_number']

const Main = ({data}: UserDataType) => {
    const location = useLocation()
    const [width] = useWindowDimension();
    const isMain = path.includes(location.pathname)
    const isCheckout = include.includes(location.pathname)
    const isDesktop = width >= 744;
        
    return (
        <div className='container'>
        {!isDesktop && !isCheckout && <Header/>}
        {isDesktop && <Header/>} 

        <AnimatePresence exitBeforeEnter>
            <Routes key={location.pathname} location={location}>
                {!isDesktop && <Route path='/cart' element={<Navigate to={routes.products}/>}/>} 
                <Route path={routes.home} element={<Home/>}/>
                <Route path={routes.checkout} element={<Checkout/>}/>
                <Route path={routes.products} element={<Products/>}/>
                <Route path={routes.FreePod} element={<FreePods/>}/>
                {isDesktop && <Route path={routes.cart} element={<CartDesktop points={data?.points} />}/>}
            </Routes>
        </AnimatePresence>
            {isMain && <>
                <Menu/>
                <>
                    <Cart points={data?.points} isMobile={true}/>
                </>
            </>}
        </div>
    );
};

export default Main;

interface UserDataType {
    data?: UserType
}

