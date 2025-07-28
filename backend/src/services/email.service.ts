import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import Lending from '../models/lending.model';
import { format } from 'date-fns';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(options: EmailOptions) {
        try {
            const mailOptions = {
                from: `"Book Club Library" <${process.env.EMAIL_FROM}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${options.to}`);
        } catch (error) {
            logger.error(`Error sending email: ${error}`);
            throw error;
        }
    }

    async sendOverdueNotification(lendingId: string) {
        const lending = await Lending.findById(lendingId)
            .populate('book')
            .populate('reader');

        if (!lending || !lending.reader || !lending.book) {
            throw new Error('Lending record not found');
        }

        const reader = lending.reader as any;
        const book = lending.book as any;

        const subject = `Overdue Book: ${book.title}`;
        const html = `
      <h1>Book Club Library - Overdue Book</h1>
      <p>Dear ${reader.name},</p>
      <p>The following book is overdue:</p>
      <ul>
        <li><strong>Title:</strong> ${book.title}</li>
        <li><strong>Author:</strong> ${book.author}</li>
        <li><strong>Due Date:</strong> ${format(lending.dueDate, 'MMMM d, yyyy')}</li>
      </ul>
      <p>Please return the book as soon as possible to avoid any penalties.</p>
      <p>Thank you,</p>
      <p>Book Club Library Team</p>
    `;

        await this.sendEmail({
            to: reader.email,
            subject,
            html,
        });
    }
}

export default new EmailService();