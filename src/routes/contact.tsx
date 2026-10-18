import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Globe2, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact | Shaaq Apparels" },
    { name: "description", content: "Contact Shaaq Apparels about custom shirts, t-shirts, trousers and tuxedos." },
    { property: "og:title", content: "Contact Shaaq Apparels" },
    { property: "og:description", content: "Talk to our team about custom garments, samples and quotes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: ContactPage,
});

function ContactPage() { return <SiteShell>
  <PageIntro eyebrow="Contact" title="Let’s talk about your garments.">For custom orders, samples, appointments or pricing, contact our team using the details below.</PageIntro>
  <section className="section-pad bg-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-12">
    <div><p className="eyebrow">Contact details</p><div className="mt-8 border-t border-border"><ContactRow icon={<Mail />} label="Email" value="info@shaaqtrading.com" href="mailto:info@shaaqtrading.com" /><ContactRow icon={<MessageCircle />} label="WhatsApp" value="+44 7440 744464" href="https://wa.me/447440744464" /><ContactRow icon={<Phone />} label="Phone" value="+44 7440 744464" href="tel:+447440744464" /><ContactRow icon={<Globe2 />} label="Website" value="www.shaaqtrading.com" href="https://www.shaaqtrading.com" /></div><p className="mt-6 text-muted-foreground">London, United Kingdom</p></div>
    <div className="bg-secondary p-7 sm:p-10"><p className="eyebrow">Ready to order?</p><h2 className="mt-5 font-display text-4xl leading-tight">Build it, preview it, price it.</h2><p className="mt-5 leading-7 text-muted-foreground">Specify every detail in our customisation studio, or request an on-site visit and we will bring samples to you.</p><Button asChild variant="trade" size="xl" className="mt-8"><Link to="/customise">Start customising <ArrowRight /></Link></Button><Button asChild variant="outline" size="xl" className="mt-3 sm:ml-3"><Link to="/appointments">Request a visit</Link></Button></div>
  </div></section>
  <section className="section-pad bg-secondary"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="eyebrow">Follow Shaaq Apparels</p><h2 className="section-title mt-5">Keep in touch with the collection.</h2></div><div className="flex gap-3"><a href="https://www.facebook.com/shaaqtrading/" target="_blank" rel="noreferrer" className="contact-social"><Facebook /> Facebook</a><a href="https://www.instagram.com/shaaqtrading/" target="_blank" rel="noreferrer" className="contact-social"><Instagram /> Instagram</a></div></div></div></section>
  </SiteShell>; }

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) { return <a href={href} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 border-b border-border py-7"><span className="text-primary [&_svg]:size-5">{icon}</span><span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span><span className="mt-1 block truncate font-display text-xl text-foreground sm:text-2xl">{value}</span></span><ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" /></a>; }