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
    navigate(`/listings?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const tabs: { key: Purpose; label: string }[] = [
    { key: "sale", label: "Nhà đất bán" },
    { key: "rent", label: "Nhà đất thuê" },
    { key: "auction", label: "Đấu giá" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Tabs row */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPurpose(tab.key)}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors relative
              ${purpose === tab.key
                ? "text-foreground bg-card"
                : "text-muted-foreground bg-secondary/50 hover:text-foreground hover:bg-secondary/80"
              }`}
          >
            {tab.label}
            {purpose === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Vị trí</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="TP.HCM, Hà Nội..."
                className="pl-9 h-10 text-sm border-border"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Loại nhà đất</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="can-ho-chung-cu">Căn hộ chung cư</SelectItem>
                <SelectItem value="nha-rieng">Nhà riêng</SelectItem>
                <SelectItem value="dat-nen">Đất nền</SelectItem>
                <SelectItem value="biet-thu">Biệt thự</SelectItem>
                <SelectItem value="nha-pho">Nhà phố, shophouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Mức giá</label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Tất cả mức giá" />
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
          </div>

          <Button
            className="h-10 px-8 bg-foreground hover:bg-foreground/90 text-background font-medium"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
};
