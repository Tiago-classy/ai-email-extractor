import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

/**
 * Checks if the EmailJS service is configured with all necessary environment variables.
 * @returns {boolean} True if all required variables are set, false otherwise.
 */
export const isEmailServiceConfigured = (): boolean => {
    return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
};


// The shape of the template parameters is now defined inline in the sendEmail function signature.
export const sendEmail = async (templateParams: {
    source_name: string;
    email_list: string;
    recipient_email: string;
}): Promise<void> => {
  if (!isEmailServiceConfigured()) {
    console.error("EmailJS environment variables not set. Required: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY");
    throw new Error("Email sending service is not configured. Please contact the administrator.");
  }
  
  try {
    // Using non-null assertions because isEmailServiceConfigured is checked beforehand.
    // The cast is no longer needed as the inline object type is assignable to what emailjs.send expects.
    await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, templateParams, {
        publicKey: PUBLIC_KEY!,
    });
    console.log('Email sent successfully via EmailJS!');
  } catch (error) {
    console.error('Failed to send email via EmailJS:', error);
    // The error from EmailJS is not an Error instance, but an object with a `text` property.
    // We check for that shape to extract the specific service error.
    if (typeof error === 'object' && error !== null && 'text' in error && typeof (error as { text: unknown }).text === 'string') {
        throw new Error(`Failed to send email. Service error: ${(error as { text: string }).text}`);
    }
    // Handle standard Error objects as a fallback.
    if (error instanceof Error) {
        throw new Error(`Failed to send email. Service error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while sending the email.");
  }
};