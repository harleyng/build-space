import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { useListings } from "@/hooks/useListings";
import apartmentSample from "@/assets/apartment-sample.jpg";
import houseSample from "@/assets/house-sample.jpg";
import penthouseSample from "@/assets/penthouse-sample.jpg";

const Listings = () => {
  const { data: propertyTypes, isLoading: isLoadingPropertyTypes } = usePropertyTypes();
  const { data: listings, isLoading: isLoadingListings } = useListings();
  
  const [purpose, setPurpose] = useState<"FOR_SALE" | "FOR_RENT">("FOR_SALE");
  const [propertyType, setPropertyType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minArea, setMinArea] = useState<string>("");
  const [maxArea, setMaxArea] = useState<string>("");
  const [numBedrooms, setNumBedrooms] = useState<string>("");
  const [numBathrooms, setNumBathrooms] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [facadeWidth, setFacadeWidth] = useState<string>("");
  const [alleyWidth, setAlleyWidth] = useState<string>("");
  const [legalStatus, setLegalStatus] = useState<string>("");
  const [interiorStatus, setInteriorStatus] = useState<string>("");
  const [floorNumber, setFloorNumber] = useState<string>("");
  const [numFloors, setNumFloors] = useState<string>("");

  // Get selected property type metadata
  const selectedPropertyType = useMemo(() => {
    if (!propertyTypes || !propertyType) return null;
    return propertyTypes.find((pt) => pt.slug === propertyType);
  }, [propertyTypes, propertyType]);

  // Get available filters for the selected property type and purpose
  const availableFilters = useMemo(() => {
    if (!selectedPropertyType) return [];
    const metadata = selectedPropertyType.filter_metadata[purpose];
    
    // Handle both old format (array) and new format (object with filters key)
    if (Array.isArray(metadata)) {
      return metadata;
    }
    
    return metadata?.filters || [];
  }, [selectedPropertyType, purpose]);

  // Reset dependent filters when purpose or property type changes
  useEffect(() => {
    setNumBedrooms("");
    setNumBathrooms("");
    setDirection("");
    setFacadeWidth("");
    setAlleyWidth("");
    setLegalStatus("");
    setInteriorStatus("");
    setFloorNumber("");
    setNumFloors("");
  }, [purpose, propertyType]);

  // Format price for display
  const formatPrice = (price: number, purpose: string) => {
    if (purpose === "FOR_RENT") {
      // Price is in VND, convert to millions
      const priceInMillions = price / 1000000;
      return `${priceInMillions.toLocaleString('vi-VN')} triệu/tháng`;
    }
    // For sale - price is in VND, convert to billions
    const priceInBillions = price / 1000000000;
    if (priceInBillions >= 1) {
      return `${priceInBillions.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
    }
    // Less than 1 billion, show in millions
    const priceInMillions = price / 1000000;
    return `${priceInMillions.toLocaleString('vi-VN')} triệu`;
  };

  // Get property type name from slug
  const getPropertyTypeName = (slug: string) => {
    const propertyType = propertyTypes?.find(pt => pt.slug === slug);
    return propertyType?.name || slug;
  };

  // Get fallback image based on property type
  const getFallbackImage = (slug: string) => {
    if (slug.includes('can-ho') || slug.includes('chung-cu')) return apartmentSample;
    if (slug.includes('nha') || slug.includes('biet-thu')) return houseSample;
    return penthouseSample;
  };

  const filteredProperties = useMemo(() => {
    if (!listings) return [];
    
    return listings.filter((listing) => {
      // Filter by purpose (FOR_SALE/FOR_RENT)
      if (listing.purpose !== purpose) return false;

      // Filter by property type
      if (propertyType && listing.property_type_slug !== propertyType) return false;

      // Filter by price (convert database VND to billions for FOR_SALE, millions for FOR_RENT)
      const priceValue = purpose === "FOR_SALE" 
        ? listing.price / 1000000000  // Convert VND to billions
        : listing.price / 1000000;     // Convert VND to millions
      if (minPrice && priceValue < parseFloat(minPrice)) return false;
      if (maxPrice && priceValue > parseFloat(maxPrice)) return false;

      // Filter by area
      if (minArea && Number(listing.area) < parseFloat(minArea)) return false;
      if (maxArea && Number(listing.area) > parseFloat(maxArea)) return false;

      // Filter by bedrooms
      if (numBedrooms && numBedrooms !== "all" && listing.num_bedrooms !== parseInt(numBedrooms)) return false;

      // Filter by bathrooms
      if (numBathrooms && numBathrooms !== "all" && listing.num_bathrooms !== parseInt(numBathrooms)) return false;

      // Filter by district
      if (district && district !== "all" && listing.district !== district) return false;

      // Filter by direction
      if (direction && direction !== "all") {
        const listingDirection = listing.house_direction || 
                                  listing.balcony_direction || 
                                  listing.land_direction || "";
        if (listingDirection !== direction) return false;
      }

      // Filter by facade width
      if (facadeWidth && listing.facade_width) {
        if (Number(listing.facade_width) < parseFloat(facadeWidth)) return false;
      }

      // Filter by alley width
      if (alleyWidth && listing.alley_width) {
        if (Number(listing.alley_width) < parseFloat(alleyWidth)) return false;
      }

      // Filter by legal status
      if (legalStatus && legalStatus !== "all" && listing.legal_status !== legalStatus) return false;

      // Filter by interior status
      if (interiorStatus && interiorStatus !== "all" && listing.interior_status !== interiorStatus) return false;

      // Filter by floor number
      if (floorNumber && listing.floor_number) {
        if (listing.floor_number < parseInt(floorNumber)) return false;
      }

      // Filter by number of floors
      if (numFloors && listing.num_floors) {
        if (listing.num_floors < parseInt(numFloors)) return false;
      }

      return true;
    });
  }, [listings, purpose, propertyType, minPrice, maxPrice, minArea, maxArea, numBedrooms, numBathrooms, district, 
      direction, facadeWidth, alleyWidth, legalStatus, interiorStatus, floorNumber, numFloors]);

  const resetFilters = () => {
    setPurpose("FOR_SALE");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setNumBedrooms("");
    setNumBathrooms("");
    setDistrict("");
    setDirection("");
    setFacadeWidth("");
    setAlleyWidth("");
    setLegalStatus("");
    setInteriorStatus("");
    setFloorNumber("");
    setNumFloors("");
  };

  // Get available property types for selected purpose
  const availablePropertyTypes = useMemo(() => {
    if (!propertyTypes) return [];
    return propertyTypes.filter((pt) => {
      const metadata = pt.filter_metadata[purpose];
      
      // Handle both old format (array - available if not empty) and new format (object with available key)
      if (Array.isArray(metadata)) {
        return metadata.length > 0;
      }
      
      return metadata?.available === true;
    });
  }, [propertyTypes, purpose]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Danh Sách Bất Động Sản
          </h1>
          <p className="text-muted-foreground">
            Tìm thấy {filteredProperties.length} bất động sản
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border sticky top-4">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Bộ lọc
              </h2>

              {/* Purpose Toggle */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Mục đích
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={purpose === "FOR_SALE" ? "default" : "outline"}
                    onClick={() => setPurpose("FOR_SALE")}
                    className="w-full"
                  >
                    Mua
                  </Button>
                  <Button
                    variant={purpose === "FOR_RENT" ? "default" : "outline"}
                    onClick={() => setPurpose("FOR_RENT")}
                    className="w-full"
                  >
                    Thuê
                  </Button>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Loại hình BĐS
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType} disabled={isLoadingPropertyTypes}>
                  <SelectTrigger className="bg-popover">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {availablePropertyTypes.map((pt) => (
                      <SelectItem key={pt.id} value={pt.slug}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Khu vực
                </Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="bg-popover">
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Quận 1">Quận 1</SelectItem>
                    <SelectItem value="Quận 2">Quận 2</SelectItem>
                    <SelectItem value="Quận 3">Quận 3</SelectItem>
                    <SelectItem value="Bình Thạnh">Bình Thạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Khoảng giá (tỷ VNĐ)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Diện tích (m²)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Filters Based on Property Type */}
              {availableFilters.includes("numBedrooms") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Số phòng ngủ
                  </Label>
                  <Select value={numBedrooms} onValueChange={setNumBedrooms}>
                    <SelectTrigger className="bg-popover">
                      <SelectValue placeholder="Chọn số phòng" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1">1 phòng</SelectItem>
                      <SelectItem value="2">2 phòng</SelectItem>
                      <SelectItem value="3">3 phòng</SelectItem>
                      <SelectItem value="4">4 phòng</SelectItem>
                      <SelectItem value="5">5+ phòng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {availableFilters.includes("numBathrooms") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Số phòng vệ sinh
                  </Label>
                  <Select value={numBathrooms} onValueChange={setNumBathrooms}>
                    <SelectTrigger className="bg-popover">
                      <SelectValue placeholder="Chọn số phòng" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1">1 phòng</SelectItem>
                      <SelectItem value="2">2 phòng</SelectItem>
                      <SelectItem value="3">3 phòng</SelectItem>
                      <SelectItem value="4">4+ phòng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(availableFilters.includes("houseDirection") || 
                availableFilters.includes("balconyDirection") || 
                availableFilters.includes("landDirection")) && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Hướng
                  </Label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger className="bg-popover">
                      <SelectValue placeholder="Chọn hướng" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Đông">Đông</SelectItem>
                      <SelectItem value="Tây">Tây</SelectItem>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Bắc">Bắc</SelectItem>
                      <SelectItem value="Đông Bắc">Đông Bắc</SelectItem>
                      <SelectItem value="Tây Bắc">Tây Bắc</SelectItem>
                      <SelectItem value="Đông Nam">Đông Nam</SelectItem>
                      <SelectItem value="Tây Nam">Tây Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {availableFilters.includes("facadeWidth") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Chiều rộng mặt tiền tối thiểu (m)
                  </Label>
                  <Input
                    type="number"
                    placeholder="VD: 5"
                    value={facadeWidth}
                    onChange={(e) => setFacadeWidth(e.target.value)}
                  />
                </div>
              )}

              {availableFilters.includes("alleyWidth") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Chiều rộng đường vào tối thiểu (m)
                  </Label>
                  <Input
                    type="number"
                    placeholder="VD: 4"
                    value={alleyWidth}
                    onChange={(e) => setAlleyWidth(e.target.value)}
                  />
                </div>
              )}

              {availableFilters.includes("legalStatus") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Pháp lý
                  </Label>
                  <Select value={legalStatus} onValueChange={setLegalStatus}>
                    <SelectTrigger className="bg-popover">
                      <SelectValue placeholder="Chọn pháp lý" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Sổ hồng">Sổ hồng</SelectItem>
                      <SelectItem value="Sổ đỏ">Sổ đỏ</SelectItem>
                      <SelectItem value="HĐMB">Hợp đồng mua bán</SelectItem>
                      <SelectItem value="Đang chờ sổ">Đang chờ sổ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {availableFilters.includes("interiorStatus") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Tình trạng nội thất
                  </Label>
                  <Select value={interiorStatus} onValueChange={setInteriorStatus}>
                    <SelectTrigger className="bg-popover">
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Nội thất cao cấp">Nội thất cao cấp</SelectItem>
                      <SelectItem value="Nội thất cơ bản">Nội thất cơ bản</SelectItem>
                      <SelectItem value="Không nội thất">Không nội thất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {availableFilters.includes("floorNumber") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Tầng tối thiểu
                  </Label>
                  <Input
                    type="number"
                    placeholder="VD: 10"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                  />
                </div>
              )}

              {availableFilters.includes("numFloors") && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Số tầng tối thiểu
                  </Label>
                  <Input
                    type="number"
                    placeholder="VD: 3"
                    value={numFloors}
                    onChange={(e) => setNumFloors(e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button onClick={resetFilters} variant="outline" className="w-full gap-2">
                  <X className="h-4 w-4" />
                  Đặt lại bộ lọc
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="area-desc">Diện tích lớn nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Grid */}
            {isLoadingListings ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((listing) => (
                  <PropertyCard 
                    key={listing.id}
                    id={listing.id}
                    image={listing.image_url || getFallbackImage(listing.property_type_slug)}
                    title={listing.title}
                    price={formatPrice(listing.price, listing.purpose)}
                    location={listing.address || listing.district}
                    bedrooms={listing.num_bedrooms || 0}
                    bathrooms={listing.num_bathrooms || 0}
                    area={Number(listing.area)}
                    type={getPropertyTypeName(listing.property_type_slug)}
                    status={listing.purpose === "FOR_SALE" ? "Bán" : "Cho thuê"}
                    prominentFeatures={[
                      listing.legal_status,
                      listing.interior_status,
                      listing.house_direction || listing.balcony_direction || listing.land_direction
                    ].filter(Boolean) as string[]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tìm thấy bất động sản
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thử điều chỉnh bộ lọc để tìm thấy kết quả phù hợp
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Đặt lại bộ lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProperties.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="outline" disabled>
                  Trước
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Sau</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { Listings as default };
