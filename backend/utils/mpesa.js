const axios = require('axios');

const getMpesaToken = async () => {
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY,
          password: process.env.MPESA_CONSUMER_SECRET
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa token');
  }
};

const initiateSTKPush = async (phoneNumber, amount, accountRef, description) => {
  try {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    const token = await getMpesaToken();

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber.replace(/^0/, '254'),
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber.replace(/^0/, '254'),
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountRef.substring(0, 12),
      TransactionDesc: description.substring(0, 20)
    };

    console.log('M-Pesa STK Push payload:', { ...payload, Password: '***' });

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('M-Pesa STK Push response:', response.data);
    return response.data;
  } catch (error) {
    console.error('M-Pesa STK Push error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { getMpesaToken, initiateSTKPush };