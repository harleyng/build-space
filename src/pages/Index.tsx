import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { AuctionSection } from "@/components/AuctionSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building2, Home, LandPlot, Castle, Store, Warehouse, Star, Users, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import apartmentSample from "@/assets/apartment-sample.jpg";
import houseSample from "@/assets/house-sample.jpg";
import penthouseSample from "@/assets/penthouse-sample.jpg";

const Index = () => {
  const navigate = useNavigate();

  const featuredProperties = [
    {
      id: "1",
      image: apartmentSample,
      title: "Căn hộ cao cấp Vinhomes Central Park",
      price: "5.2 tỷ",
      location: "Quận Bình Thạnh, TP.HCM",
      bedrooms: 3,
      bathrooms: 2,
      area: 95,
      type: "Căn hộ chung cư",
      status: "Bán" as const,
      prominentFeatures: ["View đẹp", "Nội thất cao cấp", "An ninh 24/7"],
    },
    {
      id: "2",
      image: houseSample,
      title: "Nhà phố hiện đại khu compound",
      price: "8.5 tỷ",
      location: "Quận 2, TP.HCM",
      bedrooms: 4,
      bathrooms: 3,
      area: 120,
      type: "Nhà riêng",
      status: "Bán" as const,
      prominentFeatures: ["Sân vườn", "Hồ bơi riêng", "Gara ô tô"],
    },
    {
      id: "3",
      image: penthouseSample,
      title: "Penthouse sang trọng view sông",
      price: "45 triệu/tháng",
      location: "Quận 1, TP.HCM",
      bedrooms: 4,
      bathrooms: 4,
      area: 180,
      type: "Căn hộ cao cấp",
      status: "Cho thuê" as const,
      prominentFeatures: ["Tầng cao", "View sông", "Full nội thất"],
    },
    {
      id: "4",
      image: apartmentSample,
      title: "Căn hộ 2PN giá tốt The Sun Avenue",
      price: "3.8 tỷ",
      location: "Quận 2, TP.HCM",
      bedrooms: 2,
      bathrooms: 2,
      area: 75,
      type: "Căn hộ chung cư",
      status: "Bán" as const,
      prominentFeatures: ["Giá tốt", "Vị trí đẹp", "Tiện ích đầy đủ"],
    },
    {
      id: "5",
      image: houseSample,
      title: "Biệt thự vườn khu Thảo Điền",
      price: "15.5 tỷ",
      location: "Quận 2, TP.HCM",
      bedrooms: 5,
      bathrooms: 4,
      area: 250,
      type: "Biệt thự",
      status: "Bán" as const,
    },
    {
      id: "6",
      image: penthouseSample,
      title: "Căn hộ dịch vụ full nội thất",
      price: "18 triệu/tháng",
      location: "Quận 3, TP.HCM",
      bedrooms: 2,
      bathrooms: 2,
      area: 65,
      type: "Căn hộ dịch vụ",
      status: "Cho thuê" as const,
    },
    {
      id: "7",
      image: apartmentSample,
      title: "Căn hộ 3PN tại Masteri Thảo Điền",
      price: "6.8 tỷ",
      location: "Quận 2, TP.HCM",
      bedrooms: 3,
      bathrooms: 2,
      area: 105,
      type: "Căn hộ chung cư",
      status: "Bán" as const,
    },
    {
      id: "8",
      image: houseSample,
      title: "Nhà mặt tiền Quận 10",
      price: "12 tỷ",
      location: "Quận 10, TP.HCM",
      bedrooms: 4,
      bathrooms: 3,
      area: 85,
      type: "Nhà riêng",
      status: "Bán" as const,
    },
  ];

  const stats = [
    { icon: Star, value: "50,000+", label: "Tin đăng" },
    { icon: Users, value: "100,000+", label: "Người dùng" },
    { icon: ShieldCheck, value: "99%", label: "Tin cậy" },
  ];

  const propertyTypes = [
    { label: "Căn hộ", slug: "can-ho-chung-cu", icon: Building2 },
    { label: "Nhà riêng", slug: "nha-rieng", icon: Home },
    { label: "Đất nền", slug: "dat-nen", icon: LandPlot },
    { label: "Biệt thự", slug: "biet-thu", icon: Castle },
    { label: "Nhà phố", slug: "nha-pho", icon: Store },
    { label: "Kho xưởng", slug: "kho-nha-xuong", icon: Warehouse },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - split layout like reference */}
      <section className="relative bg-secondary/40 overflow-hidden">
        <div className="container px-4 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                Tìm ngôi nhà<br />mơ ước của bạn
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
                Khám phá hàng nghìn bất động sản chất lượng trên khắp Việt Nam. Mua, thuê hoặc đấu giá với giá tốt nhất.
              </p>
              <Button
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-lg"
                onClick={() => navigate("/listings")}
              >
                Khám phá ngay
              </Button>
            </div>

            {/* Right: Image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 h-[380px]">
              <div className="rounded-xl overflow-hidden">
                <img src={apartmentSample} alt="Bất động sản" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-rows-2 gap-3">
                <div className="rounded-xl overflow-hidden">
                  <img src={houseSample} alt="Bất động sản" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src={penthouseSample} alt="Bất động sản" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar - overlapping */}
      <div className="container px-4 -mt-6 relative z-10">
        <SearchBar />
      </div>

      {/* Stats */}
      <section className="container py-10 md:py-14 px-4">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-4 md:p-6">
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Property Types */}
      <section className="container py-8 md:py-12 px-4">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1">
            Khám phá theo loại hình
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Tìm kiếm nhanh theo danh mục bất động sản
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link key={type.slug} to={`/listings?propertyType=${type.slug}`} className="group">
                <Card className="h-full border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-4 md:p-5 text-center flex flex-col items-center">
                    <div className="p-2.5 md:p-3 rounded-xl bg-secondary mb-2 md:mb-3 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-medium text-xs md:text-sm text-foreground">
                      {type.label}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Auction Section */}
      <AuctionSection />

      {/* Featured Listings */}
      <section className="container py-8 md:py-12 px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1">
              Bất động sản nổi bật
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Những tin đăng được quan tâm nhất
            </p>
          </div>
          <Link to="/listings">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground text-sm">
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link to="/listings">
            <Button variant="outline" size="sm">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section - cleaner */}
      <section className="bg-secondary/50 py-14 md:py-20 mt-8">
        <div className="container text-center px-4">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3">
            Bạn có bất động sản cần bán hoặc cho thuê?
          </h2>
          <p className="text-xs md:text-base text-muted-foreground mb-6 md:mb-8 max-w-lg mx-auto">
            Đăng tin miễn phí và tiếp cận hàng nghìn khách hàng tiềm năng
          </p>
          <Button
            size="lg"
            className="bg-foreground hover:bg-foreground/90 text-background"
            onClick={() => navigate("/broker/properties/new")}
          >
            Đăng tin ngay
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
