import {Document} from 'mongoose';

export interface ProductWeb extends Document {
    readonly active: boolean,
    readonly name: string,
    readonly description: string,
    readonly img_url: string,
    readonly category: string,
    readonly hit?: boolean,
    readonly id: string
    readonly available: number
    readonly top_effect: string,
    readonly top_flavour: string,
    readonly price_tag: string,
    readonly type: string
}
