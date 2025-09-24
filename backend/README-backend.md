# Germany-Meds Backend (Email API)

This backend provides a single endpoint to send emails via SMTP.

## Files added
- `server.js` : Express server with `POST /send-email`.
- `package.json` : dependencies (express, nodemailer, cors, dotenv).
- `.env.example` : example environment variables.

## Setup (locally)
1. `cd backend`
2. copy `.env.example` to `.env` and fill your SMTP credentials
3. `npm install`
4. `npm start` (or `npm run dev` with nodemon)

## Endpoint
`POST /send-email`
JSON body:
```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "from": "Optional From header"
}
```
Response:
```json
{ "success": true, "messageId": "...", "response": "..." }
```

## Notes
- Make sure your SMTP provider allows sending from your `from` address.
- For production, set environment variables on your host (do not commit real credentials).
