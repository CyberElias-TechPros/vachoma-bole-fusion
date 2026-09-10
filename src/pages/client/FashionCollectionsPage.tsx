import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatNGN } from "@/lib/site";
import { Layers, ArrowRight, CalendarDays } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  season: string | null;
  release_date: string | null;
  is_active: boolean | null;
}

interface DesignSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: string;
  design_images: string[];
}

const FashionCollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [designsByCollection, setDesignsByCollection] = useState<Record<string, DesignSummary[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data: cols, error: colsError } = await supabase
          .from("fashion_collections")
          .select("*")
          .eq("is_active", true)
          .order("release_date", { ascending: false, nullsFirst: false });

        if (colsError) throw colsError;
        setCollections(cols ?? []);

        if (cols && cols.length > 0) {
          const { data: links, error: linksError } = await supabase
            .from("collection_designs")
            .select("collection_id, design_id, fashion_designs (id, name, description, category, price, status, design_images)")
            .in("collection_id", cols.map((c) => c.id));

          if (linksError) throw linksError;

          const grouped: Record<string, DesignSummary[]> = {};
          (links ?? []).forEach((link) => {
            const design = link.fashion_designs as unknown as DesignSummary | null;
            // Only published designs are visible to the public.
            if (!design || design.status !== "approved") return;
            if (!grouped[link.collection_id]) grouped[link.collection_id] = [];
            grouped[link.collection_id].push(design);
          });
          setDesignsByCollection(grouped);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const totalLooks = useMemo(
    () => Object.values(designsByCollection).reduce((n, arr) => n + arr.length, 0),
    [designsByCollection]
  );

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
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
        title="Fashion Collections"
        description="Browse Vachoma Empire's seasonal and themed fashion collections — curated looks from our Port Harcourt atelier, available to customise and order."
        path="/fashion-collections"
      />
      <div className="container py-8 md:py-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Curated looks</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Seasonal &amp; Themed Collections</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {collections.length > 0
              ? `${collections.length} ${collections.length === 1 ? "collection" : "collections"} · ${totalLooks} published ${totalLooks === 1 ? "look" : "looks"} — each one customisable to your measurements.`
              : "Our design team curates seasonal edits of the portfolio's best pieces."}
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Layers className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">New collections on the way</h2>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              We're putting together our next edit. Meanwhile, the full portfolio is open for browsing.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/fashion-portfolio">
                <Button>Browse Portfolio</Button>
              </Link>
              <Link to="/fashion-custom-orders">
                <Button variant="outline">Request Custom Design</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {collections.map((collection) => {
              const designs = designsByCollection[collection.id] ?? [];
              return (
                <Card key={collection.id} className="group overflow-hidden transition-shadow hover:shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {collection.cover_image ? (
                      <img
                        src={collection.cover_image}
                        alt={`${collection.name} collection cover`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : designs[0]?.design_images?.[0] ? (
                      <img
                        src={designs[0].design_images[0]}
                        alt={`${collection.name} — ${designs[0].name}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Layers className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex gap-2">
                      {collection.season && <Badge>{collection.season}</Badge>}
                      <Badge variant="secondary">
                        {designs.length} {designs.length === 1 ? "look" : "looks"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h2 className="mb-1 text-2xl font-bold">{collection.name}</h2>
                    {collection.release_date && (
                      <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Released {new Date(collection.release_date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                      </p>
                    )}
                    <p className="mb-5 line-clamp-3 text-muted-foreground">{collection.description}</p>

                    {designs.length > 0 && (
                      <div className="mb-5 flex -space-x-2">
                        {designs.slice(0, 5).map((d) =>
                          d.design_images?.[0] ? (
                            <img
                              key={d.id}
                              src={d.design_images[0]}
                              alt={d.name}
                              className="h-12 w-12 rounded-full border-2 border-card object-cover"
                              loading="lazy"
                            />
                          ) : null
                        )}
                        {designs.length > 5 && (
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-semibold">
                            +{designs.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto" disabled={designs.length === 0}>
                          View Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
                        <DialogHeader>
                          <DialogTitle>{collection.name}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">{collection.description}</p>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {designs.map((design) => (
                            <li key={design.id} className="overflow-hidden rounded-xl border">
                              <div className="aspect-[4/3] bg-muted">
                                {design.design_images?.[0] ? (
                                  <img
                                    src={design.design_images[0]}
                                    alt={design.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold leading-tight">{design.name}</h3>
                                  <span className="shrink-0 text-sm font-bold text-primary">
                                    {formatNGN(design.price)}
                                  </span>
                                </div>
                                <p className="mb-3 mt-1 line-clamp-2 text-xs capitalize text-muted-foreground">
                                  {design.category.replace(/-/g, " ")}
                                </p>
                                <Link to={`/fashion-custom-orders?design=${encodeURIComponent(design.name)}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    Customise this look
                                  </Button>
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="mb-3 text-2xl font-bold">Like a look? Make it yours.</h2>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                Every collection piece can be remade to your measurements, in your fabric, for
                your occasion. Tell us which look caught your eye.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/fashion-custom-orders">
                  <Button size="lg">Start a Custom Order</Button>
                </Link>
                <Link to="/fashion-portfolio">
                  <Button size="lg" variant="outline">Browse Full Portfolio</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default FashionCollectionsPage;
