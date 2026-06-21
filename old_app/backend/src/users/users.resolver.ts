import {Args, Mutation, Query, Resolver, Subscription} from "@nestjs/graphql";
import {CommentsType, NotificationsType, UserType} from "./models/user";
import {UsersService} from "./users.service";
import {GetUserArgs} from "./dto/args/get-user.args";
import {createUserInput} from "./dto/input/create-user.input";
import {updateUserInput} from "./dto/input/update-user.input";
import {deleteUserInput} from "./dto/input/delete-user.input";
import {loginUserInput} from "./dto/input/login-user";
import {GetUserNotifications} from "./dto/args/get-user-notifications";
import {confirmUserPhoneInput} from "./dto/input/confirm-user-phone.input";
import {createUserCommentsInput} from "./dto/input/create-user-comments.input";
import {PubSub} from "graphql-subscriptions";
import {setUserNotificationsInput} from "./dto/input/set-user-notifications.input";
import {addUserAddressInput} from "./dto/input/add-user-address.input";
import {referFriendInput} from "./dto/input/refer-friend.input";
import {GetNewUserArgs} from "./dto/args/get-new-user.args";
import {setUserFirstNameInput} from "./dto/input/set-user-first-name.input";
import {UsersController} from "./users.controller";
import {SetNewProfileFalseInput} from "./dto/input/set-new-profile-false.input";
import {SetUserUseSafariInput} from "./dto/input/set-user-use-safari.input";

@Resolver(() => UserType)
export class UsersResolver {
    private pubSub: PubSub

    constructor(
        private readonly usersService: UsersService,
        private readonly usersController: UsersController
    ) {
        this.pubSub = new PubSub()
    }

    @Query(() => UserType, {name: 'getUser', nullable: true})
    async getUser(@Args() getUserArgs: GetUserArgs): Promise<UserType> {
        return this.usersService.getUser(getUserArgs)
    }

    @Query(() => UserType, {name: 'getNewUser', nullable: true})
    async getNewUser(@Args() getNewUserArgs: GetNewUserArgs): Promise<UserType> {
        return this.usersService.getNewUser(getNewUserArgs)
    }

    @Query(() => NotificationsType, {name: 'getUserNotification', nullable: true})
    async getUserNotification(@Args('phone', {type: () => String}) phone: GetUserNotifications): Promise<NotificationsType> {
        return this.usersService.getUserNotification(phone)
    }

    @Query(() => [CommentsType], {name: 'getUserComments', nullable: true})
    async getUserComments(@Args('phone', {type: () => String}) getUserNotificationsArgs: GetUserNotifications): Promise<CommentsType[]> {
        return this.usersService.getUserComments(getUserNotificationsArgs)
    }

    @Query(() => [UserType], {name: 'getUsers', nullable: 'items'})
    async getUsers(): Promise<UserType[]> {
        return this.usersService.getUsers()
    }

    @Mutation(() => UserType)
    async createUser(@Args('input') createUserData: createUserInput): Promise<UserType> {
        return this.usersService.createUser(createUserData)
    }

    @Mutation(() => UserType)
    async referFriend(@Args('input') input: referFriendInput): Promise<UserType> {
        return this.usersService.referFriend(input)
    }

    @Mutation(() => UserType)
    async setUserFirstName(@Args('input') input: setUserFirstNameInput): Promise<UserType> {
        const userFromChangeFirstName = await this.usersService.setUserFirstName(input)
        await this.usersController.getUserFirstName(input.first_name, userFromChangeFirstName)
        return userFromChangeFirstName
    }


    @Mutation(() => UserType)
    async newProfileFalse(@Args('input') input: SetNewProfileFalseInput): Promise<UserType> {
        return await this.usersService.newProfileFalse(input)
    }

    @Mutation(() => UserType)
    async setUseSafari(@Args('input') input: SetUserUseSafariInput): Promise<UserType> {
        return await this.usersService.setUseSafari(input)
    }



    @Mutation(() => UserType)
    async confirmUser(@Args('input') confirmUserPhoneData: confirmUserPhoneInput): Promise<UserType> {
        return this.usersService.confirmUser(confirmUserPhoneData.phone, confirmUserPhoneData.token)
    }

    @Mutation(() => [CommentsType])
    async setUserCommentRead(@Args('input') confirmUserPhoneData: loginUserInput): Promise<CommentsType[]> {
        return this.usersService.setUserCommentRead(confirmUserPhoneData.phone)
    }

    @Mutation(() => UserType, {name: 'addAddress'})
    async addNewAddress(@Args('input') addUserAddressData: addUserAddressInput): Promise<any> {
        return this.usersService.addNewAddress(addUserAddressData)
    }

    @Mutation(() => UserType)
    async updateUser(@Args('input') updateUserData: updateUserInput): Promise<UserType> {
        return this.usersService.updateUser(updateUserData.id, updateUserData)
    }

    @Mutation(() => UserType)
    async deleteUser(@Args('input') deleteUserData: deleteUserInput): Promise<UserType> {
        return this.usersService.deleteUser(deleteUserData)
    }

    @Mutation(() => UserType)
    async login(@Args('phone') loginUserData: loginUserInput): Promise<UserType> {
        return this.usersService.login(loginUserData.phone)
    }

    @Mutation(() => [CommentsType])
    async userComments(@Args('input') createUserCommentData: createUserCommentsInput): Promise<CommentsType[]> {
        const usersMessage = await this.usersService.userComments(createUserCommentData)
        await this.pubSub.publish('userMessage', {userMessage: usersMessage});
        return usersMessage
    }

    @Mutation(returns => NotificationsType)
    async setUserNotification(@Args('input') setUserNotificationsData: setUserNotificationsInput): Promise<NotificationsType> {
        const userNotification = await this.usersService.setUserNotification(
            setUserNotificationsData.phone,
            setUserNotificationsData.title,
            setUserNotificationsData.description)
        await this.pubSub.publish('userNotification', {userNotification: userNotification});
        return userNotification
    }

    @Subscription(returns => [CommentsType], {name: 'userMessage'})
    userMessage() {
        return this.pubSub.asyncIterator(['userMessage']);
    }

    @Subscription(returns => NotificationsType, {name: 'userNotification'})
    userNotification() {
        return this.pubSub.asyncIterator('userNotification');
    }
}