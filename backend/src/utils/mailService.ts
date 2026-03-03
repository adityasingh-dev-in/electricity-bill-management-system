import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.NODEMAILER_APP_PASSWORD,
    },
    tls: {
        // This is crucial: it prevents the connection from dropping 
        // if Render has trouble verifying Gmail's SSL certificate
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    },
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: `"Electricity Board" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html
    };

    return await transporter.sendMail(mailOptions);
};
