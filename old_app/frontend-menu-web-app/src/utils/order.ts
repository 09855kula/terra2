import {ProductsType} from "../types"
import {local} from './'
import {useState} from "react";

interface ObjectType {
    [key: string]: ProductsType
}

interface PropsType {
    products: ProductsType[]
    withDiscount: number
    defaultCost: number
    discount: string
    total: boolean
}

export const countOrder = (cart: ProductsType[]): PropsType => {
    let products = [] as ProductsType[]


    products = cart?.filter(prod => prod.count !== 0)
    // console.log('products--count Order:', products)
    return {products, ...discountCalculation(cart)}
}

export const countCost = (product: ProductsType, products: ProductsType[]): number => {
    let summ = 0
    console.log('product_in_cart:', product)
    console.log('products---context:', products)
    let buds = [] as ProductsType[]
    let edibles = [] as ProductsType[]
    let extracts = [] as ProductsType[]
    let mushrooms = [] as ProductsType[]
    let vape_products = [] as ProductsType[]
    if (products) {
        products.forEach(i => {
            if (i.group === 'Buds') {
                buds.push(i)
            }
            if (i.group === 'Extracts') {
                extracts.push(i)
            }
            if (i.group === 'Edibles') {
                edibles.push(i)
            }
            if (i.group === 'Mushrooms') {
                mushrooms.push(i)
            }
            if (i.group === 'Vape products') {
                vape_products.push(i)
            }
        })
    }
    console.log('buds:', buds)
    let countCost = 0
    if (product.group === 'Buds') {
        let index = buds.findIndex(i => product.id === i.id)
        // console.log('index:', index)
        let sliceBuds = buds.slice(0, index)
        if (sliceBuds && sliceBuds.length) {
            sliceBuds.forEach(i => {
                countCost += i.count
            })
        } else {
            countCost = 0
        }
    }
    if (product.group === 'Extracts') {
        let index = extracts.findIndex(i => product.id === i.id)
        // console.log('index:', index)
        let sliceExtracts = extracts.slice(0, index)
        if (sliceExtracts && sliceExtracts.length) {
            sliceExtracts.forEach(i => {
                countCost += i.count
            })
        } else {
            countCost = 0
        }
    }
    if (product.group === 'Edibles') {
        let index = edibles.findIndex(i => product.id === i.id)
        // console.log('index:', index)
        let sliceEdibles = edibles.slice(0, index)
        if (sliceEdibles && sliceEdibles.length) {
            sliceEdibles.forEach(i => {
                countCost += i.count
            })
        } else {
            countCost = 0
        }
    }
    if (product.group === 'Mushrooms') {
        let index = mushrooms.findIndex(i => product.id === i.id)
        // console.log('index:', index)
        let sliceMushrooms = mushrooms.slice(0, index)
        if (sliceMushrooms && sliceMushrooms.length) {
            sliceMushrooms.forEach(i => {
                countCost += i.count
            })
        } else {
            countCost = 0
        }
    }
    if (product.group === 'Vape products') {
        let index = vape_products.findIndex(i => product.id === i.id)
        // console.log('index:', index)
        let sliceVapeProducts = vape_products.slice(0, index)
        if (sliceVapeProducts && sliceVapeProducts.length) {
            sliceVapeProducts.forEach(i => {
                countCost += i.count
            })
        } else {
            countCost = 0
        }
    }

    console.log('countCost:', countCost)
    for (let i = countCost; i < countCost + product.count; i++) {
        summ += product.costs[i].cost
    }


    console.log('summa:', summ)
    return summ
}

const discountCalculation = (products: ProductsType[]) => {
    let withDiscount = 0
    let defaultCost = 0
    let buds = [] as ProductsType[]
    let edibles = [] as ProductsType[]
    let extracts = [] as ProductsType[]
    let mushrooms = [] as ProductsType[]
    let vape_products = [] as ProductsType[]
    if (products) {
        products.forEach(i => {
            if (i.group === 'Buds') {
                buds.push(i)
            }
            if (i.group === 'Extracts') {
                extracts.push(i)
            }
            if (i.group === 'Edibles') {
                edibles.push(i)
            }
            if (i.group === 'Mushrooms') {
                mushrooms.push(i)
            }
            if (i.group === 'Vape products') {
                vape_products.push(i)
            }
        })
    }
    console.log('buds:', buds)
    products.forEach(product => {
        let arr = [] as number[]
        let countCost = 0
        if (product.group === 'Buds') {
            let index = buds.findIndex(i => product.id === i.id)
            // console.log('index:', index)
            let sliceBuds = buds.slice(0, index)
            if (sliceBuds && sliceBuds.length) {
                sliceBuds.forEach(i => {
                    countCost += i.count
                })
            } else {
                countCost = 0
            }
        }
        if (product.group === 'Extracts') {
            let index = extracts.findIndex(i => product.id === i.id)
            // console.log('index:', index)
            let sliceExtracts = extracts.slice(0, index)
            if (sliceExtracts && sliceExtracts.length) {
                sliceExtracts.forEach(i => {
                    countCost += i.count
                })
            } else {
                countCost = 0
            }
        }
        if (product.group === 'Edibles') {
            let index = edibles.findIndex(i => product.id === i.id)
            // console.log('index:', index)
            let sliceEdibles = edibles.slice(0, index)
            if (sliceEdibles && sliceEdibles.length) {
                sliceEdibles.forEach(i => {
                    countCost += i.count
                })
            } else {
                countCost = 0
            }
        }
        if (product.group === 'Mushrooms') {
            let index = mushrooms.findIndex(i => product.id === i.id)
            // console.log('index:', index)
            let sliceMushrooms = mushrooms.slice(0, index)
            if (sliceMushrooms && sliceMushrooms.length) {
                sliceMushrooms.forEach(i => {
                    countCost += i.count
                })
            } else {
                countCost = 0
            }
        }
        if (product.group === 'Vape products') {
            let index = vape_products.findIndex(i => product.id === i.id)
            // console.log('index:', index)
            let sliceVapeProducts = vape_products.slice(0, index)
            if (sliceVapeProducts && sliceVapeProducts.length) {
                sliceVapeProducts.forEach(i => {
                    countCost += i.count
                })
            } else {
                countCost = 0
            }
        }

        console.log('countCost:', countCost)
        for (let i = countCost; i < countCost + product.count; i++) {
            withDiscount += product.costs[i].cost
            defaultCost += product.costs[i].cost

        }




        // for (let i = 0; i < product.count; i++) {
        //     arr.push(i)
        // }

        // defaultCost += arr.reduce((a, b) => a + product.cost, 0)
        // withDiscount += arr.reduce((a, b) => a + el.costs[b].cost, 0)
    })

    const discount = (((defaultCost - withDiscount) / defaultCost) * 100).toFixed(0)
    const total = withDiscount < defaultCost;

    return {withDiscount, defaultCost, discount, total}
}