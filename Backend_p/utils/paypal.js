import dotenv from 'dotenv';
dotenv.config();

// لو انت شغال Node v18 أو أعلى، مفيش داعي تثبت fetch، جاهز معاك
// لو أقل من كده، ثبّت: npm install node-fetch
import fetch from 'node-fetch';

const base = 'https://api-m.sandbox.paypal.com'; // رابط الساندبوكس

export const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get access token from PayPal');
  }

  const data = await response.json();
  return data.access_token;
};
