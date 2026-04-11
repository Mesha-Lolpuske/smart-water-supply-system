import africastalking from 'africastalking';

// Initialize Africa's Talking
const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
};

const africastalkingClient = africastalking(credentials);
const sms = africastalkingClient.SMS;

// Format phone number to international format
export const formatPhoneNumber = (phone) => {
  // Remove any spaces, dashes, or brackets
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // If it starts with 0, replace with +254 (Kenya country code)
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  }

  // If it doesn't start with +, add it
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
};

// Send SMS
export const sendSMS = async (to, message) => {
  try {
    const options = {
      to: Array.isArray(to) ? to : [to],
      message: message,
      from: process.env.AFRICASTALKING_SENDER_ID || 'WATER_ALERT',
    };

    const response = await sms.send(options);
    console.log('SMS sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP via SMS
export const sendSMSOTP = async (phone, otp, name) => {
  const message = `Hello ${name}, your Smart Water Supply verification code is: ${otp}. This code expires in 10 minutes.`;
  return await sendSMS(phone, message);
};

// Send water alert via SMS
export const sendWaterAlertSMS = async (phone, name, alertType, zoneName, message) => {
  let alertMessage = '';

  switch (alertType) {
    case 'water_back':
      alertMessage = `Hello ${name}, GREAT NEWS! Water supply has been restored in ${zoneName}. You can now use water normally.`;
      break;
    case 'water_cut':
      alertMessage = `Hello ${name}, URGENT: Water supply has been cut in ${zoneName}. Please conserve water. ${message}`;
      break;
    case 'maintenance':
      alertMessage = `Hello ${name}, SCHEDULED: Water maintenance in ${zoneName}. ${message}`;
      break;
    case 'emergency':
      alertMessage = `Hello ${name}, EMERGENCY ALERT: ${message} in ${zoneName}. Please follow safety instructions.`;
      break;
    default:
      alertMessage = `Hello ${name}, Water Alert: ${message} in ${zoneName}`;
  }

  return await sendSMS(phone, alertMessage);
};

// Send bulk SMS alerts
export const sendBulkSMSAlerts = async (recipients, alertType, zoneName, message) => {
  const results = [];

  for (const recipient of recipients) {
    if (recipient.phone && recipient.smsNotificationsEnabled !== false) {
      const result = await sendWaterAlertSMS(
        recipient.phone,
        recipient.name,
        alertType,
        zoneName,
        message
      );
      results.push({
        recipient: recipient._id,
        phone: recipient.phone,
        success: result.success,
        error: result.error
      });
    }
  }

  return results;
};