// Server-only: emails each new enquiry to the business owner, with the customer in CC.
// Uses Resend (https://resend.com). Set these environment variables in Vercel:
//   RESEND_API_KEY     - your Resend API key (secret)
//   NOTIFY_EMAIL_TO    - the inbox that receives enquiries
//   NOTIFY_EMAIL_FROM  - optional, e.g. "Shaaq Trading <enquiries@shaaqtrading.com>"
// If RESEND_API_KEY or NOTIFY_EMAIL_TO is missing, nothing is sent and the enquiry is still saved.

type Field = readonly [string, unknown];

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const show = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
};

export async function notifyOwner(input: {
  subject: string;
  replyTo?: string | null;
  fields: readonly Field[];
}): Promise<"sent" | "failed" | "not_configured"> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["NOTIFY_EMAIL_TO"];
  if (!apiKey || !to) return "not_configured";

  const from = process.env["NOTIFY_EMAIL_FROM"] || "Shaaq Trading <onboarding@resend.dev>";
  const customer = (input.replyTo ?? "").trim();
  const cc = customer && customer.toLowerCase() !== to.toLowerCase() ? [customer] : undefined;

  const rows = input.fields
    .map(([k, v]) => [k, show(v)] as const)
    .filter(([, v]) => v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #ddd;background:#f7f4ee;vertical-align:top;white-space:nowrap"><b>${esc(k)}</b></td>` +
        `<td style="padding:6px 12px;border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");

  const html =
    `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">` +
    `<h2 style="margin:0 0 12px">${esc(input.subject)}</h2>` +
    `<p>Thank you for contacting Shaaq Trading. We have received the details below and will be in touch shortly.</p>` +
    `<table style="border-collapse:collapse">${rows}</table></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        ...(cc ? { cc } : {}),
        ...(customer ? { reply_to: customer } : {}),
        subject: input.subject,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify] Resend error", res.status, await res.text().catch(() => ""));
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[notify] email failed", err);
    return "failed";
  }
}
