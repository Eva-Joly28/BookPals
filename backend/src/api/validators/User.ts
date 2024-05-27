import { IsAlphanumeric, IsArray, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserPost {
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserPatch {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  username: string;

  @IsOptional()
  @IsArray()
  booksInProgress: string[];

  @IsOptional()
  @IsArray()
  booksToRead: string[];

  @IsOptional()
  @IsArray()
  wishList: string[];

}
