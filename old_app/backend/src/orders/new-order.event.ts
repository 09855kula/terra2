import {OrderType} from "./models/orders";
import {OrderIdType} from "./interface/order-id.type";

export class NewOrder {
    text: OrderType;

    constructor(text) {
        this.text = text;
    }
}

export class OrderId {
    text: OrderIdType;

    constructor(text) {
        this.text = text;
    }
}

export class Warning {
    text: {
        id: string,
        count: number,
        phone: string
    };

    constructor(text) {
        this.text = text;
    }
}