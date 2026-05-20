import nodemailer from 'nodemailer';

import * as dotenv from 'dotenv';


dotenv.config ();

export const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : Number(process.env.SMTP_PORT),
    secure : false,

    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    }
});

transporter.verify((error, sucesss)=> {
    if (error) console.log("SMTP error:", error);

    else
        console.log("SMTP server is ready");
        
    })





    

    







