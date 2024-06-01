import Model from "@ember-data/model";
import { attr } from "@ember-data/model/-private/attr";

export default class BookModel extends Model{

    @attr() declare title : string;
    @attr() declare description : string;
    @attr() declare isbn : string;
    @attr() declare authors : string[];
    @attr() declare publisher_date : string;
    @attr() declare publishers : string[];
    @attr() declare categories : string[];
    @attr() declare cover : string;
    @attr() declare default_image : string;
}