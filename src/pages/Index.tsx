import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { AuctionSection } from "@/components/AuctionSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
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
      attributes: {
        balconyDirection: "Đông Nam",
        interiorStatus: "Nội thất cao cấp",
        legalStatus: "Sổ hồng",
        floorNumber: 15,
      },
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
      attributes: {
        houseDirection: "Đông",
        facadeWidth: 6,
        alleyWidth: 8,
        numFloors: 3,
        legalStatus: "Sổ hồng",
      },
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
      attributes: {
        balconyDirection: "Nam",
        interiorStatus: "Nội thất cao cấp",
        floorNumber: 25,
      },
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
      prominentFeatures: ["Vườn rộng", "Thiết kế hiện đại", "Khu vip"],
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
      prominentFeatures: ["Full nội thất", "Dọn dẹp hàng tuần", "Trung tâm"],
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
      prominentFeatures: ["Tiện ích 5 sao", "View công viên", "Giao thông thuận lợi"],
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
      prominentFeatures: ["Mặt tiền", "Kinh doanh tốt", "Vị trí đắc địa"],
    },
  ];

  const stats = [
    { icon: TrendingUp, value: "50,000+", label: "Tin đăng" },
    { icon: Users, value: "100,000+", label: "Người dùng" },
    { icon: Shield, value: "99%", label: "Tin cậy" },
  ];

  const propertyTypes = [
    { label: "Căn hộ chung cư", slug: "can-ho-chung-cu", icon: "🏢" },
    { label: "Nhà riêng", slug: "nha-rieng", icon: "🏠" },
    { label: "Đất nền", slug: "dat-nen", icon: "🌾" },
    { label: "Biệt thự", slug: "biet-thu", icon: "🏰" },
    { label: "Nhà phố", slug: "nha-pho", icon: "🏘️" },
    { label: "Kho, nhà xưởng", slug: "kho-nha-xuong", icon: "🏭" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - cleaner style inspired by image 2 */}
      <section className="relative h-[500px] md:h-[550px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tìm kiếm bất động sản"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/40 to-transparent" />
        </div>

        <div className="relative container h-full flex flex-col justify-center z-10 px-4">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 leading-tight">
              Tìm ngôi nhà mơ ước của bạn
            </h1>
            <p className="text-sm md:text-lg text-primary-foreground/80 mb-6 max-w-md">
              Khám phá hàng nghìn bất động sản chất lượng trên khắp Việt Nam. Mua, thuê hoặc đấu giá.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="container px-4">
        <SearchBar />
      </div>

      {/* Stats */}
      <section className="container py-10 md:py-12 px-4">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 md:p-6 bg-card rounded-lg border border-border"
              >
                <div className="p-2 md:p-3 rounded-full bg-primary/10 hidden sm:block">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Property Types */}
      <section className="container py-8 md:py-12 px-4">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Khám phá theo loại hình
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Tìm kiếm nhanh theo danh mục bất động sản
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {propertyTypes.map((type) => (
            <Link key={type.slug} to={`/listings?propertyType=${type.slug}`} className="group">
              <Card className="h-full border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-xs md:text-sm text-foreground group-hover:text-primary transition-colors">
                    {type.label}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Auction Section */}
      <AuctionSection />

      {/* Featured Listings */}
      <section className="container py-8 md:py-12 px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Bất động sản nổi bật
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Những tin đăng được quan tâm nhất
            </p>
          </div>
          <Link to="/listings">
            <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-foreground">
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link to="/listings">
            <Button variant="outline">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground py-14 md:py-16 mt-8 md:mt-12">
        <div className="container text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-background mb-3 md:mb-4">
            Bạn có bất động sản cần bán hoặc cho thuê?
          </h2>
          <p className="text-sm md:text-lg text-background/70 mb-6 md:mb-8 max-w-2xl mx-auto">
            Đăng tin miễn phí và tiếp cận hàng nghìn khách hàng tiềm năng
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground text-sm md:text-lg"
            onClick={() => navigate("/broker/properties/new")}
          >
            Đăng tin ngay
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
