import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const client = new BrevoClient({ 
  apiKey: process.env.BREVO_API_KEY 
});

const apiInstance = client.transactionalEmails;
const smsInstance = client.transactionalSms;

export { apiInstance, smsInstance };
