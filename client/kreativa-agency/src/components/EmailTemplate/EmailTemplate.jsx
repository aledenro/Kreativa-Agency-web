import PropTypes from "prop-types";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Text,
	Link,
} from "@react-email/components";

const EmailTemplate = ({ header, content, btnLabel, accessLink, logoUrl }) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>{header}</Preview>
				<Container style={container}>
					<Section style={logoSection}>
						<Img
							src={
								logoUrl ||
								"https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png"
							}
							width="100"
							alt="Kreativa Logo"
							style={logo}
						/>
					</Section>

					<Heading style={h1}>{header}</Heading>

					<Text style={text}>{content}</Text>

					{btnLabel && accessLink && (
						<Section style={buttonSection}>
							<Button
								href={`${import.meta.env.VITE_API_URL}/${accessLink}`}
								style={button}
							>
								{btnLabel}
							</Button>
						</Section>
					)}

					<Section style={footer}>
						<Text style={footerText}>
							© 2025 Kreativa Agency. Todos los derechos reservados.
						</Text>
						<Text style={footerText}>
							Si no solicitaste esta acción, ignora este mensaje.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

EmailTemplate.propTypes = {
	header: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	btnLabel: PropTypes.string,
	accessLink: PropTypes.string,
	logoUrl: PropTypes.string,
};

export default EmailTemplate;

const main = {
	backgroundColor: "#f6f9fc",
	margin: "0 auto",
	fontFamily:
		"'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	lineHeight: "1.4",
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px",
	borderRadius: "8px",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	maxWidth: "600px",
};

const logoSection = {
	textAlign: "center",
	marginBottom: "32px",
};

const logo = {
	marginTop: "32px",
	display: "block",
	margin: "0 auto",
};

const h1 = {
	color: "#1d1c1d",
	fontSize: "32px",
	fontWeight: "700",
	margin: "0 0 24px 0",
	padding: "0",
	lineHeight: "1.2",
	textAlign: "center",
};

const text = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "1.6",
	margin: "0 0 24px 0",
};

const buttonSection = {
	textAlign: "center",
	margin: "32px 0",
};

const button = {
	backgroundColor: "#ff0072",
	color: "#ffffff",
	padding: "14px 28px",
	textDecoration: "none",
	borderRadius: "8px",
	display: "inline-block",
	fontWeight: "600",
	fontSize: "16px",
	border: "none",
	cursor: "pointer",
	transition: "background-color 0.3s ease",
};

const footer = {
	borderTop: "1px solid #e5e7eb",
	paddingTop: "24px",
	marginTop: "40px",
	textAlign: "center",
};

const footerText = {
	color: "#6b7280",
	fontSize: "12px",
	lineHeight: "1.4",
	margin: "0 0 8px 0",
};
