// Simple Express server exposing POST /send-email
// Reads SMTP config from environment variables (see .env.example)
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// create transporter using SMTP settings from env
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || (port===465);

  if(!host || !user || !pass) {
    console.warn('SMTP settings missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment.');
  }

  return nodemailer.createTransport({
    host, port, secure,
    auth: { user, pass }
  });
}

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html, from } = req.body;
  if(!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: from || process.env.DEFAULT_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.json({ success: true, messageId: info.messageId, response: info.response });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err.message || err });
  }
});

app.get('/', (req, res) => {
  res.send('Germany-Meds backend: POST /send-email to send mail via SMTP');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
