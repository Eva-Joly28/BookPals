import { ArrayMinSize } from "class-validator";

export class conversationPost {

@ArrayMinSize(2)
declare participants : string[]

}