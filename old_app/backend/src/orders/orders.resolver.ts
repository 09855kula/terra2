import {Query, Resolver, Args, Mutation, Subscription} from "@nestjs/graphql";
import {PubSub} from "graphql-subscriptions";
import {CommentsOrderType, OrderType} from "./models/orders";
import {OrdersService} from "./orders.service";
import {GetOrderArgs} from "./dto/args/get-order.args";
import {createOrderInput} from "./dto/input/create-order.input";
import {updateOrderInput} from "./dto/input/update-order.input";
import {deleteOrderInput} from "./dto/input/delete-order.input";
import {GetDraftOrder} from "./dto/args/get-draft-order";
import {GetOrderComments} from "./dto/args/get-order-comments";
import {GetOrdersArgs} from "./dto/args/get-orders.args";
import {OrdersController} from "./orders.controller";

@Resolver(() => OrderType)
export class OrdersResolver {
    private pubSub: PubSub
    constructor(
        private readonly ordersService: OrdersService,
        private readonly ordersController: OrdersController) {
        this.pubSub = new PubSub()
    }

    @Query(() => OrderType, {name: 'getOrder', nullable: true})
    async getOrder(@Args() getOrderArgs: GetOrderArgs): Promise<OrderType> {
        return this.ordersService.getOrder(getOrderArgs)
    }

    @Query(() => OrderType, {name: 'getDraftOrders', nullable: true})
    async getDraftOrders(@Args() getDraftOrderArgs: GetDraftOrder): Promise<OrderType> {
        return this.ordersService.getDraftOrders(getDraftOrderArgs)
    }

    @Query(() => [CommentsOrderType], {name: 'getComments', nullable: true})
    async getOrderComments(@Args() getOderCommentsArgs: GetOrderComments): Promise<CommentsOrderType[]> {
        return this.ordersService.getOrderComments(getOderCommentsArgs)
    }

    @Query(() => [OrderType], {name: 'getAllOrders', nullable: 'items'})
    async getOrders(@Args() getOrdersArgs: GetOrdersArgs): Promise<OrderType[]> {
        return this.ordersService.getOrders(getOrdersArgs)
    }



    @Mutation(() => OrderType)
    async createUserOrder(@Args('input') input: createOrderInput): Promise<OrderType> {
        const newOrder = await this.ordersService.createUserOrder(input)
        await this.ordersController.getCreatedOrder(newOrder)
        return newOrder
    }

    @Mutation(() => OrderType)
    async updateOrder(@Args('input') input: updateOrderInput): Promise<OrderType> {
        const updatedOrder = await this.ordersService.updateOrder(input)
        // console.log('updatedOrder:', updatedOrder)
        await this.ordersController.getUpdateOrder(updatedOrder)
        return updatedOrder
    }

    @Mutation(() => OrderType)
    async deleteOrder(@Args('input') input: deleteOrderInput): Promise<OrderType> {
        const userId = this.ordersService.deleteOrder(input)
        await this.ordersController.getDeleteOrder(input)
        return userId
    }

    @Subscription(returns => CommentsOrderType, {name: 'messages'})
    messages() {
        // await this.pubSub.publish('messages', {messages: messages});

        return this.pubSub.asyncIterator('messages');
    }
}