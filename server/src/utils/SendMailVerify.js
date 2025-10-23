const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const MailVerifyAccount = async (email, otp) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        await transport.sendMail({
            from: `"MacOne" <${process.env.USER_EMAIL}>`,
            to: email,
            subject: 'Xác thực tài khoản - MacOne',
            text: `Cảm ơn bạn đã đăng ký tài khoản tại MacOne. Mã OTP để xác thực tài khoản của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #27ae60;">MacOne</h2>
                        <p style="color: #555; font-size: 14px;">Xác thực tài khoản của bạn</p>
                    </div>
                    <p>Xin chào <strong>${email}</strong>,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>MacOne</strong>. Để hoàn tất quá trình tạo tài khoản, vui lòng nhập mã OTP dưới đây:</p>
                    <p style="text-align: center; font-size: 22px; font-weight: bold; color: #27ae60; letter-spacing: 2px;">${otp}</p>
                    <p>Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                    <p>Nếu bạn không thực hiện đăng ký tài khoản này, vui lòng bỏ qua email.</p>
                    <p style="margin-top: 20px; font-size: 14px; text-align: center; color: #777;">Trân trọng,</p>
                    <p style="text-align: center; color: #27ae60; font-size: 18px;">Đội ngũ MacOne</p>
                </div>
            `,
        });

        console.log('✅ Email xác thực đã được gửi đến:', email);
    } catch (error) {
        console.error('❌ Lỗi khi gửi email xác thực:', error);
    }
};

module.exports = MailVerifyAccount;
