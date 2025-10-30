import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Purpose } from "@/types/listing.types";
import { PropertyType } from "@/hooks/usePropertyTypes";

interface ListingFormStep1PropertyTypeProps {
  purpose: Purpose;
  setPurpose: (value: Purpose) => void;
  propertyTypeSlug: string;
  setPropertyTypeSlug: (value: string) => void;
  filteredPropertyTypes: PropertyType[];
}

export const ListingFormStep1PropertyType = ({
  purpose,
  setPurpose,
  propertyTypeSlug,
  setPropertyTypeSlug,
  filteredPropertyTypes,
}: ListingFormStep1PropertyTypeProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Loại hình và Mục đích</h2>
        <p className="text-muted-foreground">
          Chọn loại hình bất động sản và mục đích đăng tin của bạn
        </p>
      </div>

      <div className="space-y-2">
        <Label>Mục đích <span className="text-destructive">*</span></Label>
        <Tabs value={purpose} onValueChange={(v) => setPurpose(v as Purpose)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="FOR_SALE">Bán</TabsTrigger>
            <TabsTrigger value="FOR_RENT">Cho thuê</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyType">Loại hình BĐS <span className="text-destructive">*</span></Label>
        <Select value={propertyTypeSlug} onValueChange={setPropertyTypeSlug} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại hình" />
          </SelectTrigger>
          <SelectContent>
            {filteredPropertyTypes.map((type) => (
              <SelectItem key={type.slug} value={type.slug}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
