import { createFileRoute } from "@tanstack/react-router";

import { GarmentBuilder } from "@/components/garment-builder";
import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/customise")({
  validateSearch: (search: Record<string, unknown>): { garment?: string } =>
    typeof search["garment"] === "string" ? { garment: search["garment"] } : {},
  head: () => ({
    meta: [
      { title: "Customise Your Garment | Shaaq Apparels" },
      { name: "description", content: "Build a shirt, t-shirt or trousers detail by detail, add your own logo and request a quote." },
      { property: "og:title", content: "Customise Your Garment | Shaaq Apparels" },
      { property: "og:description", content: "Choose every detail, preview your logo on the garment and request pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomisePage,
});

function CustomisePage() {
  const { garment } = Route.useSearch();
  return (
    <SiteShell>
      <PageIntro eyebrow="Customisation studio" title="Build the garment, detail by detail.">
        Choose a garment, select every specification, add your own logo to preview placement, and describe the fabric and
        stitching you need. Send it to us and we'll price it for the quantity you want.
      </PageIntro>
      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <GarmentBuilder {...(garment ? { initialGarment: garment } : {})} />
        </div>
      </section>
    </SiteShell>
  );
}
