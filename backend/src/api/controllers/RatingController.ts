import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { ratingPatch, ratingPost } from "../validators/Rating";
import { Inject, Service } from "typedi";
import { RatingRepository } from "../repositories/rating.repository";
import { RatingControllerPort } from "src/core/ports/in/RatingControllerPort";
import { RatingService } from "../../core/services/RatingService";
import { RequiredEntityData } from "@mikro-orm/core";
import { Rating } from "src/database/entities/Rating";
import JsonApiSerializer from "../../utils/jsonapi-serializer";
import { validateOrReject } from "class-validator";
import JsonApiDeserializer from "../../utils/deserializer";

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
    return JsonApiSerializer.serializeRatings(await this.ratingService.getRatingsWithFilters(request.query));

  }

  @Get('/:id',{transformResponse:false})
  async getOne(@Param('id') id: string){
    let result = await this.ratingService.getRating(id);
    return result!==null ? JsonApiSerializer.serializeRating(result): undefined;
  }

  @Post('/',{transformResponse:false})
  async create(@Body() body: any){
    let deserializedRate = JsonApiDeserializer.deserializeRating(body);
    await validateOrReject(Object.assign(new ratingPost(),deserializedRate))
    let result = await this.ratingService.createRating(deserializedRate as RequiredEntityData<Rating>);
    return result ? JsonApiSerializer.serializeRating(result) : undefined
;  }

  @Patch('/:id', {transformResponse:false})
  async update(@Param('id') id: string, @Body() body:any){
    let deserializedRate = JsonApiDeserializer.deserializeRating(body);
    await validateOrReject(Object.assign(new ratingPatch(),deserializedRate));
    let result = await this.ratingService.updateRating(id, deserializedRate as Partial<Rating>);
    return result ? JsonApiSerializer.serializeRating(result) : undefined
; 
  }

  @Delete('/:id', {transformResponse: false})
  async delete(@Param('id') id:string){
    await this.ratingService.deleteRating(id);
  }


}