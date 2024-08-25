import { RequiredEntityData } from "@mikro-orm/core";
import { Message } from "src/database/entities/Message";

export interface MessageRepositoryPort {
    getMessagesWithFilters(query: any): Promise<Message[]>;
    getMessage(id: string): Promise<Message | null>;
    createMessage(message:RequiredEntityData<Message>): Promise<Message | undefined>;
    updateMessage(id:string,book:Partial<Message>):Promise<Message | null>;
    deleteMessage(id:string):Promise<void>;
}