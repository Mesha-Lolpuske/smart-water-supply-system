import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD
  }
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.log('BREVO SMTP ERROR:', error);
  } else {
    console.log('BREVO SMTP READY: Email server is active');
  }
});

export const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL,
      to: email,
      subject: 'Verify Your Maji Track Account', // Updated Subject
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff; padding: 40px 20px; border-radius: 12px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #38bdf8, #0284c7); border-radius: 50%; line-height: 60px; font-size: 30px; margin: 0 auto 20px;">💧</div>
            <h2 style="color: #0f172a; margin: 0 0 10px; font-size: 24px;">Verify Your Email</h2>
            <p style="color: #475569; font-size: 16px; margin: 0 0 20px;">Hello ${name},</p>
            <p style="color: #475569; font-size: 15px; margin: 0 0 25px; line-height: 1.5;">Use the following security code to complete your registration for Maji Track:</p>
            
            <div style="background-color: #f8fafc; border: 2px dashed #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <span style="font-size: 36px; font-weight: 700; color: #0284c7; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #64748b; font-size: 13px; margin: 0;">This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">If you didn't request this email, you can safely ignore it.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Maji Track System</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully to', email);
    return { success: true }; 
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetOTP = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL,
      to: email,
      subject: 'Reset Your Maji Track Password', // Updated Subject
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff7ed; padding: 40px 20px; border-radius: 12px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #fb923c, #ea580c); border-radius: 50%; line-height: 60px; font-size: 30px; margin: 0 auto 20px;">🔐</div>
            <h2 style="color: #0f172a; margin: 0 0 10px; font-size: 24px;">Reset Your Password</h2>
            <p style="color: #475569; font-size: 16px; margin: 0 0 20px;">Hello ${name},</p>
            <p style="color: #475569; font-size: 15px; margin: 0 0 25px; line-height: 1.5;">You recently requested to reset your password. Use the security code below to proceed:</p>
            
            <div style="background-color: #fffbeb; border: 2px dashed #fed7aa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <span style="font-size: 36px; font-weight: 700; color: #ea580c; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #64748b; font-size: 13px; margin: 0;">This code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please secure your account immediately.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Maji Track System</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset OTP sent successfully to', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    return { success: false, error: error.message };
  }
};