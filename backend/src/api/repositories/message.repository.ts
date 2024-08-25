import { EntityManager, EntityRepository, Knex, knex, QueryBuilder, raw, RequiredEntityData, SelectQueryBuilder, wrap } from "@mikro-orm/postgresql";
import { MessageRepositoryPort } from "src/core/ports/out/messageRepositoryPort.ts";
import { Message } from "../../database/entities/Message";
import { Service } from "typedi";
import { Conversation } from "src/database/entities/Conversation";

export interface messageFilters{
    conversation?: string;
    offset?:number,
    limit?: number,
}

@Service('messageRepo')
export class MessageRepository extends EntityRepository<Message> implements MessageRepositoryPort {
    constructor(em:EntityManager){
        super(em, Message)
    }

    async getMessagesWithFilters(filters: any): Promise<Message[]> {
        const qb = this.em.qb(Message,'m')
        if(filters.conversation){
            qb.select('*')
            .leftJoinAndSelect('m.conversation', 'conversation')
            .leftJoinAndSelect('m.sender','sender')
            .leftJoinAndSelect('m.receiver','receiver')
            .where({conversation: filters.conversation});
        }
        qb.orderBy({createdAt:'DESC'});
        
        if(filters){
            if(filters.offset){
                qb.offset(parseInt(filters.offset))
            }

            if(filters.limit){
                qb.limit(parseInt(filters.limit));
            }
        }
        return qb.execute('all');
        // await this.em.populate(results, ['messages.sender'])
    }
    async getMessage(id: string): Promise<Message | null> {
        return await this.findOne({id}, {populate:['*']});
    }

    async getConversionMessages(conversation: Conversation) {
        return this.find({conversation},{orderBy:{createdAt: 'ASC'},populate:['*']});
    }

    async createMessage(message: RequiredEntityData<Message>): Promise<Message | undefined> {
        const newMessage = new Message();
        wrap(newMessage).assign(message,{em:this.em});
        await this.em.persistAndFlush(newMessage);
        return newMessage;
    }

    async updateMessage(id: string, message: Partial<Message>): Promise<Message | null> {
        
        const result = await this.findOne({id},{populate:['*']});
        if(!result || result===null){
            return null;
        }
        wrap(result!).assign(message);
        console.log(result);
        await this.em.persistAndFlush(result!);
        return result;
    }

    async deleteMessage(id: string): Promise<void> {
        const result = await this.findOne({id},{populate:['*']});
            if(result && result!== null){
                await this.em.removeAndFlush(result!);
            }
    }


}