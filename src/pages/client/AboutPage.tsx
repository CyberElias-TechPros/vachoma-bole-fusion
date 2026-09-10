import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { siteConfig } from "@/lib/site";
import { Scissors, Flame, Heart, Award, Users, ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <ClientLayout>
      <Seo
        title="About Us"
        description="The story of Vachoma Empire — a Port Harcourt fashion atelier and Bole kitchen celebrating Nigerian creativity through craft and cuisine since 2018."
        path="/about"
      />
      <div className="container mx-auto py-12 md:py-16">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Our story</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">About Vachoma Empire</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Celebrating Nigerian creativity through fashion design and culinary excellence
          </p>
        </div>

        <div className="mb-16 grid items-center gap-10 md:mb-20 md:grid-cols-2 md:gap-14">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold tracking-tight">From a small atelier to a household name</h2>
            <p className="text-lg text-muted-foreground">
              Founded in 2018, Vachoma Empire began as a small fashion atelier in Port Harcourt.
              Our founder, Victoria Achor, combined her passion for traditional and contemporary
              fashion with a love for authentic Nigerian cuisine.
            </p>
            <p className="text-lg text-muted-foreground">
              What started as a small operation quickly grew as word spread about our quality
              craftsmanship and attention to detail. In 2020, we expanded to include our Bole
              food business, bringing traditional flavours with a modern twist to our customers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/fashion-portfolio">
                <Button>See Our Work <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Get In Touch</Button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border shadow-lg">
            <img
              src="/images/IMG-20250516-WA0004.jpg"
              alt="Hand-beaded coral blouse crafted by the Vachoma Empire fashion atelier"
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mb-16 md:mb-20">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Our Vision &amp; Mission</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 inline-flex rounded-full bg-primary/15 p-3 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Vision</h3>
              <p className="text-muted-foreground">
                To be the leading provider of quality fashion designs and authentic Nigerian
                cuisine in Port Harcourt, recognised for our commitment to excellence,
                creativity, and customer satisfaction.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 inline-flex rounded-full bg-primary/15 p-3 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Mission</h3>
              <p className="text-muted-foreground">
                To create exceptional fashion pieces and delicious food experiences that celebrate
                Nigerian culture and creativity, while providing exceptional service to our clients
                and contributing positively to our community.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16 md:mb-20">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">What we stand for</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Scissors,
                title: "Craftsmanship",
                text: "Every garment is cut, fitted and finished by hand. We don't rush stitches, and we don't cut corners.",
              },
              {
                icon: Flame,
                title: "Authentic flavour",
                text: "Real fire, fresh ingredients, and a palm-oil pepper sauce recipe our regulars can recognise blindfolded.",
              },
              {
                icon: Users,
                title: "Community",
                text: "Port Harcourt made us. We hire locally, source locally, and treat every customer like a neighbour — because you are.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border bg-card p-6">
                <div className="mb-4 inline-flex rounded-full bg-primary/15 p-2.5 text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Our Businesses</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border bg-card">
              <img
                src="/images/IMG-20250516-WA0004.jpg"
                alt="Beaded blouse detail from the Vachoma Empire fashion atelier"
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <div className="p-8">
                <h3 className="mb-3 text-2xl font-semibold">Fashion Design</h3>
                <p className="mb-4 text-muted-foreground">
                  Our fashion business specialises in custom designs, ready-to-wear collections,
                  and traditional attire. We work closely with clients to create pieces that
                  reflect their personal style while incorporating elements of Nigerian culture.
                </p>
                <Link to="/fashion-custom-orders">
                  <Button variant="outline">Request a Design <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-card">
              <img
                src="/images/IMG-20250516-WA0030.jpg"
                alt="Vachoma Empire Bole platter with roasted plantain, pepper sauce and onions"
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <div className="p-8">
                <h3 className="mb-3 text-2xl font-semibold">Bole Food</h3>
                <p className="mb-4 text-muted-foreground">
                  Our Bole food business celebrates the rich culinary tradition of roasted plantain,
                  sweet potatoes, fish, and yam served with our special palm-oil gravy sauce.
                  Using fresh, locally-sourced ingredients, we create meals that capture the
                  authentic taste of Nigerian cuisine.
                </p>
                <Link to="/food-order">
                  <Button variant="outline">Order Food <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Visit us at {siteConfig.contact.address} — or{" "}
            <Link to="/contact" className="text-primary hover:underline">send us a message</Link>.
          </p>
        </div>
      </div>
    </ClientLayout>
  );
};

export default AboutPage;
