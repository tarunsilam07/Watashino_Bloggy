import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export default async function sendEmail({email,emailType,userId}:any){
    try {
        const hashedToken=await bcryptjs.hash(userId.toString(),10);
        const hashedEmail=await bcryptjs.hash(email,10);
        if(emailType==="VERIFY"){
            await User.findByIdAndUpdate(userId,
                {verifyToken:hashedToken,
                verifyTokenExpiry:Date.now() + 3600000,hashedEmail:hashedEmail});
        }else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now() + 3600000,hashedEmail:hashedEmail});
        }
        
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
            }
        });

        const mailOptions = {
            from:'tarun79767@gmail.com',
            to:email,
            subject:emailType==="VERIFY"?"Verify your email":"Reset your password",
            html:`<p>Click <a href=${process.env.DOMAIN}/${emailType==="VERIFY"?"verifyemail":"resetpassword"}?token=${hashedToken}&id=${hashedEmail} >here</a> to ${emailType==="VERIFY"?"Verify your email":"Reset your password"} </p>
            <p>link=${process.env.DOMAIN}/${emailType==="VERIFY"?"verifyemail":"resetpassword"}?token=${hashedToken}&id=${hashedEmail} >here</a> to ${emailType==="VERIFY"?"Verify your email":"Reset your password"}`
        }
        const mailResponse=await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}