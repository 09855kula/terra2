import * as Scroll from 'react-scroll';

import {AnimatePage, CartButton, FadeInWrapper, Filter, Loader, Product} from "../../components";
import { Container, ContentWrapper, Description, Layout, ProductTitle, ReadMore, TabletWrapper, Wrapper } from './styled';
import React, {useContext, useEffect, useState} from 'react';

import { CartContext } from "../../context/cartContext";
import { productsSelector } from "../../utils";
import useElementSize from "../../hooks/useElementSize";
import useScrollPosition from "../../hooks/useElementPosition";

let scroll  = Scroll.animateScroll;

const Products = () => {
    const position = useScrollPosition()
    const [squareRef, {windowWidth}] = useElementSize()
    const is744 = windowWidth >= 743 && windowWidth < 1280;
    const less744 = windowWidth < 743;
    const is1280= windowWidth >= 1280;
    const {setCart, filteredProducts, group, cart, currentCategory, loading, categoryHandler, groupDesc} = useContext(CartContext);
    const [open, setOpen] = useState(false)
    const isTop = position < 100;    
    const res = productsSelector.description(currentCategory ? currentCategory : group)
    // console.log(windowWidth);
    //  console.log(res());
       
    useEffect(() => {
        scroll.scrollToTop()
    },[])

     
    return (
        <AnimatePage>
            <Wrapper ref={squareRef}>
                {is744 &&
                <TabletWrapper>
                    <Filter isStart={isTop} width={windowWidth}/>
                    <CartButton/>
                </TabletWrapper>}
                {is1280 && <Filter isStart={isTop} width={windowWidth}/>}
                <FadeInWrapper keyElement={group}>
                    <ContentWrapper>
                        <Container>
                            <div>
                                <ProductTitle>{currentCategory ? currentCategory : group}</ProductTitle>
                                <ReadMore onClick={() => setOpen(!open)}>{open ? 'close' : 'read more'}</ReadMore>
                            </div>
                            <Description className={open ? 'show' : 'hide'}>
                                <FadeInWrapper keyElement={open ? 1 : 0}>
                                <p>{res && res}</p>
                                {res && <p className='desktop'>
                                    {res?.slice(0, open ? 1000 : 150)}
                                   {res?.length > 150 && <>{open ? null : '...'}<span onClick={() => setOpen(!open)}>{open ? 'close' : 'read more'}</span></>}</p>}
                                </FadeInWrapper>
                            </Description>
                        </Container>
                        {less744 && <Filter isStart={isTop} width={windowWidth}/>}
                        <Layout>
                        {!loading && filteredProducts?.map((item, idx) =>
                            <Product key={idx ** 13} product={item} index={idx} cart={cart} setCart={setCart} categoryHandler={categoryHandler}/>)}
                        </Layout>
                    </ContentWrapper>
                </FadeInWrapper>
                {loading && <Loader/>}
            </Wrapper>
        </AnimatePage>
        );
    }
;

export default Products;

