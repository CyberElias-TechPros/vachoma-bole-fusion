
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

const BudgetRangePopover: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-4 w-4" />
          <span className="sr-only">Budget Information</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Budget Guidelines</h4>
            <p className="text-sm text-muted-foreground">
              Our custom designs typically range in the following price brackets:
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div className="font-medium">Design Type</div>
              <div className="font-medium">Price Range</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Tops</div>
              <div>₦10,000 - ₦30,000</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Skirts</div>
              <div>₦15,000 - ₦35,000</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Dresses</div>
              <div>₦25,000 - ₦60,000</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Pants</div>
              <div>₦18,000 - ₦40,000</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Suits</div>
              <div>₦45,000 - ₦120,000</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-1 text-sm">
              <div>Special Occasion</div>
              <div>₦50,000 - ₦200,000+</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Final pricing depends on fabric choice, design complexity, and timeline.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BudgetRangePopover;
