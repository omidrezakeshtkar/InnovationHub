import * as React from "react";
import {
	Html,
	Head,
	Body,
	Container,
	Text,
	Button,
} from "@react-email/components";

interface EmailProps {
	title: string;
	content: string;
	buttonText?: string;
	buttonUrl?: string;
}

const EmailTemplate: React.FC<EmailProps> = ({
	title,
	content,
	buttonText,
	buttonUrl,
}) => (
	<Html>
		<Head />
		<Body
			style={{
				fontFamily: "Arial, sans-serif",
				backgroundColor: "#f6f6f6",
				margin: 0,
				padding: 0,
			}}
		>
			<Container
				style={{
					backgroundColor: "#ffffff",
					margin: "0 auto",
					padding: "20px",
					maxWidth: "600px",
				}}
			>
				<Text
					style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
				>
					{title}
				</Text>
				<Text
					style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}
				>
					{content}
				</Text>
				{buttonText && buttonUrl && (
					<Button
						href={buttonUrl}
						style={{
							backgroundColor: "#007bff",
							borderRadius: "4px",
							color: "#ffffff",
							fontWeight: "bold",
							padding: "12px 24px",
							textDecoration: "none",
							textTransform: "uppercase",
						}}
					>
						{buttonText}
					</Button>
				)}
			</Container>
		</Body>
	</Html>
);

export default EmailTemplate;
