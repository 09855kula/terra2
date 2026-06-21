import {Field, InputType} from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()

class CostsInputType   {
    @Field({ nullable: true })
    public cost?: number;

    @Field({ nullable: true })
    public unit?: number;
}
@InputType ()
class NotificationsInputType {
    @Field({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    public description?: string;

    @Field({ nullable: true })
    public created?: Date;
}
@InputType ()
class NotificationInputType  {
    @Field({ nullable: true })
    public five_week_expired?: Date;

    @Field({ nullable: true })
    public seven_week_expired?: Date;
}
@InputType ()
class Next_order_discountInputType  {
    @Field({ nullable: true })
    public amount?: number;

    @Field({ nullable: true })
    public start_date?: Date;
}
@InputType ()
class GiftPairsInputType  {
    @Field({ nullable: true })
    public id?: string;

    @Field({ nullable: true })
    public gift_holder?: string;

    @Field({ nullable: true })
    public is_gift?: string;

    @Field({ nullable: true })
    public name?: string;

    @Field({ nullable: true })
    public cost?: number;
}
@InputType ()
class UserProductsInputType{
    @Field({ nullable: true })
    public name?: string;

    @Field({ nullable: true })
    public pack?: number;

    @Field({ nullable: true })
    public measure?: string;

    @Field({ nullable: true })
    public category?: string;

    @Field({ nullable: true })
    public id?: string;

    @Field({ nullable: true })
    public img_url?: string;

    @Field({ nullable: true })
    public group?: string;

    @Field({ nullable: true })
    public cost?: number;

    @Field({ nullable: true })
    public count?: number;

    @Field( () => [CostsInputType], { nullable: 'items' } )
    public costs?: CostsInputType[];

    @Field( () => GiftPairsInputType, { nullable: true } )
    public got_gift_pairs?: GiftPairsInputType;
}
@InputType ()
class CommentsInputType {
    @Field({ nullable: true })
    public role?: string;

    @Field({ nullable: true })
    public user_id?: number;

    @Field({ nullable: true })
    public text?: string;

    @Field({ nullable: true })
    public image?: string;

    @Field({ nullable: true })
    public isRead?: boolean;

    @Field({ nullable: true })
    public created?: string;
}

@InputType ()
class CartsInputType  {
    @Field( () => [UserProductsInputType], { nullable: 'items' } )
    public products?: UserProductsInputType[];

    @Field({ nullable: true })
    public id?: string;

    @Field({ nullable: true })
    public status?: string;

    @Field( () => [String], { nullable: 'items' })
    public products_list?: string[];

    @Field({ nullable: true })
    public created?: Date;

    @Field({ nullable: true })
    public updated?: Date;

    @Field({ nullable: true })
    public address?: string;

    @Field({ nullable: true })
    public delivery_date?: string;

    @Field({ nullable: true })
    public timeslot?: string;

    @Field({ nullable: true })
    public cut_offs?: string;

    @Field({ nullable: true })
    public total_after_discount?: number;

    @Field( () => [CommentsInputType], { nullable: 'items' })
    public comments?: CommentsInputType[];
}
@InputType ()
export class updateUserInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    id: number;

    @Field({ nullable: true })
    first_name: string;

    @Field({ nullable: true })
    last_name: string;

    @Field({ nullable: true })
    public phone?: string;

    @Field({ nullable: true })
    public username?: string;

    @Field({ nullable: true })
    public role?: string;

    @Field({ nullable: true })
    public first_order?: boolean;

    @Field({ nullable: true })
    public is_vip?: boolean;

    @Field({ nullable: true })
    public points?: number;

    @Field({ nullable: true })
    public created?: Date;

    @Field({ nullable: true })
    public updated?: Date;

    @Field({ nullable: true })
    public referral_code?: string;

    @Field(  () => [Number],{ nullable: 'items' } )
    public orders?: number[];

    @Field(  () => [Number], { nullable: 'items' }  )
    public tokens?: number[];

    @Field({ nullable: true })
    public token?: number;

    @Field( () => [Number], { nullable: 'items' } )
    public profiles?: number[];

    @Field({ nullable: true })
    public inventory?: string;

    @Field({ nullable: true })
    public route?: string;

    @Field({ nullable: true })
    public last_profile?: number;

    @Field({ nullable: true })
    public profile_confirmed?: boolean;

    @Field( () => [String], { nullable: 'items' } )
    public phones?: string[];

    @Field( () => [String], { nullable: 'items' } )
    public addresses?: string[];

    @Field({ nullable: true })
    public limited?: Date;

    @Field(  () => CartsInputType,  { nullable: true })
    public cart?: CartsInputType;

    @Field( () => [CommentsInputType], { nullable: 'items' } )
    public comments?: CommentsInputType[];

    @Field( () => NotificationsInputType, { nullable: true } )
    public notifications?: NotificationsInputType;

    @Field( () => NotificationInputType, { nullable: true } )
    public notification?: NotificationInputType;

    @Field( () => Next_order_discountInputType, { nullable: true } )
    public next_order_discount?: Next_order_discountInputType;

    @Field()
    public new_profile?: boolean;
}