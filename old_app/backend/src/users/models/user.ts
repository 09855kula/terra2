import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
class CostsType   {
    @Field({ nullable: true })
    public cost?: number;

    @Field({ nullable: true })
    public unit?: number;
}
@ObjectType()
export class NotificationsType {
    @Field({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    public description?: string;

    @Field({ nullable: true })
    public created?: string;
}
@ObjectType()
class NotificationType  {
    @Field({ nullable: true })
    public five_week_expired?: Date;

    @Field({ nullable: true })
    public seven_week_expired?: Date;
}
@ObjectType()
class Next_order_discountType  {
    @Field({ nullable: true })
    public amount?: number;

    @Field({ nullable: true })
    public start_date?: Date;
}
@ObjectType()
class GiftPairsType  {
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
@ObjectType()
export class UserProductsType{
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

    @Field( () => [CostsType], { nullable: 'items' } )
    public costs?: CostsType[];

    @Field( () => GiftPairsType, { nullable: true } )
    public got_gift_pairs?: GiftPairsType;
}
@ObjectType()
export class CommentsType {
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

@ObjectType()
class CartsType  {
    @Field( () => [UserProductsType], { nullable: true } )
    public products?: UserProductsType[];

    @Field({ nullable: true })
    public id?: string;

    @Field({ nullable: true })
    public status?: string;

    @Field({ nullable: true })
    public created?: Date;

    @Field({ nullable: true })
    public updated?: Date;

    @Field({ nullable: true })
    public address?: string;

    @Field( () => [String], { nullable: 'items' })
    public products_list?: string[];

    @Field({ nullable: true })
    public delivery_date?: string;

    @Field({ nullable: true })
    public timeslot?: string;

    @Field({ nullable: true })
    public cut_offs?: string;

    @Field({ nullable: true })
    public total_after_discount?: number;

    @Field( () => [CommentsType], { nullable: true })
    public comments?: CommentsType[];
}
@ObjectType()
export class UserType {

    @Field({ nullable: true })
    public id?: number;

    @Field({ nullable: true })
    public first_name?: string;

    @Field({ nullable: true })
    public last_name?: string;

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

    @Field(  () => [Number],{ nullable: true } )
    public orders?: number[];

    @Field(  () => [Number], { nullable: true }  )
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

    @Field({ nullable: true })
    public five_weeks_limited?: Date;

    @Field({ nullable: true })
    public six_weeks_limited?: Date;

    @Field({ nullable: true })
    public seven_weeks_limited?: Date;

    @Field(  () => CartsType,  { nullable: true })
    public cart?: CartsType;

    @Field( () => [CommentsType], { nullable: 'items' } )
    public comments?: CommentsType[];

    @Field( () => NotificationsType, { nullable: true } )
    public notifications?: NotificationsType;

    @Field( () => NotificationType, { nullable: true } )
    public notification?: NotificationType;

    @Field( () => Next_order_discountType, { nullable: true } )
    public next_order_discount?: Next_order_discountType;

    @Field()
    public new_profile?: boolean;

    @Field({ nullable: true })
    public use_safari?:  boolean;

    @Field()
    public is_token_right?:  boolean;

    @Field()
    public is_token_reverse?:  boolean;

    @Field()
    public is_token_invalid?:  boolean;
}