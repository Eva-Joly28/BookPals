import { wrap } from '@mikro-orm/core';
import {
  JsonController,
  Param,
  Get,
  Post,
  Put,
  Delete,
  NotFoundError,
  Body,
  OnNull,
  Patch,
} from 'routing-controllers';
import { User } from '../../database/entities/User';
import { UserPost, UserPatch } from '../validators/User';
import { Service } from 'typedi';
import { ResponseSchema } from 'routing-controllers-openapi';
import { AppService } from '../../core/services/AppService';
import { AnyString } from '@mikro-orm/core/typings';

@JsonController('/users')
@Service()
export class UserController {
  constructor(public appService: AppService) {}
  @Get('/', { transformResponse: false })
  @ResponseSchema(User)
  async getAll(): Promise<User[]> {
    const em = this.appService.getEntityManager();
    const result = await (
      await em.getRepository<User>('User').findAll()
    );
    return result;
  }

  @Get('/:id', { transformResponse: false })
  @OnNull(404)
  @ResponseSchema(User)
  async getOne(@Param('id') id: string): Promise<User | null> {
    const em = this.appService.getEntityManager();
    return await em.getRepository<User>('User').findOne({ id });
  }

  @Post('/', { transformResponse: false })
  @ResponseSchema(User)
  async post(@Body() user: UserPost): Promise<User> {
    const em = this.appService.getEntityManager();
    const userBdd = new User();
    wrap(userBdd).assign(user);
    await em.persistAndFlush(userBdd);
    return userBdd;
  }

  @Patch('/:id', { transformResponse: false })
  @ResponseSchema(User)
  async put(@Param('id') id: string, @Body() user: UserPatch): Promise<User> {
    const em = this.appService.getEntityManager();
    const result = await em
      .getRepository<User>('User')
      .findOneOrFail({ id }, { failHandler: () => new NotFoundError() });
    wrap(result).assign(user);
    await em.persistAndFlush(result);
    return result;
  }

  @Delete('/:id', { transformResponse: false })
  @ResponseSchema(User)
  async remove(@Param('id') id: string) {
    const em = this.appService.getEntityManager();
    const result = await em
      .getRepository<User>('User')
      .findOneOrFail({ id }, { failHandler: () => new NotFoundError() });
    em.removeAndFlush(result);
    return result;
  }
}
