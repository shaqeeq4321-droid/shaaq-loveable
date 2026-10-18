import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquareText, Ruler } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { QuoteForm } from "@/components/quote-form";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/enquiry")({
  validateSearch: (search: Record<string, unknown>): { style?: string } =>
    typeof search["style"] === "string" ? { style: search["style"] } : {},
  head: () => ({ meta: [
    { title: "Request a Trade Quote | Shaaq Apparels" },
    { name: "description", content: "Tell Shaaq Trading about the garments, quantities and sizes you need." },
    { property: "og:title", content: "Request a Trade Quote | Shaaq Apparels" },
    { property: "og:description", content: "Request pricing for the number of pieces you need." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: EnquiryPage,
});

function EnquiryPage() { const { style = "" } = Route.useSearch(); return <SiteShell>
  <PageIntro eyebrow="Trade enquiries" title="Tell us what your business needs.">Share your styles, quantities and sizing requirements. We’ll use the details to understand the enquiry and shape the right conversation.</PageIntro>
  <section className="section-pad bg-secondary"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14 lg:px-12">
    <aside><p className="eyebrow">Before you enquire</p><h2 className="mt-5 font-display text-3xl leading-tight">A few useful details help us respond well.</h2><div className="mt-9 space-y-7"><Info icon={<MessageSquareText />} title="Styles" text="Note the catalogue styles or shirt specifications that interest you." /><Info icon={<Ruler />} title="Sizing & quantity" text="Share an estimated quantity and your expected size range." /><Info icon={<Mail />} title="Next steps" text="We’ll contact you directly to discuss your requirements in more detail." /></div></aside>
    <QuoteForm initialStyle={style} />
  </div></section>
  </SiteShell>; }

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="grid grid-cols-[auto_1fr] gap-4"><span className="mt-1 text-primary [&_svg]:size-5">{icon}</span><div><h3 className="font-semibold text-foreground">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>; }