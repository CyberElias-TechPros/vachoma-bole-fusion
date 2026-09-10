
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CustomOrderFormData } from "@/types/schema";
import { supabase } from "@/integrations/supabase/client";

export function useCustomOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const MAX_IMAGES = 5;
  const MAX_FILE_BYTES = 5 * 1024 * 1024;

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const incoming = Array.from(files);
    const accepted: File[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        toast({ title: `"${file.name}" is not an image`, variant: "destructive" });
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast({ title: `"${file.name}" exceeds 5MB`, variant: "destructive" });
        continue;
      }
      accepted.push(file);
    }

    setReferenceImages((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (room <= 0) {
        toast({ title: `Maximum ${MAX_IMAGES} images`, variant: "destructive" });
        return prev;
      }
      if (accepted.length > room) {
        toast({ title: `Only ${room} more image${room === 1 ? "" : "s"} allowed`, variant: "destructive" });
      }
      return [...prev, ...accepted.slice(0, room)];
    });
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => setReferenceImages([]);

  const submitOrder = async (data: CustomOrderFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Start progress indicator
      const intervalId = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            return 90; // Hold at 90% until the actual upload completes
          }
          return newProgress;
        });
      }, 200);
      
      // Upload reference images if any
      const uploadedImageUrls: string[] = [];
      
      if (referenceImages.length > 0) {
        for (const file of referenceImages) {
          const safeName = file.name.replace(/[^\w.-]+/g, '-');
          const filePath = `${Date.now()}-${safeName}`;
          
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('custom-order-images')
            .upload(filePath, file);
            
          if (uploadError) {
            throw uploadError;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('custom-order-images')
            .getPublicUrl(filePath);
            
          uploadedImageUrls.push(publicUrl);
        }
      }
      
      // Submit the order data to Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('custom_order_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          order_type: data.orderType,
          other_order_type: data.otherOrderType,
          description: data.description,
          size: data.size,
          custom_size: data.customSize || null,
          budget: data.budget,
          timeline: data.timeline,
          reference_images: uploadedImageUrls,
          fabric_preferences: data.fabricPreferences || null,
          delivery_address: data.deliveryAddress,
          additional_notes: data.additionalNotes || null,
        })
        .select();
        
      if (orderError) {
        throw orderError;
      }
      
      // Complete progress
      clearInterval(intervalId);
      setUploadProgress(100);
      
      toast({
        title: "Order submitted successfully",
        description: "We'll get back to you within 24 hours.",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting custom order:", error);
      toast({
        title: "Error submitting order",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    uploadProgress,
    referenceImages,
    handleImageUpload,
    removeImage,
    clearImages,
    submitOrder,
  };
}
