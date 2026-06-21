import {Controller} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import {CategoriesService} from "./categories.service";

@Controller()
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {
    }


    @EventPattern("IMPORT_CATEGORIES")
    async handleMessagePrinted(data: Record<string, unknown>) {
        //console.log(data);
        if (data.toString() === "Attention! Import categories initialized TG-BOT") {
            await this.categoriesService.getCategories()
        }

    }
}