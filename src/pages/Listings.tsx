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
import apartmentSample from "@/assets/apartment-sample.jpg";
import houseSample from "@/assets/house-sample.jpg";
import penthouseSample from "@/assets/penthouse-sample.jpg";

const Listings = () => {
  const { data: propertyTypes, isLoading: isLoadingPropertyTypes } = usePropertyTypes();
  
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

  const allProperties = [
    {
      id: "1",
      image: apartmentSample,
      title: "Căn hộ cao cấp Vinhomes Central Park",
      price: "5.2 tỷ",
      priceValue: 5.2,
      location: "Quận Bình Thạnh, TP.HCM",
      district: "Bình Thạnh",
      bedrooms: 3,
      bathrooms: 2,
      area: 95,
      type: "Căn hộ chung cư",
      status: "Bán" as const,
      prominentFeatures: ["View đẹp", "Nội thất cao cấp", "Bảo vệ 24/7"],
      attributes: {
        balconyDirection: "Đông Nam",
        interiorStatus: "Nội thất cao cấp",
        legalStatus: "Sổ hồng",
        floorNumber: 15,
      } as any,
    },
    {
      id: "2",
      image: houseSample,
      title: "Nhà phố hiện đại khu compound",
      price: "8.5 tỷ",
      priceValue: 8.5,
      location: "Quận 2, TP.HCM",
      district: "Quận 2",
      bedrooms: 4,
      bathrooms: 3,
      area: 120,
      type: "Nhà riêng",
      status: "Bán" as const,
      prominentFeatures: ["Khu an ninh", "Sân vườn", "Gần trường học"],
      attributes: {
        houseDirection: "Đông",
        facadeWidth: 6,
        alleyWidth: 8,
        numFloors: 3,
        legalStatus: "Sổ hồng",
      } as any,
    },
    {
      id: "3",
      image: penthouseSample,
      title: "Penthouse sang trọng view sông",
      price: "45 triệu/tháng",
      priceValue: 45,
      location: "Quận 1, TP.HCM",
      district: "Quận 1",
      bedrooms: 4,
      bathrooms: 4,
      area: 180,
      type: "Căn hộ cao cấp",
      status: "Cho thuê" as const,
      prominentFeatures: ["View sông", "Full nội thất", "Tầng cao"],
      attributes: {
        balconyDirection: "Nam",
        interiorStatus: "Nội thất cao cấp",
        floorNumber: 25,
      } as any,
    },
    {
      id: "4",
      image: apartmentSample,
      title: "Căn hộ 2PN giá tốt The Sun Avenue",
      price: "3.8 tỷ",
      priceValue: 3.8,
      location: "Quận 2, TP.HCM",
      district: "Quận 2",
      bedrooms: 2,
      bathrooms: 2,
      area: 75,
      type: "Căn hộ chung cư",
      status: "Bán" as const,
      prominentFeatures: ["Giá tốt", "Gần Metro", "View thoáng"],
      attributes: {
        balconyDirection: "Nam",
        interiorStatus: "Nội thất cơ bản",
      } as any,
    },
    {
      id: "5",
      image: houseSample,
      title: "Biệt thự vườn khu Thảo Điền",
      price: "15.5 tỷ",
      priceValue: 15.5,
      location: "Quận 2, TP.HCM",
      district: "Quận 2",
      bedrooms: 5,
      bathrooms: 4,
      area: 250,
      type: "Biệt thự",
      status: "Bán" as const,
      prominentFeatures: ["Vườn rộng", "Hồ bơi", "Khu VIP"],
      attributes: {
        houseDirection: "Tây Nam",
        facadeWidth: 12,
        numFloors: 2,
        legalStatus: "Sổ hồng",
      } as any,
    },
    {
      id: "6",
      image: penthouseSample,
      title: "Căn hộ dịch vụ full nội thất",
      price: "18 triệu/tháng",
      priceValue: 18,
      location: "Quận 3, TP.HCM",
      district: "Quận 3",
      bedrooms: 2,
      bathrooms: 2,
      area: 65,
      type: "Căn hộ dịch vụ",
      status: "Cho thuê" as const,
      prominentFeatures: ["Full nội thất", "Dịch vụ tốt", "Trung tâm"],
      attributes: {
        balconyDirection: "Đông",
        interiorStatus: "Nội thất cao cấp",
        floorNumber: 8,
      } as any,
    },
  ];

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // Filter by purpose (FOR_SALE/FOR_RENT)
      if (purpose === "FOR_SALE" && property.status !== "Bán") return false;
      if (purpose === "FOR_RENT" && property.status !== "Cho thuê") return false;

      // Filter by property type
      if (propertyType && property.type !== propertyType) return false;

      // Filter by price
      if (minPrice && property.priceValue < parseFloat(minPrice)) return false;
      if (maxPrice && property.priceValue > parseFloat(maxPrice)) return false;

      // Filter by area
      if (minArea && property.area < parseFloat(minArea)) return false;
      if (maxArea && property.area > parseFloat(maxArea)) return false;

      // Filter by bedrooms
      if (numBedrooms && numBedrooms !== "all" && property.bedrooms !== parseInt(numBedrooms)) return false;

      // Filter by bathrooms
      if (numBathrooms && numBathrooms !== "all" && property.bathrooms !== parseInt(numBathrooms)) return false;

      // Filter by district
      if (district && district !== "all" && property.district !== district) return false;

      // Filter by direction
      if (direction && direction !== "all" && property.attributes) {
        const propertyDirection = property.attributes.houseDirection || 
                                  property.attributes.balconyDirection || 
                                  property.attributes.landDirection || "";
        if (propertyDirection !== direction) return false;
      }

      // Filter by facade width
      if (facadeWidth && property.attributes?.facadeWidth) {
        if (property.attributes.facadeWidth < parseFloat(facadeWidth)) return false;
      }

      // Filter by alley width
      if (alleyWidth && property.attributes?.alleyWidth) {
        if (property.attributes.alleyWidth < parseFloat(alleyWidth)) return false;
      }

      // Filter by legal status
      if (legalStatus && legalStatus !== "all" && property.attributes?.legalStatus !== legalStatus) return false;

      // Filter by interior status
      if (interiorStatus && interiorStatus !== "all" && property.attributes?.interiorStatus !== interiorStatus) return false;

      // Filter by floor number
      if (floorNumber && property.attributes?.floorNumber) {
        if (property.attributes.floorNumber < parseInt(floorNumber)) return false;
      }

      // Filter by number of floors
      if (numFloors && property.attributes?.numFloors) {
        if (property.attributes.numFloors < parseInt(numFloors)) return false;
      }

      return true;
    });
  }, [purpose, propertyType, minPrice, maxPrice, minArea, maxArea, numBedrooms, numBathrooms, district, 
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
                      <SelectItem key={pt.id} value={pt.name}>
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
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
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
