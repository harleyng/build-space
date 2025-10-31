import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vietnamProvinces } from "@/constants/vietnam-locations";
import { useGeocode } from "@/hooks/useGeocode";
import { LocationMap } from "./LocationMap";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface ListingFormStep2LocationProps {
  province: string;
  setProvince: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  ward: string;
  setWard: (value: string) => void;
  street: string;
  setStreet: (value: string) => void;
  projectName: string;
  setProjectName: (value: string) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
}

export const ListingFormStep2Location = ({
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  street,
  setStreet,
  projectName,
  setProjectName,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}: ListingFormStep2LocationProps) => {
  // Get available districts based on selected province
  const availableDistricts = useMemo(() => {
    if (!province) return [];
    const selectedProvince = vietnamProvinces.find((p) => p.name === province);
    return selectedProvince?.districts || [];
  }, [province]);

  // Get available wards based on selected district
  const availableWards = useMemo(() => {
    if (!district) return [];
    const selectedDistrict = availableDistricts.find((d) => d.name === district);
    return selectedDistrict?.wards || [];
  }, [district, availableDistricts]);

  // Geocode the address automatically
  const { latitude: geocodedLat, longitude: geocodedLng, isLoading: isGeocoding } = useGeocode(
    province,
    district,
    ward,
    street
  );

  // Update latitude and longitude when geocoding is complete
  useMemo(() => {
    if (geocodedLat && geocodedLng) {
      setLatitude(geocodedLat.toString());
      setLongitude(geocodedLng.toString());
    }
  }, [geocodedLat, geocodedLng, setLatitude, setLongitude]);

  const showMap = latitude && longitude && parseFloat(latitude) !== 0 && parseFloat(longitude) !== 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Bất động sản của bạn nằm ở đâu?</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">
            Tỉnh/Thành phố <span className="text-destructive">*</span>
          </Label>
          <Select
            value={province}
            onValueChange={(value) => {
              setProvince(value);
              setDistrict("");
              setWard("");
            }}
          >
            <SelectTrigger id="province">
              <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
            </SelectTrigger>
            <SelectContent>
              {vietnamProvinces.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">
            Quận/Huyện <span className="text-destructive">*</span>
          </Label>
          <Select
            value={district}
            onValueChange={(value) => {
              setDistrict(value);
              setWard("");
            }}
            disabled={!province}
          >
            <SelectTrigger id="district">
              <SelectValue placeholder="Chọn Quận/Huyện" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((d) => (
                <SelectItem key={d.name} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward">
            Phường/Xã <span className="text-destructive">*</span>
          </Label>
          <Select value={ward} onValueChange={setWard} disabled={!district}>
            <SelectTrigger id="ward">
              <SelectValue placeholder="Chọn Phường/Xã" />
            </SelectTrigger>
            <SelectContent>
              {availableWards.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">
            Địa chỉ chi tiết <span className="text-destructive">*</span>
          </Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Số nhà, tên đường"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectName">Tên dự án (Nếu có)</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Ví dụ: Vinhomes Central Park"
        />
      </div>

      {isGeocoding && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang tìm vị trí trên bản đồ...</span>
        </div>
      )}

      {showMap && (
        <div className="border-t pt-4">
          <LocationMap
            latitude={parseFloat(latitude)}
            longitude={parseFloat(longitude)}
          />
        </div>
      )}
    </div>
  );
};
