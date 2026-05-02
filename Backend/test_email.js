import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const client = new BrevoClient({ 
  apiKey: process.env.BREVO_API_KEY 
});

async function test() {
    console.log('Testing with API Key:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
    console.log('From Email:', process.env.BREVO_EMAIL_FROM);
    try {
        const result = await client.transactionalEmails.sendTransacEmail({
            subject: "Test",
            to: [{ email: "test@example.com", name: "Test" }],
            sender: { email: process.env.BREVO_EMAIL_FROM, name: "Test" },
            htmlContent: "test"
        });
        console.log('Success:', result.data);
    } catch (e) {
        console.error('Error Status:', e.statusCode);
        console.error('Error Body:', JSON.stringify(e.body, null, 2));
        console.error('Error Message:', e.message);
    }
}
test();
