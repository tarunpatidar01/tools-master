import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Note: You need to install nodemailer: npm install nodemailer

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    // Using Gmail SMTP service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'help.apniwebsite@gmail.com',
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1e40af;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; color: #374151;">${message}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent from EMI Tools Calculator contact form.
          </p>
        </div>
      `,
      replyTo: email,
    };

    // Also send a confirmation email to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - EMI Tools Calculator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1e40af;">Thank You!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Message Details:</strong></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Our team will respond to your inquiry within 24 business hours.</p>
          <p style="margin-top: 30px; color: #6b7280;">
            Best regards,<br>
            EMI Tools Calculator Team
          </p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
