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

const FONT = "Arial,Helvetica,sans-serif";

// One compact table; group rows (CONTACT / DETAILS) act as small capital headings.
function group(title: string, rows: readonly (readonly [string, string])[]): string {
  if (!rows.length) return "";
  const head =
    `<tr><td colspan="2" style="padding:7px 12px;background:${BRAND.cream};font-size:11px;font-weight:bold;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(title)}</td></tr>`;
  const body = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="padding:6px 12px;width:30%;vertical-align:top;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.muted};border-top:1px solid ${BRAND.line}">${esc(k)}</td>` +
        `<td style="padding:6px 12px;vertical-align:top;font-size:14px;line-height:1.4;color:${BRAND.ink};border-top:1px solid ${BRAND.line}">${valueHtml(k, v)}</td>` +
        `</tr>`,
    )
    .join("");
  return head + body;
}

export async function notifyOwner(input: {
  subject: string;
  replyTo?: string | null;
  fields: readonly Field[];
  /** Base64 JPEG images shown inline in the email body (e.g. the customised garment). */
  images?: readonly { label: string; data: string }[];
  /** Extra files attached to the email (base64 content). */
  attachments?: readonly { filename: string; content: string }[];
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
  const heading = (colon > 0 ? input.subject.slice(0, colon) : input.subject).toUpperCase();
  const subtitle = colon > 0 ? input.subject.slice(colon + 1).trim() : "";
  const subject = `\u{1F988} ${input.subject}`;

  const images = input.images ?? [];
  const imagesBlock = images
    .map(
      (im, i) =>
        `<div style="padding:12px 0 4px;text-align:center">` +
        `<img src="cid:preview-${i}" alt="${esc(im.label)}" width="240" style="display:block;margin:0 auto;width:240px;max-width:100%;height:auto;border:1px solid ${BRAND.line}">` +
        `<div style="margin-top:6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.muted}">${esc(im.label)}</div></div>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.cream}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(subject)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream}"><tr><td align="center" style="padding:16px 8px">` +
    `<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;font-family:${FONT}">` +
    // header: one slim bar
    `<tr><td style="background:${BRAND.ink};padding:12px 18px;border-bottom:3px solid ${BRAND.red}">` +
    `<span style="font-size:18px;font-weight:bold;letter-spacing:.2em;color:#ffffff">${BRAND.name}</span>` +
    `<span style="float:right;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#d9c9b0;line-height:24px">${esc(BRAND.tag)}</span>` +
    `</td></tr>` +
    // body
    `<tr><td style="background:#ffffff;padding:18px">` +
    `<div style="font-size:18px;font-weight:bold;letter-spacing:.06em;color:${BRAND.ink}">${esc(heading)}</div>` +
    (subtitle ? `<div style="margin-top:2px;font-size:14px;color:${BRAND.muted}">${esc(subtitle)}</div>` : "") +
    `<div style="margin-top:8px;font-size:13px;line-height:1.5;color:${BRAND.ink}">Thank you. We have your details below and will reply shortly. Reply to this email to correct anything.</div>` +
    imagesBlock +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border:1px solid ${BRAND.line};border-collapse:collapse">` +
    group("Contact", contactRows) +
    group("Details", detailRows) +
    `</table>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>` +
    `<td style="background:${BRAND.red}"><a href="${BRAND.whatsapp}" style="display:inline-block;padding:9px 16px;font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;text-decoration:none">WhatsApp us</a></td>` +
    `</tr></table>` +
    `</td></tr>` +
    // footer
    `<tr><td style="background:${BRAND.ink};padding:10px 18px;font-size:11px;line-height:1.6;color:#c9bba5">` +
    `<a href="mailto:${BRAND.email}" style="color:#ffffff;text-decoration:none">${BRAND.email}</a> &nbsp;|&nbsp; ` +
    `<a href="tel:${BRAND.phone.replace(/\s/g, "")}" style="color:#ffffff;text-decoration:none">${BRAND.phone}</a> &nbsp;|&nbsp; ` +
    `<a href="${BRAND.site}" style="color:#ffffff;text-decoration:none">shaaqtrading.com</a><br>${esc(BRAND.legal)}` +
    `</td></tr>` +
    `</table></td></tr></table></body></html>`;

  const text =
    `${subject}\n\n` +
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
        subject,
        ...(images.length || input.attachments?.length
          ? {
              attachments: [
                ...images.map((im, i) => ({ filename: `garment-preview-${i + 1}.jpg`, content: im.data, content_id: `preview-${i}` })),
                ...(input.attachments ?? []),
              ],
            }
          : {}),
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
