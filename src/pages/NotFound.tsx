import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Compass } from "lucide-react";

const NotFound = () => {
  return (
    <ClientLayout>
      <Seo
        title="Page Not Found"
        description="The page you are looking for does not exist."
        path="/404"
        indexable={false}
      />
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-md px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Compass className="h-10 w-10" />
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
          <h1 className="mb-3 mt-1 text-4xl font-bold">Page not found</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for was moved, deleted, or never existed. Let's get you
            back to something delicious — or beautifully tailored.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/food-menu">View Bole Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default NotFound;
