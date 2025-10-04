import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.append("purpose", purpose);
    if (location) params.append("location", location);
    if (propertyType) params.append("propertyType", propertyType);
    
    navigate(`/listings?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 -mt-10 relative z-10">
      <div className="flex gap-4 mb-4">
        <Button
          variant={purpose === "sale" ? "default" : "ghost"}
          onClick={() => setPurpose("sale")}
          className="flex-1"
        >
          Mua
        </Button>
        <Button
          variant={purpose === "rent" ? "default" : "ghost"}
          onClick={() => setPurpose("rent")}
          className="flex-1"
        >
          Thuê
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Nhập địa điểm (Tỉnh, Quận, Đường...)"
            className="pl-10 h-12"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Loại BĐS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="can-ho-chung-cu">Căn hộ chung cư</SelectItem>
            <SelectItem value="nha-rieng">Nhà riêng</SelectItem>
            <SelectItem value="dat-nen">Đất nền</SelectItem>
            <SelectItem value="biet-thu">Biệt thự</SelectItem>
            <SelectItem value="nha-pho">Nhà phố, shophouse</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          className="h-12 bg-primary hover:bg-primary-hover text-primary-foreground"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-5 w-5" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
