export const otpEmailTemplate = (otp: string, purpose: "verify" | "reset") => {
  const heading = purpose === "verify" ? "Verify your email" : "Reset your password";
  const message =
    purpose === "verify"
      ? "Use the code below to verify your RideSync account:"
      : "Use the code below to reset your RideSync password:";

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #6d28d9;">${heading}</h2>
      <p style="color: #3f3f46; font-size: 15px;">${message}</p>
      <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #6d28d9;">${otp}</span>
      </div>
      <p style="color: #71717a; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};