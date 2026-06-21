import {NoOrderButton, NoOrderContainer, NoOrderText, NoOrderTitle} from './styled'
import React, {useContext} from 'react';

import { CartContext } from '../../../../context/cartContext';
import {Link} from 'react-router-dom'

const NoOrder = ({width}: {width: number}) => {
    const {groupHandler} = useContext(CartContext);
    const is1280 = width >= 1280
    
     const openMenu = () => {
        groupHandler('Buds')
    }
    
    return <NoOrderContainer is1280={is1280}>
            <NoOrderTitle>Ready to order?</NoOrderTitle>
            <NoOrderText>
                You don’t have active orders.
                <br />
                <br />
                Click here to open our menu
            </NoOrderText>
            <Link to='/products'>
                <NoOrderButton onClick={openMenu}>Open Menu</NoOrderButton>
            </Link>
        </NoOrderContainer>
   
};

export default NoOrder;

