export const productConversion = (allProducts, category) => {
    if (!allProducts && !category) return

    const prod = []
    const temp = {}

    category?.getCategories.forEach((item) => temp[removeIcons(item.name)] = item)
    // console.log(allProducts?.getProducts.filter(el => el.active === true));

    allProducts?.getProducts.map((item, idx) =>  {


        if (temp[removeIcons(item.category)]) {

            // console.log('temp[removeIcons(item.category)]:', temp[removeIcons(item.category)])
            let {measure, pack, group, costs, sativa, indica, lso, effect} = temp[removeIcons(item.category)]

            costs = formatCosts(costs)
            const product = {...item, measure, pack, group, costs, cost: costs[0]?.cost, count: 0, sativa, indica, lso, effect}
            prod.push(product)
        }

    })
    // console.log(Array.from(new Set(prod.map(el => el.costs[0].cost))));
    //console.log('prod:',prod)
    return prod
}

const formatCosts = (costs) => {
    return costs.map(cost => ({cost: cost.cost, unit: cost.unit})).sort((a,b) => {
        return a.unit - b.unit
    })
}
const regex = /[^A-Za-z0-9\%\)\(]+/g

const removeIcons = (item) => item //.replace(regex, '')

const decimalToMixed = (dec) => {
    const integerPartStr = Math.floor(dec).toString();
    const decimalPart = dec % 1;
    switch (decimalPart) {
        case 0.25:
            return integerPartStr + '¼';
        case 0.5:
            return integerPartStr + '½';
        case 0.75:
            return integerPartStr + '¾';
        default:
            return integerPartStr;
    }
};

const gramToOZConverter = (grams) => {
    switch (grams) {
        case 7:
            return '1/4';
        case 14:
            return '1/2';
        case 21:
            return '3/4';
        default:
            return decimalToMixed(Math.round(((grams / 28) + Number.EPSILON) * 100) / 100);
    }
}