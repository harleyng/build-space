import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriceUnit } from "@/types/listing.types";

interface ListingFormStep3BasicInfoProps {
  area: string;
  setArea: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  priceUnit: PriceUnit;
  setPriceUnit: (value: PriceUnit) => void;
  numBedrooms: string;
  setNumBedrooms: (value: string) => void;
  numBathrooms: string;
  setNumBathrooms: (value: string) => void;
}

export const ListingFormStep3BasicInfo = ({
  area,
  setArea,
  price,
  setPrice,
  priceUnit,
  setPriceUnit,
  numBedrooms,
  setNumBedrooms,
  numBathrooms,
  setNumBathrooms,
}: ListingFormStep3BasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Giá và Thông số cơ bản</h2>
        <p className="text-muted-foreground">
          Nhập thông tin giá và các thông số chính của bất động sản
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Diện tích (m²) <span className="text-destructive">*</span></Label>
        <Input
          id="area"
          type="number"
          step="0.01"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Ví dụ: 100"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="price">Giá <span className="text-destructive">*</span></Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ví dụ: 5000000000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceUnit">Đơn vị <span className="text-destructive">*</span></Label>
          <Select value={priceUnit} onValueChange={(v) => setPriceUnit(v as PriceUnit)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOTAL">Tổng giá</SelectItem>
              <SelectItem value="PER_SQM">VND/m²</SelectItem>
              <SelectItem value="PER_MONTH">VND/tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-4">Thông số cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numBedrooms">Số phòng ngủ</Label>
            <Input
              id="numBedrooms"
              type="number"
              value={numBedrooms}
              onChange={(e) => setNumBedrooms(e.target.value)}
              placeholder="Ví dụ: 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numBathrooms">Số phòng vệ sinh</Label>
            <Input
              id="numBathrooms"
              type="number"
              value={numBathrooms}
              onChange={(e) => setNumBathrooms(e.target.value)}
              placeholder="Ví dụ: 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
