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
} from "@react-email/components";

const EmailTemplate = ({ header, content, btnLabel, accessLink }) => {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>{header}</Preview>
                <Container style={container}>
                    <Section>
                        <Img
                            src={`http://localhost:5173/logo.png`}
                            width="120"
                            height="36"
                            alt="logo"
                            style={logoContainer}
                        />
                    </Section>
                    <Heading style={h1}>{header}</Heading>
                    <Text style={text}>{content}</Text>
                    <Section>
                        <Button
                            href={`http://localhost:5173/${accessLink}`}
                            style={button}
                        >
                            {btnLabel}
                        </Button>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

EmailTemplate.propTypes = {
    header: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    btnLabel: PropTypes.string.isRequired,
    accessLink: PropTypes.string.isRequired,
};

module.exports = EmailTemplate;

const main = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
    margin: "0 auto",
    padding: "0px 20px",
};

const logoContainer = {
    marginTop: "32px",
};

const h1 = {
    color: "#1d1c1d",
    fontSize: "36px",
    fontWeight: "700",
    margin: "30px 0",
    padding: "0",
    lineHeight: "42px",
};

const text = {
    color: "#000",
    fontSize: "14px",
    lineHeight: "24px",
};

const button = {
    backgroundColor: "#ff0072",
    color: "#ffffff",
    padding: "12px 40px 12px",
    textDecoration: "none",
    borderRadius: "5px",
    display: "inline-block",
    fontWeight: 600,
    fontSize: "16px",
};
