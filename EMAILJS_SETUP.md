# Portfolio — EmailJS Setup Guide

## Why EmailJS?

EmailJS lets you send emails **directly from the browser** with zero backend/server. Free tier gives **200 emails/month** — more than enough for a portfolio.

---

## Step-by-Step Setup (10 minutes)

### 1. Create EmailJS Account
→ Go to [https://www.emailjs.com](https://www.emailjs.com) and sign up (free)

### 2. Add an Email Service
- Dashboard → **Email Services** → **Add New Service**
- Choose **Gmail**
- Click **Connect Account** → authorize with `amanbaldha01@gmail.com`
- Click **Create Service**
- Copy the **Service ID** (looks like `service_abc1234`)

### 3. Create an Email Template
- Dashboard → **Email Templates** → **Create New Template**
- Set **To Email**: `amanbaldha01@gmail.com`
- Set **Subject**: `Portfolio Contact: {{from_name}}`
- Set **Body**:

```
Hi Aman,

You have a new message from your portfolio:

Name:    {{from_name}}
Email:   {{from_email}}

Message:
{{message}}
```

- Click **Save**
- Copy the **Template ID** (looks like `template_xyz789`)

### 4. Get Your Public Key
- Dashboard → **Account** → **API Keys**
- Copy your **Public Key**

### 5. Update `script.js`

Open `/Users/amanbaldha/portfolio/script.js` and replace lines 103–105:

```js
// BEFORE (placeholders)
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// AFTER (your real values)
const EMAILJS_PUBLIC_KEY  = 'abc123xyz';        // your real public key
const EMAILJS_SERVICE_ID  = 'service_abc1234';  // your real service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789';  // your real template ID
```

Save the file and **you're done** — messages from the form will now arrive in your Gmail inbox.

---

## Test It

1. Open the portfolio → Contact section
2. Fill the form with any test data
3. Click **Send Message**
4. Check `amanbaldha01@gmail.com` inbox (may take ~10 seconds)

---

## Free Tier Limits

| Plan | Emails/month | Cost |
|------|-------------|------|
| Free | 200 | $0 |
| Personal | 1,000 | ~$5/mo |

200/month is plenty for a portfolio contact form.
