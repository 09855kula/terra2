export class NewProfile {
    text: ChangeAddress;

    constructor(text) {
        this.text = text;
    }
}
interface ChangeAddress {
    id: string
    address: string
    district: string,
    phone: string,
    user_id: number,
    special_instructions: string,
    created: string,
    status: string,


}

