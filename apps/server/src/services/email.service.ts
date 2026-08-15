import { Resend } from 'resend';

export const SENDER_EMAIL = 'Lead-ERP <alerts@support.elitedev.space>';

export interface SendLeadConfirmationOptions {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  notes?: string | null;
}

/**
 * Sends a confirmation email to a newly created lead via Resend.
 * Non-blocking: Errors are caught and logged so HTTP responses are not affected.
 */
export async function sendLeadConfirmationEmail(
  options: SendLeadConfirmationOptions,
): Promise<void> {
  const { name, email, company, source, phone } = options;

  const apiKey = process.env.RESEND_API;

  if (!apiKey) {
    console.warn(
      '[EmailService] RESEND_API environment variable is not configured. Email notification skipped.',
    );
    return;
  }

  const resend = new Resend(apiKey);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
          .header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .header h1 { color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; }
          .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-top: 8px; }
          .content { line-height: 1.6; font-size: 15px; }
          .details-card { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .details-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #64748b; }
          .value { color: #0f172a; font-weight: 500; }
          .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Lead-ERP Confirmation</h1>
            <span class="badge">Inquiry Received</span>
          </div>
          <div class="content">
            <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
            <p>Thank you for connecting with us! We have successfully received your inquiry and our sales team will reach out to you shortly.</p>
            
            <div class="details-card">
              <div class="details-row"><span class="label">Name:</span> <span class="value">${escapeHtml(name)}</span></div>
              <div class="details-row"><span class="label">Email:</span> <span class="value">${escapeHtml(email)}</span></div>
              ${phone ? `<div class="details-row"><span class="label">Phone:</span> <span class="value">${escapeHtml(phone)}</span></div>` : ''}
              ${company ? `<div class="details-row"><span class="label">Company:</span> <span class="value">${escapeHtml(company)}</span></div>` : ''}
              ${source ? `<div class="details-row"><span class="label">Source:</span> <span class="value">${escapeHtml(source)}</span></div>` : ''}
            </div>
            
            <p>If you have any urgent questions, feel free to reply directly to this message.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Lead-ERP. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `Hello ${name},\n\nThank you for reaching out! We have successfully received your submission.\n\nSummary:\n- Name: ${name}\n- Email: ${email}${phone ? `\n- Phone: ${phone}` : ''}${company ? `\n- Company: ${company}` : ''}\n\nOur team will review your details and get back to you shortly.\n\nBest regards,\nLead-ERP Team`;

  try {
    const response = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'We have received your lead submission - Lead-ERP',
      html: htmlContent,
      text: textContent,
    });

    if (response.error) {
      console.error(
        '[EmailService] Failed to send lead confirmation email via Resend:',
        response.error,
      );
    } else {
      console.log(
        `[EmailService] Lead confirmation email dispatched to ${email} (ID: ${response.data?.id})`,
      );
    }
  } catch (error) {
    console.error('[EmailService] Unexpected error sending confirmation email via Resend:', error);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
