import {Button, ButtonBack, Item, List, MenuOverlay, MenuWrapper, Wrapper} from './styled';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';

import { CartButton } from '..';
import { CartContext } from '../../context/cartContext';
import {Image} from '../common'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import closeMenu from '../../assets/icons/close.svg'
import menuIcon from '../../assets/icons/menu.svg'
import {windowOverflow} from '../../utils'

const Menu = () => {
    const {groupHandler, categoryHandler, menuCategories, groups, cart, group, currentCategory} = useContext(CartContext);
    console.log('groups:',groups)
    const [category, setCategory] = useState(true)
    const [openMenu, setOpenMenu] = useState(false)
    const isBuds = group === 'Buds'
   
    const changeGroup = (item: string) => {
        if (item === 'Buds') {
            groupHandler(item)
            setCategory(true)
            setOpenMenu(false)
        } else {
            groupHandler(item)
            setCategory(false)
        }
    }
    
    const changeCategory = (item: string) => {
        categoryHandler(item, group)
        setOpenMenu(false)
    }

    const openMenuHandler = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setOpenMenu(!openMenu)
    }

    // useEffect(() => {
    //     setCategory(true)
    // },[])

    useEffect(() => {
        if (!menuCategories.length && !group) {
            setCategory(true)
        }
    },[menuCategories, group])

    useEffect(() => {
        if (openMenu) {
            windowOverflow(true)
        } else {
            windowOverflow(false)
        }
    }, [openMenu])
    console.log('category:',category)
    console.log('groups:',groups)
    console.log('menuCategories:',menuCategories)
    return (
        <Wrapper>
            <MenuOverlay onClick={() => setOpenMenu(false)} className={openMenu ? '' : 'hide'}>
                <MenuWrapper className={openMenu ? 'active' : ''} onClick={(e) => e.stopPropagation()}>
                    <div> 
                        <List>
                            {category &&
                            groups.map((item, idx) =>
                                (<Item className={group === item ? 'active' : ''} key={idx * 10}
                                    onClick={() => changeGroup(item)}>{item}</Item>)
                            )
                            }
                            {!category && !isBuds && 
                            menuCategories.map((item, idx) =>
                                (<Item className={currentCategory === item ? 'active' : ''} key={idx * 10}
                                    onClick={() => changeCategory(item)}>{item}</Item>)
                            )}
                        </List>
                        {!category && !isBuds && 
                        <ButtonBack onClick={() => setCategory(true)}>
                            <Image src={arrowLeft}/>Back
                        </ButtonBack>}
                    </div>
                </MenuWrapper>
            </MenuOverlay>
            <Button width={openMenu ? '242px' : '210px'} onClick={openMenuHandler} isCart={cart.length > 0}>
                <Image src={openMenu ? closeMenu : menuIcon}/>
                {' '}
                {openMenu ? 'Close' : 'Products'}
                {cart.length > 0 && <CartButton/>}
            </Button>
        </Wrapper>
    );
};

export default Menu;
