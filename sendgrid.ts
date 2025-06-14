/// <reference types="node" />

import sgMail from "@sendgrid/mail";

// Initialize SendGrid with the API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export interface SendgridEmailOptions {
  /** One or more recipient email addresses */
  to: string | string[];
  /** Email subject line */
  subject: string;
  /** HTML version of the email body */
  html?: string;
  /** Plain-text version of the email body (will be auto-generated from HTML if omitted) */
  text?: string;
  /** Sender email address. Falls back to DEFAULT_FROM_EMAIL env var or hard-coded placeholder. */
  from?: string;
  /** Optional reply-to address */
  replyTo?: string;
}

/**
 * Sends an email via SendGrid.
 * Wraps sgMail.send with TypeScript-friendly options and sensible defaults.
 */
export async function sendEmail(options: SendgridEmailOptions): Promise<void> {
  const {
    to,
    subject,
    html,
    text,
    from = process.env.DEFAULT_FROM_EMAIL || "no-reply@example.com",
    replyTo,
  } = options;

  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("Missing SENDGRID_API_KEY environment variable.");
  }

  const msg: sgMail.MailDataRequired = {
    to,
    from,
    subject,
    // Prefer HTML but fall back to text
    html: html ?? undefined,
    text: text ?? (html ? stripHtml(html) : undefined),
    ...(replyTo ? { replyTo } : {}),
  };

  await sgMail.send(msg);
}

/**
 * Very small helper to strip basic HTML tags when generating a fallback text version.
 * Not perfect, but good enough for most simple drafts.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
} 