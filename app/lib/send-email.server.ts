import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeEmail from "~/components/emails/welcomeEmail";
import ProgramStatus from "~/components/emails/programStatus";
import PasswordResetEmail from "~/components/emails/passwordResetEmail";

let resend: Resend | null = null;

const getResendObject = (key: string) => {
  if (!resend) resend = new Resend(key);
  return resend;
};

type EmailTemplate = "program-status" | "password-reset" | "contact";

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
    case "program-status":
      emailComponent = ProgramStatus(props);
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



type EmailSendBody = {
  to: string|string[];
  subject: string;
  text: string;
};



export const sendBatchEmail= (  body: EmailSendBody,
  apiKey: string,
  sourceEmail: string)=>{
    getResendObject(apiKey).batch.send(
      body.to.map((target:string)=>({
        from: sourceEmail,
        to: target,
        subject: body.subject,
        html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${body.subject}</title>
            <style>
              body {
                font-family: 'PingARLT', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #0D3151;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding: 20px;
                font-size: 14px;
                color: #6c757d;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .highlight {
                background-color: #e9ecef;
                padding: 2px 5px;
                border-radius: 3px;
              }
            </style>
          </head>
          <body>
            <div class="content">
            <img src="https://qyam.org/logo.svg" alt="logo"/>
              <p>مرحبًا بك في قيم</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                ${body.text}
              </div>
            </div>
            <div class="footer">
              <p>تم إرسال هذا البريد عبر موقع قيم٫ يرجى عدم الرد على هذا الإيميل مباشرة</p>
            </div>
          </body>
        </html>
      `,
        
        
      }))
    );
}