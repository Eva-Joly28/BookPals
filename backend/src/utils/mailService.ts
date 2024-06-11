import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import path from 'path';

const {URL,CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, MAIL_USERNAME} = process.env;

const OAuth2 = google.auth.OAuth2; 
const authClient = new OAuth2(CLIENT_ID, CLIENT_SECRET,'https://developers.google.com/oauthplayground');
authClient.setCredentials({
    refresh_token: REFRESH_TOKEN
});



export const sendVerificationEmail = async (email: string, token: string) => {
    const accessToken = await authClient.getAccessToken();
    const url = `${URL}/reset-password?token=${token}`;

    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAIL_USERNAME,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        } as any);

        transporter.use('compile', nodemailerExpressHandlebars({
            viewEngine: {
              extname: '.hbs',
              partialsDir: path.resolve('./emails/'),
              defaultLayout:'./emails/template',
            },
            viewPath: path.resolve('./emails/'),
            extName: '.hbs',
          }));
    
        await transporter.sendMail({
            from: MAIL_USERNAME,
            to: email,
            subject: 'mot de passe oublié',
            template : 'template',
            context:{resetToken : token}
        } as any);
    }
    catch(e){
        console.log(e);
    }
}