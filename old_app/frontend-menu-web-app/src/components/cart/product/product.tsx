import {Block, Content, Cost, CustomSelect, Flex, Icon, Pack, Text, TextWrapper, Title} from "./styled";
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import CartImageContainer from "./cartImageContainer";
import { ProductsType } from '../../../types';
import {countCost} from '../../../utils/order';
import creative from "../../../assets/icons/creative.svg";
import {updateProductCount} from "../../../utils";
import useVisible from "../../../hooks/useVisible";
import {detect} from "detect-browser";

const Product = ({product, products, deleteProduct, updateProduct, editMode = true, error, changed}: ProductPropsType) => {
    const {ref, isVisible, setIsVisible} = useVisible(false)
    const browser = detect();
    let webkitClassName

    const {img_url, pack, category, measure,  name, count, got_gift_pairs} = product
    const defaultMeasure = measure === 'g' || measure === 'oz';
    const isStarterKit = category === 'Starter Kit (Dab)'
    const starterKitWithGift = got_gift_pairs?.name ? `${category} | ${got_gift_pairs?.name}` : category
    const changedCount = error && changed ? changed : count
    const [lastCost, setCost] = useState(0)    
    
    const updateUnit = (e: ChangeEvent<HTMLSelectElement>) => {
        const check = e.target.value.slice(0,1)
        const count = +e.target.value.slice(1)
        if(check === '-') {
            updateProduct(updateProductCount(product, count, false, true))
        } else {
            updateProduct(updateProductCount(product, count, true));
        }
        
        setIsVisible(false)
    }

    const updateHandler = () => {
        if (editMode) {
            setIsVisible(true)
        }
    }
   
    useEffect(() => {
        if(error && changed) {
            setCost(countCost({...product, count: changedCount}, products))
        }
    },[error])
    if(browser) {
        if (browser && browser.name === 'safari'|| browser && browser.name === 'ios' || browser && browser.name === 'ios-webview' || browser && browser.name === 'miui' || browser && browser.name === 'firefox'){
            webkitClassName = 'product__webkit-select'
        } else {
            webkitClassName = 'product__chrome-select'
        }
    }
    console.log('webkitClassName:',webkitClassName)
    return (
        <Content className='product__item'>
            <Flex justify={'start'}>
                <Block className='product__block'>
                    <CartImageContainer img_url={img_url} deleteHandler={deleteProduct} editMode={editMode}/>
                    <Flex direction={'column'} align={'start'}  className='product__item_text-wrapper'>
                        <Title>{name}</Title>
                        <TextWrapper>
                            <Text>{isStarterKit ? starterKitWithGift : category}</Text>
                            {!isStarterKit &&
                            <Flex className="product__item_subtext-wrapper">
                                <Icon src={creative}/>
                                <Text>Creative</Text>
                            </Flex>}
                        </TextWrapper>
                    </Flex>
                    {error ? 
                    <Pack onClick={updateHandler} error={error} disabled={error} editMode={editMode}>
                       {!defaultMeasure && 'x'}{pack * changedCount}{defaultMeasure && 'g'}
                        {error && <span>{!defaultMeasure && 'x'}{pack * count}{defaultMeasure && 'g'}</span>}
                    </Pack>
                    :
                    <CustomSelect className={webkitClassName} value={`${!defaultMeasure && 'x'}${pack * changedCount} ${defaultMeasure && 'g'}`} ref={ref} onChange={updateUnit} disabled={!editMode}>
                        <option value=''>{!defaultMeasure && 'x'}{pack * changedCount}{defaultMeasure && 'g'}</option>
                        <option value={`+${1}`}>+{pack}</option>
                        <option value={`+${2}`}>+{pack * 2}</option>
                        <option value={`+${4}`}>+{pack * 4}</option>
                        <option value={`-${1}`}>-{pack}</option>
                        <option value={`-${2}`}>-{pack * 2}</option>
                        <option value={`-${4}`}>-{pack * 4}</option>
                    </CustomSelect>}
                   {/* {isVisible  ? 
                    <CustomSelect value='' ref={ref} onChange={updateUnit} >
                        <option value=''></option>
                        <option value={`+${1}`}>+{pack}</option>
                        <option value={`+${2}`}>+{pack * 2}</option>
                        <option value={`+${4}`}>+{pack * 4}</option>
                        <option value={`-${1}`}>-{pack}</option>
                        <option value={`-${2}`}>-{pack * 2}</option>
                        <option value={`-${4}`}>-{pack * 4}</option>
                    </CustomSelect> 
                   : 
                    <Pack onClick={updateHandler} error={error} disabled={error} editMode={editMode}>
                       {!defaultMeasure && 'x'}{pack * changedCount}{defaultMeasure && 'g'}
                        {error && <span>{!defaultMeasure && 'x'}{pack * count}{defaultMeasure && 'g'}</span>}
                    </Pack>} */}
                    <Cost error={error}>
                        <div>
                            <span>$</span>{error ? lastCost : countCost(product, products)}
                        </div>
                        {error && <div className={'changed'}><span>$</span>{countCost(product, products)}</div>}
                    </Cost>
                </Block>
            </Flex>
        </Content>
    );
};

export default Product;

interface ProductPropsType {
    product: ProductsType
    error?: boolean
    changed?: number | null
    editMode?: boolean
    deleteProduct: () => void
    updateProduct: (product?: ProductsType | string) => void
    index: number
    products: ProductsType[]
}
