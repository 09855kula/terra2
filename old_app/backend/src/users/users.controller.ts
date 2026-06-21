import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {ReferFriend} from './events-tgbot/refer-friend.event';
import {InjectModel} from "@nestjs/mongoose";
import {ProfilesWeb, ProfilesDocument} from "../profiles/schemas/profiles.schemas";
import {Model} from "mongoose";
import {UsersWeb, UsersWebDocument} from "./schemas/users.schemas";
import {ScriptsService} from "../scripts/scripts.service";
import {FirstName} from "./events-tgbot/set-first-name.events";

@Controller()
export class UsersController {
    constructor(@Inject('IMPORT_FRIEND')
                private readonly client: ClientProxy,
                @InjectModel(ProfilesWeb.name) private profilesModel: Model<ProfilesDocument>,
                @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                private readonly scriptsService: ScriptsService,
    ) {
    }

    async onApplicationBootstrap() {
        await this.client.connect();
    }

    @Get()
    getReferFriend(newProfile, referFriend) {
        this.client.emit<any>('refer_friend', new ReferFriend(
            {profile: newProfile, user: referFriend}));
        return console.log('New refer a friend send to TG-BOT:', referFriend, newProfile);
    }

    @Get()
    getUserFirstName(firstName, userFromChangeFirstName) {
        this.client.emit<any>('set_first_name', new FirstName(
            {first_name: firstName, user: userFromChangeFirstName}));
        return console.log('Change first name send to TG-BOT:', firstName, userFromChangeFirstName);
    }

    @EventPattern("IMPORT_FRIEND")
    async handleMessagePrinted(data: Record<string, unknown>) {
        if(data.toString() === 'Friend no approved'){
            console.log(data.toString())
        }

        if(data.toString() !== 'Friend no approved') {
            // @ts-ignore
            const newProfile = JSON.parse(data)
            console.log('newProfile:',newProfile)
            await this.profilesModel.findOneAndUpdate({id: newProfile.id}, {
                $set: {
                    district: newProfile.district,
                    status: newProfile.status,
                    address: newProfile.address,
                }
            })
            await this.usersModel.findOneAndUpdate({id: newProfile.user_id}, {
                addresses: []
            })
            await this.usersModel.findOneAndUpdate({id: newProfile.user_id}, {
                $push: {
                    addresses: newProfile.address,
                    profiles: Number(newProfile.id)
                },
                $set: {
                    last_profile: Number(newProfile.id)
                }
            })
            await this.scriptsService.profileApprovedNotification(newProfile.phone)
            await this.scriptsService.referFriendNotification(newProfile)
        }
    }
}