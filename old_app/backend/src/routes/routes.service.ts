import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {v4 as uuidv4} from 'uuid';
import {RoutesWeb} from './interfaces/routes.interface';
import {GetRoutesArgs} from './dto/args/get-routes.args';
import {deleteRouteInput} from "./dto/inputs/delete-route.input";
import {updateRouteInput} from "./dto/inputs/update-route.input";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";



@Injectable()
export class RoutesService {


    constructor(
        @InjectModel('RoutesWeb') private readonly routesModel: Model<RoutesWeb>,
        @InjectModel(UsersWeb.name ) private readonly usersModel: Model<UsersWebDocument>,
        private readonly googleSheetsService: GoogleSheetsService,
        ) {
    }

    async createRoute(createRouteDto: GetRoutesArgs): Promise<RoutesWeb> {
        const createdRoute = new this.routesModel(createRouteDto)
        return await createdRoute.save();
    }
    async getRoutes(){
        return await this.routesModel.find().exec();
    }

    async getImportRoutes(): Promise<RoutesWeb[]> {
        this.routesModel.remove({})
        const splitRowsByDriver = await this.googleSheetsService.importRoutes()

        const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const DISTRICT = {
            'Monday': 1, 'Tuesday': 3, 'Wednesday': 5, 'Thursday': 7, 'Friday': 9, 'Saturday': 11, 'Sunday': 13
        };
        const TIMESLOT = {
            'Monday': 2, 'Tuesday': 4, 'Wednesday': 6, 'Thursday': 8, 'Friday': 10, 'Saturday': 12, 'Sunday': 14
        };
        const CUTOFF = 0;
        let cron_job_set = false;
        let first_driver;
        let two_driver;
        for (let rows of splitRowsByDriver) {
            let cutoffs = [];
            let cutoffs_2 = [];
            let cutOffObj = DAYS.reduce((a, key) => {
                return Object.assign(a, {[key]: ""})
            }, {});
            const cutOffObj_2 = DAYS.reduce((a, key) => {
                return Object.assign(a, {[key]: ""})
            }, {});
            const cutOffObj_3 = DAYS.reduce((a, key) => {
                return Object.assign(a, {[key]: ""})
            }, {});
            const cutOffObj_4 = DAYS.reduce((a, key) => {
                return Object.assign(a, {[key]: ""})
            }, {});
            const _routes = rows.map(async row => {
                if (row[DISTRICT['Monday']] === 'Monday') {
                    const r = await this.getCreateRoute(row[0]);
                    await this.routesModel.updateOne({id: r.id}, {
                        $set: {points: []}
                    }).exec();
                    return r;
                }
                if (row[CUTOFF] === 'Cutoff 1') {
                    cutoffs.push(row);
                }
                if (row[CUTOFF] === 'Cutoff 2') {
                    cutoffs_2.push(row);
                }
                return null;
            });
            const awaitedRoutes = await Promise.all(_routes);
            const __routes = awaitedRoutes.map(async (route, i, array) => {
                if (!route) {
                    let j = i - 1;
                    while (!array[j] && j >= 0) j--;
                    let id = array[j].id;
                    if (!first_driver) first_driver = id;
                    if (first_driver) two_driver = id
                    const index = i - j - 1;
                    const _week = DAYS.map(
                        async weekday => {
                            const d = rows[i][DISTRICT[weekday]],
                                t = rows[i][TIMESLOT[weekday]];
                            if (!d || !t) return null;

                            return await this.setPoint(id, {
                                index, weekday, district: d, timeslot: t
                            });
                        }
                    );
                    DAYS.map(
                        (weekday) => {
                            let cutOffRead
                            let cutOffRead_2
                            let cutOffRead_3
                            if (id === first_driver) {
                                cutOffRead = cutoffs[0][TIMESLOT[weekday]];
                                cutOffObj[weekday] = cutOffRead
                                cutOffRead_2 = cutoffs_2[0][TIMESLOT[weekday]];
                                cutOffObj_3[weekday] = cutOffRead_2

                                this.setCutOffs(id,
                                    cutOffObj, cutOffObj_3
                                );
                            } else {
                                cutOffRead = cutoffs[1][TIMESLOT[weekday]];
                                cutOffObj_2[weekday] = cutOffRead
                                cutOffRead_3 = cutoffs_2[1][TIMESLOT[weekday]];
                                cutOffObj_4[weekday] = cutOffRead_3
                                this.setCutOffs(
                                    id, cutOffObj_2, cutOffObj_4
                                );
                            }

                        }
                    );
                    return Promise.all(_week);
                }
                return route
            });
            const routes = await Promise.all(__routes)


            if (!cron_job_set) {
                const currentDriverCutoffs = await this.getCutOffs(first_driver || two_driver);
                const sundayCutoff = currentDriverCutoffs && currentDriverCutoffs.Sunday ?
                    currentDriverCutoffs.Sunday :
                    null;
                // debugger;
                // if (sundayCutoff) {
                //     WeekToggleCron && WeekToggleCron.changeTime(sundayCutoff);
                // } else {
                //     WeekToggleCron && WeekToggleCron.changeTime("12:00");
                // }
                //set cron
                cron_job_set = true;
            }

            const updated = await Promise.all(routes.map(
                async r => r.name && await this.usersModel.updateOne({phone: r.name}, {
                    $set: {route: r.name}
                }).exec()
            ));
        }
        const routesFromMongo = await this.routesModel.find().exec();
        console.log('Attention! Import routes from Google sheets success:', routesFromMongo.map(i => i.name))
        return await this.routesModel.find().exec();
    }

    async findOneRoute(id): Promise<RoutesWeb> {
        return await this.routesModel.findOne(id).exec();
    }

    async deleteRoute(deleteRouteData: deleteRouteInput): Promise<RoutesWeb> {
        return this.routesModel.findOneAndRemove(deleteRouteData)
    }

    async updateRoute(id, updateProductData: updateRouteInput): Promise<RoutesWeb> {
        return this.routesModel.findOneAndUpdate(id, updateProductData, {new: true})
    }

    async getCreateRoute(name) {
        let route = await this.routesModel.findOne({name});
        if (!route) {
            route = await this.createRouteFromModel(name);
        }
        return route;
    }

    async createRouteFromModel(name) {
        const route = new this.routesModel({
            id: uuidv4(),
            name,
            points: []
        });
        await route.save()
        return route;
    }

    async getPoint(id, point) {
        try {
            const route = await this.routesModel.findOne({id});
            if (!route) return null;

            const {index, weekday} = point;

            return route.points.find(
                p => (p.index == index && p.weekday == weekday)
            );
        } catch (err) {
            console.error(`Could not get Route id ${id}, err = ${err}`);
            throw err;
        }
    }

    async setPoint(id, point) {
        try {
            const route = await this.routesModel.findOne({id});
            if (!route) return null;

            const {index, weekday} = point;

            const _point = await this.getPoint(id, point);

            if (!_point) {
                await this.routesModel.updateOne({id}, {
                    $push: {points: point}
                });

                return await this.getPoint(id, point);
            }

            const changed = route.points.map(
                (p, i) => (p.index == index && p.weekday == weekday) ? point : p
            );

            await this.routesModel.updateOne({id}, {
                $set: {points: changed}
            });

            return await this.getPoint(id, point);
        } catch (err) {
            console.error(`Could not get Route id ${id}, err = ${err}`);
            throw err;
        }
    }


    async setCutOffs(id, cut_offs, cut_offs_2) {
        try {
            let route = await this.routesModel.findOne({id}).exec();
            if (route == null) return null;

            await this.routesModel.updateOne({id}, {
                $set: {cut_offs, cut_offs_2}
            }).exec();

            return await this.routesModel.findOne({id}).exec();
        } catch (err) {
            console.error(`Could not set cutoffs of Route id ${id}, err = ${err}`);
            throw err;
        }
    }

    async getCutOffs(id) {
        try {
            let route = await this.routesModel.findOne({id}).exec();
            if (route == null) return null;
            return route.cut_offs && route.cut_offs_2 || null;
        } catch (err) {
            console.error(`Could not get cutoffs of Route id ${id}, err = ${err}`);
            throw err;
        }
    }

}
