import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ProfilesType} from "./models/profile";
import {ProfilesService} from "./profiles.service";
import {GetProfileArgs} from "./dto/args/get-profile.args";
import {createProfileInput} from "./dto/input/create-profile.input";
import {updateProfileInput} from "./dto/input/update-profile.input";
import {deleteProfileInput} from "./dto/input/delete-profile.input";
import {GetProfileById} from "./dto/args/get-profile-by-id";
import {RouteResponseType} from "./interfaces/routes-response-type";
import {RoutesResponseFromDistrictsType} from "./models/routes-response-from-districts";
import {changeUserPhoneInput} from "./dto/input/change-user-phone.input";
import {updateInstructionsInput} from "./dto/input/update-instructions.input";
import {ProfilesController} from "./profiles.controller";
import {GetProfilesArgs} from "./dto/args/get-profiles.args";


@Resolver(() => ProfilesType)
export class ProfilesResolver {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly profilesController: ProfilesController) {
    }

    @Query(() => [ProfilesType], {name: 'getProfile', nullable: 'items'})
    async getProfile(@Args() getProfileArgs: GetProfileArgs): Promise<ProfilesType[]> {
        return this.profilesService.getProfile(getProfileArgs)
    }
    @Query(() => ProfilesType, {name: 'getLastProfile', nullable: true})
    async getLastProfile(@Args() getProfilesArgs: GetProfilesArgs): Promise<ProfilesType> {
        return this.profilesService.getLastProfile(getProfilesArgs)
    }

    @Query(() => [RoutesResponseFromDistrictsType], {name: 'getRoutesByDistrictFromProfile', nullable: true})
    async getRoutesByDistrictFromProfile(@Args() getProfileByIdArgs: GetProfileById): Promise<RouteResponseType[]> {
        return await this.profilesService.getRoutesByDistrictFromProfile(getProfileByIdArgs)
    }

    @Query(() => [ProfilesType], {name: 'getProfiles', nullable: 'items'})
    async getProfiles(): Promise<ProfilesType[]> {
        return this.profilesService.getProfiles()
    }

    @Mutation(() => ProfilesType)
    async createProfile(@Args('input') input: createProfileInput): Promise<ProfilesType> {
        const newProfile = await this.profilesService.createProfile(input)
        await this.profilesController.getChangeAddress(newProfile)
        return newProfile
    }
    @Mutation(() => ProfilesType)
    async changeProfile(@Args('input') input: createProfileInput): Promise<ProfilesType> {
        return await this.profilesService.changeProfile(input)
    }

    @Mutation(() => ProfilesType)
    async changeUserPhone(@Args('input') input: changeUserPhoneInput): Promise<ProfilesType[]> {
        await this.profilesController.getChangePhone(input.user_id, input.phone)
        return this.profilesService.changeUserPhone(input.user_id, input.phone)
    }

    @Mutation(() => ProfilesType)
    async updateProfile(@Args('input') input: updateProfileInput): Promise<ProfilesType> {
        return this.profilesService.updateProfile(input.id, input)
    }

    @Mutation(() => ProfilesType)
    async updateInstruction(@Args('input') input: updateInstructionsInput): Promise<ProfilesType> {
        return this.profilesService.updateInstruction(input)
    }

    @Mutation(() => ProfilesType)
    async deleteProfile(@Args('input') input: deleteProfileInput): Promise<ProfilesType> {
        return this.profilesService.deleteProfile(input)
    }
}