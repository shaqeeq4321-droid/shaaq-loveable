import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Factory, Store } from "lucide-react";

import blueShirt from "@/assets/shirt-blue.jpg";
import productionImage from "@/assets/garment-production-line.jpg";
import stripeShirt from "@/assets/shirt-stripe.jpg";
import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About | Shaaq Apparels" },
    { name: "description", content: "Learn how Shaaq Apparels makes custom shirts, t-shirts, trousers and tuxedos to each client's specification." },
    { property: "og:title", content: "About Shaaq Apparels" },
    { property: "og:description", content: "Custom garments made to your specification, with your branding." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AboutPage,
});

function AboutPage() {
  return <SiteShell>
    <PageIntro eyebrow="Our story" title="Built around the details that matter to you.">Shaaq Apparels makes custom garments for boutiques, brands and businesses — specified by you, sampled with you, and made to order.</PageIntro>
    <section className="section-pad bg-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12">
      <div className="image-frame"><img src={stripeShirt} alt="Blue striped formal shirt showing precise tailoring" width={1024} height={1280} className="h-full w-full object-cover" /></div>
      <div><p className="eyebrow">Our model</p><h2 className="section-title mt-5">Your specification.<br />Our making.</h2><p className="mt-7 text-lg leading-8 text-foreground">You choose every detail — fabric, collar, cuff, stitching, fit and branding — and we make it in the quantity you need.</p><p className="mt-5 leading-8 text-muted-foreground">Before production, request an on-site appointment and we will bring samples to your premises so you can check stitching quality and confirm sizing. Every order is made with attention to cloth, construction and consistent finish.</p></div>
    </div></section>
    <section className="section-pad bg-secondary"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div className="max-w-2xl"><p className="eyebrow">Who we serve</p><h2 className="section-title mt-5">Made for the specialist trade.</h2></div>
      <div className="mt-12 grid gap-8 md:grid-cols-3"><Value icon={<Building2 />} number="01" title="Shirt & suit boutiques" text="Full specification control for formal shirts, trousers and tuxedos, with the detailing your customers expect." /><Value icon={<Store />} number="02" title="Brands & businesses" text="Branded t-shirts, shirts and uniforms with your logo placed exactly where you want it." /><Value icon={<Factory />} number="03" title="Long-term partners" text="Clear communication, repeatable quality and a practical approach to ongoing order requirements." /></div>
    </div></section>
    <section className="section-pad bg-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:px-12">
      <div className="overflow-hidden"><img src={productionImage} alt="Skilled garment workers producing formal shirts on an organised production line" width={1440} height={1088} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" /></div>
      <div><p className="eyebrow">Production</p><h2 className="section-title mt-5">Consistency at every stage.</h2><p className="mt-7 leading-8 text-muted-foreground">From cutting and stitching to pressing and final inspection, each production stage follows the approved sample and specification. This keeps sizing, detailing and finish consistent across your order.</p></div>
    </div></section>
    <section className="section-pad bg-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.75fr] lg:items-center lg:gap-20 lg:px-12">
      <div><p className="eyebrow">Our standard</p><h2 className="section-title mt-5">Quality that earns its place on the rail.</h2><p className="mt-7 max-w-xl leading-8 text-muted-foreground">We believe strong trade relationships begin with a product that performs. Our focus is on balanced fits, dependable construction and fabrics selected for the demands of formal dressing.</p><Button asChild variant="trade" size="xl" className="mt-8"><Link to="/customise">Start customising <ArrowRight /></Link></Button></div>
      <div className="image-frame image-frame-short"><img src={blueShirt} alt="Pale blue formal shirt from the Shaaq collection" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" /></div>
    </div></section>
  </SiteShell>;
}

function Value({ icon, number, title, text }: { icon: React.ReactNode; number: string; title: string; text: string }) { return <article className="border-t border-border pt-6"><div className="flex items-center justify-between text-primary"><span className="[&_svg]:size-5">{icon}</span><span className="font-display text-sm">{number}</span></div><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>; }