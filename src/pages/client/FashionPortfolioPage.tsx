
import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";

// Define design item interface
interface DesignItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
}

// Sample portfolio data
const portfolioItems: DesignItem[] = [
  {
    id: "design-1",
    name: "Traditional Wedding Attire",
    description: "Elegant traditional attire with modern embellishments, perfect for wedding ceremonies.",
    images: [],
    category: "traditional"
  },
  {
    id: "design-2",
    name: "Contemporary Ankara Dress",
    description: "Modern Ankara dress with stylish cuts and patterns, suitable for formal occasions.",
    images: [],
    category: "modern"
  },
  {
    id: "design-3",
    name: "Business Casual Outfit",
    description: "Professional attire with African-inspired elements, perfect for business settings.",
    images: [],
    category: "modern"
  },
  {
    id: "design-4",
    name: "Traditional Festival Outfit",
    description: "Vibrant traditional outfit designed for cultural festivals and celebrations.",
    images: [],
    category: "traditional"
  },
  {
    id: "design-5",
    name: "Evening Gown",
    description: "Elegant evening gown with intricate beadwork and flowing design.",
    images: [],
    category: "special"
  },
  {
    id: "design-6",
    name: "Casual Weekend Wear",
    description: "Comfortable yet stylish outfit perfect for weekend outings.",
    images: [],
    category: "casual"
  },
  {
    id: "design-7",
    name: "Wedding Guest Outfit",
    description: "Stunning outfit designed for wedding guests, featuring modern Nigerian styles.",
    images: [],
    category: "special"
  },
  {
    id: "design-8",
    name: "Casual Ankara Top",
    description: "Versatile Ankara top that can be paired with various bottoms for a casual look.",
    images: [],
    category: "casual"
  },
];

const FashionPortfolioPage = () => {
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);
  
  // Filter items by category
  const traditionalItems = portfolioItems.filter(item => item.category === "traditional");
  const modernItems = portfolioItems.filter(item => item.category === "modern");
  const specialItems = portfolioItems.filter(item => item.category === "special");
  const casualItems = portfolioItems.filter(item => item.category === "casual");

  return (
    <ClientLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Fashion Design Portfolio</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our collection of designs for inspiration or request a custom design
          </p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Designs</TabsTrigger>
              <TabsTrigger value="traditional">Traditional</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="special">Special Occasions</TabsTrigger>
              <TabsTrigger value="casual">Casual Wear</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {portfolioItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => setSelectedDesign(item)} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="traditional" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {traditionalItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => setSelectedDesign(item)} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="modern" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {modernItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => setSelectedDesign(item)} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="special" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {specialItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => setSelectedDesign(item)} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="casual" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {casualItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => setSelectedDesign(item)} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 rounded-lg bg-muted p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Looking for Something Unique?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Our team of designers can create custom fashion pieces tailored to your specific requirements and measurements.
          </p>
          <Link to="/fashion-custom-orders">
            <Button size="lg">Request Custom Design</Button>
          </Link>
        </div>
        
        {/* Design Detail Dialog */}
        {selectedDesign && (
          <Dialog open={!!selectedDesign} onOpenChange={(open) => !open && setSelectedDesign(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedDesign.name}</DialogTitle>
                <DialogDescription className="py-2">{selectedDesign.description}</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted"></div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted"></div>
                  ))}
                </div>
                
                <div className="mt-4 space-y-4">
                  <h3 className="font-semibold">Design Details</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a sample design that can be customized to your preferences. Our designers can adjust colors, materials, and styling to match your needs.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setSelectedDesign(null)}>
                      Close
                    </Button>
                    <Link to="/fashion-custom-orders">
                      <Button>Request Similar Design</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ClientLayout>
  );
};

// Portfolio card component
interface PortfolioCardProps {
  item: DesignItem;
  onClick: () => void;
}

const PortfolioCard = ({ item, onClick }: PortfolioCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full" onClick={onClick}>
            <div className="aspect-square w-full bg-muted"></div>
            <div className="p-4">
              <h3 className="font-medium">{item.name}</h3>
              <p className="line-clamp-2 mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default FashionPortfolioPage;
