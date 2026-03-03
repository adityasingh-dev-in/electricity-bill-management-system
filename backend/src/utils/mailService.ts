import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.NODEMAILER_APP_PASSWORD,
    },
    tls: {
        // This helps if the server has issues with certificate self-signing
        rejectUnauthorized: false 
    },
    connectionTimeout: 10000, // Give it 10 seconds to connect
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
