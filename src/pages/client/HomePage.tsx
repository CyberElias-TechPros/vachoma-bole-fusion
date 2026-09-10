import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Utensils, ArrowRight, Scissors, Flame, Truck, Ruler, Sparkles, MapPin, Clock } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { siteConfig } from "@/lib/site";

const HomePage = () => {
  return (
    <ClientLayout>
      <Seo
        title="Custom Fashion Design & Authentic Bole in Port Harcourt"
        description="Vachoma Empire is Port Harcourt's home for bespoke fashion design and authentic Bole — roasted plantain, yam, sweet potatoes and smoked fish with signature palm-oil pepper sauce. Order food online or request a custom outfit."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.18),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="container relative mx-auto py-14 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="animate-fade-in space-y-6">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5" />
                Port Harcourt, Rivers State
              </Badge>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Bespoke fashion.
                <span className="block text-primary">Authentic Bole.</span>
                One Empire.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                A fashion atelier crafting made-to-measure pieces, and a kitchen serving
                Port Harcourt's beloved roasted plantain with rich palm-oil pepper sauce —
                smoked fish, yam and sweet potatoes inclusive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/fashion-portfolio">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <ShoppingBag className="h-5 w-5" />
                    Explore Fashion
                  </Button>
                </Link>
                <Link to="/food-menu">
                  <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                    <Utensils className="h-5 w-5" />
                    View Bole Menu
                  </Button>
                </Link>
              </div>
              <dl className="grid max-w-md grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Est.</dt>
                  <dd className="text-2xl font-bold">2018</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Businesses</dt>
                  <dd className="text-2xl font-bold">2 in 1</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">City</dt>
                  <dd className="text-2xl font-bold">PHC</dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border shadow-2xl">
                <img
                  src="/images/IMG-20250516-WA0003.jpg"
                  alt="Signature Vachoma Empire Bole — smoked fish with rich red pepper sauce"
                  className="aspect-[4/5] w-full object-cover sm:aspect-square lg:aspect-[4/5]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <Card className="absolute -bottom-5 -left-3 shadow-xl sm:-left-6">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-primary/15 p-2.5 text-primary">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Roasted fresh daily</p>
                    <p className="text-xs text-muted-foreground">Pickup &amp; delivery in PHC</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute -right-3 -top-5 hidden shadow-xl sm:-right-4 md:block">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-primary/15 p-2.5 text-primary">
                    <Scissors className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Made to measure</p>
                    <p className="text-xs text-muted-foreground">Custom designs in days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two businesses ───────────────────────────────── */}
      <section className="bg-muted/40 py-16 md:py-20" aria-labelledby="businesses-heading">
        <div className="container mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">What we do</p>
            <h2 id="businesses-heading" className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              Two crafts, one standard: excellence
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your experience — or enjoy both. Every dish and every stitch carries
              the Vachoma name.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Fashion card */}
            <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/images/IMG-20250516-WA0004.jpg"
                  alt="Hand-beaded coral blouse made by the Vachoma Empire fashion atelier"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <Badge className="absolute left-4 top-4">Fashion Atelier</Badge>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="mb-2 text-2xl font-bold">Custom fashion design</h3>
                <p className="mb-6 text-muted-foreground">
                  Made-to-measure dresses, traditional attire, suits and statement pieces —
                  designed around your body, your fabric and your occasion.
                </p>
                <ul className="mb-6 space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Ruler className="h-4 w-4 shrink-0 text-primary" /> Exact measurements &amp; perfect fit
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" /> Hand beading &amp; detailing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Scissors className="h-4 w-4 shrink-0 text-primary" /> Seasonal collections &amp; portfolio pieces
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link to="/fashion-portfolio">
                    <Button>View Portfolio <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Link to="/fashion-custom-orders">
                    <Button variant="outline">Request Custom Design</Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Food card */}
            <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/images/IMG-20250516-WA0030.jpg"
                  alt="Vachoma Empire Bole platter — roasted plantain with pepper sauce and onions"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <Badge className="absolute left-4 top-4">Bole Kitchen</Badge>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="mb-2 text-2xl font-bold">Authentic Bole food</h3>
                <p className="mb-6 text-muted-foreground">
                  Fire-roasted plantain, yam and sweet potatoes with smoked fish and our
                  signature palm-oil pepper sauce. Dine in, take away, or get it delivered.
                </p>
                <ul className="mb-6 space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Flame className="h-4 w-4 shrink-0 text-primary" /> Roasted fresh over open fire
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Utensils className="h-4 w-4 shrink-0 text-primary" /> Fish, yam &amp; sweet potato options
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Truck className="h-4 w-4 shrink-0 text-primary" /> Pickup &amp; delivery across Port Harcourt
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link to="/food-menu">
                    <Button>View Menu <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Link to="/food-order">
                    <Button variant="outline">Order Now</Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="how-heading">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Getting started</p>
            <h2 id="how-heading" className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              Effortless from first click
            </h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse & choose",
                text: "Explore the fashion portfolio or the Bole menu. Save favourites, build your food cart, or pick a design to customise.",
              },
              {
                step: "02",
                title: "Tell us what you want",
                text: "Place a food order for pickup or delivery — or send a custom fashion request with your measurements and reference photos.",
              },
              {
                step: "03",
                title: "We craft & deliver",
                text: "Our kitchen fires up your Bole; our atelier cuts your fabric. Track everything from your personal dashboard.",
              },
            ].map((s) => (
              <li key={s.step} className="relative rounded-2xl border bg-card p-6 md:p-8">
                <span className="text-5xl font-black text-primary/20" aria-hidden="true">{s.step}</span>
                <h3 className="mb-2 mt-3 text-xl font-bold">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="bg-muted/40 py-16 md:py-20" aria-labelledby="love-heading">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Customer love</p>
            <h2 id="love-heading" className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              What Port Harcourt says
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "The custom outfit designed for my wedding was absolutely perfect. The attention to detail was amazing!",
                name: "Sarah Johnson",
                role: "Fashion Client",
              },
              {
                quote: "Best Bole in Port Harcourt! The fish is always fresh and the sauce is perfect. Their delivery is prompt too.",
                name: "Michael Obi",
                role: "Food Customer",
              },
              {
                quote: "I've been a regular client for both their fashion and food services. The quality and customer care are consistently excellent.",
                name: "Ada Nwosu",
                role: "Regular Customer",
              },
            ].map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-4 text-4xl leading-none text-primary" aria-hidden="true">&ldquo;</div>
                <blockquote className="flex-1 text-muted-foreground">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t pt-4">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visit / CTA ──────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="visit-heading">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-card to-card p-8 md:p-14">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 id="visit-heading" className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Hungry now? Or planning something special?
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Order Bole for today, or start a custom fashion piece for your next occasion.
                  We're in the heart of Port Harcourt.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/food-order">
                    <Button size="lg" className="w-full sm:w-auto">Order Bole</Button>
                  </Link>
                  <Link to="/fashion-custom-orders">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Start Custom Order
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4 rounded-2xl border bg-background/60 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Find us</p>
                    <p className="text-sm text-muted-foreground">{siteConfig.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Opening hours</p>
                    {siteConfig.contact.hours.map((h) => (
                      <p key={h} className="text-sm text-muted-foreground">{h}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};

export default HomePage;
