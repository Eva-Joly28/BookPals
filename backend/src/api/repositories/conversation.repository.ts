import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
import { Conversation } from "../../database/entities/Conversation";
import { Service } from "typedi";

@Service('convRepo')
export class ConversationRepository extends EntityRepository<Conversation>{
    constructor(em: EntityManager){
        super(em,Conversation);
    }

    async getUserConversations(user:string){
        // const qb = this.em.qb(Conversation,'c')
        // .select('*')
        // .leftJoinAndSelect('c.messages','m')
        // .leftJoinAndSelect('m.sender','sender')
        // .leftJoinAndSelect('m.receiver','receiver');
        // qb.where({
        //     participants: { $in: [user] }
        // }).orderBy({lastMessageDate:'DESC'})

        // return qb.execute('all');
        const results = await this.find({
            participants: {$in:[user]} }, 
            {
                orderBy: {lastMessageDate:'DESC'},
                populate: ['*']
            })
        return results;
    }

    async findOrCreateConversation(sender: string, receiver: string ){
        const qb = this.em.qb(Conversation)
        .select('*').where({
            $and: [
                { participants: { $in: [sender] } },
                { participants: { $in: [receiver] } }
            ]
        });
        let conversation = await qb.execute('get');

        if(!conversation){
            conversation = new Conversation();
            wrap(conversation).assign({participants:[sender,receiver]},{em:this.em});
            await this.em.persistAndFlush(conversation);
        }
        return conversation;
    }

    async updateConversation(id:string,data : Partial<Conversation>){
        let conv = await this.findOne({id},{populate:['*']});

        if(!conv || conv == null){
            throw new Error('conversation inexistante');
        }
        wrap(conv).assign(data);
        await this.em.persistAndFlush(conv);
    }

    async deleteConversation(id: string){
        const result = await this.findOne({id},{populate:['*']});
        if(result && result!== null){
            await this.em.removeAndFlush(result);
        }
    }

    


}
