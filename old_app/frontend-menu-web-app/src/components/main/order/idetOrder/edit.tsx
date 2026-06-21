import { AnimatePage, Loader } from '../../../';
import {BackButton, ButtonFlex, Flex, Image, MainButton} from '../../../common';
import {BillSubTitle, BillTitle, CancelOrder, Container, ExtraInfoWrapper, FullHeader, OrderContainer, OrderEdit, OrderEditButton, ProductsWrapper, Wrapper} from './styled';
import React, {useContext} from 'react';

import { CartContext } from '../../../../context/cartContext';
import {DELETE_ORDER} from "../../../../api";
import OrderInfo from './orderInfo'
import { OrderType } from '../../../../types';
import Product from '../../../cart/product/product';
import arrowLeft from "../../../../assets/icons/arrowLeftWhite.svg";
import {delivery} from '../../../../utils/'
import {useMutation} from "@apollo/client";
import {useNavigate} from 'react-router-dom'

const include = ['canceled', 'closed']

const Edit = ({id, token, order}: PropsType) => {
    const {refetch} = useContext(CartContext) 
    const [deleteOrder, {loading}] = useMutation(DELETE_ORDER)
    const navigate = useNavigate()
    const isExpired  = order && delivery.checkCutoff(order.delivery_date, order.cut_offs)
    const orderStatus = order?.status && include.includes(order?.status)
   
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

    if (loading) return <Loader/>
   
    return (
        <AnimatePage>
            <OrderContainer>
                <div className='desktop__notif'>
                  <OrderInfo order={order}/>
                  <ExtraInfoWrapper className='desktop__notification'>
                    <h6>{isExpired ? 'On the way!' : 'Cut-off hasn’t pass yet!'}</h6>
                    <p>{isExpired ? 
                        <>Your order will be delivered today <br /><br /> Have fun ;-)</>
                        : 
                    'You can add more products to this order and they will be delivered all together!'}</p>
                  </ExtraInfoWrapper>
                </div>
                
                <div className="order__wrapper">
                <FullHeader className='order__desktop-header'>Order № {order?.id}</FullHeader>
                <Flex className='order__mobile-header'>
                    <OrderEdit>Order № {order?.id}</OrderEdit>
                      {!isExpired && !orderStatus &&
                    <CancelOrder onClick={removeOrder}>
                        Cancel order
                    </CancelOrder>}
                </Flex>
                <Wrapper>
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
                   <Container>
                        {!isExpired && !orderStatus &&
                        <CancelOrder onClick={removeOrder}>
                            Cancel order
                        </CancelOrder>}
                        <div className="order__total-block">
                            <BillTitle margin={'0 10px 0 0'}>Total:</BillTitle>
                            <BillSubTitle><span>$</span>{order?.total_after_discount}</BillSubTitle>
                            {!isExpired && !orderStatus ? 
                            <OrderEditButton width={'185px'} onClick={() => navigate('/order/edit')}>
                                Edit Order
                            </OrderEditButton>
                            :
                            <OrderEditButton width={'171px'}>
                                Chat
                            </OrderEditButton>}
                        </div>
                    </Container>
                </Wrapper>
                </div>
                <ButtonFlex className='desktop__hide'>
                    <BackButton onClick={() => navigate(-1)}>
                        <Image src={arrowLeft}/>
                        Back
                    </BackButton>
                    {!isExpired && !orderStatus ?
                        <MainButton width={'200px'} onClick={() => navigate('/order/edit')}>
                            Edit Order
                        </MainButton>
                        :
                        <MainButton width={'202px'}>
                            Chat
                        </MainButton>}
                </ButtonFlex>
                <BackButton onClick={() => navigate(-1)} className='cart__back-btn'>
                        <Image src={arrowLeft}/>
                        Back
                </BackButton>
            </OrderContainer>
            <ExtraInfoWrapper className='tablet__notification'>
                <h6>{isExpired ? 'On the way!' : 'Cut-off hasn’t pass yet!'}</h6>
                <p>{isExpired ? 
                <>Your order will be delivered today <br /><br /> Have fun ;-)</>
                    : 
                'You can add more products to this order and they will be delivered all together!'}</p>
            </ExtraInfoWrapper>
        </AnimatePage>
    );
}

export default Edit;

interface PropsType {
    token: string | null
    id?: string
    order?: OrderType
}

