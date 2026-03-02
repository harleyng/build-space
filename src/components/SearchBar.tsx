import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
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

type Purpose = "sale" | "rent" | "auction";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>("sale");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.append("purpose", purpose);
    if (location) params.append("location", location);
    if (propertyType) params.append("propertyType", propertyType);
    if (priceRange) params.append("priceRange", priceRange);

    if (purpose === "auction") {
      navigate(`/listings?${params.toString()}`);
    } else {
      navigate(`/listings?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const tabs: { key: Purpose; label: string }[] = [
    { key: "sale", label: "Mua" },
    { key: "rent", label: "Thuê" },
    { key: "auction", label: "Đấu giá" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-xl p-4 md:p-6 -mt-10 relative z-10 border border-border">
      {/* Tabs */}
      <div className="flex gap-0 mb-4 md:mb-5 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPurpose(tab.key)}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 text-sm md:text-base font-semibold transition-colors relative
              ${purpose === tab.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
            {purpose === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Vị trí"
            className="pl-9 h-11 md:h-12 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="h-11 md:h-12 text-sm">
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

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="h-11 md:h-12 text-sm">
            <SelectValue placeholder="Mức giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">Dưới 1 tỷ</SelectItem>
            <SelectItem value="1-3">1 - 3 tỷ</SelectItem>
            <SelectItem value="3-5">3 - 5 tỷ</SelectItem>
            <SelectItem value="5-10">5 - 10 tỷ</SelectItem>
            <SelectItem value="10-20">10 - 20 tỷ</SelectItem>
            <SelectItem value="20+">Trên 20 tỷ</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="h-11 md:h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
