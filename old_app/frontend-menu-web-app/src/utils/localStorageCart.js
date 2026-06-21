const cartName = 'MyCart'
const discountName = 'Terracy_discount'
const deliveryTime = 'Terracy_delivery_time'
const userSettings = 'Terracy_user_settings'
const userToken = 'Terracy_user_token'

export const local = {
    createToken: function (id) {
        localStorage.setItem(userToken, id)
    },
    getToken: function () {
        return localStorage.getItem(userToken)
    },
    removeToken: function () {
        return localStorage.removeItem(userToken)
    },
    save: function (product) {
        localStorage.setItem(cartName, JSON.stringify(product))
    },
    setUserSettings: function (setting) {
        let res = localStorage.getItem(userSettings);
    
        if (res) {
            const settings = JSON.parse(res)
            const temp = {...settings, ...setting}
            localStorage.setItem(userSettings, JSON.stringify(temp))
        } else {
            localStorage.setItem(userSettings, JSON.stringify(setting))
        }

        return res && JSON.parse(res)
    },
    getUserSettings: function () {
        let res = localStorage.getItem(userSettings);
        return res && JSON.parse(res)
    },
    removeUserSettings: function () {
        localStorage.removeItem(userSettings)
    },
    // for edit goods
    editGoods: function (time) {
        localStorage.setItem(deliveryTime, JSON.stringify(time))
    },
    getEditGoods: function () {
        let res = localStorage.getItem(deliveryTime);
        return res && JSON.parse(res)
    },
    removeEditGoods: function () {
        localStorage.removeItem(deliveryTime)
    },
    //for discount
    saveDiscount: function (number) {
        localStorage.setItem(discountName, JSON.stringify(number))
    },
    getDiscount: function () {
        let res = localStorage.getItem(discountName);
        return res && JSON.parse(res)
    },
    removeDiscount: function () {
        localStorage.removeItem(discountName)
    },
    edit: function (product) {
        const cart = this.getItem()
        let storage = JSON.parse(cart)
        storage = [...storage, ...product]

        localStorage.setItem(cartName, JSON.stringify(storage))
    },
    remove: function () {
        localStorage.removeItem(cartName)
        localStorage.removeItem(discountName)
        localStorage.removeItem(deliveryTime)
    },
    removeAll: function () {
        localStorage.removeItem(cartName)
        localStorage.removeItem(discountName)
        localStorage.removeItem(deliveryTime)
        localStorage.removeItem(userSettings)
        localStorage.removeItem(userToken)
    },
    getCart: function () {
        const cart = this.getItem()

        if (cart) {
            return JSON.parse(cart)
        } else {
            return []
        }
    },
    deleteOrder: function (id) {
        const cart = this.getItem()

        let storage = JSON.parse(cart)
        storage = storage.filter((el, idx) => idx !== id)

        localStorage.setItem(cartName, JSON.stringify(storage))
    },
    getItem: function () {
        return localStorage.getItem(cartName);
    }
}

export default local;