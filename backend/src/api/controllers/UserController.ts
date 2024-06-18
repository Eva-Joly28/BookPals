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
import JsonApiSerializer from '../../utils/jsonapi-serializer';

@JsonController('/users')
@Service()
export class UserController implements UserControllerPort {
  constructor(
    @Inject('userRepo') private readonly userRepository: UserRepository,
    @Inject('userService') private userService: UserService
) {
    this.userService = new UserService(userRepository)
  }

  @Get('/', {transformResponse:true})
  async getWithFilters(@Req() request: any){
    const {filters} = request.params;
    let users = await this.userService.getUsersWithFilters(filters);
    let filteredUsers = this.filterFields(users,['password']);
    return filteredUsers;
  }

  @Get('/:id',{transformResponse:false})
  async getOne(@Param('id') id: string){
    let user = await this.userService.getUser(id);
    let filtereduser = this.filterFields([user],['password'])[0];
    return filtereduser;
  }

  @Patch('/:id', {transformResponse:false})
  async update(@Param('id') id: string, @Body() body:UserPatch){
    
    let user = await this.userService.updateUser(id, body);
    let filteredUser = this.filterFields([user], ['password'])[0];
    return filteredUser;
  }


  filterFields(entities: any[], excludeFields: string[]): any[] {
    return entities.map(entity => {
      const filteredEntity = { ...entity };
      excludeFields.forEach(field => delete filteredEntity[field]);
      return filteredEntity;
    });
  }

}
