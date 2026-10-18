import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, CheckCheck, PenTool, Ruler, Shirt, Sparkles, Upload } from "lucide-react";

import brandingImage from "@/assets/industry-branding.jpg";
import consultationImage from "@/assets/appointment-fabric-consultation.jpg";
import explodedShirt from "@/assets/exploded-shirt.jpg";
import measurementImage from "@/assets/shirt-measurement.jpg";
import trousersImage from "@/assets/garment-trousers.jpg";
import tshirtImage from "@/assets/garment-tshirt.jpg";
import tuxedoImage from "@/assets/garment-tuxedo.jpg";
import shirtImage from "@/assets/shirt-white.jpg";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shaaq Apparels | Custom Shirts, T-Shirts & Trousers" },
      { name: "description", content: "Build custom shirts, t-shirts and trousers detail by detail, preview your own logo, request an on-site sample visit and receive a quote." },
      { property: "og:title", content: "Shaaq Apparels | Custom Shirts, T-Shirts & Trousers" },
      { property: "og:description", content: "Specify every detail, add your logo and request pricing for the quantity you need." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const garmentCards = [
  { name: "Formal shirts", id: "shirt", image: shirtImage, detail: "Collars, cuffs, plackets, stitch density" },
  { name: "T-shirts", id: "tshirt", image: tshirtImage, detail: "Weights, knits, necklines, decoration" },
  { name: "Trousers", id: "trousers", image: trousersImage, detail: "Waistbands, pleats, pockets, hems" },
];


function HomePage() {
  return (
    <SiteShell>
      <section className="hero-section">
        <img src={explodedShirt} alt="Exploded view of a shirt showing collar, yoke, cuffs, placket and panels laid out separately" width={1536} height={1152} className="hero-image" />
        <div className="hero-overlay" />
        <div className="relative mx-auto flex min-h-[min(720px,75svh)] max-w-7xl items-end px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="max-w-4xl">
            <p className="eyebrow text-cream/80">Custom garment specialists</p>
            <h1 className="mt-6 font-display text-5xl leading-[0.98] text-cream sm:text-7xl lg:text-[5.4rem]">Shaaq Apparels</h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-cream/80 sm:text-lg">
              Custom shirts, t-shirts and trousers. Choose each detail, add your own logo, describe the fabric and
              stitching you want, then order the quantity you need.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="trade" size="xl"><Link to="/customise">Start customising <ArrowRight /></Link></Button>
              <Button asChild variant="cream" size="xl"><Link to="/appointments">Request a sample visit</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow">Your branding</p><h2 className="section-title mt-5">Your brand. Worn with pride.</h2><p className="mt-6 max-w-2xl leading-8 text-muted-foreground">Branded t-shirts, collared polos and formal shirts for hospitality, logistics and business teams. Choose your garment, position your logo and send us the details for a quote.</p></div><Button asChild variant="outline" size="xl"><Link to="/customise">Preview your logo <Sparkles /></Link></Button></div>
          <img src={brandingImage} alt="Hospitality, logistics and office professionals wearing t-shirts, collared polos and formal shirts with YOUR BRAND chest logos" width={1536} height={1024} loading="lazy" className="mt-10 aspect-[3/2] w-full object-cover" />
          <div className="mt-4 grid grid-cols-3 gap-3 border-b border-border pb-5 text-center text-xs font-semibold text-muted-foreground sm:text-sm"><p>Hospitality</p><p>Logistics &amp; trades</p><p>Corporate teams</p></div>
        </div>
      </section>

      <section className="section-pad bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div><p className="eyebrow">What we do</p><h2 className="section-title mt-5">Garments made to your specification.</h2></div>
          <div className="lg:pt-8">
            <p className="text-xl leading-9 text-foreground">We make formal shirts, t-shirts, trousers and evening wear to order — from single boutique ranges to full uniform programmes.</p>
            <p className="mt-6 leading-8 text-muted-foreground">Build your garment online, upload your logo to preview how it sits, and tell us exactly what fabric quality and stitching you expect. Review real samples with us, then confirm your order with confidence.</p>
            <Button asChild variant="link" className="mt-6 h-auto p-0 text-sm"><Link to="/about">How we work <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <img src={measurementImage} alt="Tailor measuring a formal shirt with a measuring tape" width={1440} height={1088} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
          <div className="flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-16 lg:py-20"><p className="eyebrow text-cream/60">Measured with care</p><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Specifications checked before production.</h2><p className="mt-6 max-w-xl leading-8 text-cream/70">Measurements, collar proportions, cuffs and construction details are checked against your agreed specification for a dependable finished garment.</p></div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5">
            <div><p className="eyebrow">Choose a garment</p><h2 className="section-title mt-4">Start with what you're making</h2></div>
            <Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/customise">Open the studio <ArrowRight /></Link></Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {garmentCards.map((card, index) => (
              <Link key={card.id} to="/customise" search={{ garment: card.id }} className="group product-card">
                <div className="aspect-[4/5] overflow-hidden bg-background">
                  <img src={card.image} alt={card.name} width={1024} height={1280} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                </div>
                <div className="border-x border-b border-border bg-background p-5">
                  <h3 className="font-display text-xl text-foreground">{card.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.detail}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Customise <ArrowRight className="size-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
          <Button asChild variant="outline" size="lg" className="mt-8 w-full sm:hidden"><Link to="/customise">Open the studio <ArrowRight /></Link></Button>
        </div>
      </section>

      <section className="section-pad bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl"><p className="eyebrow">How it works</p><h2 className="section-title mt-5">From specification to delivery.</h2></div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <Step number="01" icon={<PenTool />} title="Build the garment" text="Select every detail with a button per option, from collar shape to stitch density." />
            <Step number="02" icon={<Upload />} title="Add your logo" text="Upload your artwork and position it on the garment to preview placement and scale." />
            <Step number="03" icon={<CalendarCheck />} title="Arrange a visit" text="Choose a preferred time for us to bring samples, quality and stitching examples to you." />
            <Step number="04" icon={<CheckCheck />} title="Confirm & order" text="Approve the specification and sizing, then order the number of pieces you need." />
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl"><p className="eyebrow">Specification detail</p><h2 className="section-title mt-5">Every spec your boutique asks for.</h2></div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <SpecCard
              image={consultationImage}
              icon={<Shirt />}
              title="Shirt boutiques"
              intro="Full shirtmaking detail, specified option by option."
              items={["Collar: cutaway, spread, semi-cutaway, point, button-down, wing, mandarin", "Collar construction: fused, soft unfused, removable bones, hand-finished", "Cuffs: single barrel, double (French), rounded, mitred", "Plackets: standard, French, covered fly, pleated bib", "Fabrics: poplin, twill, pinpoint, royal oxford, herringbone, sateen", "Back shaping, pockets, buttons, monogram position", "Stitch density from 7 to 12 stitches per inch"]}
            />
            <SpecCard
              image={tuxedoImage}
              icon={<Ruler />}
              title="Suit & tuxedo boutiques"
              intro="Evening wear detailing and hand finishing."
              items={["Lapels: peak or shawl satin, notch or peak grosgrain, self fabric", "Fastening: one button, two button, double-breasted 4x2 or 6x2", "Construction: fused, half canvas, full canvas, hand-padded lapel", "Trims: satin, grosgrain, velvet; jetted or flap pockets", "Dress shirt: pleated or marcella bib, wing collar, double cuffs, studs", "Trouser braid, cummerbund, low-cut waistcoat, braces", "Pick stitching, Milanese buttonholes, monogrammed lining"]}
            />
          </div>
          <Button asChild variant="trade" size="xl" className="mt-10"><Link to="/customise">Specify your garment <ArrowRight /></Link></Button>
        </div>
      </section>


      <section className="cta-band">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-20">
          <div>
            <p className="eyebrow text-cream/60">Ready when you are</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl">Preview the samples, then order with confidence.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cream" size="xl"><Link to="/appointments">Request an on-site visit</Link></Button>
            <Button asChild variant="outline" size="xl" className="border-cream/40 bg-transparent text-cream hover:bg-cream hover:text-ink"><Link to="/enquiry">Request a quote</Link></Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Step({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-center justify-between text-primary"><span className="grid size-14 place-items-center border border-primary/25 bg-secondary [&_svg]:size-7">{icon}</span><span className="font-display text-sm">{number}</span></div>
      <h3 className="mt-7 font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}

function SpecCard({ title, intro, items, image, icon }: { title: string; intro: string; items: string[]; image: string; icon: React.ReactNode }) {
  return (
    <article className="overflow-hidden border border-border bg-background">
      <img src={image} alt={`${title} tailoring and garment details`} width={1440} height={1088} loading="lazy" className="aspect-[16/9] w-full object-cover" />
      <div className="p-6 sm:p-8"><span className="text-primary [&_svg]:size-7">{icon}</span>
      <h3 className="font-display text-3xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{intro}</p>
      <ul className="spec-list mt-6">
        {items.map((item) => (
          <li key={item}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{item}</li>
        ))}
      </ul></div>
    </article>
  );
}
