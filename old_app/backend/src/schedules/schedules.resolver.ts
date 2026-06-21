import {Query, Resolver, Args, Mutation} from "@nestjs/graphql";
import {SchedulesType} from "./models/schedules";
import {SchedulesService} from "./schedules.service";
import {GetScheduleArgs} from "./dto/args/get-schedule.args";
import {createSchedulesInput} from "./dto/input/create-schedule.input";
import {updateScheduleInput} from "./dto/input/update-schedule.input";
import {deleteScheduleInput} from "./dto/input/delete-schedule.input";

@Resolver(() => SchedulesType)
export class SchedulesResolver {
    constructor(private readonly schedulesService: SchedulesService) {
    }

    @Query(() => SchedulesType, {name: 'getSchedule', nullable: true})
    async getSchedule(@Args() getScheduleArgs: GetScheduleArgs): Promise<SchedulesType> {
        return this.schedulesService.getSchedule(getScheduleArgs)
    }

    @Query(() => [SchedulesType], {name: 'getSchedules', nullable: 'items'})
    async getSchedules(): Promise<SchedulesType[]> {
        return this.schedulesService.getSchedules()
    }

    @Mutation(() => SchedulesType)
    async createSchedule(@Args('input') input: createSchedulesInput): Promise<SchedulesType> {
        return this.schedulesService.createSchedule(input)
    }

    @Mutation(() => SchedulesType)
    async updateSchedule(@Args('input') input: updateScheduleInput): Promise<SchedulesType> {
        return this.schedulesService.updateSchedule(input.id, input)
    }

    @Mutation(() => SchedulesType)
    async deleteSchedule(@Args('input') input: deleteScheduleInput): Promise<SchedulesType> {
        return this.schedulesService.deleteSchedule(input)
    }
}