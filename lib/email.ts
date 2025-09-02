import nodemailer from "nodemailer";
import { NotificationType } from "@/app/generated/prisma";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface NotificationData {
  studentName: string;
  courseTitle: string;
  examDate: string;
  examTime: string;
  examVenue: string;
  faculty: string;
  matricNumber: string;
}

// Notification type styles matching the provided types
export const notificationStyles = {
  SCHEDULE: { color: '#1e40af', bgColor: '#dbeafe', label: 'Schedule Update' },
  REMINDER: { color: '#a16207', bgColor: '#fef3c7', label: 'Reminder' },
  CHANGE: { color: '#c2410c', bgColor: '#fed7aa', label: 'Schedule Change' },
  EMERGENCY: { color: '#dc2626', bgColor: '#fecaca', label: 'Emergency' }
};

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      };

      this.transporter = nodemailer.createTransport(config);
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  private generateEmailTemplate(
    type: NotificationType,
    data: NotificationData,
    customMessage?: string
  ): EmailTemplate {
    const style = notificationStyles[type];
    const baseTemplate = this.getBaseTemplate(type, data, customMessage);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${baseTemplate.subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: ${style.bgColor};
            color: ${style.color};
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .badge {
            display: inline-block;
            background-color: ${style.bgColor};
            color: ${style.color};
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .exam-details {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid ${style.color};
          }
          .detail-row {
            margin: 8px 0;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">${baseTemplate.subject}</h1>
        </div>
        <div class="content">
          <div class="badge">${style.label}</div>
          <p>Dear ${data.studentName},</p>
          <p>${baseTemplate.message}</p>
          
          <div class="exam-details">
            <h3 style="margin-top: 0; color: ${style.color};">Exam Details</h3>
            <div class="detail-row">
              <span class="detail-label">Course:</span> ${data.courseTitle}
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span> ${data.examDate}
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span> ${data.examTime}
            </div>
            <div class="detail-row">
              <span class="detail-label">Venue:</span> ${data.examVenue}
            </div>
            <div class="detail-row">
              <span class="detail-label">Faculty:</span> ${data.faculty}
            </div>
          </div>

          <p>Please arrive at the venue at least 15 minutes before the exam time.</p>
          <p><strong>Good luck with your examination!</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Exam Alert System.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
${baseTemplate.subject}

Dear ${data.studentName},

${baseTemplate.message}

Exam Details:
- Course: ${data.courseTitle}
- Date: ${data.examDate}
- Time: ${data.examTime}
- Venue: ${data.examVenue}
- Faculty: ${data.faculty}

Please arrive at the venue at least 15 minutes before the exam time.

Good luck with your examination!

---
This is an automated message from the Exam Alert System.
Please do not reply to this email.
    `;

    return {
      subject: baseTemplate.subject,
      html: html.trim(),
      text: text.trim(),
    };
  }

  private getBaseTemplate(
    type: NotificationType,
    data: NotificationData,
    customMessage?: string
  ): { subject: string; message: string } {
    if (customMessage) {
      return {
        subject: `${notificationStyles[type].label} - ${data.courseTitle}`,
        message: customMessage,
      };
    }

    switch (type) {
      case 'SCHEDULE':
        return {
          subject: `Exam Scheduled - ${data.courseTitle}`,
          message: `Your ${data.courseTitle} exam has been scheduled. Please find the details below.`,
        };
      case 'REMINDER':
        return {
          subject: `Exam Reminder - ${data.courseTitle}`,
          message: `This is a reminder about your upcoming ${data.courseTitle} exam. Please review the details and prepare accordingly.`,
        };
      case 'CHANGE':
        return {
          subject: `Exam Schedule Changed - ${data.courseTitle}`,
          message: `Important: There has been a change to your ${data.courseTitle} exam schedule. Please note the updated information below.`,
        };
      case 'EMERGENCY':
        return {
          subject: `URGENT: Emergency Notice - ${data.courseTitle}`,
          message: `URGENT: There is an important update regarding your ${data.courseTitle} exam. Please read this notice carefully.`,
        };
      default:
        return {
          subject: `Exam Notification - ${data.courseTitle}`,
          message: `This is a notification regarding your ${data.courseTitle} exam.`,
        };
    }
  }

  public async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email transporter not initialized. Please check your SMTP configuration.',
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Exam Alert System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  public async sendNotificationEmail(
    type: NotificationType,
    recipientEmail: string,
    notificationData: NotificationData,
    customMessage?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = this.generateEmailTemplate(type, notificationData, customMessage);
    
    return this.sendEmail({
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendBulkNotifications(
    type: NotificationType,
    recipients: Array<{ email: string; data: NotificationData }>,
    customMessage?: string
  ): Promise<Array<{ email: string; success: boolean; messageId?: string; error?: string }>> {
    const results = [];
    
    for (const recipient of recipients) {
      const result = await this.sendNotificationEmail(
        type,
        recipient.email,
        recipient.data,
        customMessage
      );
      
      results.push({
        email: recipient.email,
        ...result,
      });
    }
    
    return results;
  }

  public async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email transporter not initialized',
      };
    }

    try {
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection verification failed',
      };
    }
  }
}

export const emailService = new EmailService();