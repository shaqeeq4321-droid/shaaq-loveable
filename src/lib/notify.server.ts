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

const BRAND = {
  name: "SHAAQ",
  tag: "Apparels & Automotives",
  red: "#7d1f28",
  ink: "#231a17",
  cream: "#f6efe3",
  line: "#e3d8c6",
  muted: "#6f625a",
  email: "info@shaaqtrading.com",
  phone: "+44 7440 744464",
  whatsapp: "https://wa.me/447440744464",
  site: "https://shaaqtrading.com",
  legal: "Shaaq Trading Limited · Company number 15821646 · London, United Kingdom",
};

const CONTACT_LABELS = new Set(["Name", "Email", "Phone", "Company"]);

function valueHtml(label: string, value: string): string {
  const safe = esc(value);
  if (label === "Email") return `<a href="mailto:${safe}" style="color:${BRAND.red};text-decoration:none">${safe}</a>`;
  if (label === "Phone") return `<a href="tel:${esc(value.replace(/[^+\d]/g, ""))}" style="color:${BRAND.red};text-decoration:none">${safe}</a>`;
  return safe.replace(/\n/g, "<br>");
}

function section(title: string, rows: readonly (readonly [string, string])[]): string {
  if (!rows.length) return "";
  const body = rows
    .map(
      ([k, v], i) =>
        `<tr>` +
        `<td style="padding:11px 14px;width:34%;vertical-align:top;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.muted};border-top:${i ? `1px solid ${BRAND.line}` : "0"}">${esc(k)}</td>` +
        `<td style="padding:11px 14px;vertical-align:top;font-size:15px;line-height:1.55;color:${BRAND.ink};border-top:${i ? `1px solid ${BRAND.line}` : "0"}">${valueHtml(k, v)}</td>` +
        `</tr>`,
    )
    .join("");
  return (
    `<p style="margin:26px 0 8px;font-size:12px;font-weight:bold;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(title)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-radius:6px;background:#ffffff;border-collapse:separate">${body}</table>`
  );
}

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

  const all = input.fields
    .map(([k, v]) => [k, show(v)] as const)
    .filter(([, v]) => v.trim() !== "");
  const contactRows = all.filter(([k]) => CONTACT_LABELS.has(k));
  const detailRows = all.filter(([k]) => !CONTACT_LABELS.has(k));

  const colon = input.subject.indexOf(":");
  const heading = colon > 0 ? input.subject.slice(0, colon) : input.subject;
  const subtitle = colon > 0 ? input.subject.slice(colon + 1).trim() : "";

  const html =
    `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.cream}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(input.subject)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream}"><tr><td align="center" style="padding:28px 12px">` +
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;font-family:Georgia,'Times New Roman',serif">` +
    // header
    `<tr><td style="background:${BRAND.ink};padding:26px 30px;border-radius:8px 8px 0 0">` +
    `<div style="font-size:26px;font-style:italic;font-weight:bold;letter-spacing:.04em;color:#ffffff">${BRAND.name}</div>` +
    `<div style="margin-top:4px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#d9c9b0">${esc(BRAND.tag)}</div>` +
    `</td></tr>` +
    `<tr><td style="background:${BRAND.red};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>` +
    // body
    `<tr><td style="background:#fbf8f2;padding:32px 30px 12px;font-family:Arial,Helvetica,sans-serif">` +
    `<h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:${BRAND.ink}">${esc(heading)}</h1>` +
    (subtitle ? `<p style="margin:8px 0 0;font-size:15px;color:${BRAND.muted}">${esc(subtitle)}</p>` : "") +
    `<p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:${BRAND.ink}">Thank you for getting in touch with Shaaq Trading. We have received the details below and a member of our team will reply to you shortly. If anything needs correcting, simply reply to this email.</p>` +
    section("Contact", contactRows) +
    section("Details", detailRows) +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 12px"><tr>` +
    `<td style="background:${BRAND.red};border-radius:5px"><a href="${BRAND.whatsapp}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none">Message us on WhatsApp</a></td>` +
    `</tr></table>` +
    `</td></tr>` +
    // footer
    `<tr><td style="background:${BRAND.ink};padding:22px 30px;border-radius:0 0 8px 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#c9bba5">` +
    `<a href="mailto:${BRAND.email}" style="color:#ffffff;text-decoration:none">${BRAND.email}</a> &nbsp;·&nbsp; ` +
    `<a href="tel:${BRAND.phone.replace(/\s/g, "")}" style="color:#ffffff;text-decoration:none">${BRAND.phone}</a> &nbsp;·&nbsp; ` +
    `<a href="${BRAND.site}" style="color:#ffffff;text-decoration:none">shaaqtrading.com</a><br>${esc(BRAND.legal)}` +
    `</td></tr>` +
    `</table></td></tr></table></body></html>`;

  const text =
    `${input.subject}\n\n` +
    `Thank you for getting in touch with Shaaq Trading. We have received the details below and will reply shortly.\n\n` +
    all.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${BRAND.email} | ${BRAND.phone} | shaaqtrading.com\n${BRAND.legal}`;

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
        text,
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
