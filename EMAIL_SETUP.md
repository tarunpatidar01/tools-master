# Email Configuration Guide

Your contact form is now set up to send emails to **help.apniwebsite@gmail.com**

## Setup Steps:

### Step 1: Install Dependencies
```bash
npm install nodemailer
```

### Step 2: Generate Gmail App Password

Follow these steps to get your Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Make sure 2-Factor Authentication is enabled (it's required for app passwords)
3. Search for "App passwords" in the security settings
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a 16-character password
6. Copy this password

### Step 3: Add Credentials to .env.local

Open `.env.local` file in your project root and update:

```
EMAIL_USER=help.apniwebsite@gmail.com
EMAIL_PASSWORD=your_16_character_password_here
```

Replace `your_16_character_password_here` with the password you generated in Step 2.

### Step 4: Restart Your Development Server

```bash
npm run dev
```

## How It Works:

✅ **Contact Form Submission:**
- User fills out the contact form on `/contact` page
- Clicks "Send Message"
- Email is sent to `help.apniwebsite@gmail.com` with the user's message
- User receives a confirmation email at their email address

## Email Features:

✓ Contact form data is sent to your email with:
  - User's name
  - User's email (for reply-to)
  - Subject
  - Full message content

✓ Automatic confirmation email is sent to the user saying:
  - We received their message
  - We'll respond within 24 business hours

✓ Professional HTML email formatting

## Troubleshooting:

**Issue:** "Invalid credentials" error
- **Solution:** Make sure you're using the 16-character App Password, not your Gmail password
- **Solution:** Verify 2-Factor Authentication is enabled on your Google Account

**Issue:** Emails not sending
- **Solution:** Check that `.env.local` file has correct credentials
- **Solution:** Ensure `nodemailer` is installed with `npm install nodemailer`
- **Solution:** Check server logs for error messages

**Issue:** The Gmail account keeps getting blocked
- **Solution:** Allow less secure apps: Go to https://myaccount.google.com/apppasswords

## All Pages Updated:

✅ Privacy Policy - Updated with your email
✅ Terms & Conditions - Updated with your email  
✅ About Us - Updated with your email
✅ Contact Us - Full working contact form with email delivery

## Testing:

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/contact
3. Fill out the form and submit
4. Check your email at help.apniwebsite@gmail.com
5. Also check the spam folder just in case

Everything is ready to go! 🚀
