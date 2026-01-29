# Vercel Deployment Setup Guide

## ✅ Deployment Complete!

Your EMI Tools App has been successfully deployed to Vercel!

### 🌐 Live URLs

- **Production**: https://emi-tools-master.vercel.app
- **Inspect**: https://vercel.com/tools-projects-f3ba6a3e/emi-tools-master

---

## 📧 Email Configuration (Important!)

To enable the contact form email functionality, you need to add environment variables to your Vercel project:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: `emi-tools-master`
3. Go to **Settings** tab
4. Click on **Environment Variables**

### Step 2: Add Email Variables
Add the following environment variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `EMAIL_USER` | `help.apniwebsite@gmail.com` | Production, Preview |
| `EMAIL_PASSWORD` | [Gmail App Password] | Production, Preview |

**Note**: For `EMAIL_PASSWORD`, you need a Gmail App Password:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Create an App Password for "Mail" and "Other (custom name)"
4. Use the generated 16-character password

### Step 3: Redeploy
After adding environment variables:
```bash
vercel --prod
```

Or redeploy from Vercel Dashboard by clicking the **Deploy** button.

---

## 🔧 Google AdSense Setup

To add Google AdSense ads to your site:

1. Sign up at https://www.google.com/adsense/
2. Verify your domain
3. Once approved, go to `app/layout.tsx` (line 210)
4. Replace the placeholder AdSense code:
   ```jsx
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID" crossOrigin="anonymous"></script>
   ```
5. Redeploy to production

---

## ✅ Deployment Checklist

- [x] Project deployed to Vercel
- [x] Domain configured: `emi-tools-master.vercel.app`
- [ ] Email environment variables added
- [ ] Contact form tested
- [ ] Google AdSense code updated
- [ ] Final production test completed

---

## 📝 Project Details

- **Framework**: Next.js 16.1.3
- **Hosting**: Vercel
- **Region**: Auto (default)
- **Build Command**: `next build`
- **Start Command**: `next start`

---

## 🚀 Next Steps

1. **Add Email Variables** (see Email Configuration above)
2. **Update AdSense Code** (see Google AdSense Setup above)
3. **Redeploy** to production
4. **Test Contact Form** on your live site
5. **Monitor Analytics** on Vercel dashboard

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

**Deployment Date**: January 29, 2026  
**Status**: ✅ Active and Running
