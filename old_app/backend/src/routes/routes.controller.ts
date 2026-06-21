import {Controller} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import {RoutesService} from "./routes.service";

@Controller()
export class RoutesController {
    constructor(
        private readonly routesService: RoutesService
    ) {
    }


    @EventPattern("IMPORT_ROUTES")
    async handleMessagePrinted(data: Record<string, unknown>) {
        //console.log(data);
        if (data.toString() === "Attention! Import routes initialized TG-BOT") {
            await this.routesService.getImportRoutes()
        }

    }
}