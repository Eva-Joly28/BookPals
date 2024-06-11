import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

export class Encrypt{
    static async passwordEncrypt(password: string) {
        return bcrypt.hash(password,10);
    }

    static async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    static async generateToken(payload: any){
        return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'})
    }
}