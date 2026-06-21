
import {Flex, Image} from '../common'
import {
    IconWrapper,
    ImageWrapper,
    Img,
    MessageText,
    OutStock,
    Overlay,
    ProductWrapper,
    SubTitle,
    Text,
    Title, TooltipProductContent, TooltipProductWrapper, TooltipEffectContent, TooltipEffectWrapper
} from './styled';
import React, {useEffect, useState} from 'react';
import { checkGiftProduct, getAvailableProduct, local, multiplyProducts } from '../../utils/';
import {useNavigate, useParams} from 'react-router-dom'
import {dataIcons, dataIconsFromEffects} from '../../context/importIcon'
import AddButton from './addButton';
import Citrus from '../../assets/citrus.png'
import { FadeInWrapper } from '..';
import GiftProducts from './gift'
import InfoPanel from './infoPanel';
import MainProduct from './main'
import ProductImage from '../../assets/product.png'
import {ProductsType} from "../../types";
import { useToasts } from 'react-toast-notifications';

const Product: React.FC<PropsType> = ({product, setCart, cart, free, categoryHandler, index}) => {
    const {name, img_url, available, category, indica, sativa, pack, type, top_effect, top_flavour } = product
    let new_img_url
    if (img_url && img_url.match(/imgur/) && !img_url.match(/imgur.*\.jpg$/)) {
        // img_url = img_url.replace('imgur', 'i.imgur');
        new_img_url = img_url +'.jpg';
    }
    else if (img_url && img_url.match(/postimg/) && !img_url.match(/postimg.*\.jpg$/)) {
        // img_url = img_url.replace('imgur', 'i.imgur');
        new_img_url = img_url +'.jpg';
    }

    else {
        new_img_url = img_url
    }

    const devices = category === 'Device' || category === 'Starter Kit (Dab)'
    const starterKit = category === 'Starter Kit (Dab)'
    const navigate = useNavigate()
    const { addToast } = useToasts();
    const {id} = useParams()
    //
    const [unit, setUnit] = useState(0)
    const [active, setActive] = useState(false)
    const [availableProduct, setAvailable] = useState(available)
    // console.log(product)
    const add = (unit: number) => {
        const item = multiplyProducts(product, cart, unit)        
        setCart(item)
        local.save(item)
    }
    // console.log('dataIcons:', dataIcons)

    const addGiftProduct = () => {
        const item = multiplyProducts(product, cart, 1, id)
        setCart(item)
        local.save(item)
        categoryHandler('Starter Kit (Dab)', 'Dab Pod System')
        addToast(`Starter Kit was added` , {appearance: 'success', autoDismiss: true});
    }
    
    const addToCart = (count: number = 0) => {
        if (starterKit && !checkGiftProduct(product.id, cart)) {
                categoryHandler('Pods (Dab)', 'Dab Pod System')
                navigate(`/products/free/${product.id}`)
                add(1)
        } else {
            if (count) {
                add(count)
            } else {
                add(1)
                setActive(true)
            }
        }
        setUnit(0)
    }

    useEffect(() => {
        setActive(false)
    }, [product])  

    useEffect(() => {
        const res = getAvailableProduct(cart, available, product.id)
        if (res === 0) {
            setActive(false)
        }
        
        setAvailable(res)
    }, [cart, available, product])
    const noType = "No Type"
    // @ts-ignore
    return (
        <>
       <FadeInWrapper keyElement={name}> 
            <ProductWrapper>
                <Title>{name}</Title>
                <SubTitle>{

                    type === noType
                        ? ''
                        :type

                }</SubTitle>
                <Overlay>
                    <ImageWrapper >
                        <Img src={new_img_url} onError={(e: any) => {e.target.onerror = null; e.target.src=`${ProductImage}`}}/>
                        <IconWrapper >
                            {
                                top_effect === 'Happy' &&
                                <TooltipEffectWrapper>
                                    <Image className='cart__info-image' src={dataIconsFromEffects.happy.img_url}/>
                                    <TooltipEffectContent className="tooltip">
                                        <div className="text">
                                            Top Effect:<br/>
                                            <b>{dataIconsFromEffects.happy.name}</b>
                                        </div>
                                    </TooltipEffectContent>
                                </TooltipEffectWrapper>
                                ||
                                top_effect === 'Sleepy' &&
                                <TooltipEffectWrapper>
                                    <Image className='cart__info-image' src={dataIconsFromEffects.sleepy.img_url}/>
                                    <TooltipEffectContent className="tooltip">
                                        <div className="text">
                                            Top Effect:<br/>
                                            <b>{dataIconsFromEffects.sleepy.name}</b>
                                        </div>
                                    </TooltipEffectContent>
                                </TooltipEffectWrapper>
                                ||
                                top_effect === 'Calm' &&
                                <TooltipEffectWrapper>
                                    <Image className='cart__info-image' src={dataIconsFromEffects.calm.img_url}/>
                                    <TooltipEffectContent className="tooltip">
                                        <div className="text">
                                            Top Effect:<br/>
                                            <b>{dataIconsFromEffects.calm.name}</b>
                                        </div>
                                    </TooltipEffectContent>
                                </TooltipEffectWrapper>
                                ||
                                top_effect === 'Energy' &&
                                <TooltipEffectWrapper>
                                    <Image className='cart__info-image' src={dataIconsFromEffects.energy.img_url}/>
                                    <TooltipEffectContent className="tooltip">
                                        <div className="text">
                                            Top Effect:<br/>
                                            <b>{dataIconsFromEffects.energy.name}</b>
                                        </div>
                                    </TooltipEffectContent>
                                </TooltipEffectWrapper>
                                ||
                                top_effect === 'Creative' &&
                                <TooltipEffectWrapper>
                                    <Image className='cart__info-image' src={dataIconsFromEffects.creative.img_url}/>
                                    <TooltipEffectContent className="tooltip">
                                        <div className="text">
                                            Top Effect:<br/>
                                            <b>{dataIconsFromEffects.creative.name}</b>
                                        </div>
                                    </TooltipEffectContent>
                                </TooltipEffectWrapper>

                            }
                            {
                                top_flavour === 'Mint' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.mint.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.mint.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Berry' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.berry.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.berry.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Tar' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.tar.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.tar.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Cheese' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.cheese.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.cheese.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Citrus' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.citrus.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.citrus.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Diesel' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.diesel.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.diesel.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Ammonia' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.ammonia.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.ammonia.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Chemical' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.chemical.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.chemical.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Coffee' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.coffee.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.coffee.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Earthy' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.earthy.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.earthy.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Flowery' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.flowery.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.flowery.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Woody' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.woody.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.woody.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Vanilla' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.vanilla.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.vanilla.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Tropical' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.tropical.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.tropical.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Tobacco' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.tobacco.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.tobacco.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Sweet' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.sweet.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.sweet.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Skunk' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.skunk.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.skunk.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Pungent' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.pungent.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.pungent.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Pine' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.pine.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.pine.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Nutty' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.nutty.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.nutty.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Honey' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.honey.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.honey.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Herbal' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.herbal.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.herbal.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                                ||
                                top_flavour === 'Fruity' &&
                                <TooltipProductWrapper>
                                    <Image className='cart__info-image' src={dataIcons.fruity.img_url}/>
                                    <TooltipProductContent className="tooltip">
                                        <div className="text">
                                            Flavour:<br/>
                                            <b>{dataIcons.fruity.name}</b>
                                        </div>
                                    </TooltipProductContent>
                                </TooltipProductWrapper>
                            }

                        </IconWrapper>

                        {!free && <InfoPanel product={product} unit={unit} cart={cart} setUnit={setUnit}/>}
                    </ImageWrapper>
                    {free ? <GiftProducts addGiftProduct={addGiftProduct}/> :
                    <>
                    {availableProduct !== 0 && !devices &&
                            <MainProduct 
                                setUnit={setUnit}
                                addToCart={addToCart}
                                product={product}
                                availableProduct={availableProduct}
                                unit={unit}
                                cart={cart}
                            />}
                    {devices && availableProduct !== 0 &&
                    <>
                        <Flex margin={'27px 0 0 0'}>
                            <MessageText>Press plus to add one {'>'}</MessageText>
                            <AddButton 
                                disabled={!unit && availableProduct === 0} 
                                addToCart={addToCart} 
                                pack={pack} 
                                unit={unit} 
                                single={true}/>
                        </Flex>
                    </>}
                    {availableProduct === 0 && !active && 
                    <>
                        <Text>The more you get - the less you pay!</Text>
                        <Flex margin={'27px 0 0 0'}>
                            <>  
                                <Flex direction='column' align="flex-start">
                                    <OutStock>Out of stock!</OutStock>
                                    <Text>You’ve taken the last item</Text>
                                </Flex>
                                <AddButton 
                                    disabled={!unit && availableProduct === 0} 
                                    addToCart={addToCart} 
                                    pack={pack} 
                                    unit={unit} 
                                    single={true}/>
                            </>
                        </Flex>
                    </>}
                    </>}
                </Overlay>
            </ProductWrapper>
        </FadeInWrapper>
        </>
    );
};

export default Product;

interface PropsType {
    product: ProductsType
    setCart: (cart: ProductsType[]) => void
    categoryHandler: (category: string, group: string) => void
    cart: ProductsType[]
    free?: boolean
    index?: number
}