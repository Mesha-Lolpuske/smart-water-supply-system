import dotenv from 'dotenv';
dotenv.config();

// Formats numbers to international standard (e.g., +254 for Kenya)
export const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
};

// Main function to send SMS via Brevo
export const sendSMS = async (to, message) => {
  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, 
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        type: 'transactional',
        unicodeEnabled: false,
        sender: 'MajiTrack', // Max 11 alphanumeric characters
        recipient: formattedPhone,
        content: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send Brevo SMS');
    }

    console.log('Maji Track SMS sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Brevo SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Specific function for water interruption alerts
// Specific function for water interruption alerts
export const sendWaterAlertSMS = async (phone, supplyArea, message) => {
  const alertMessage = `MAJI TRACK ALERT: Water interruption in ${supplyArea}. ${message}`;
  return await sendSMS(phone, alertMessage);
};