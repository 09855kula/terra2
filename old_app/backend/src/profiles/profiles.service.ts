import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {updateProfileInput} from "./dto/input/update-profile.input";
import {deleteProfileInput} from "./dto/input/delete-profile.input";
import {ProfilesWeb, ProfilesDocument} from "./schemas/profiles.schemas";
import {RoutesService} from "../routes/routes.service";
import {RouteResponseType} from "./interfaces/routes-response-type";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
import {ScriptsService} from "../scripts/scripts.service";
import {ProfilesController} from "./profiles.controller";

const moment = require('moment');

@Injectable()
export class ProfilesService {
    constructor(@InjectModel(ProfilesWeb.name) private profilesModel: Model<ProfilesDocument>,
                @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                @Inject(forwardRef(() => RoutesService)) private readonly routesService: RoutesService,
                @Inject(forwardRef(() => ScriptsService))private readonly scriptsService: ScriptsService,
                @Inject(forwardRef(() => ProfilesController))private readonly profilesController: ProfilesController) {
    }

    async createProfile(input): Promise<ProfilesDocument> {
        let user_id = ''
        const district = null;
        const status = 'pending'
        const special_instruction = input.special_instructions
        const phone = input.phone
        try {
            let user = await this.usersModel.findOneAndUpdate({phones: phone}, {$set: {phone: phone}}).exec();

            if (user == null) return null;
            user_id = user?.id

            let id = 0;

            do {
                id = Math.floor(1000 + Math.random() * 9000);
            } while (await this.profilesModel.findOne({ id }).exec());

            // console.log('create profile', id)

            let profile = await this.profilesModel.create({
                id,
                user_id,
                address: input.address,
                district,
                status,
                phone,
                created: moment().format(),
                special_instructions: special_instruction,
            });
            await profile.save();
            // console.log('created profile', id)
            return await this.profilesModel.findOne({ id }).exec();
        }
        catch (err) {
            console.error(`Could not create Profile for user ${user_id}, err = ${err}`);
            throw err;
        }
    }

    async changeProfile(input): Promise<ProfilesDocument> {
        const special_instructions = input.special_instructions
        // console.log('special_instructions', special_instructions)
        const phone = input.phone
        const address = input.address
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            // console.log('user:',user)
            const id = user.last_profile.toString()
            const last_profile = await this.profilesModel.findOne({id}).exec()
            // console.log('last_profile:',last_profile)
            if(last_profile.address === address) {
                await this.profilesModel.findOneAndUpdate({id}, {special_instructions: special_instructions}).exec()
                return await this.profilesModel.findOne({ id }).exec();
            } else {
                const newProfile = await this.createProfile(input)
                await this.profilesController.getChangeAddress(newProfile)
                return newProfile
            }

        }
        catch (err) {
            console.error(`Could not create Profile for user ${phone}, err = ${err}`);
            throw err;
        }
    }

    async createProfileFriend({user_id, address, phone, friend }): Promise<ProfilesDocument> {

        const district = null;
        const status = 'pending'
        const special_instructions = ''

        try {
            let user = await this.usersModel.findOne({phone}).exec();

            if (user == null) return null;

            let id = 0;

            do {
                id = Math.floor(1000 + Math.random() * 9000);
            } while (await this.profilesModel.findOne({ id }).exec());

            // console.log('create profile', id)

            let profile = await this.profilesModel.create({
                id,
                user_id,
                address,
                district,
                status,
                phone,
                friend,
                created: moment().format(),
                special_instructions,
            });
            await profile.save();
            console.log('created profile', id)
            return await this.profilesModel.findOne({ id }).exec();
        }
        catch (err) {
            console.error(`Could not create Profile for user ${user_id}, err = ${err}`);
            throw err;
        }
    }

    async updateProfile(id, updateProfilesData: updateProfileInput): Promise<ProfilesDocument> {
        return this.profilesModel.findOneAndUpdate(id, updateProfilesData, {new: true}).exec()
    }

    async updateInstruction(input): Promise<ProfilesDocument> {
        const profileId = input.id
        const special_instructions = input.special_instructions
        try {
            let profile = await this.profilesModel.updateOne(
                {id: profileId},
                {special_instructions: special_instructions}).exec();
            if (profile == null) return null;

            const res = await this.profilesModel.find({id: profileId}).exec()

            return res[0]
        } catch (err) {
            console.error(`Could not add Token for User id ${profileId}, err = ${err}`);
            throw err;
        }
    }

    async getProfile({user_id}): Promise<ProfilesDocument[]> {
         const profiles = await this.profilesModel.find({user_id}).exec()

        return profiles.filter(i => i.district)
    }
    async getLastProfile({id}): Promise<ProfilesDocument> {
        return await this.profilesModel.findOne({id}).exec()
    }

    async getRoutesByDistrictFromProfile(getProfileByIdArgs): Promise<RouteResponseType[]> {
        const id = getProfileByIdArgs.id.toString()

        try {
            const profile = await this.profilesModel.findOne({id}).exec();
            if (profile == null) return null;
            const routes = await  this.routesService.getRoutes()
            if (routes == null) return null;
            return await this.scriptsService.getTimeSlot(routes, profile.district)
        } catch (err) {
            console.error(`Could not get Route, err = ${err}`);
            throw err;
        }
    }

    async changeUserPhone(userId, phone) {
        try {

            let profiles = await this.profilesModel.find({user_id: userId}).exec();
            let user = await this.usersModel.find({id: userId}).exec();
            if (profiles == undefined || user == undefined) return null;

            //update user phone
            if (!user[0]?.phones?.includes(phone)) {
                await this.usersModel.updateOne({id: userId}, {$push: {phones: phone}}).exec()
                await this.usersModel.updateOne({id: userId}, {$set: {phone: phone}}).exec()
            } else {
                await this.usersModel.updateOne({id: userId}, {$set: {phone: phone}}).exec()
            }

            for (let i = 0; i < profiles.length; i++) {
                await this.profilesModel.updateOne({id: profiles[i].id}, {$set: {phone}}).exec();
            }

            return await this.profilesModel.find({user_id: userId}).exec();
        } catch (err) {
            console.error(`Could not find user ${userId}, err = ${err}`);
            throw err;
        }
    }

    async getProfiles(): Promise<ProfilesDocument[]> {
        return await this.profilesModel.find().exec();
    }

    async deleteProfile(deleteProfilesData: deleteProfileInput): Promise<ProfilesDocument> {
        return this.profilesModel.findOneAndRemove(deleteProfilesData)

    }


}
