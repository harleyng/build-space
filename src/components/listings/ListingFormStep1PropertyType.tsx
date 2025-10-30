import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Purpose } from "@/types/listing.types";
import { PropertyType } from "@/hooks/usePropertyTypes";
import { cn } from "@/lib/utils";
import { Home, Building2, Store, Warehouse, TreePine, Hotel, LandPlot } from "lucide-react";

interface ListingFormStep1PropertyTypeProps {
  purpose: Purpose;
  setPurpose: (value: Purpose) => void;
  propertyTypeSlug: string;
  setPropertyTypeSlug: (value: string) => void;
  filteredPropertyTypes: PropertyType[];
}

// Icon mapping for property types
const getPropertyIcon = (slug: string) => {
  const iconMap: Record<string, any> = {
    "nha-rieng": Home,
    "can-ho-chung-cu": Building2,
    "biet-thu-villa": Hotel,
    "dat-nen": LandPlot,
    "nha-mat-pho": Store,
    "nha-xuong-kho": Warehouse,
    "dat-rung": TreePine,
  };
  return iconMap[slug] || Home;
};

export const ListingFormStep1PropertyType = ({
  purpose,
  setPurpose,
  propertyTypeSlug,
  setPropertyTypeSlug,
  filteredPropertyTypes,
}: ListingFormStep1PropertyTypeProps) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Điều gì sau đây mô tả chính xác nhất về chỗ ở của bạn?
        </h1>
      </div>

      {/* Purpose Selection */}
      <div className="space-y-3">
        <Label className="text-base">Mục đích <span className="text-destructive">*</span></Label>
        <Tabs value={purpose} onValueChange={(v) => setPurpose(v as Purpose)}>
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="FOR_SALE" className="text-base">Bán</TabsTrigger>
            <TabsTrigger value="FOR_RENT" className="text-base">Cho thuê</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Property Type Grid */}
      <div className="space-y-3">
        <Label className="text-base">Loại hình BĐS <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filteredPropertyTypes.map((type) => {
            const Icon = getPropertyIcon(type.slug);
            const isSelected = propertyTypeSlug === type.slug;
            
            return (
              <button
                key={type.slug}
                type="button"
                onClick={() => setPropertyTypeSlug(type.slug)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 transition-all hover:border-foreground hover:shadow-md",
                  isSelected 
                    ? "border-foreground bg-muted shadow-md" 
                    : "border-border bg-background"
                )}
              >
                <Icon className={cn(
                  "h-7 w-7 transition-colors",
                  isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-sm md:text-base font-medium text-left transition-colors",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}>
                  {type.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
