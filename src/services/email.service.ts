import nodemailer from "nodemailer";
import { getEnv } from "../utils/validateEnv";

export class EmailService {
  private transporter: nodemailer.Transporter | undefined;

  constructor() {
    this._createTransporter();
  }

  // 1- create transporter (service that will send the email)
  private async _createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: getEnv().EMAIL_HOST,
      port: getEnv().EMAIL_PORT,
      auth: {
        user: getEnv().EMAIL_USER,
        pass: getEnv().EMAIL_PASS
      },
      secure: getEnv().EMAIL_SECURE === "true"
    } as nodemailer.TransportOptions);
  }

  // 3) send email
  sendVerificationEmail = async ({
    email,
    token,
    subject
  }: {
    email: string;
    token: string;
    subject: string;
  }) => {
    const verificationUrl = `${getEnv().BASE_URL}/api/auth/verify-email?token=${token}&email=${email}`;
    // 2) define email options like from, to, subject, content
    const mailOptions = {
      from: getEnv().EMAIL_USER,
      to: email,
      subject,
      text: `Please verify your email address by clicking on the link: ${verificationUrl}`
    };
    await this.transporter?.sendMail(mailOptions);
    return verificationUrl;
  };
}
