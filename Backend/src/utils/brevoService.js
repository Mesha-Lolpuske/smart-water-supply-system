

/**
 * Send a professional OTP verification email
 */
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      subject: "Verify Your Account - Smart Water Supply",
      to: [{ email: email, name: name }],
      sender: { 
        email: process.env.BREVO_EMAIL_FROM || "no-reply@smartwater.com", 
        name: process.env.BREVO_SENDER_NAME || "Smart Water Supply" 
      },
      htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f9; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
              .header { background: linear-gradient(135deg, #0061ff 0%, #60efff 100%); padding: 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
              .content { padding: 40px 30px; text-align: center; }
              .content h2 { color: #1a202c; margin-top: 0; font-size: 22px; }
              .content p { color: #4a5568; font-size: 16px; margin-bottom: 30px; }
              .otp-container { background: #f0f4f8; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px; border: 1px dashed #cbd5e0; }
              .otp-code { font-size: 36px; font-weight: 800; color: #0061ff; letter-spacing: 8px; margin: 0; }
              .footer { background: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 13px; border-top: 1px solid #edf2f7; }
              .expiry { font-weight: 600; color: #e53e3e; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>SMART WATER SUPPLY</h1>
              </div>
              <div class="content">
                  <h2>Email Verification</h2>
                  <p>Hello <strong>${name}</strong>,</p>
                  <p>Thank you for registering. Please use the verification code below to complete your account setup.</p>
                  <div class="otp-container">
                      <p class="otp-code">${otp}</p>
                  </div>
                  <p>This code is valid for <span class="expiry">10 minutes</span>. For your security, please do not share this code with anyone.</p>
                  <p>If you didn't create an account, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Smart Water Supply System. All rights reserved.</p>
                  <p>Designed to ensure sustainable water management for everyone.</p>
              </div>
          </div>
      </body>
      </html>
      `
    });

    console.log('Brevo Email sent successfully:', result.data.messageId);
    return { success: true, messageId: result.data.messageId };
  } catch (error) {
    console.error('Brevo Error Detailed:', JSON.stringify(error, null, 2));
    console.error('Brevo Error Message:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send a professional Password Reset email
 */
export const sendPasswordResetEmail = async (email, otp, name) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      subject: "Reset Your Password - Smart Water Supply",
      to: [{ email: email, name: name }],
      sender: { 
          email: process.env.BREVO_EMAIL_FROM || "no-reply@smartwater.com", 
          name: process.env.BREVO_SENDER_NAME || "Smart Water Supply" 
      },
      htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f9; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
              .header { background: linear-gradient(135deg, #f56565 0%, #ed8936 100%); padding: 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
              .content { padding: 40px 30px; text-align: center; }
              .content h2 { color: #1a202c; margin-top: 0; font-size: 22px; }
              .content p { color: #4a5568; font-size: 16px; margin-bottom: 30px; }
              .otp-container { background: #fff5f5; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px; border: 1px dashed #feb2b2; }
              .otp-code { font-size: 36px; font-weight: 800; color: #e53e3e; letter-spacing: 8px; margin: 0; }
              .footer { background: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 13px; border-top: 1px solid #edf2f7; }
              .expiry { font-weight: 600; color: #e53e3e; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>SMART WATER SUPPLY</h1>
              </div>
              <div class="content">
                  <h2>Password Reset Request</h2>
                  <p>Hello <strong>${name}</strong>,</p>
                  <p>We received a request to reset your password. Use the code below to proceed with the reset.</p>
                  <div class="otp-container">
                      <p class="otp-code">${otp}</p>
                  </div>
                  <p>This code is valid for <span class="expiry">10 minutes</span>. If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Smart Water Supply System. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `
    });
    return { success: true, messageId: result.data.messageId };
  } catch (error) {
    console.error('Brevo Error Detailed:', JSON.stringify(error, null, 2));
    console.error('Brevo Error Message:', error.message);
    return { success: false, error: error.message };
  }
};


