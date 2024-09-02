import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { MessageControllerPort } from "src/core/ports/in/MessageControllerPort";
import { Inject, Service } from "typedi";
import { MessageRepository } from "../repositories/message.repository";
import { MessageService } from "../../core/services/MessageService";
import { Message } from "../../database/entities/Message";
import JsonApiSerializer from "../../utils/jsonapi-serializer";
import JsonApiDeserializer from "../../utils/deserializer";
import { validateOrReject } from "class-validator";
import { messagePatch, messagePost } from "../validators/Message";
import { ConversationRepository } from "../repositories/conversation.repository";

@JsonController('/messages')
@Service()
export class MessageController implements MessageControllerPort {
    constructor(
        @Inject('convRepo') private readonly conversationRepository : ConversationRepository,
        @Inject('messageRepo') private readonly messageRepository : MessageRepository,
        @Inject('messageService') private messageService : MessageService
    ){
        this.messageService = new MessageService(messageRepository);
    }

    @Get('/', {transformResponse:false})
    async getWithFilters(@Req() request: any): Promise<any> { 
        let results = await this.messageService.getMessagesWithFilters(request.query);
        return JsonApiSerializer.serializeMessages(results);
    }

    @Post('/',{transformResponse:false})
    async create(@Body() message: any): Promise<any> {
        let deserializedMessage = JsonApiDeserializer.deserializeMessage(message);
        await validateOrReject(Object.assign(new messagePost(), deserializedMessage));
        let conversation = await this.conversationRepository.findOrCreateConversation(deserializedMessage.sender, deserializedMessage.receiver);
        deserializedMessage.conversation = conversation.id;
        let newMessage = await this.messageService.createMessage(deserializedMessage);
        await this.conversationRepository.updateConversation(conversation.id,{lastMessageDate:new Date()});
        return message ? JsonApiSerializer.serializeMessage(newMessage!) : undefined;
    }

    @Get('/:id', {transformResponse:false})
    async getOne(@Param('id') id: string): Promise<any> {
        let result = await this.messageService.getMessage(id);
        return result!=null ? JsonApiSerializer.serializeMessage(result) : undefined
    }

    @Patch('/:id')
    async update(@Param('id') id: string, @Body() message: any): Promise<any> {
        let deserializedMessage = JsonApiDeserializer.deserializeMessage(message);
        await validateOrReject(Object.assign(new messagePatch(), deserializedMessage));
        let result = await this.messageService.updateMessage(id,deserializedMessage);
        return result!=null ? JsonApiSerializer.serializeMessage(result) : undefined;
    }

    @Delete('/:id', {transformResponse:false})
    async delete(@Param('id') id: string): Promise<void> {
        await this.messageService.deleteMessage(id);
    }

    
    
}