
export class ReferFriend {
    text: {
        profile: NewProfile
        user: ReferAddressFriend
    };


    constructor(text) {
        this.text = text;
    }
}
interface ReferAddressFriend {
    id: number
    first_name: string
    last_name: string
    username: string
    phone: string
    phones: [string]
    addresses: [string]
    role: string
    first_order: boolean
    points: number
    tokens: [number]
    token: number
    created: string


}
interface NewProfile {
    id: string
    address: string
    district: string,
    phone: string,
    user_id: number,
    special_instructions: string,
    created: string,
    status: string,
    friend: string
}