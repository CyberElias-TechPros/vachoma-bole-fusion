
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Utensils } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";

const HomePage = () => {
  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Welcome to Vachoma Empire
              </h1>
              <p className="text-xl text-muted-foreground">
                Experience premium fashion designs and authentic Bole cuisine in Port Harcourt.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/fashion-portfolio">
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Explore Fashion
                  </Button>
                </Link>
                <Link to="/food-menu">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Utensils className="h-5 w-5" />
                    View Bole Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted md:aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Featured Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Fashion Design</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Discover our exclusive fashion collections and custom design services
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Custom Designs</h3>
                <p className="mb-4 text-muted-foreground">
                  Tailored fashion pieces created to your exact specifications and measurements.
                </p>
                <Link to="/fashion-custom-orders">
                  <Button>Request Design</Button>
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Seasonal Collections</h3>
                <p className="mb-4 text-muted-foreground">
                  Browse our latest seasonal fashion collections for all occasions.
                </p>
                <Link to="/fashion-collections">
                  <Button>Browse Collections</Button>
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Portfolio</h3>
                <p className="mb-4 text-muted-foreground">
                  Explore our complete portfolio of designs and fashion pieces.
                </p>
                <Link to="/fashion-portfolio">
                  <Button>View Portfolio</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Bole Food</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Authentic Nigerian Bole - Roasted plantain, sweet potatoes, fish, and yam with palm oil gravy sauce
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Full Menu</h3>
                <p className="mb-4 text-muted-foreground">
                  Browse our complete menu of Bole dishes and accompaniments.
                </p>
                <Link to="/food-menu">
                  <Button>View Menu</Button>
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Order Online</h3>
                <p className="mb-4 text-muted-foreground">
                  Place your order now for delivery or pickup in Port Harcourt.
                </p>
                <Link to="/food-order">
                  <Button>Order Now</Button>
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-background shadow-md">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Special Offers</h3>
                <p className="mb-4 text-muted-foreground">
                  Check out our promotions and special deals on Bole packages.
                </p>
                <Link to="/food-specials">
                  <Button>View Specials</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Our Happy Customers</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              See what clients are saying about our fashion designs and Bole food
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-background p-6 shadow-md">
              <div className="mb-4 text-4xl">"</div>
              <p className="mb-4 text-muted-foreground">
                The custom outfit designed for my wedding was absolutely perfect. The attention to detail was amazing!
              </p>
              <div className="mt-4">
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Fashion Client</div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md">
              <div className="mb-4 text-4xl">"</div>
              <p className="mb-4 text-muted-foreground">
                Best Bole in Port Harcourt! The fish is always fresh and the sauce is perfect. Their delivery is prompt too.
              </p>
              <div className="mt-4">
                <div className="font-semibold">Michael Obi</div>
                <div className="text-sm text-muted-foreground">Food Customer</div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md">
              <div className="mb-4 text-4xl">"</div>
              <p className="mb-4 text-muted-foreground">
                I've been a regular client for both their fashion and food services. The quality and customer care are consistently excellent.
              </p>
              <div className="mt-4">
                <div className="font-semibold">Ada Nwosu</div>
                <div className="text-sm text-muted-foreground">Regular Customer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};

export default HomePage;
