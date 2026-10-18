import { createFileRoute } from "@tanstack/react-router";
import { Layers, Ruler, Scissors } from "lucide-react";

import { AppointmentForm } from "@/components/appointment-form";
import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import consultationImage from "@/assets/appointment-fabric-consultation.jpg";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Request an On-Site Sample Visit | Shaaq Apparels" },
      { name: "description", content: "Choose a preferred date and time for Shaaq Trading to bring fabric, stitching and garment samples to your business." },
      { property: "og:title", content: "Request an On-Site Sample Visit | Shaaq Apparels" },
      { property: "og:description", content: "Arrange a customer-premises visit to review samples, quality and stitching before you order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  return (
    <SiteShell>
      <PageIntro eyebrow="On-site appointments" title="We bring the samples to you.">
        Choose a preferred date and time for us to visit your business. Tell us what you need to review and we’ll bring the
        relevant fabrics, stitching examples and finished garments.
      </PageIntro>

      <section className="section-pad bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:px-12">
          <div className="overflow-hidden"><img src={consultationImage} alt="Tailoring consultant in a double-breasted suit presenting fabric swatches to a customer" width={1440} height={1088} className="aspect-[4/3] h-full w-full object-cover" /></div>
          <div><p className="eyebrow">At your premises</p><h2 className="section-title mt-5">Compare cloth and construction in person.</h2><p className="mt-6 leading-8 text-muted-foreground">We visit your boutique, office or business with the samples you select. Review colour, weight, weave, stitching and fit with your team before requesting a quote.</p></div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-3">
            <Point icon={<Layers />} title="Fabrics in hand" text="Compare weights, weaves and finishes side by side before choosing." />
            <Point icon={<Scissors />} title="Stitching up close" text="Inspect seam quality, stitch density and hand-finished detailing." />
            <Point icon={<Ruler />} title="Fit and sizing" text="Try sample sizes and agree the grading that suits your customers." />
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <AppointmentForm />
        </div>
      </section>
    </SiteShell>
  );
}

function Point({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border-t border-border pt-6">
      <span className="text-primary [&_svg]:size-5">{icon}</span>
      <h2 className="mt-6 font-display text-2xl text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
