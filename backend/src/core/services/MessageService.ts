import { Service } from "typedi";
import { MessageRepositoryPort } from "../ports/out/messageRepositoryPort.ts";
import { RequiredEntityData } from "@mikro-orm/core";
import { Message } from "../../database/entities/Message.js";

@Service('messageService')
export class MessageService{
    constructor(private readonly messageRepository : MessageRepositoryPort){}

    async getMessagesWithFilters(query : any) : Promise<Message[]>{
        return await this.messageRepository.getMessagesWithFilters(query);
    }

    async getMessage(messageId: string){
        return await this.messageRepository.getMessage(messageId);
    }

    async createMessage(message:RequiredEntityData<Message>) : Promise<Message|undefined>{
        return await this.messageRepository.createMessage(message);
    }

    async updateMessage(id:string, book:Partial<Message>): Promise<Message | null>{
        return await this.messageRepository.updateMessage(id,book)
    } 

    async deleteMessage(id:string){
        await this.messageRepository.deleteMessage(id);
    }
}