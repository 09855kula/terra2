import {ApolloQueryResult, OperationVariables, useQuery} from "@apollo/client";
import {CategoriesType, ProductsType} from '../types'
import {GET_CATEGORIES, GET_PRODUCTS} from "../api";
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {local, productsSelector, windowOverflow} from '../utils'

import {productConversion} from '../utils/productConversion';
import {useNavigate} from 'react-router-dom';

interface AvailableProductsType {
   error: boolean
   products: {[key: string]: ProdType}
}

interface ProdType {
    id: string
    name: string
    available: number
    error: boolean

}

export const CartContext = React.createContext({} as ContextType)

export const Cart: React.FC<{}> = ({children}) => {
    const navigate = useNavigate()
    const {loading, data: allProducts, refetch} = useQuery<{ getProducts: ProductsType[] }>(GET_PRODUCTS);
    const {data: category} = useQuery<{ getCategories: CategoriesType[] }>(GET_CATEGORIES);
    //
    const [products, setProducts] = useState<ProductsType[] | []>([])
    const [filteredProducts, setFilteredProducts] = useState<ProductsType[] | []>([])
    const [groups, setGroups] = useState<string[]>([])
    const [groupDesc, setGroupDesc] = useState<string>('')
    const [menuCategories, setCategories] = useState<string[]>([])
    const [cart, setCart] = useState<ProductsType[]>([])
    const [available, setAvailable] = useState<AvailableProductsType>({error: false, products: {}})
    const [activeCart, setActiveCart] = useState(false)
    const [editCartMode, setEditCartMode] = useState(false)
    const [group, setGroup] = useState<string>('')
    const [currentCategory, setCurrentCategory] = useState<string>('')
    // console.log(products);
    
    const groupHandler = (group: string) => {
        let res = productsSelector.filterProducts(products, group)
        let categories = Array.from(new Set(res?.map(item => item.category)))
        //
        if (group === 'Dab Pod System' && currentCategory === '') {
            res = res.filter((el) => el.category === 'Pods (Dab)')            
        }
        // if (group === 'LSO') {
        //     res = res.filter((el) => el.category === 'Buds')
        // }
        if (group === 'Dab Pod System' && currentCategory !== '') {
            res = res.filter((el) => el.category === currentCategory)
        }
        // console.log('res:', res)
        setGroupDesc(res[0]?.description)
        setCurrentCategory('')
        setFilteredProducts(res)
        setGroup(group)
        setCategories(categories)
        navigate('/products')
    }
  
    const categoryHandler = (category: string, group: string) => {
        let res = productsSelector.filterProducts(products, group)
        let cat = res.filter(item => item.category === category)
        
        setGroupDesc(cat[0]?.description)
        setCurrentCategory(category)
        setFilteredProducts(res.filter(item => item.category === category))
        navigate('/products')
    }
    // console.log(filteredProducts);
    
    useEffect(() => {
        const convertProd = productConversion(allProducts, category)
        //console.log('convertProd:', convertProd)
        if (convertProd) {
            setProducts(convertProd)
            let res = productsSelector.filterProducts(convertProd, 'Buds')
            // const res = convertProd.filter(item => item.group === 'Buds').filter(el => el.active !== false && el.available !== 0)
            // console.log(res);
            
            setGroupDesc(res[0]?.description)
            setFilteredProducts(res)
        }
        
        const res: string[] = Array.from(new Set(convertProd?.map(item => item.group)))
        const gr = res.find((el) => el === 'Buds')
        
        setGroups(res)
        if (gr) {
            setGroup(gr)
        }
    }, [allProducts, category])

    useEffect(() => {
        setCart(local.getCart())
    }, [])

    useEffect(() => {
        if (activeCart) {
            windowOverflow(true)
        } else {
            windowOverflow(false)
        }
    },[activeCart])

    return <CartContext.Provider value={{
        setCart,
        groupHandler, 
        categoryHandler, 
        setActiveCart, 
        setEditCartMode, 
        setCurrentCategory,
        setGroup,
        setAvailable,
        refetch,
        setCategories,
        setFilteredProducts,
        available,
        products,
        currentCategory,
        editCartMode, 
        cart, 
        filteredProducts, 
        menuCategories, 
        activeCart, 
        group, 
        groups,
        groupDesc,
        loading}}>{children}</CartContext.Provider>
}

interface ContextType {
    groupHandler: (group: string) => void
    categoryHandler: (category: string, group: string) => void
    setActiveCart: Dispatch<SetStateAction<boolean>>
    setCart: Dispatch<SetStateAction<ProductsType[]>>
    setGroup: Dispatch<SetStateAction<string>>
    setEditCartMode: Dispatch<SetStateAction<boolean>>
    setCurrentCategory: Dispatch<SetStateAction<string>>
    setAvailable: Dispatch<SetStateAction<AvailableProductsType>>
    setCategories: Dispatch<SetStateAction<string[]>>
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<{getProducts: ProductsType[];}>>
    setFilteredProducts: Dispatch<SetStateAction<ProductsType[]>>
    currentCategory: string
    editCartMode: boolean
    filteredProducts: ProductsType[] | []
    cart: ProductsType[]
    menuCategories: string[]
    activeCart: boolean
    group: string
    groups: string[]
    loading: boolean
    groupDesc: string
    available: AvailableProductsType
    products: ProductsType[] | []
}