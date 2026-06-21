import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ProfilesWeb, ProfilesDocument} from "./schemas/profiles.schemas";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
import {NewProfile} from './events-tgbot/new-profile.event';
import {ScriptsService} from "../scripts/scripts.service";
import {NewPhone} from "./events-tgbot/set-phone.events";

@Controller()
export class ProfilesController {
    constructor(@Inject('CHANGE_ADDRESS')
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
    getChangeAddress(newProfile) {
        this.client.emit<any>('change_address', new NewProfile(newProfile));
        return console.log('New profile send to TG-BOT:', newProfile);
    }

    @Get()
    getChangePhone(user_id, phone) {
        this.client.emit<any>('change_phone', new NewPhone({user_id, phone}));
        return console.log('New phone send to TG-BOT:', user_id, phone);
    }
    @EventPattern("IMPORT_ADDRESS")
    async handleMessagePrinted(data: Record<string, unknown>) {
        if (data.toString() === 'District no set'){
            console.log('Profile no approved')
        }
            if (data.toString() !== 'District no set') {
            // @ts-ignore
            const newProfile = JSON.parse(data)
            // console.log('newProfile:',newProfile)
            await this.profilesModel.findOneAndUpdate({id: newProfile.id}, {
                $set: {
                    district: newProfile.district,
                    status: newProfile.status,
                    address: newProfile.address,
                }
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
        }
    }
}