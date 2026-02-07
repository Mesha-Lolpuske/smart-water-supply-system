import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter (VERY IMPORTANT for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP ERROR:', error);
  } else {
    console.log('SMTP READY: Email server is ready');
  }
});

export const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
  from: `"Water Supply Management" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Verify Your Account - Water Supply Management',
  text: `Hello ${name}, your OTP is ${otp} (expires in 10 minutes).`,
  html: `
    <div style="font-family:Arial,sans-serif;padding:20px;">
      <h2 style="margin:0 0 8px 0;">Hello ${name},</h2>
      <p style="margin:0 0 12px 0;">Your verification code is:</p>
      <div style="font-size:28px;color:#4CAF50;letter-spacing:4px;margin:8px 0;">${otp}</div>
      <p style="color:#666;font-size:14px;margin-top:12px;">This code expires in 10 minutes.</p>
    </div>
  `
};

    await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully to', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};
export const sendPasswordResetOTP = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: `"Water Supply Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Water Supply Management',
      text: `Hello ${name}, your password reset code is ${otp} (expires in 10 minutes).`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2 style="margin:0 0 8px 0;">Hello ${name},</h2>
          <p style="margin:0 0 12px 0;">You requested to reset your password. Your verification code is:</p>
          <div style="font-size:28px;color:#FF5722;letter-spacing:4px;margin:8px 0;">${otp}</div>
          <p style="color:#666;font-size:14px;margin-top:12px;">This code expires in 10 minutes.</p>
          <p style="color:#666;font-size:14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset OTP sent successfully to', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    return false;
  }
};