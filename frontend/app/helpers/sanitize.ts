import { helper } from "@ember/component/helper";
import { htmlSafe } from "@ember/template";
import sanitizeHtml from 'sanitize-html';

export default helper(function sanitize([description] : [string]){
    const clean = sanitizeHtml(description, {
        allowedTags:['br','i','p','strong','b'],
        allowedAttributes:{}
    });
    console.log(clean);
    return htmlSafe(clean);
});