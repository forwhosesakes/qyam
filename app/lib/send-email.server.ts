import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeEmail from "~/components/emails/welcomeEmail";
import PasswordResetEmail from "~/components/emails/passwordResetEmail";

let resend: Resend | null = null;

const getResendObject = (key: string) => {
  if (!resend) resend = new Resend(key);
  return resend;
};

type EmailTemplate = "welcome" | "password-reset" | "contact";

interface SendEmailProps {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  props?: Record<string, any>;
  text?: string;  // fallback text
}

export const sendEmail = async ({
  to,
  subject,
  template,
  props = {},
  text,
}: SendEmailProps, apiKey: string, sourceEmail: string) => {
  const resend = getResendObject(apiKey);

  let emailComponent;
  switch (template) {
    case "welcome":
      emailComponent = WelcomeEmail(props);
      break;
    case "password-reset":
      emailComponent = PasswordResetEmail(props);
      break;
    default:
      throw new Error(`Unknown email template: ${template}`);
  }

  const html =await render(emailComponent);

  return resend.emails.send({
    from: sourceEmail,
    to,
    subject,
    html,
    text: text || '',
  });
};