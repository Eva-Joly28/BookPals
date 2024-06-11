import Model, { attr } from "@ember-data/model";

export default class BookModel extends Model {
    @attr() declare bookId: string;
    @attr() declare title : string;
    @attr() declare description : string;
    @attr() declare isbn10 : string;
    @attr() declare isbn13 : string;
    @attr() declare authors : string[];
    @attr() declare publishedDate : string;
    @attr() declare publisher : string;
    @attr() declare categories : string[];
    @attr() declare language : string;
    @attr() declare cover : string;
    @attr() declare defaultImage : string;
    @attr() declare views: number;
    @attr() declare pageCount: number;
    @attr() declare snippet: string;
    


}