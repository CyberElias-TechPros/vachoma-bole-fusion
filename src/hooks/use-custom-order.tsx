
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CustomOrderFormData } from "@/types/schema";

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
      // Simulate form submission with progress
      const intervalId = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
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
