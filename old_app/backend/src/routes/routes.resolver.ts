import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {RoutesService} from './routes.service';
import {RouteType} from './models/route';
import {GetRouteArgs} from "./dto/args/get-route.args";
import {deleteRouteInput} from "./dto/inputs/delete-route.input";
import {updateRouteInput} from "./dto/inputs/update-route.input";
import { createRouteInput } from './dto/inputs/create-route.dto';
@Resolver()
export class RoutesResolver {
    constructor(
        private readonly routesService: RoutesService,


    ) {
    }

    @Query(() => [RouteType], {name: 'getImportRoutes', nullable: 'items'})
    async getImportRoutes() {
        return this.routesService.getImportRoutes();
    }

    @Query(() => [RouteType], {name: 'getRoutes', nullable: 'items'})
    async getRoutes() {
        return this.routesService.getRoutes();
    }

    @Query(() => RouteType, {name: 'getRoute', nullable: true})
    async getRoute(@Args() getRoutesArgs: GetRouteArgs): Promise<RouteType> {
        return this.routesService.findOneRoute(getRoutesArgs)
    }

    @Mutation(() => RouteType)
    async createRoute(@Args('input') input: createRouteInput) {
        return this.routesService.createRoute(input);
    }

    @Mutation(() => RouteType, {name: 'removeRoute', nullable: true})
    async removeRoute(@Args('input') input: deleteRouteInput): Promise<RouteType> {
        return this.routesService.deleteRoute(input)
    }

    @Mutation(() => RouteType)
    async updateRoute(@Args('input') updateRouteData: updateRouteInput): Promise<RouteType> {
        return this.routesService.updateRoute(updateRouteData.id, updateRouteData)
    }
}
