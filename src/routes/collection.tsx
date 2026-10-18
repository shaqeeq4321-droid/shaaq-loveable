import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CatalogueCard } from "@/components/catalogue-card";
import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { catalogue } from "@/lib/catalogue";

export const Route = createFileRoute("/collection")({
  head: () => ({ meta: [
    { title: "Shirt & Polo Collection | Shaaq Apparels" },
    { name: "description", content: "Explore Shaaq Apparels' formal shirts and collared polo styles, ready to customise with your own details and logo." },
    { property: "og:title", content: "Shirt & Polo Collection | Shaaq Apparels" },
    { property: "og:description", content: "Formal shirt styles ready to customise and order." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: CollectionPage,
});

function CollectionPage() { return <SiteShell>
  <PageIntro eyebrow="The collection" title="Formalwear foundations, considered in every detail.">A representative selection of our approach to cloth, collar and finish. Explore formal shirts and collared polos. Customise shirts in the studio or enquire about our polo collection.</PageIntro>
  <section className="section-pad bg-background"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{catalogue.map((item, index) => <CatalogueCard key={item.name} item={item} priority={index < 3} />)}</div>
    <div className="mt-16 border-t border-border pt-10 text-center"><p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground">Styles shown are representative catalogue concepts. Final specifications, colours and order quantities can be discussed with our trade team.</p><Button asChild variant="trade" size="xl" className="mt-7"><Link to="/customise">Customise a shirt <ArrowRight /></Link></Button></div>
  </div></section>
  </SiteShell>; }