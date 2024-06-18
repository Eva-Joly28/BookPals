import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { ratingPatch, ratingPost } from "../validators/Rating";
import { Inject, Service } from "typedi";
import { RatingRepository } from "../repositories/rating.repository";
import { RatingControllerPort } from "src/core/ports/in/RatingControllerPort";
import { RatingService } from "../../core/services/RatingService";
import { RequiredEntityData } from "@mikro-orm/core";
import { Rating } from "src/database/entities/Rating";

@JsonController('/ratings')
@Service()
export class RatingController implements RatingControllerPort  {
  constructor(
    @Inject('ratingRepo') private readonly ratingRepository: RatingRepository,
    @Inject('ratingService') private ratingService: RatingService
) {
    this.ratingService = new RatingService(ratingRepository)
  }

  @Get('/', {transformResponse:false})
  async getWithFilters(@Req() request: any){
    const {filters} = request.params;
    return await this.ratingService.getRatingsWithFilters(filters);

  }

  @Get('/:id',{transformResponse:false})
  async getOne(@Param('id') id: string){
    return await this.ratingService.getRating(id);
  }

  @Post('/',{transformResponse:false})
  async create(@Body() body: ratingPost){
    return await this.ratingService.createRating(body as RequiredEntityData<Rating>);
  }

  @Patch('/:id', {transformResponse:false})
  async update(@Param('id') id: string, @Body() body:ratingPatch){
    return await this.ratingService.updateRating(id, body);
  }

  @Delete('/:id', {transformResponse: false})
  async delete(@Param('id') id:string){
    await this.ratingService.deleteRating(id);
  }


}