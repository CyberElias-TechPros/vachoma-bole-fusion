import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCustomOrder } from "@/hooks/use-custom-order";
import ImageUploadPreview from "@/components/fashion/ImageUploadPreview";
import SizesGuidePopover from "@/components/fashion/SizesGuidePopover";
import BudgetRangePopover from "@/components/fashion/BudgetRangePopover";
import { 
  ArrowRight, 
  Calendar, 
  Check, 
  ImagePlus, 
  Info, 
  LoaderCircle, 
  MoveRight, 
  PlusCircle, 
  Upload
} from "lucide-react";
import { CustomOrderFormData } from "@/types/schema";

const customOrderSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Valid phone number required" }),
  orderType: z.enum(["dress", "top", "skirt", "pants", "suit", "other"]),
  otherOrderType: z.string().optional(),
  description: z.string().min(10, { message: "Please provide more details about your order" }),
  size: z.enum(["xs", "s", "m", "l", "xl", "xxl", "custom"]),
  customSize: z.object({
    bust: z.number().optional(),
    waist: z.number().optional(),
    hip: z.number().optional(),
    height: z.number().optional(),
    shoulder: z.number().optional(),
  }).optional(),
  budget: z.number().min(5000, { message: "Minimum budget is ₦5,000" }),
  timeline: z.enum(["standard", "rush", "flexible"]),
  fabricPreferences: z.string().optional(),
  deliveryAddress: z.object({
    street: z.string().min(3, { message: "Please provide street address" }),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(1, { message: "Zip code is required" }),
    country: z.string().min(2, { message: "Country is required" }),
  }),
  additionalNotes: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms and conditions" }),
  }),
});

const FashionCustomOrdersPage = () => {
  const { 
    isSubmitting, 
    uploadProgress, 
    referenceImages, 
    handleImageUpload, 
    removeImage, 
    submitOrder 
  } = useCustomOrder();
  
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof customOrderSchema>>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      orderType: "dress",
      description: "",
      size: "m",
      budget: 25000,
      timeline: "standard",
      fabricPreferences: "",
      deliveryAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Nigeria",
      },
      additionalNotes: "",
    },
  });
  
  const handleSubmit = async (data: z.infer<typeof customOrderSchema>) => {
    const formData: CustomOrderFormData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      orderType: data.orderType,
      otherOrderType: data.otherOrderType,
      description: data.description,
      size: data.size,
      customSize: data.customSize,
      budget: data.budget,
      timeline: data.timeline,
      referenceImages: referenceImages,
      fabricPreferences: data.fabricPreferences,
      deliveryAddress: data.deliveryAddress,
      additionalNotes: data.additionalNotes
    };
    
    const success = await submitOrder(formData);
    if (success) {
      setOrderSubmitted(true);
      form.reset();
    }
  };
  
  const selectedSize = form.watch("size");
  const selectedOrderType = form.watch("orderType");
  
  if (orderSubmitted) {
    return (
      <ClientLayout>
        <div className="container py-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="mx-auto rounded-full bg-primary/20 p-3 mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Custom Order Submitted!</CardTitle>
              <CardDescription>
                Thank you for your custom order request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our design team will review your request and contact you within 24 hours to discuss your design in detail.
              </p>
              <Alert>
                <AlertDescription>
                  We've sent a confirmation email to the address you provided. Please check your inbox.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={() => setOrderSubmitted(false)}>
                Submit Another Order
              </Button>
              <Button onClick={() => window.location.href = "/fashion-portfolio"} className="flex items-center gap-2">
                View Our Portfolio
                <MoveRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout>
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Request Custom Fashion Design</h1>
            <p className="text-muted-foreground mt-2">
              Fill out this form to request a custom-made design from our skilled fashion team.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Let us know how to contact you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 xxx xxx xxxx" {...field} />
                        </FormControl>
                        <FormDescription>
                          We'll use this to coordinate details and delivery
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Tell us about the piece you want created</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="orderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dress">Dress</SelectItem>
                              <SelectItem value="top">Top/Blouse</SelectItem>
                              <SelectItem value="skirt">Skirt</SelectItem>
                              <SelectItem value="pants">Pants/Trousers</SelectItem>
                              <SelectItem value="suit">Suit/Formal Wear</SelectItem>
                              <SelectItem value="other">Other (specify)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedOrderType === "other" && (
                    <FormField
                      control={form.control}
                      name="otherOrderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Order Type</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Wedding gown, traditional attire, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the style, details, and any specific requirements for your custom order"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Reference Images
                      <span className="text-muted-foreground text-xs">(Optional but recommended)</span>
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          className="w-full"
                        >
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Upload Images
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload images of designs you like or sketches of your idea (max 5MB each)
                      </p>
                    </div>
                    <div className="mt-4">
                      <ImageUploadPreview
                        images={referenceImages}
                        onRemove={removeImage}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Size & Measurements</CardTitle>
                  <CardDescription>
                    Help us create the perfect fit for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div className="flex items-center gap-2">
                            <FormLabel>Standard Size</FormLabel>
                            <SizesGuidePopover />
                          </div>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                setShowCustomSize(value === "custom");
                              }}
                              defaultValue={field.value}
                              className="grid grid-cols-3 sm:grid-cols-7 gap-2"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="xs" />
                                </FormControl>
                                <FormLabel className="font-normal">XS</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="s" />
                                </FormControl>
                                <FormLabel className="font-normal">S</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="m" />
                                </FormControl>
                                <FormLabel className="font-normal">M</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="l" />
                                </FormControl>
                                <FormLabel className="font-normal">L</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="xl" />
                                </FormControl>
                                <FormLabel className="font-normal">XL</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="xxl" />
                                </FormControl>
                                <FormLabel className="font-normal">XXL</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="custom" />
                                </FormControl>
                                <FormLabel className="font-normal">Custom</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {showCustomSize && (
                    <div className="border rounded-lg p-4 bg-muted/50 space-y-4">
                      <h4 className="font-medium">Custom Measurements (in inches)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customSize.bust"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bust</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Bust circumference"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customSize.waist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waist</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Waist circumference"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customSize.hip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hip</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Hip circumference"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customSize.height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Your height"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Budget & Timeline</CardTitle>
                  <CardDescription>
                    Let us know your budget constraints and when you need this piece
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Budget (₦)</FormLabel>
                          <BudgetRangePopover />
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your budget in Naira"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Timeline</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="standard" />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="font-medium">Standard (2-3 weeks)</FormLabel>
                                <FormDescription>
                                  Our regular production timeline with standard pricing
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rush" />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="font-medium">Rush (5-7 days)</FormLabel>
                                <FormDescription>
                                  Expedited production with 30% rush fee
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="flexible" />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="font-medium">Flexible</FormLabel>
                                <FormDescription>
                                  No specific deadline, eligible for discounts
                                </FormDescription>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fabricPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric Preferences (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific fabric type, color, or texture preferences"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>
                    Where should we deliver your custom order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="deliveryAddress.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryAddress.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Port Harcourt" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Rivers State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryAddress.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="500001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Nigeria" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special delivery instructions or other information"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By submitting this form, you agree to our <a href="#" className="text-primary underline">terms of service</a> and <a href="#" className="text-primary underline">privacy policy</a>.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Custom Order
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading order details...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </ClientLayout>
  );
};

export default FashionCustomOrdersPage;
