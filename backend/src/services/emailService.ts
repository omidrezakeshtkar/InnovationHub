import nodemailer from "nodemailer";
import config from "../config";
import { renderToString } from "react-dom/server";
//@ts-ignore
import EmailTemplate from "./emailService.tsx";

export const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: config.email.secure, // false for MailHog
	// Remove auth for MailHog
	auth:
		config.email.user && config.email.password
			? {
					user: config.email.user,
					pass: config.email.password,
			  }
			: undefined,
} as nodemailer.TransportOptions);

export const checkEmailService = async () => {
	try {
		// Verify connection configuration
		await transporter.verify();
		console.log("Email service is up and running.");
	} catch (error) {
		console.error("Error connecting to email service:", error);
		throw new Error("Email service is not available");
	}
};

interface EmailProps {
	title: string;
	content: string;
	buttonText?: string;
	buttonUrl?: string;
}

export const sendEmail = async (
	to: string,
	subject: string,
	props: EmailProps
) => {
	try {
		const emailHtml = renderToString(EmailTemplate(props));

		const info = await transporter.sendMail({
			from: config.email.from,
			to,
			subject,
			html: emailHtml,
		});
		console.log(`Email sent to ${to}`);
		if (process.env.NODE_ENV === "development") {
			console.log("Email content:");
			console.log(`Subject: ${subject}`);
			console.log(`HTML: ${emailHtml}`);
			console.log("MailHog URL: http://localhost:8025");
		}
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export const sendIdeaApprovalEmail = async (to: string, ideaTitle: string) => {
	const subject = "Your Idea Has Been Approved";
	const props: EmailProps = {
		title: "Congratulations!",
		content: `Your idea "${ideaTitle}" has been approved. Thank you for your contribution to our idea exchange platform.`,
		buttonText: "View Your Idea",
		buttonUrl: `${config.websiteUrl}/ideas/${encodeURIComponent(ideaTitle)}`,
	};
	await sendEmail(to, subject, props);
};

export const sendNewCommentEmail = async (
	to: string,
	ideaTitle: string,
	commentAuthor: string
) => {
	const subject = "New Comment on Your Idea";
	const props: EmailProps = {
		title: "New Comment",
		content: `${commentAuthor} has commented on your idea "${ideaTitle}". Log in to the platform to view and respond to the comment.`,
		buttonText: "View Comment",
		buttonUrl: `${config.websiteUrl}/ideas/${encodeURIComponent(ideaTitle)}`,
	};
	await sendEmail(to, subject, props);
};
