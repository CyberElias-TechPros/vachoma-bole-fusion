import { useState, useMemo, useEffect } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFashionDesigns } from "@/hooks/use-fashion-designs";
import { useToast } from "@/hooks/use-toast";
import { formatNGN } from "@/lib/site";
import { Search, Heart, Share2, ZoomIn, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const FAVORITES_KEY = "vachoma-portfolio-favorites-v1";

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

const FashionPortfolioPage = () => {
  const { designs, loading } = useFashionDesigns();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Private mode etc. — favorites still work in memory.
    }
  }, [favorites]);

  // The portfolio only ever shows published (approved) designs to the public.
  const published = useMemo(() => designs.filter((d) => d.status === "approved"), [designs]);

  const categories = useMemo(() => {
    return [...new Set(published.map((design) => design.category))];
  }, [published]);

  const filteredDesigns = useMemo(() => {
    return published.filter((design) => {
      const matchesSearch =
        design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || design.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(design.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [published, searchTerm, selectedCategory, showFavoritesOnly, favorites]);

  const toggleFavorite = (designId: string, designName: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(designId);
      toast({
        title: exists ? "Removed from favourites" : "Saved to favourites",
        description: exists ? undefined : `${designName} — find it here any time.`,
      });
      return exists ? prev.filter((id) => id !== designId) : [...prev, designId];
    });
  };

  const shareDesign = async (designId: string, designName: string) => {
    const url = `${window.location.origin}/fashion-portfolio#${designId}`;
    const shareData = { title: `${designName} — Vachoma Empire`, text: `Look at this design from Vachoma Empire: ${designName}`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${designName} — ${url}`);
        toast({ title: "Link copied", description: "Share it with anyone." });
      } else {
        toast({ title: "Copy this link", description: url });
      }
    } catch (err) {
      // User dismissed the share sheet — not an error.
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  const pretty = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Seo
        title="Fashion Portfolio"
        description="Explore the Vachoma Empire fashion portfolio — traditional Nigerian attire and contemporary pieces from our Port Harcourt atelier. Request any design made to your measurements."
        path="/fashion-portfolio"
      />
      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Fashion atelier</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Fashion Portfolio</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Exquisite fashion designs, from traditional Nigerian attire
            to contemporary pieces — all crafted with precision and style.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/fashion-custom-orders">
              <Button size="lg" className="w-full sm:w-auto">
                Request Custom Design
              </Button>
            </Link>
            <Link to="/fashion-collections">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Collections
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search designs"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {pretty(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className="gap-2 md:w-auto"
            aria-pressed={showFavoritesOnly}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Favourites ({favorites.length})
          </Button>
        </div>

        {published.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="mb-2 text-lg font-medium">Portfolio coming soon</h2>
            <p className="mx-auto mb-4 max-w-md text-muted-foreground">
              Our designers are photographing the latest pieces. Tell us what you have in mind
              and we'll create it from scratch.
            </p>
            <Link to="/fashion-custom-orders">
              <Button>Request Custom Design</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesigns.map((design) => (
              <Card key={design.id} id={design.id} className="group overflow-hidden scroll-mt-24 transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {design.design_images && design.design_images.length > 0 ? (
                    <img
                      src={design.design_images[0]}
                      alt={design.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <ZoomIn className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
                        <DialogHeader>
                          <DialogTitle>{design.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            {design.design_images?.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${design.name} — view ${index + 1}`}
                                className="w-full rounded-lg"
                                loading="lazy"
                              />
                            ))}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="mb-2 font-semibold">Description</h3>
                              <p className="text-muted-foreground">{design.description}</p>
                            </div>
                            <div>
                              <h3 className="mb-2 font-semibold">Category</h3>
                              <Badge variant="outline">{pretty(design.category)}</Badge>
                            </div>
                            <div>
                              <h3 className="mb-2 font-semibold">From</h3>
                              <span className="text-2xl font-bold text-primary">
                                {formatNGN(design.price)}
                              </span>
                            </div>
                            {design.technical_specs && (
                              <div>
                                <h3 className="mb-2 font-semibold">Details</h3>
                                <p className="text-sm text-muted-foreground">{design.technical_specs}</p>
                              </div>
                            )}
                            <div className="pt-4">
                              <Link to={`/fashion-custom-orders?design=${encodeURIComponent(design.name)}`}>
                                <Button className="w-full">
                                  Request Similar Design
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFavorite(design.id, design.name)}
                      aria-label={favorites.includes(design.id) ? `Remove ${design.name} from favourites` : `Save ${design.name} to favourites`}
                      aria-pressed={favorites.includes(design.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(design.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => shareDesign(design.id, design.name)}
                      aria-label={`Share ${design.name}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute right-2 top-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {formatNGN(design.price)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-lg leading-snug">{design.name}</CardTitle>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {design.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {pretty(design.category)}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/fashion-custom-orders?design=${encodeURIComponent(design.name)}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Customise
                        </Button>
                      </Link>
                      <Link to={`/fashion-custom-orders?design=${encodeURIComponent(design.name)}`} className="flex-1">
                        <Button className="w-full">
                          Inquire
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {published.length > 0 && filteredDesigns.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-medium">No designs found</h3>
            <p className="mb-4 text-muted-foreground">
              {showFavoritesOnly
                ? "You haven't saved any favourites yet — tap the heart on any design."
                : "Try adjusting your search terms or filters."}
            </p>
            <Link to="/fashion-custom-orders">
              <Button>Request Custom Design</Button>
            </Link>
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Love What You See?</h2>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                Our skilled designers can create custom pieces tailored to your style and preferences.
                From traditional Nigerian attire to modern fashion statements, we bring your vision to life.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link to="/fashion-custom-orders">
                  <Button size="lg">Start Custom Order</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">Contact Designer</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default FashionPortfolioPage;
