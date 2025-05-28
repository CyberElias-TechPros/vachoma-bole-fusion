
import { useState, useEffect } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Star, Percent } from "lucide-react";
import { Link } from "react-router-dom";

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
    const discountedPrice = special.price;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
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
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Special Offers & Deals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on our amazing food deals and limited-time offers. 
            Enjoy your favorite dishes at special prices!
          </p>
        </div>

        {/* Active Specials */}
        {specials.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Percent className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Active Specials</h3>
            <p className="text-muted-foreground mb-6">
              We don't have any special offers running at the moment, but check back soon for exciting deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            {/* Featured Special */}
            {specials.filter(special => isActiveSpecial(special)).length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">🔥 Limited Time Offers</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {specials
                    .filter(special => isActiveSpecial(special))
                    .slice(0, 2)
                    .map((special) => (
                      <Card key={special.id} className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="relative">
                          {special.image_url ? (
                            <img 
                              src={special.image_url} 
                              alt={special.name}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No Image</span>
                            </div>
                          )}
                          
                          {/* Discount Badge */}
                          {getDiscountPercentage(special) && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                                {getDiscountPercentage(special)}% OFF
                              </Badge>
                            </div>
                          )}

                          {/* Time Remaining */}
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-900">
                              <Clock className="h-3 w-3 mr-1" />
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
                                    ₦{special.price.toLocaleString()}
                                  </span>
                                  {special.menu_items && (
                                    <span className="text-lg text-muted-foreground line-through">
                                      ₦{special.menu_items.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {special.menu_items && (
                                  <Badge variant="outline" className="text-xs">
                                    {special.menu_items.category.replace('-', ' ')}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">4.7</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Valid until {formatDate(special.end_date)}</span>
                              </div>
                            </div>

                            <Link to="/food-order">
                              <Button className="w-full" size="lg">
                                Order Now
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* All Specials Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">All Special Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specials.map((special) => (
                  <Card key={special.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {special.image_url ? (
                        <img 
                          src={special.image_url} 
                          alt={special.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
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
                      <CardTitle className="text-lg line-clamp-2">{special.name}</CardTitle>
                      {special.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {special.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                              ₦{special.price.toLocaleString()}
                            </span>
                            {special.menu_items && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₦{special.menu_items.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.5</span>
                          </div>
                        </div>

                        {/* Validity */}
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>Valid: {formatDate(special.start_date)} - {formatDate(special.end_date)}</span>
                          </div>
                          {isActiveSpecial(special) && (
                            <div className="flex items-center gap-1 text-red-600">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeRemaining(special.end_date)}</span>
                            </div>
                          )}
                        </div>

                        {/* Category */}
                        {special.menu_items && (
                          <Badge variant="outline" className="text-xs">
                            {special.menu_items.category.replace('-', ' ')}
                          </Badge>
                        )}

                        {/* Action Button */}
                        <Link to="/food-order">
                          <Button 
                            className="w-full" 
                            variant={isActiveSpecial(special) ? "default" : "outline"}
                            disabled={!isActiveSpecial(special)}
                          >
                            {isActiveSpecial(special) ? "Order Now" : "Coming Soon"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Newsletter Signup */}
        <Card className="bg-primary/5 border-primary/20 mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss a Deal!</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to be the first to know about new specials, 
              seasonal offers, and exclusive discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default FoodSpecialsPage;
