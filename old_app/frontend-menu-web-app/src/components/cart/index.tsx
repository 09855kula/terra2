import {BackButton, CheckBox, Image, MainButton} from "../common";
import { BillSubTitle, BillTitle, ContentWrapper, Flex, FullHeader, Header, MenuOverlay, Overlay, Scroll, Wrapper } from './styled';
import React, {useContext, useEffect, useState} from 'react';
import { local, users } from '../../utils/';

import { CartContext } from '../../context/cartContext';
import NotEnoughProduct from './notEnoughProduct'
import Product from './product/product';
import { ProductsType } from '../../types';
import Tooltip from './tooltip'
import arrowLeft from "../../assets/icons/arrowLeftWhite.svg";
import checkout from "../../assets/icons/checkout.svg";
import {countOrder} from "../../utils/order";
import useCheckProducts from '../../hooks/useCheckProducts';
import useElementSize from '../../hooks/useElementSize'
import {useNavigate} from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';

const Cart = ({points, isMobile}: { points: number | undefined; isMobile?: boolean }) => {
    const navigate = useNavigate()
    const { addToast } = useToasts();
    const getSavings = local.getDiscount()
    const {checkProduct} = useCheckProducts()
    const [squareRef, {height, windowHeight, windowWidth}] = useElementSize()
    const {setActiveCart, setCart, activeCart, cart, available, setAvailable} = useContext(CartContext);
    const [isSavings, setIsSavings] = useState<boolean>(true)
    //
    const {products, total, discount, defaultCost, withDiscount} = countOrder(cart)
    //
    const chanedHeight = available.error ? height + 227 : height
    const findHeight = Math.round((chanedHeight / windowHeight * 100)) > 75
    const {totalPoints, availablePoints} = users.countPoints(points, withDiscount) || {}
    const is744 = windowWidth >= 743;
    console.log('availablePoints:',availablePoints)
    // console.log(windowHeight);
    // console.log(chanedHeight);
    // console.log(findHeight);
    
    const deleteProduct = (id: number) => {
        const storage = cart.filter((el, idx )=> idx !== id)
        setCart(storage)
        local.deleteOrder(id)
    }
    console.log('cart---costs:', cart)
    const updateProduct = (response?: ProductsType | string) => {
        if (typeof response !== 'string' && response) {
            const storage = cart.map((el)=> el.id === response.id ? {...response} : el)
            setCart(storage)
            local.save(storage)
            addToast('Saved Successfully', {appearance: 'success', autoDismiss: true});
        } else {
            addToast(response, {appearance: 'error', autoDismiss: true});
        }
    }
    
    const check = async () => {
        if (products.length) {
            let ids = products.map(prod => prod.id)
            console.log('ids:', products)
            if (isSavings) {
                local.saveDiscount(availablePoints / 2.5)
            }
            const res = await checkProduct(products, ids)

            if (res?.allProducts) {
                if (!isSavings) {
                    local.removeDiscount()
                }

                navigate('/checkout')
                setActiveCart(false)
            } else {
               res?.products && setAvailable(res?.products);
            }  
        }
    }

    const resetState = () => {
        setAvailable({error: false, products: {}})
    }
        
    const confirm = () => {
        let storage = [] as ProductsType[]
        products.forEach(prod => {
            if (available.products[prod.id].error && available.products[prod.id].available !== 0) {
                storage.push({...prod, count: available.products[prod.id].available})
            } else {
                if (available.products[prod.id].available !== 0) {
                    storage.push(prod)
                }
            }
        })
      
        setCart(storage)
        local.save(storage)
        addToast('Saved Successfully', {appearance: 'success', autoDismiss: true});
        resetState()
    }

    useEffect(() => {
        if (points) {
            if (getSavings) {
                setIsSavings(true)
            }
        }
    },[available, getSavings])

    useEffect(() => {
        if (!cart.length) {
           setActiveCart(false)
        }
    },[cart])


   
    return (
        <>
        {!is744 && <MenuOverlay onClick={() => setActiveCart(false)} className={activeCart ? '' : 'hide'}/>}
        <Wrapper maxHeight={findHeight} isMobile={isMobile} error={available.error} className={activeCart ? 'active' : ''} >
            {is744 && <FullHeader>
                        Your Cart
                    </FullHeader>}
            {findHeight && !is744 &&
                    <FullHeader>
                        What’s in your cart:
                    </FullHeader>}
            {!findHeight && !is744 &&
            <>
                <Overlay/>
                <Header>
                    <div>What’s in your cart:</div>
                </Header>
            </>}
            <ContentWrapper isError={available?.error}
                onClick={(e) => e.stopPropagation()}
                maxHeight={findHeight}
                >
                <div className='cart__wrapper' ref={squareRef}>
                <Scroll maxHeight={findHeight} height={available?.error ? '360px' : '230px'}>
                    {cart.map((prod,idx) => {
                        const changed = available?.error ? 
                        available?.products[prod.id]?.available : null
                        
                        return <Product 
                                key={idx*23} index={idx} 
                                deleteProduct={() => deleteProduct(idx)} 
                                updateProduct={updateProduct}
                                error={available?.products[prod.id]?.error}
                                changed={changed}
                                product={prod}
                                products={products}
                            />
                    })}
                </Scroll>
                {/*{!availablePoints && */}
                {/*<Flex width={'300px'} margin={'0 auto'} className="cart__total-wrapper">*/}
                {/*    {total && <Flex direction={'column'}>*/}
                {/*        <BillTitle>Discount:</BillTitle>*/}
                {/*        <BillSubTitle>{discount}%</BillSubTitle>*/}
                {/*    </Flex>}*/}
                {/*    <Flex direction={'column'} margin={total ? '' : '0 0 0 auto'}>*/}
                {/*        <BillTitle>Total:</BillTitle>*/}
                {/*        <BillSubTitle className={total ? 'discount' : ''}><span>$</span>{defaultCost}</BillSubTitle>*/}
                {/*    </Flex>*/}
                {/*    {total && <Flex direction={'column'}>*/}
                {/*        <BillTitle>To Pay:</BillTitle>*/}
                {/*        <BillSubTitle><span>$</span>{withDiscount}</BillSubTitle>*/}
                {/*    </Flex>}*/}
                {/*    {is744 && */}
                {/*   <MainButton className="checkout__btn" onClick={available?.error ? confirm : check}>*/}
                {/*        Checkout*/}
                {/*    </MainButton>}*/}
                {/*</Flex>}*/}
                {/*    {availablePoints === 0 &&*/}
                {/*        <Flex margin={'17px auto'} className="cart__savings-wrapper">*/}
                {/*            /!*<CheckBox id="cart-check" className="cart-check" type="checkbox" checked={isSavings} onChange={(e) => setIsSavings(e.target.checked)}/>*!/*/}
                {/*            /!*<label htmlFor="cart-check" className="cart-check">Use my savings (${availablePoints})</label>*!/*/}
                {/*            /!*<Tooltip allSavings={totalPoints} availableSavings={availablePoints}/>*!/*/}
                {/*            <Flex className='cart__total'>*/}
                {/*                <BillTitle margin={'0 10px 0 0'}>Total:</BillTitle>*/}
                {/*                <BillSubTitle><span>$</span>{isSavings ? withDiscount - availablePoints : withDiscount}</BillSubTitle>*/}
                {/*            </Flex>*/}
                {/*            {is744 &&*/}
                {/*                <MainButton className="checkout__btn" onClick={available?.error ? confirm : check}>*/}
                {/*                    Checkout*/}
                {/*                </MainButton>}*/}
                {/*        </Flex>}*/}
               {availablePoints >= 0 &&
               <Flex margin={'17px auto'} className="cart__savings-wrapper">
                    <CheckBox id="cart-check" className="cart-check" type="checkbox" checked={isSavings} onChange={(e) => setIsSavings(e.target.checked)}/>
                    <label htmlFor="cart-check" className="cart-check">Use my savings (${availablePoints})</label>
                    <Tooltip allSavings={totalPoints} availableSavings={availablePoints}/>
                    <Flex className='cart__total'>
                        <BillTitle margin={'0 10px 0 0'}>Total:</BillTitle>
                        <BillSubTitle><span>$</span>{isSavings ? withDiscount - availablePoints : withDiscount}</BillSubTitle>
                    </Flex>
                   {is744 && 
                   <MainButton className="checkout__btn" onClick={available?.error ? confirm : check}>
                        Checkout
                    </MainButton>}
                </Flex>}
                {!available?.error && !is744 &&
                <Flex margin={'0 auto 0 auto'} padding={'0 0 20px 0'} gap='10px'>
                    <BackButton className="back__btn-mobile" onClick={() => setActiveCart(false)} width='145px' size="28px">
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton> 
                    <MainButton className="checkout__btn-mobile" width={'218px'} onClick={check} size="28px">
                        <Image src={checkout}/>
                        Checkout
                    </MainButton>
                </Flex>}
                </div>
                {available?.error && !is744 && <NotEnoughProduct setBack={resetState} setConfirm={confirm} maxHeight={findHeight}/>}
            </ContentWrapper>
        </Wrapper>
        </>
    );
};

export default Cart;

