import { Resend } from "resend";

const FROM_EMAIL = "Weekly Planner <noreply@resend.dev>";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password — Weekly Planner",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #3d3632;">
          <h2 style="font-family: 'Lora', Georgia, serif; color: #7c6f5e; margin-bottom: 16px;">
            Password Reset
          </h2>
          <p>You requested a password reset for your Weekly Planner account.</p>
          <p>Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background: #7c6f5e; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #8a8078;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return { success: false, error: "Failed to send email" };
  }
}
