import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEGAL_STATUSES, DIRECTIONS } from "@/constants/listing.constants";

interface ListingFormStep3LegalAndDirectionsProps {
  propertyTypeSlug: string;
  purpose: string;
  legalStatus: string;
  setLegalStatus: (value: string) => void;
  houseDirection: string;
  setHouseDirection: (value: string) => void;
  facadeWidth: string;
  setFacadeWidth: (value: string) => void;
  alleyWidth: string;
  setAlleyWidth: (value: string) => void;
}

export const ListingFormStep3LegalAndDirections = ({
  propertyTypeSlug,
  purpose,
  legalStatus,
  setLegalStatus,
  houseDirection,
  setHouseDirection,
  facadeWidth,
  setFacadeWidth,
  alleyWidth,
  setAlleyWidth,
}: ListingFormStep3LegalAndDirectionsProps) => {
  // Determine which fields to show based on property type
  const showLegalStatus = ["nha-pho", "biet-thu", "dat-nen", "nha-mat-pho"].includes(propertyTypeSlug);
  const showHouseDirection = ["nha-pho", "biet-thu", "can-ho", "chung-cu", "nha-mat-pho"].includes(propertyTypeSlug);
  const showFacadeWidth = ["nha-pho", "biet-thu", "nha-mat-pho", "dat-nen"].includes(propertyTypeSlug);
  const showAlleyWidth = ["nha-pho", "biet-thu", "nha-mat-pho"].includes(propertyTypeSlug);

  // If no fields should be shown, return null (this step will be skipped)
  if (!showLegalStatus && !showHouseDirection && !showFacadeWidth && !showAlleyWidth) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Thông tin bổ sung</h2>
        <p className="text-muted-foreground">
          Cung cấp thêm thông tin về bất động sản của bạn
        </p>
      </div>

      <div className="space-y-4">
        {showLegalStatus && (
          <div className="space-y-2">
            <Label htmlFor="legal-status">Pháp lý</Label>
            <Select value={legalStatus} onValueChange={setLegalStatus}>
              <SelectTrigger id="legal-status">
                <SelectValue placeholder="Chọn tình trạng pháp lý" />
              </SelectTrigger>
              <SelectContent>
                {LEGAL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showHouseDirection && (
          <div className="space-y-2">
            <Label htmlFor="house-direction">Hướng nhà</Label>
            <Select value={houseDirection} onValueChange={setHouseDirection}>
              <SelectTrigger id="house-direction">
                <SelectValue placeholder="Chọn hướng nhà" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((direction) => (
                  <SelectItem key={direction} value={direction}>
                    {direction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showFacadeWidth && (
            <div className="space-y-2">
              <Label htmlFor="facade-width">Chiều rộng mặt tiền (m)</Label>
              <Input
                id="facade-width"
                type="number"
                step="0.1"
                min="0"
                placeholder="Nhập chiều rộng mặt tiền"
                value={facadeWidth}
                onChange={(e) => setFacadeWidth(e.target.value)}
              />
            </div>
          )}

          {showAlleyWidth && (
            <div className="space-y-2">
              <Label htmlFor="alley-width">Độ rộng đường vào (m)</Label>
              <Input
                id="alley-width"
                type="number"
                step="0.1"
                min="0"
                placeholder="Nhập độ rộng đường vào"
                value={alleyWidth}
                onChange={(e) => setAlleyWidth(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
