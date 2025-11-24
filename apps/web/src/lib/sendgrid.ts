import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@howisyourday.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Send a newsletter subscription confirmation email
 * @param to - Recipient email address
 * @param confirmToken - Confirmation token
 */
export async function sendSubscriptionConfirmation(
    to: string,
    confirmToken: string
) {
    const confirmUrl = `${SITE_URL}/api/subscribe/confirm?token=${confirmToken}`;

    const msg = {
        to,
        from: FROM_EMAIL,
        subject: 'Confirm your subscription to How Is Your Day',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to How Is Your Day!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>Please confirm your subscription by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Confirm Subscription
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmUrl}">${confirmUrl}</a>
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          If you didn't subscribe to this newsletter, you can safely ignore this email.
        </p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('SendGrid error:', error);
        throw new Error('Failed to send confirmation email');
    }
}

/**
 * Send a contact form email to admin
 * @param from - Sender email
 * @param name - Sender name
 * @param message - Message content
 */
export async function sendContactEmail(
    from: string,
    name: string,
    message: string
) {
    const msg = {
        to: FROM_EMAIL, // Send to admin
        from: FROM_EMAIL,
        replyTo: from,
        subject: `New contact form message from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Message</h2>
        <p><strong>From:</strong> ${name} (${from})</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #666; font-size: 14px;">
          Reply directly to this email to respond to ${name}.
        </p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('SendGrid error:', error);
        throw new Error('Failed to send contact email');
    }
}

/**
 * Send newsletter to all confirmed subscribers
 * @param subject - Email subject
 * @param content - HTML content
 * @param subscribers - Array of subscriber emails
 */
export async function sendNewsletter(
    subject: string,
    content: string,
    subscribers: string[]
) {
    const msg = {
        to: subscribers,
        from: FROM_EMAIL,
        subject,
        html: content,
    };

    try {
        await sgMail.sendMultiple(msg);
    } catch (error) {
        console.error('SendGrid error:', error);
        throw new Error('Failed to send newsletter');
    }
}

export default sgMail;
