// --- PlatformToEarn Webhook Listener ---
//
// For Railway deployment:
// 1. Set EMAIL_USER and EMAIL_PASS as environment variables in Railway dashboard.
// 2. Locally, create a .env file with:
//      EMAIL_USER=platformtoearn@gmail.com
//      EMAIL_PASS=Platformtoearn@123
// 3. Do NOT commit .env to git.
// --------------------------------------

require('dotenv').config(); 

const fetch = require('node-fetch'); 

const url = 'https://web3.nodit.io/v1/ethereum/sepolia/webhooks';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-API-KEY': 'your-nodit-api-key'
  },
  body: JSON.stringify({
    eventType: 'LOG',
    contractAddress: '0x9fc8cF7cfd2bB1d1bF36E7e30867138516061e09',
    eventSignature: 'TaskSubmitted(uint256,address)', // or WinnerPicked(...)
    description: 'Notify on task submission',
    notification: {webhookUrl: 'https://your-backend.up.railway.app/api/webhook-listener'}
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));


const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Example in-memory mapping (replace with your DB in production)
const addressToEmail = {
  '0x9fc8cF7cfd2bB1d1bF36E7e30867138516061e09': 'user@example.com',
  // Add more wallet: email pairs as needed
};

// Configure your email transporter (replace with your SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', or use your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let rewardEvents = [];

app.post('/api/webhook-listener', (req, res) => {
  const event = req.body;

  if (event && event.data && event.data.to) {
    const toAddress = event.data.to;
    const email = addressToEmail[toAddress];

    if (email) {
      // Send email notification
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'You received a reward!',
        text: `Congratulations! You received a reward of ${event.data.value}. Tx: ${event.data.transactionHash}`,
      }, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      // Store the reward event
      rewardEvents.push({
        to: toAddress,
        value: event.data.value,
        tx: event.data.transactionHash,
        timestamp: Date.now()
      });
    } else {
      console.log(`No email found for address: ${toAddress}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.status(400).json({ error: 'Invalid event data' });
  }
});

app.get('/api/rewards', (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Missing address' });
  const events = rewardEvents.filter(e => e.to.toLowerCase() === address.toLowerCase());
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});

