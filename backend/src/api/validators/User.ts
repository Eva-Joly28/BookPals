import { IsAlphanumeric, IsArray, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserPost {
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  refreshToken: string = '';
}

export class UserPatch {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  profilePicture: string;

  @IsOptional()
  username: string;

  @IsOptional()
  @IsArray()
  booksInProgress: string[];

  @IsOptional()
  @IsArray()
  readBooks: string[];

  @IsOptional()
  @IsArray()
  booksToRead: string[];

  @IsOptional()
  @IsArray()
  wishList: string[];

}
