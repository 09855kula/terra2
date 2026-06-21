import {AnimatePage, CartButton, ChangeAddress, ChangeNumber, Chat, Created, Edit, EditOrder, Loader, NewAddress, NoOrder, Notification, Refer, RoutesWindow} from "../";
import {CartWrapper, ContentWrapper, OrderContent, TabletContainer} from './styled'
import { Item, MenuList, ItemDisabled } from "../../pages/main/styled";
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import {AnimatePresence} from 'framer-motion'
import {GET_CART} from "../../api";
import {OrderType} from "../../types";
import PlugContainer from "../chat/Plug";
import Settings from "./settings";
import {local} from '../../utils'
import useGetDraftOrder from "../../hooks/useGetDraftOrders";
import {useQuery} from "@apollo/client";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { v4 as uuidv4 } from 'uuid';

const routes = [
    {path: '/', menu: 'Customer service'},
    // {path: '/customer_service', menu: 'Customer service'},

    {path: '/delivery_window', menu: 'Delivery window'},
    // {path: '/refer_friend', menu: 'Refer a friend'},
    {path: '/', menu: 'Refer a friend'},

    {path: '/profile', menu: 'Your Profile'},
]

const include = ['/order/edit', '/order', '/customer_service', '/change_address']

const Home = () => {
    const location = useLocation()
    const token = local.getToken() || '';
    const [width] = useWindowDimension();
    const is744 = width >= 744
    const is1280 = width >= 1280
    const notEditOrder = !include.includes(location.pathname)
    //
    const {isDraft} = useGetDraftOrder(token)
    const {data, refetch, loading} = useQuery(GET_CART, {variables: {phone: token}, fetchPolicy: "cache-and-network"} )
    const [order, setOrder] = useState<OrderType>()
    const [changeAddress, setChangeAddress] = useState<boolean>(false)
    
    useEffect(() => {
        if (token) {
            if (data?.getUser) {
                setOrder(data?.getUser?.cart)
                // local.setUserSettings({address: data?.getUser?.addresses[0]})
            }
        }
        refetch()
    },[data, location])

    useEffect(() => {
        if (isDraft) {
            local.setUserSettings({address: isDraft.address})
        }
    }, [isDraft]);

    const showDeliveryWindow = (window: string) => {
        if (is1280 && window === 'Delivery window') {
            setChangeAddress(false)
        }
    }
        
    // if (loading) return <Loader/>
    return (<>
            {!notEditOrder && 
            <OrderContent isChat={location.pathname === '/customer_service'}>
                {is1280 && location.pathname === '/customer_service' &&
                <div className="menu__wrapper chat__menu">
                    <MenuList id="main__menu">
                        {routes.map((item, idx) =>
                            item.menu === 'Customer service' || item.menu === 'Refer a friend'
                            ?<ItemDisabled key={uuidv4()} to={item.path}>{item.menu}</ItemDisabled>
                            :<Item key={uuidv4()} to={item.path}>{item.menu}</Item>
                        )}
                    </MenuList>
                    <CartWrapper><CartButton isMain={true} text='Your cart'/></CartWrapper>
                </div>}
                <AnimatePage>
                    <AnimatePresence exitBeforeEnter>
                        <Routes key={location.pathname} location={location}>
                            <Route path='/order' element={ <Edit token={token} id={order?.id} order={order}/>}/>
                            <Route path='/order/edit' element={ <EditOrder order={order} id={order?.id} token={token}/>}/>
                            <Route path='/customer_service'  element={
                            <Chat role={data?.getUser?.role} id={data?.getUser?.id} orderId={data?.getUser?.cart?.id}/>}/>
                            {/* <Route path='/customer_service' element={<PlugContainer/>}/> */}
                            {!is1280 && location.pathname === '/change_address' &&
                            <Route path='/change_address' element={<ChangeAddress userId={data?.getUser?.id} token={token}/>}/>}
                        </Routes>
                    </AnimatePresence>
                </AnimatePage>
            </OrderContent>}
        {notEditOrder && 
        <ContentWrapper isMain={location.pathname === '/'}>
            {is744 && !is1280 && location.pathname === '/' && token && <Notification order={order} phone={token}/>}
            {is1280 && notEditOrder && token && <Notification order={order} phone={token}/>}
            <TabletContainer isMain={location.pathname === '/'}>
                <AnimatePage>
                    <AnimatePresence exitBeforeEnter>
                        <Routes key={location.pathname} location={location}>
                            <Route path='/' element={<Main order={order} token={token}/>}/>
                            <Route path='/refer_friend' element={<Refer phone={token}/>}/>
                            <Route path='/delivery_window' element={<RoutesWindow userId={data?.getUser?.id} changeAddress={changeAddress} setChangeAddress={setChangeAddress}/>}/>
                            <Route path='/profile' element={<Settings user={data?.getUser}/>}/>
                            <Route path='/profile/new_profile' element={<NewAddress phone={token}/>}/>
                            <Route path='/profile/change_number' element={<ChangeNumber userId={data?.getUser?.id}/>}/>
                        </Routes>
                    </AnimatePresence>
                </AnimatePage>
            </TabletContainer>
            {is744 && notEditOrder && location.pathname !== '/change_address' &&
                <div className="menu__wrapper">
                    {!is1280 && <CartWrapper><CartButton isMain={true} text='Open cart'/></CartWrapper>}
                    <MenuList id="main__menu">
                        {routes.map((item, idx) =>
                            item.menu === 'Customer service' || item.menu === 'Refer a friend'
                                ?<ItemDisabled key={uuidv4()} to={item.path} onClick={() => showDeliveryWindow(item.menu)}>{item.menu}</ItemDisabled>
                                :<Item key={uuidv4()} to={item.path} onClick={() => showDeliveryWindow(item.menu)}>{item.menu}</Item>
                        )}
                    </MenuList>
                    {is1280 && <CartWrapper><CartButton isMain={true} text='Open cart'/></CartWrapper>}
                </div>}
        </ContentWrapper>}
    </>   
    );
};

const Main = ({order, token}: {order: OrderType | undefined, token: string}) => {
    const location = useLocation()
    const main_page = location.pathname === '/'
    const [width] = useWindowDimension();
    const is744 = width >= 744
    
    return (
        <AnimatePage>
            <>
                {!is744 && order && token && <Notification order={order} phone={token}/>}
                {order && main_page && token && <Created cart={order} phone={token}/>}
                {!order && is744 && <NoOrder width={width}/>}
                {main_page && !is744 &&
                <>
                    <MenuList id="main__menu">
                        {routes.map((item, idx) =>
                            item.menu === 'Customer service' || item.menu === 'Refer a friend'
                                ?<ItemDisabled key={uuidv4()} to={item.path}>{item.menu}</ItemDisabled>
                                :<Item key={uuidv4()} to={item.path}>{item.menu}</Item>
                        )}
                    </MenuList>
                </>}
            </>
        </AnimatePage>
    )
}

export default Home;



