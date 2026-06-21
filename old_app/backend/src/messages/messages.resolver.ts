import {Query, Resolver, Args, Mutation} from "@nestjs/graphql";
import {MessagesType} from "./models/messages";
import {MessagesService} from "./messages.service";
import {GetMessageArgs} from "./dto/args/get-message.args";
import {createMessageInput} from "./dto/input/create-message.input";
import {updateMessageInput} from "./dto/input/update-message.input";
import {deleteMessagesInput} from "./dto/input/delete-message.input";

@Resolver(() => MessagesType)
export class MessagesResolver {
    constructor(private readonly messagesService: MessagesService) {
    }

    @Query(() => MessagesType, {name: 'getMessage', nullable: true})
    async getMessage(@Args() getMessageArgs: GetMessageArgs): Promise<MessagesType> {
        return this.messagesService.getMessage(getMessageArgs)
    }

    @Query(() => [MessagesType], {name: 'getMessages', nullable: 'items'})
    async getMessages(): Promise<MessagesType[]> {
        return this.messagesService.getMessages()
    }

    @Mutation(() => MessagesType)
    async createMessage(@Args('input') input: createMessageInput): Promise<MessagesType> {
        return this.messagesService.createMessage(input)
    }

    @Mutation(() => MessagesType)
    async updateMessage(@Args('input') input: updateMessageInput): Promise<MessagesType> {
        return this.messagesService.updateMessage(input.message_id, input)
    }

    @Mutation(() => MessagesType)
    async deleteMessage(@Args('input') input: deleteMessagesInput): Promise<MessagesType> {
        return this.messagesService.removeMessage(input)
    }
}