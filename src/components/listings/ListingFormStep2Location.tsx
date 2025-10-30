import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Vị trí và Định vị</h2>
        <p className="text-muted-foreground">
          Cung cấp thông tin chi tiết về vị trí bất động sản
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">Tỉnh/Thành phố</Label>
          <Input
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Ví dụ: TP. Hồ Chí Minh"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện <span className="text-destructive">*</span></Label>
          <Input
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Ví dụ: Quận 1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward">Phường/Xã</Label>
          <Input
            id="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="Ví dụ: Phường Bến Nghé"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Địa chỉ chi tiết</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Số nhà, tên đường"
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

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-4">Tọa độ (Tùy chọn)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="10.762622"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="106.660172"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
