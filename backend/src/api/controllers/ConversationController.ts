import { Delete, Get, JsonController, Param, Req } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ConversationRepository } from "../repositories/conversation.repository";
import JsonApiSerializer from "../../utils/jsonapi-serializer";

@JsonController('/conversations')
@Service()
export class ConversationController{
    constructor(
        @Inject('convRepo') private readonly conversationRepository : ConversationRepository
    ){}

    @Get('/')
    async getConversations(@Req() request:any){
        let conversations = await this.conversationRepository.getUserConversations(request.query.user);
        return JsonApiSerializer.serializeConversations(conversations);
    }

    @Get('/:id')
    async findConversation(@Param('id') id:string){
        let result = await this.conversationRepository.findConversation(id);
        return result!=null ? JsonApiSerializer.serializeConversation(result) : undefined; 
    }

    @Delete('/:id')
    async deleteConversation(@Param('id') id:string){
        await this.conversationRepository.deleteConversation(id);
    }

} 