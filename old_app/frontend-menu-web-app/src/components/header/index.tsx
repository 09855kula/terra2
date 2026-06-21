import {Info, List, ListWrapper, Logo, LogoTitle, Title, Wrapper} from './styled'
import { Navigate, useLocation } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import { local, scrollToElement } from '../../utils';

import { CartContext } from '../../context/cartContext';
import { Image } from '../common';
import InfoImage from "../../assets/icons/info.svg";
import InfoImageGreen from "../../assets/icons/infoGreen.svg";
import LogoImage from "../../assets/logo.svg";

const include = ['/products', '/cart', '/checkout']

const Header = () => {
    const token = local.getToken()
    const location = useLocation()
    const {groupHandler, categoryHandler, menuCategories, groups, group, currentCategory, setGroup, setCategories} = useContext(CartContext);
    const isBuds = group === 'Buds'
    const isCategories = !!(menuCategories?.length && !isBuds)
    const isMain = location.pathname === '/products' 

    const changeGroup = (item: string) => {
        groupHandler(item)
    }
    
    const changeCategory = (item: string) => {
        categoryHandler(item, group)
    }

    const routeHandler = () => {
        !isMain && scrollToElement("main__menu")
    }
   
    useEffect(() => {
        if (!include.includes(location.pathname)) {            
            setGroup('')
            setCategories([])
        }
    }, [location, group])    
    
    if (!token) {
        return <Navigate to="/auth"/>
    }
    
    return (
        <>
            {isMain && 
                <Wrapper color={'#5BA03B'} className="mobile__header">
                    <Title>
                        {group}
                    </Title>
                    <Info to={'/'} color={'#FFFFFF'}>
                        <Image src={InfoImage}/>
                        Info
                    </Info>
                </Wrapper>}
                <Wrapper position='absolute'>
                    <Logo to={'/'}>
                        <button onClick={routeHandler}>
                            <Image src={LogoImage}/>
                        </button>
                    </Logo>
                    <LogoTitle>Terra</LogoTitle>
                    <ListWrapper isCat={isCategories}>
                        <List>
                            {groups && groups.map((gr, idx) => 
                                <li key={idx * 33} 
                                    className={gr === group ? 'active' : ''} 
                                    title={gr}
                                    onClick={() => changeGroup(gr)}>{gr}
                                </li>
                            )}
                        </List>
                        {<List className={isCategories ? 'category active' : 'category'}>
                            {isCategories && menuCategories.map((cat, idx) => 
                                <li key={idx * 33} 
                                    title={cat}
                                    className={cat === currentCategory ? 'active' : ''} 
                                    onClick={() => changeCategory(cat)}>{cat}</li>
                                )}
                        </List>}
                    </ListWrapper>
                    <button onClick={routeHandler}>
                        <Info to={'/'} color={'#49812F'}>
                            <Image src={InfoImageGreen}/>
                            Info
                        </Info>
                    </button>
                </Wrapper>
        </>
    );
};

export default Header;