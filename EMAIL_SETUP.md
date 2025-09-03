# Email Notification System Setup Guide

This guide will help you set up the email notification system for the Exam Alert application. The system uses Nodemailer with SMTP to send professional email notifications to students about exam schedules.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Email Provider Setup](#email-provider-setup)
4. [Database Migration](#database-migration)
5. [Testing Configuration](#testing-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Email account with SMTP access
- Basic understanding of environment variables

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Database

Update the database URLs in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database_name?schema=public"
DIRECT_URL="postgresql://username:password@hostname:port/database_name?schema=public"
```

### 3. Configure Email Service

Choose your email provider and update the SMTP settings. See [Email Provider Setup](#email-provider-setup) below for specific configurations.

## Email Provider Setup

### Gmail Setup (Recommended for Development)

Gmail requires app-specific passwords for SMTP access.

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Follow the setup process to enable 2FA

#### Step 2: Generate App Password
1. In Google Account Settings, go to **Security** → **App passwords**
2. Select **App**: Mail
3. Select **Device**: Other (Custom name)
4. Enter "Exam Alert System" as the name
5. Copy the 16-character password generated

#### Step 3: Configure Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=your-gmail@gmail.com
```

### Outlook/Hotmail Setup

#### Step 1: Configure Environment Variables
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

#### Step 2: Account Security
- Ensure "Less secure app access" is enabled if using regular password
- Consider using app-specific passwords for enhanced security

### SendGrid Setup (Recommended for Production)

SendGrid offers reliable email delivery with better deliverability rates.

#### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Complete account verification
3. Navigate to **Settings** → **API Keys**
4. Create a new API key with "Mail Send" permissions

#### Step 2: Configure Environment Variables
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=your-verified-email@yourdomain.com
```

#### Step 3: Domain Authentication (Recommended)
1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Set up domain authentication for better deliverability
3. Add DNS records as instructed by SendGrid

### Mailgun Setup

#### Step 1: Create Mailgun Account
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Add your domain or use the sandbox domain for testing

#### Step 2: Get SMTP Credentials
1. Go to **Sending** → **Domain settings**
2. Find your SMTP credentials

#### Step 3: Configure Environment Variables
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-smtp-password
SMTP_FROM=noreply@your-domain.mailgun.org
```

### Amazon SES Setup

#### Step 1: Set Up SES
1. Go to [Amazon SES Console](https://console.aws.amazon.com/ses/)
2. Verify your email address or domain
3. Request production access (moves you out of sandbox)

#### Step 2: Create SMTP Credentials
1. In SES Console, go to **SMTP settings**
2. Create SMTP credentials
3. Note the server name and port

#### Step 3: Configure Environment Variables
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
SMTP_FROM=your-verified-email@yourdomain.com
```

## Database Migration

After configuring your environment, you need to apply the database migrations to add the notification tables.

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Database Migration
```bash
npx prisma db push
```

### Verify Tables Created
Check that these tables were created in your database:
- `notifications`
- The `NotificationType` enum

## Testing Configuration

### 1. Test Email Connection

Start your development server:
```bash
npm run dev
```

Navigate to the admin panel and go to **Email Notifications**. The system will automatically test the email connection and display the status.

### 2. Send Test Notification

1. Log in as an admin
2. Go to **Email Notifications** in the admin panel
3. Fill in the form with test data:
   - **Type**: Schedule Update
   - **Subject**: Test Email Configuration
   - **Message**: This is a test email to verify the configuration
4. Click **Send Notification**

### 3. Check Email Logs

Go to **Logs & Reports** → **Email Logs** to see the delivery status of your test emails.

## Troubleshooting

### Common Issues

#### "EAUTH" Authentication Error
- **Gmail**: Ensure you're using an app-specific password, not your regular password
- **Outlook**: Check if "Less secure app access" is enabled
- **All providers**: Verify username and password are correct

#### "ECONNREFUSED" Connection Error
- Check SMTP host and port settings
- Verify your internet connection
- Some networks block SMTP ports; try a different network

#### "550 Authentication Required" Error
- Verify email address is properly configured in SMTP_FROM
- For custom domains, ensure SPF and DKIM records are set up
- Check if sender verification is required (SendGrid, SES)

#### Emails Going to Spam
- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified domain with SendGrid or SES
- Avoid spam-triggering words in subject lines
- Include a physical address in email footer

#### Rate Limiting Issues
- Gmail: 500 emails/day for new accounts, 2000/day for established
- Outlook: 300 emails/day
- SendGrid: Varies by plan
- Consider using EMAIL_RATE_LIMIT in .env to control sending speed

### Debug Mode

To enable detailed logging, add this to your `.env`:
```env
NODE_ENV=development
DEBUG=nodemailer:*
```

### Testing Email Templates

You can preview email templates by:
1. Going to the Email Notification Panel
2. Filling in the form (don't send)
3. Viewing the template preview on the right side

## Best Practices

### Security

1. **Never commit `.env` files** - Add `.env` to `.gitignore`
2. **Use app-specific passwords** - Avoid using main account passwords
3. **Rotate credentials regularly** - Change passwords/API keys periodically
4. **Use environment-specific configs** - Different settings for dev/staging/production
5. **Monitor sending quotas** - Set up alerts for quota limits

### Email Deliverability

1. **Authenticate your domain** - Set up SPF, DKIM, DMARC records
2. **Use professional from addresses** - Avoid generic addresses like noreply@gmail.com
3. **Monitor bounce rates** - High bounce rates hurt sender reputation
4. **Include unsubscribe options** - Even though this is an exam system
5. **Use consistent sending patterns** - Avoid sudden spikes in volume

### Performance

1. **Implement rate limiting** - Respect provider limits
2. **Use batch processing** - Send emails in smaller batches
3. **Queue large sends** - For bulk notifications, consider using a queue system
4. **Monitor error rates** - Set up alerts for failed sends
5. **Cache template generation** - Reuse compiled templates when possible

### Monitoring

1. **Track delivery status** - Monitor sent, delivered, bounced, failed
2. **Log all email activity** - Keep records for debugging
3. **Set up alerts** - For high error rates or quota limits
4. **Monitor blacklist status** - Check if your IPs are blacklisted
5. **Review analytics** - Track open rates and engagement (if needed)

## Production Deployment

### Environment Variables

Ensure these are set in your production environment:
```env
NODE_ENV=production
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
SMTP_PASS=your-production-password
DATABASE_URL=your-production-database-url
```

### Domain Setup

For production, set up:
1. Custom domain for email sending
2. SPF record: `v=spf1 include:_spf.google.com ~all` (for Gmail)
3. DKIM authentication through your email provider
4. DMARC policy for additional security

### Scaling Considerations

- Use professional email services (SendGrid, Mailgun, SES) for high volume
- Implement email queues for large bulk sends
- Set up multiple SMTP configurations for redundancy
- Monitor and rotate IP addresses if needed

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your email provider's documentation
3. Test with a different email provider
4. Check application logs for detailed error messages
5. Ensure all environment variables are correctly set

For additional help, consult the documentation of your chosen email provider or contact their support team.