import { EntityManager, EntityRepository,SelectQueryBuilder,wrap } from "@mikro-orm/postgresql";
import { UserRepositoryPort } from "src/core/ports/out/userRepositoryPort";
import { User } from "../../database/entities/User";
import { Service } from "typedi";
import { UserPost, UserPatch } from "../validators/User";
import { NotFoundError } from "routing-controllers";

export interface UserFilters{
    username?:string,
    email?: string,
    orderBy?: string,
    order?:'asc'|'desc',
    limit?: number,
}

@Service('userRepo')
export class UserRepository extends EntityRepository<User> implements UserRepositoryPort {
    constructor(em:EntityManager){
        super(em,User);
    }


    findWithFilters(filters: any): Promise<User[]> {
        const qb = this.em.qb(User).select('*');
        if(filters){
            this.setupFilters(filters, qb);

            if(filters.limit){
                qb.limit(parseInt(filters.limit));
            }
        }
        return qb.getResultList()

    }
    async findById(id: string): Promise<User | null> {
        return await this.findOneOrFail({id});
    }
    async createUser(user: UserPost): Promise<User> {
        const newUser = new User();
        wrap(newUser).assign(user);
        await this.em.persistAndFlush(newUser);
        return newUser;
    }
    async deleteUser(id: string): Promise<void> {
        const result = await this.findOneOrFail({id}, {failHandler: () => new NotFoundError() });
        await this.em.removeAndFlush(result);
    }
    async updateUser(id: string, user: UserPatch): Promise<User> {
        const result = await this.findOneOrFail({id}, {failHandler: () => new NotFoundError() });
        wrap(result).assign(user);
        await this.em.persistAndFlush(result);
        return result;
    }

    filterUsername(filters: UserFilters, qb:SelectQueryBuilder<User>){
        if(filters.username){
            qb.where({username:{$ilike: `%${filters.username}%`}})
        }
    }

    filterEmail(filters: UserFilters, qb:SelectQueryBuilder<User>){
        if(filters.email){
            qb.where({email:{$ilike: `%${filters.email}%`}})
        }
    }

    filterOrderBy(filters: UserFilters, qb:SelectQueryBuilder<User>){
        if(filters.orderBy){
            qb.orderBy({[filters.orderBy]:filters.order||'desc'})
        }
    }

    setupFilters(filters:UserFilters, qb:SelectQueryBuilder<User>){
        this.filterUsername(filters,qb);
        this.filterEmail(filters,qb);
        this.filterOrderBy(filters,qb);
    }
}