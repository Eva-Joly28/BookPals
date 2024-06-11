import { wrap } from '@mikro-orm/core';
import {
  JsonController,
  Param,
  Get,
  Body,
  OnNull,
  Patch,
  Req,
} from 'routing-controllers';
import { User } from '../../database/entities/User';
import { UserPost, UserPatch } from '../validators/User';
import { Inject, Service } from 'typedi';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../../core/services/UserService';
import { UserControllerPort } from '../../core/ports/in/UserControllerPort';

@JsonController('/users')
@Service()
export class UserController implements UserControllerPort {
  constructor(
    @Inject('userRepo') private readonly userRepository: UserRepository,
    @Inject('userService') private userService: UserService
) {
    this.userService = new UserService(userRepository)
  }

  @Get('/', {transformResponse:false})
  async getWithFilters(@Req() request: any): Promise<User[]> {
    const {filters} = request.params;
    let users = await this.userService.getUsersWithFilters(filters);
    return this.filterFields(users,['password']);
  }

  @Get('/:id',{transformResponse:false})
  async getOne(@Param('id') id: string): Promise<User | null> {
    let user = await this.userService.getUser(id);
    return this.filterFields([user],['password'])[0];
  }

  @Patch('/:id', {transformResponse:false})
  async update(@Param('id') id: string, @Body() body:UserPatch): Promise<User | null> {
    
    let user = await this.userService.updateUser(id, body);
    return this.filterFields([user], ['password'])[0];
  }





  filterFields(entities: any[], excludeFields: string[]): any[] {
    return entities.map(entity => {
      const filteredEntity = { ...entity };
      excludeFields.forEach(field => delete filteredEntity[field]);
      return filteredEntity;
    });
  }

}
