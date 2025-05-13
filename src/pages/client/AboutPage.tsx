
import { ClientLayout } from "@/components/layout/ClientLayout";

const AboutPage = () => {
  return (
    <ClientLayout>
      <div className="container mx-auto py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">About Vachoma Empire</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Celebrating Nigerian creativity through fashion design and culinary excellence
          </p>
        </div>
        
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              Founded in 2018, Vachoma Empire began as a small fashion atelier in Port Harcourt. 
              Our founder, Victoria Achor, combined her passion for traditional and contemporary 
              fashion with a love for authentic Nigerian cuisine.
            </p>
            <p className="text-lg text-muted-foreground">
              What started as a small operation quickly grew as word spread about our quality craftsmanship 
              and attention to detail. In 2020, we expanded to include our Bole food business, bringing 
              traditional flavors with a modern twist to our customers.
            </p>
          </div>
          <div className="aspect-square bg-muted rounded-lg"></div>
        </div>
        
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Vision & Mission</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border p-8">
              <h3 className="mb-4 text-xl font-semibold">Vision</h3>
              <p className="text-muted-foreground">
                To be the leading provider of quality fashion designs and authentic Nigerian cuisine in Port Harcourt,
                recognized for our commitment to excellence, creativity, and customer satisfaction.
              </p>
            </div>
            <div className="rounded-lg border p-8">
              <h3 className="mb-4 text-xl font-semibold">Mission</h3>
              <p className="text-muted-foreground">
                To create exceptional fashion pieces and delicious food experiences that celebrate Nigerian 
                culture and creativity, while providing exceptional service to our clients and contributing 
                positively to our community.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 aspect-square w-40 rounded-full bg-muted"></div>
                <h3 className="text-lg font-semibold">Team Member {i}</h3>
                <p className="text-sm text-muted-foreground">Position</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Businesses</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg border">
              <div className="aspect-video bg-muted"></div>
              <div className="p-8">
                <h3 className="mb-4 text-2xl font-semibold">Fashion Design</h3>
                <p className="mb-4 text-muted-foreground">
                  Our fashion business specializes in custom designs, ready-to-wear collections, 
                  and traditional attire. We work closely with clients to create pieces that 
                  reflect their personal style while incorporating elements of Nigerian culture.
                </p>
                <p className="text-muted-foreground">
                  Our team of skilled designers and tailors brings decades of combined experience 
                  to every project, ensuring the highest quality and attention to detail.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="aspect-video bg-muted"></div>
              <div className="p-8">
                <h3 className="mb-4 text-2xl font-semibold">Bole Food</h3>
                <p className="mb-4 text-muted-foreground">
                  Our Bole food business celebrates the rich culinary tradition of roasted plantain, 
                  sweet potatoes, fish, and yam served with our special palm oil gravy sauce. 
                  Using fresh, locally-sourced ingredients, we create delicious meals that capture 
                  the authentic taste of Nigerian cuisine.
                </p>
                <p className="text-muted-foreground">
                  Whether you're dining in, taking out, or ordering for an event, our food offers 
                  a delightful experience that keeps customers coming back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default AboutPage;
