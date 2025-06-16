import { getAccessToken } from '../utils/paypal.js';
import axios from 'axios';

const base = 'https://api-m.sandbox.paypal.com';

export const createOrder = async (req, res) => {
  const accessToken = await getAccessToken();

  const { data } = await axios.post(`${base}/v2/checkout/orders`, {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '10.00', // المبلغ، ممكن تخليه dynamic
      },
    }],
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  res.json(data);
};

export const captureOrder = async (req, res) => {
  const { orderID } = req.body;
  const accessToken = await getAccessToken();

  const { data } = await axios.post(`${base}/v2/checkout/orders/${orderID}/capture`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  res.json(data);
};
