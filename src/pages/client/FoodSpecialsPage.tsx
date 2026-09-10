import { useState, useEffect } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { formatNGN } from "@/lib/site";
import { Calendar, Clock, Percent, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface FoodSpecial {
  id: string;
  name: string;
  description: string | null;
  price: number;
  start_date: string;
  end_date: string;
  image_url: string | null;
  available: boolean;
  menu_item_id: string | null;
  menu_items?: {
    name: string;
    price: number;
    category: string;
  };
}

const FoodSpecialsPage = () => {
  const [specials, setSpecials] = useState<FoodSpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecials();
  }, []);

  const fetchSpecials = async () => {
    try {
      const { data, error } = await supabase
        .from('food_specials')
        .select(`
          *,
          menu_items (name, price, category)
        `)
        .eq('available', true)
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      setSpecials(data || []);
    } catch (error) {
      console.error('Error fetching specials:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActiveSpecial = (special: FoodSpecial) => {
    const now = new Date();
    const startDate = new Date(special.start_date);
    const endDate = new Date(special.end_date);
    return now >= startDate && now <= endDate;
  };

  const getDiscountPercentage = (special: FoodSpecial) => {
    if (!special.menu_items) return null;
    const originalPrice = special.menu_items.price;
    if (originalPrice <= 0 || special.price >= originalPrice) return null;
    const discountedPrice = special.price;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) return 'Expired';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Ending soon';
  };

  /** Add the special to the shared cart at its deal price, then open checkout. */
  const orderSpecial = (special: FoodSpecial) => {
    if (!isActiveSpecial(special)) return;
    addItem(
      {
        id: special.menu_item_id ?? `special-${special.id}`,
        name: `${special.name} (Deal)`,
        price: special.price,
        imageUrl: special.image_url,
        notes: `Special offer valid until ${formatDate(special.end_date)}`,
      },
      1
    );
    toast({ title: "Deal added to cart", description: special.name });
    navigate("/food-order");
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
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
        title="Special Offers & Deals"
        description="Limited-time Bole deals and special offers from Vachoma Empire in Port Harcourt. Great food at special prices — order online before they end."
        path="/food-specials"
      />
      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Bole kitchen</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Special Offers &amp; Deals</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Don't miss out on our amazing food deals and limited-time offers.
            Enjoy your favourite dishes at special prices!
          </p>
        </div>

        {specials.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Percent className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No Active Specials</h2>
            <p className="mb-6 text-muted-foreground">
              We don't have any special offers running at the moment, but check back soon for exciting deals!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/food-menu">
                <Button>View Full Menu</Button>
              </Link>
              <Link to="/food-order">
                <Button variant="outline">Place Order</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {specials.filter((special) => isActiveSpecial(special)).length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Limited Time Offers</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {specials
                    .filter((special) => isActiveSpecial(special))
                    .slice(0, 2)
                    .map((special) => (
                      <Card key={special.id} className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="relative">
                          {special.image_url ? (
                            <img
                              src={special.image_url}
                              alt={special.name}
                              className="h-48 w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center bg-muted">
                              <span className="text-muted-foreground">No Image</span>
                            </div>
                          )}

                          {getDiscountPercentage(special) && (
                            <div className="absolute left-4 top-4">
                              <Badge className="bg-red-500 px-3 py-1 text-lg text-white">
                                {getDiscountPercentage(special)}% OFF
                              </Badge>
                            </div>
                          )}

                          <div className="absolute right-4 top-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-900">
                              <Clock className="mr-1 h-3 w-3" />
                              {getTimeRemaining(special.end_date)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold">{special.name}</h3>
                              {special.description && (
                                <p className="text-muted-foreground">{special.description}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-primary">
                                    {formatNGN(special.price)}
                                  </span>
                                  {special.menu_items && (
                                    <span className="text-lg text-muted-foreground line-through">
                                      {formatNGN(special.menu_items.price)}
                                    </span>
                                  )}
                                </div>
                                {special.menu_items && (
                                  <Badge variant="outline" className="text-xs">
                                    {special.menu_items.category.replace(/-/g, ' ')}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Valid until {formatDate(special.end_date)}</span>
                              </div>
                            </div>

                            <Button className="w-full" size="lg" onClick={() => orderSpecial(special)}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add Deal &amp; Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">All Special Offers</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {specials.map((special) => (
                  <Card key={special.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative">
                      {special.image_url ? (
                        <img
                          src={special.image_url}
                          alt={special.name}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center bg-muted">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}

                      <div className="absolute left-2 top-2 flex gap-2">
                        {getDiscountPercentage(special) && (
                          <Badge className="bg-red-500 text-white">
                            {getDiscountPercentage(special)}% OFF
                          </Badge>
                        )}
                        {isActiveSpecial(special) ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Upcoming</Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="line-clamp-2 text-lg">{special.name}</CardTitle>
                      {special.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {special.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatNGN(special.price)}
                            </span>
                            {special.menu_items && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatNGN(special.menu_items.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div className="mb-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Valid: {formatDate(special.start_date)} – {formatDate(special.end_date)}</span>
                          </div>
                          {isActiveSpecial(special) && (
                            <div className="flex items-center gap-1 text-red-500">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeRemaining(special.end_date)}</span>
                            </div>
                          )}
                        </div>

                        {special.menu_items && (
                          <Badge variant="outline" className="text-xs">
                            {special.menu_items.category.replace(/-/g, ' ')}
                          </Badge>
                        )}

                        <Button
                          className="w-full"
                          variant={isActiveSpecial(special) ? "default" : "outline"}
                          disabled={!isActiveSpecial(special)}
                          onClick={() => orderSpecial(special)}
                        >
                          {isActiveSpecial(special) ? "Add Deal & Order" : "Coming Soon"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Craving something already?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Deals come and go — but the full menu is always here. Order your favourites
              for pickup or delivery anywhere in Port Harcourt.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/food-menu">
                <Button size="lg">Browse Full Menu</Button>
              </Link>
              <Link to="/food-order">
                <Button size="lg" variant="outline">Order Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default FoodSpecialsPage;
