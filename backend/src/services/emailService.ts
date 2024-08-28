import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: config.email.user && config.email.password
    ? {
        user: config.email.user,
        pass: config.email.password,
      }
    : undefined,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
    if (process.env.NODE_ENV === 'development') {
      console.log('Email content:');
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html}`);
      console.log('MailHog URL: http://localhost:8025');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendIdeaApprovalEmail = async (to: string, ideaTitle: string) => {
  const subject = 'Your Idea Has Been Approved';
  const html = `
    <h1>Congratulations!</h1>
    <p>Your idea "${ideaTitle}" has been approved.</p>
    <p>Thank you for your contribution to our idea exchange platform.</p>
  `;
  await sendEmail(to, subject, html);
};

export const sendNewCommentEmail = async (to: string, ideaTitle: string, commentAuthor: string) => {
  const subject = 'New Comment on Your Idea';
  const html = `
    <h1>New Comment</h1>
    <p>${commentAuthor} has commented on your idea "${ideaTitle}".</p>
    <p>Log in to the platform to view and respond to the comment.</p>
  `;
  await sendEmail(to, subject, html);
};