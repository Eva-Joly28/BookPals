import { helper } from "@ember/component/helper";
import type BookModel from "ember-boilerplate/models/book";

export default helper(function([book]:[BookModel]){
    if(book.cover.length == 0){
        return book.defaultImage.length? book.defaultImage.replace('http','https') : '/assets/images/image-non-disponible.jpg';
    }
    
    return book.cover.replace('http','https');
})