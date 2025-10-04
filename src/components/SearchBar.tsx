import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchBar = () => {
  const [searchType, setSearchType] = useState("sale");

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 -mt-10 relative z-10">
      <div className="flex gap-4 mb-4">
        <Button
          variant={searchType === "sale" ? "default" : "ghost"}
          onClick={() => setSearchType("sale")}
          className="flex-1"
        >
          Mua
        </Button>
        <Button
          variant={searchType === "rent" ? "default" : "ghost"}
          onClick={() => setSearchType("rent")}
          className="flex-1"
        >
          Thuê
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Nhập địa điểm, dự án..."
            className="pl-10 h-12"
          />
        </div>

        <Select>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Loại BĐS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Căn hộ chung cư</SelectItem>
            <SelectItem value="house">Nhà riêng</SelectItem>
            <SelectItem value="land">Đất nền</SelectItem>
            <SelectItem value="villa">Biệt thự</SelectItem>
            <SelectItem value="shophouse">Nhà phố, shophouse</SelectItem>
          </SelectContent>
        </Select>

        <Button className="h-12 bg-primary hover:bg-primary-hover text-primary-foreground">
          <Search className="mr-2 h-5 w-5" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
