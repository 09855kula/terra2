import {BackButton, ButtonFlex, Flex, Image, MainButton, NotEnoughProduct} from "../../../common";
import {
    BillSubTitle,
    BillTitle,
    CancelOrder,
    Container,
    ExtraInfoWrapper,
    FullHeader,
    ModeContentWrapper,
    OrderContainer,
    OrderEdit,
    OrderEditButton,
    ProductsWrapper,
    Text,
    Wrapper
} from "./styled";
import {OrderType, ProductsType} from "../../../../types";
import React, {useContext, useEffect, useState} from 'react';
import {concatAvailableProductWithOrder, local} from '../../../../utils'

import {AnimatePage, Loader} from "../../..";
import { CartContext } from "../../../../context/cartContext";
import OrderInfo from './orderInfo'
import Product from "../../../cart/product/product";
import {DELETE_ORDER, UPDATE_ORDER} from "../../../../api";
import arrowLeft from "../../../../assets/icons/arrowLeftWhite.svg";
import danger from "../../../../assets/danger.svg"
import dangerDesktop from '../../../../assets/danger_desktop.svg'
import {formedCart} from "../../../../utils/formatCart";
import useCheckProducts from "../../../../hooks/useCheckProducts";
import {useMutation} from "@apollo/client";
import {useNavigate} from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';
import {delivery} from '../../../../utils/'
import {useWindowDimension} from "../../../../hooks/useWindowDimension";
import useCreateOrder from "../../../../hooks/useCreateOrder";
interface PropsType {
    token: string | null
    id?: string
    order?: OrderType
}
const include = ['canceled', 'closed']
const EditOrder = ({id,  order, token}: PropsType) => {
    const { addToast } = useToasts();
    // const token = local.getToken();
    const {checkProduct} = useCheckProducts()
    const [width] = useWindowDimension()
    const is743 = width >= 744;
    const {products, groupHandler, refetch, setAvailable, available, setActiveCart, cart: carts, setCart} = useContext(CartContext);
    const [cart, setCarts] = useState<ProductsType[] | undefined>()
    const [updateMode, setUpdateMode] = useState<boolean>()
    const cartset = local.getCart()
    console.log('cart:', cartset)
    const savings = local.getDiscount() || 0;
    const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER)
    const [deleteOrder, {loading}] = useMutation(DELETE_ORDER)
    const navigate = useNavigate()
    const isExpired  = order && delivery.checkCutoff(order.delivery_date, order.cut_offs)
    const orderStatus = order?.status && include.includes(order?.status)
    console.log('isExpiried:', isExpired)
    console.log('orderStatus:', orderStatus)

    const removeOrder = async () => {
        await deleteOrder({
            variables: {
                phone: token,
                id: id,
            }
        }).then(({data}) => {
            navigate('/')
            setTimeout(() => refetch(), 5000)
        })
    }
    const updateProduct = (response?: ProductsType | string) => {
        if (typeof response !== 'string' && response) {
            const storage = cart?.map((el)=> el.id === response.id ? {...response} : el)
            setCarts(storage)
            setUpdateMode(true)
        } else {
            addToast(response, {appearance: 'error', autoDismiss: true});
        }
    }

    const deleteProduct = (id: string) => {
        const storage = cart?.filter((el, idx )=> el.id !== id)
        console.log('storage:',storage)
        setCarts(storage)
        setUpdateMode(true)
    }
console.log('cart:',cart)
    const addMoreGoods = () => {
        if (updateMode) {
            addToast('you need to save your updates before moving on to products', {appearance: 'error', autoDismiss: true});
        } else {
            if(cart) {
                setCart(cart)
            }
            groupHandler('Buds')
            navigate('/products')
            local.editGoods({date: order?.delivery_date, order: order?.id})
        }
    }
    
    const saveOrder = async (confirm: boolean = false) => {
        if (!cart || !order?.products) return 
        let storage = cart
        let ids = cart.map(prod => prod.id)
        
        if (confirm) {
            let temp = [] as ProductsType[]
            cart?.forEach(prod => {
                if (available?.products[prod.id]?.error && available?.products[prod.id]?.available !== 0) {
                    temp.push({...prod, count: available?.products[prod.id]?.available})
                } else {
                    if (available?.products[prod.id]?.available !== 0) {
                        temp.push(prod)
                    }
                }
            })
            storage = temp
        }
       
        const res = await checkProduct(storage, ids, true, order?.products)
        const changedCart = formedCart(storage)
        
        if (res?.allProducts) {
            await updateOrder({
            variables: {
                phone: token,
                products: changedCart,
                id: order?.id
            }
            }).then(({ data }) => {

                addToast(`Order - ${order?.id} successfully updated` , {appearance: 'success', autoDismiss: true});
                setTimeout(() => refetch(), 4000)
                setAvailable({error: false, products: {}})
                navigate('/')
                // console.log(data)
            }).catch((err) => console.log('error', err))
        } else {
            res?.products && setAvailable(res?.products);
            addToast(`not enough` , {appearance: 'error', autoDismiss: true});
        }
    }

    useEffect(() => {
        order && setCarts(concatAvailableProductWithOrder(products, order?.products))
    }, [order])
    // console.log(cart);
    if (loading) return <Loader/>
    if (updateLoading) return <Loader/>

    return (
        <AnimatePage>
        <OrderContainer>
                <div className='desktop__notif'>
                  {<OrderInfo order={order}/>}
                    {available?.error ?
                        <NotEnoughProduct className='edit__notification'>
                            <h6>Sorry! Low Stock</h6>
                            <p>
                                Due to low inventory, someone <br/>
                                got to the checkout before you!
                                <br/>
                                Your cart has been adjusted
                            </p>
                            <Image src={dangerDesktop}/>
                        </NotEnoughProduct>
                        :
                        <>
                            {!isExpired && !orderStatus
                                ?
                                <ExtraInfoWrapper className="edit__info desktop__notification">
                                    <h6>You are editing your order</h6>
                                    <li>Click on a product quantity to modify it.</li>
                                    <li>Click on X marks to remove a product from the order completely</li>
                                    <li>Click Back to reset all changes</li>
                                </ExtraInfoWrapper>
                                :
                                <ExtraInfoWrapper className="edit__info desktop__notification">
                                    <h6>Cut-off hasn’t pass yet!</h6>
                                    <p>You can add more products to this order and they will be delivered all together!</p>
                                </ExtraInfoWrapper>
                            }
                        </>
                    }
                </div>
                {available?.error && 
                <NotEnoughProduct className='hide'>
                    <p>
                        Due to low inventory, someone <br/> 
                        got to the checkout before you! 
                        <br/> 
                        Your cart has been adjusted
                    </p>
                    <Image src={danger}/>
                </NotEnoughProduct>}
                <Flex className='hide'>
                    <OrderEdit>Order № {order?.id}</OrderEdit>
                    {!isExpired && !orderStatus &&
                        <CancelOrder onClick={removeOrder}>
                            Cancel order
                        </CancelOrder>}
                </Flex>
                <div className="order__wrapper">
                <FullHeader className='order__desktop-header'>Order № {order?.id}</FullHeader>
                <Wrapper edit={!available?.error}>
                    {!isExpired && !orderStatus
                    ? <ProductsWrapper>
                            {cart && cart?.map((prod, idx) => {
                                const changed = available?.error ?
                                    available?.products[prod.id]?.available : null

                                return <Product key={idx ** 20}
                                                product={prod} index={idx}
                                                deleteProduct={() => deleteProduct(prod.id)}
                                                updateProduct={updateProduct}
                                                error={available?.products[prod.id]?.error}
                                                changed={changed}
                                                products={cart}

                                />}
                            )}
                        </ProductsWrapper>
                    :
                        <ProductsWrapper>
                            {order?.products && order?.products.map((el, idx) =>
                                <Product key={idx ** 20}
                                         editMode={false}
                                         product={el}
                                         index={idx}
                                         products={order.products}
                                         deleteProduct={() => console.log('1')} updateProduct={() => console.log('2')}/>
                            )}
                        </ProductsWrapper>
                    }
                    <Container>
                       {!available?.error &&
                           <>{!isExpired && !orderStatus &&
                        <OrderEditButton width={'184px'} onClick={addMoreGoods}>
                            Add more
                        </OrderEditButton>}
                           </>}
                        <div className="order__total-block">
                            <BillTitle margin={'0 10px 0 0'}>Total:</BillTitle>
                            <BillSubTitle><span>$</span>{order?.total_after_discount}</BillSubTitle>
                            {!isExpired && !orderStatus &&
                                <OrderEditButton disabled={!updateMode} width={'196px'}
                                                 onClick={() => available?.error ? saveOrder(true) : saveOrder()}>
                                    Save order
                                </OrderEditButton>
                            }
                        </div>
                    </Container>
                </Wrapper>
                </div>
                {!available?.error && <ModeContentWrapper className='hide'>
                    {!isExpired && !orderStatus &&
                        <MainButton width={'262px'} onClick={addMoreGoods}>
                            Add more
                        </MainButton>
                    }
                    {!isExpired && !orderStatus
                        ?
                        <Text>
                            You are editing your order now. <br/>
                            <br/>
                            Click on a product quantity to modify it.
                            <br/>
                            <br/>
                            Click on the X on the photo <br/>
                            to remove it completely
                            <br/>
                            <br/>
                            Click Back to reset all changes
                        </Text>
                        :
                        <Text>
                            Cut-off hasn’t pass yet! <br/>
                            <br/>
                            You can add more products to this order <br/>
                            and they will be delivered all together!
                            <br/>
                        </Text>
                    }
                </ModeContentWrapper>}
            {available?.error ?
            <ButtonFlex className='desktop__hide'>
                <BackButton onClick={() => {
                    setAvailable({error: false, products: {}})}}>
                    <Image src={arrowLeft}/>
                    Back
                </BackButton>
                {!isExpired && !orderStatus &&
                    <MainButton width={'200px'} onClick={() => saveOrder(true)}>
                        Save order
                    </MainButton>
                }
            </ButtonFlex>
            :
            <ButtonFlex className='desktop__hide'>
                <BackButton onClick={() => navigate(-1)}>
                    <Image src={arrowLeft}/>
                    Back
                </BackButton>
                {!isExpired && !orderStatus &&
                <MainButton disabled={!updateMode} width={'200px'} onClick={() => saveOrder()}>
                    Save order
                </MainButton>
                    }
            </ButtonFlex>
            }
            <div className='cart__wrapper-btn' >
            <BackButton onClick={() => navigate(-1)} className='cart__back-btn'>
                        <Image src={arrowLeft}/>
                        Back
            </BackButton>
                {is743 && !isExpired && !orderStatus &&
                    <CancelOrder className='cart__cancel-btn' onClick={removeOrder}>
                        Cancel order
                    </CancelOrder>}
        </div>
        </OrderContainer>
            {!isExpired && !orderStatus
                ?
                <ExtraInfoWrapper className="tablet__notification edit__info">
                    <h6>You are editing your order</h6>
                    <li>Click on a product quantity to modify it.</li>
                    <li>Click on X marks to remove a product from the order completely</li>
                    <li>Click Back to reset all changes</li>
                </ExtraInfoWrapper>
                :
                <ExtraInfoWrapper className="tablet__notification edit__info">
                    <h6>Cut-off hasn’t pass yet!</h6>
                    <p>You can add more products to this order and they will be delivered all together!</p>
                </ExtraInfoWrapper>
            }
        </AnimatePage>
    )
};

export default EditOrder;