
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

const SizesGuidePopover: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-4 w-4" />
          <span className="sr-only">Size Guide</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Size Guide</h4>
            <p className="text-sm text-muted-foreground">
              Please refer to these measurements for standard sizes
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div className="font-medium">Size</div>
              <div className="font-medium">Bust</div>
              <div className="font-medium">Waist</div>
              <div className="font-medium">Hip</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>XS</div>
              <div>31-32"</div>
              <div>24-25"</div>
              <div>34-35"</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>S</div>
              <div>33-34"</div>
              <div>26-27"</div>
              <div>36-37"</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>M</div>
              <div>35-36"</div>
              <div>28-29"</div>
              <div>38-39"</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>L</div>
              <div>37-39"</div>
              <div>30-32"</div>
              <div>40-42"</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>XL</div>
              <div>40-42"</div>
              <div>33-35"</div>
              <div>43-45"</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-1 text-sm">
              <div>XXL</div>
              <div>43-45"</div>
              <div>36-38"</div>
              <div>46-48"</div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SizesGuidePopover;
