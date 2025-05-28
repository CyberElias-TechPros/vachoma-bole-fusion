
import { useState, useMemo } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFashionDesigns } from "@/hooks/use-fashion-designs";
import { Search, Heart, Share2, ZoomIn, Star, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const FashionPortfolioPage = () => {
  const { designs, loading } = useFashionDesigns();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("approved");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = useMemo(() => {
    if (!designs.length) return [];
    const uniqueCategories = [...new Set(designs.map(design => design.category))];
    return uniqueCategories;
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    return designs.filter(design => {
      const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           design.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || design.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || design.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [designs, searchTerm, selectedCategory, selectedStatus]);

  const toggleFavorite = (designId: string) => {
    setFavorites(prev => 
      prev.includes(designId)
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
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
                  <Skeleton className="h-64 w-full" />
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
          <h1 className="text-4xl font-bold mb-4">Fashion Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of exquisite fashion designs, from traditional Nigerian attire 
            to contemporary fashion pieces, all crafted with precision and style.
          </p>
          <div className="mt-6">
            <Link to="/fashion-custom-orders">
              <Button size="lg" className="mr-4">
                Request Custom Design
              </Button>
            </Link>
            <Link to="/fashion-collections">
              <Button variant="outline" size="lg">
                View Collections
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Published</SelectItem>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                {design.design_images && design.design_images.length > 0 ? (
                  <img 
                    src={design.design_images[0]} 
                    alt={design.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary">
                        <ZoomIn className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>{design.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {design.design_images?.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${design.name} - ${index + 1}`}
                              className="w-full rounded-lg"
                            />
                          ))}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground">{design.description}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Category</h3>
                            <Badge variant="outline">{design.category}</Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Price</h3>
                            <span className="text-2xl font-bold text-primary">
                              ₦{design.price.toLocaleString()}
                            </span>
                          </div>
                          {design.technical_specs && (
                            <div>
                              <h3 className="font-semibold mb-2">Technical Specifications</h3>
                              <p className="text-sm text-muted-foreground">{design.technical_specs}</p>
                            </div>
                          )}
                          <div className="pt-4">
                            <Link to="/fashion-custom-orders">
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
                    onClick={() => toggleFavorite(design.id)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(design.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={design.status === 'approved' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {design.status.replace('-', ' ')}
                  </Badge>
                </div>

                {/* Price Tag */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    ₦{design.price.toLocaleString()}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{design.name}</CardTitle>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {design.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Category and Tags */}
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {design.category.replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to="/fashion-custom-orders" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Customize
                      </Button>
                    </Link>
                    <Button className="flex-1">
                      Inquire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No designs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Link to="/fashion-custom-orders">
              <Button>Request Custom Design</Button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Love What You See?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our skilled designers can create custom pieces tailored to your style and preferences. 
                From traditional Nigerian attire to modern fashion statements, we bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
