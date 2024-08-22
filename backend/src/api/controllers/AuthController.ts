import { Body, Get, JsonController, Param, Post, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../../core/services/UserService";
import { Encrypt } from "../../utils/encrypt";
import { User } from "../../database/entities/User";
import { sendVerificationEmail } from "../../utils/mailService";
import { AnyEntity } from "@mikro-orm/core";
import { UserPatch, UserPost } from "../validators/User";
import { http } from "winston";
import { log } from "console";


const JWT_SECRET = process.env.JWT_SECRET as any ;

@JsonController('/auth')
@Service()
export class AuthController{
    constructor(
        @Inject('userRepo') private readonly userRepository: UserRepository,
        @Inject('userService') private userService: UserService
    ){
        this.userService = new UserService(userRepository)
    }


    @Post('/register',{transformResponse:false})
    async register(@Body() user:UserPost){
        const hashedPassword = await Encrypt.passwordEncrypt(user.password);
        const email = user.email;
        const verificationToken = await Encrypt.generateToken({email});
        try{
            user.password = hashedPassword; 
            console.log(user)
            const newUser = await this.userService.createUser(user);
            const token = await Encrypt.generateToken({userId: newUser.id})
            newUser.verificationToken = token;
            await this.userRepository.getEntityManager().flush();
            return {
                id : newUser.id,
                username : newUser.username,
            }
        } catch (error) {
            console.log(error);
            return undefined
        }
    }

    @Post('/login')
    async login(@Body() body:any, @Res() res:any){
        const {username, password} = body;
        const user = await this.userRepository.findOne({username});
        if(!user || !(await Encrypt.comparePassword(password, user.password))){
            return res.status(400).send('identifiants incorrects')
        }
        const token = await Encrypt.generateToken({userId: user.id})
        let refreshToken = await Encrypt.generateToken({user});
        user.verificationToken = token;
        await this.userRepository.getEntityManager().flush();
        return {id:user.id,accessToken:token,refreshToken};
    }

    @Post('/refresh-token')
    async refreshToken(@Req() req:any, @Res() res:any){

        const { token } = req.body;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const newToken = await Encrypt.generateToken({userId: decoded.userId});
            res.send({token: newToken });
        } 
        catch (error) {
            res.status(400).send('Invalid token');
        }
    }

    @Post('/forgot-password',{transformResponse:false})
    async forgotPassword(@Body() user:UserPatch){
        const {email} = user;
        const actualUser = await this.userRepository.findOne({email}); 
        if(!actualUser){
            throw new Error(' user not found');
        }
        const token = await Encrypt.generateToken({userId:actualUser.id});
        await sendVerificationEmail(email, token);
        
    }

    @Post('/reset-password/:token',{transformResponse:false})
    async resetPassword(@Param('token') token:string, @Body() body:UserPatch){
        const decoded = jwt.verify(token as string, JWT_SECRET) as {id: string};
        const {password} = body;
        const user = await this.userRepository.findOne({id: decoded.id}); 
        if(!user){
            throw new Error(' user not found');
        }
        const hashedPassword = await Encrypt.passwordEncrypt(password);
        user.password = hashedPassword
        this.userRepository.getEntityManager().flush();
        return {message: 'password reset successful'}
    }

}