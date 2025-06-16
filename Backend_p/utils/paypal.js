const axios = require("axios");

const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Use "api-m.paypal.com" for live
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

// Step 1: Create access token
const generateAccessToken = async () => {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};

// Step 2: Capture payment
const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const testPayPalConnection = async () => {
  try {
    const token = await generateAccessToken();
    console.log("✅ PayPal Access Token Generated Successfully:", token);
    return { success: true, token };
  } catch (err) {
    console.error("❌ Failed to connect to PayPal:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  generateAccessToken,
  capturePayment,
  testPayPalConnection,
};
