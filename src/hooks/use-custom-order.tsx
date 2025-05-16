
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CustomOrderFormData } from "@/types/schema";
import { supabase } from "@/integrations/supabase/client";

export function useCustomOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    // Convert FileList to array and add to state
    const newImages = Array.from(files);
    setReferenceImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

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
          const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
          
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
    submitOrder,
  };
}
