import { IsNotEmpty, IsOptional } from "class-validator";

export class messagePost{
    @IsNotEmpty()
    content: string;

    sender: string;

    receiver: string;
}

export class messagePatch{
    @IsOptional()
    content: string;

    @IsOptional()
    isRead: boolean;
}