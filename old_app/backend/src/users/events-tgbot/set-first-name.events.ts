
export class FirstName {
    text: {
        first_name: string
        user: UserFromChangeFirstName
    };


    constructor(text) {
        this.text = text;
    }
}
interface UserFromChangeFirstName {
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
