import { ListControllerPort } from "src/core/ports/in/ListControllerPort";
import { List } from "../../database/entities/List";
import { Inject, Service } from "typedi";
import { ListRepository } from "../repositories/list.repository";
import { ListService } from "../../core/services/ListService";
import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import JsonApiSerializer from "../../utils/jsonapi-serializer";
import JsonApiDeserializer from "../../utils/deserializer";
import { validateOrReject } from "class-validator";
import { listPatch, listPost } from "../validators/List";
import { RequiredEntityData } from "@mikro-orm/core";

@JsonController('/lists')
@Service()
export class ListController implements ListControllerPort {
    constructor(
        @Inject('listRepo') private readonly listRepository: ListRepository,
        @Inject('listService') private listService: ListService
    ){
        this.listService = new ListService(listRepository);
    }

    @Get('/', {transformResponse:false})
    async getWithFilters(@Req() request: any): Promise<any> {
        const {filters} = request.params();
        let results = await this.listService.getListsWithFilters(filters);
        return JsonApiSerializer.serializeLists(results);
    }

    @Get('/:id',{transformResponse:false})
    async getOne(@Param('id') id: string): Promise<any> {
        let result = await this.listService.getList(id);
        return result!=null ? JsonApiSerializer.serializeList(result) : undefined
    }

    @Post('/', {transformResponse:false})
    async create(@Body() list: any): Promise<any> {
        let deserializeList = JsonApiDeserializer.deserializeList(list);
        console.log(deserializeList);
        await validateOrReject(Object.assign(new listPost(),deserializeList ));
        return this.listService.createList(deserializeList as RequiredEntityData<List>);
    }

    @Patch('/:id',{transformResponse:false})
    async update(@Param('id') id: string, @Body() list: any): Promise<any> {
        let deserializedList = JsonApiDeserializer.deserializeList(list);
        await validateOrReject(Object.assign(new listPatch(),deserializedList ));
        let result = await this.listService.updateList(id,deserializedList);
        return result!=null ? JsonApiSerializer.serializeList(result) : undefined;
    }

    @Delete('/:id', {transformResponse:false})
    async delete(@Param('id') id: string): Promise<void> {
        await this.listService.deleteList(id);
    }

}