import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.NODEMAILER_APP_PASSWORD
    },

    connectionTimeout: 5000, 
    socketTimeout: 5000,
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
