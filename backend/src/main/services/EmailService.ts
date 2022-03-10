import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import debug from 'debug';
const log: debug.IDebugger = debug('app:EmailService');

@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      pool: true,
      maxMessages: Infinity,
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_PASSWORD,
      },
    });

    log('Created new instance of EmailService');
  }

  public sendEmail = async (emailAddress: string, emailSubject: string, emailBody: string): Promise<void> => {
    await this.transporter.sendMail({
      from: process.env.COMPANY_EMAIL, // sender address
      to: emailAddress, // list of receivers "bar@example.com, baz@example.com"
      subject: emailSubject, // Subject line
      html: emailBody, // html body
    });
  };
}
