/** Sends via Resend's free-tier HTTP API. Without RESEND_API_KEY, logs the link in dev only. */
export async function sendPasswordResetEmail(to: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[password-reset] RESEND_API_KEY unset; reset link for ${to}: ${link}`);
    } else {
      console.warn("[password-reset] RESEND_API_KEY unset; reset email not sent");
    }
    return;
  }
  const from = process.env.EMAIL_FROM || "Reading Game <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your Reading Game password",
      text: `Someone asked to reset your password. Open this link within 30 minutes:\n\n${link}\n\nIf this wasn't you, ignore this email.`,
      html: `<p>Someone asked to reset your password.</p><p><a href="${link}">Reset your password</a> (expires in 30 minutes)</p><p>If this wasn't you, ignore this email.</p>`,
    }),
  });
  if (!res.ok) console.error("[password-reset] Resend error", res.status, await res.text().catch(() => ""));
}
