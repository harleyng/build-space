import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bed, Bath, Maximize, MapPin, Phone, Mail, User } from "lucide-react";

// Mock data for listing detail - in a real app, this would come from an API
const getListingById = (id: string) => {
  const listings = {
    "1": {
      id: "1",
      title: "Căn hộ cao cấp The Manor 2 phòng ngủ, nội thất đầy đủ",
      description: "Căn hộ 2 phòng ngủ tại The Manor, tầng 15, view đẹp, đầy đủ nội thất cao cấp. Thiết kế hiện đại, thoáng mát. Khu vực an ninh 24/7, đầy đủ tiện ích: hồ bơi, gym, công viên. Gần trường học, siêu thị, bệnh viện. Rất thuận tiện cho việc đi lại và sinh hoạt.",
      price: "15 tỷ",
      priceValue: 15000000000,
      priceUnit: "TOTAL",
      area: 85,
      location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
      address: {
        street: "Đường Nguyễn Hữu Cảnh",
        ward: "Phường 22",
        district: "Quận Bình Thạnh",
        province: "TP. Hồ Chí Minh",
      },
      coordinates: { lat: 10.8005, lng: 106.7122 },
      contactInfo: {
        name: "Nguyễn Văn A",
        phone: "0912345678",
        email: "nguyenvana@email.com",
      },
      projectName: "The Manor",
      purpose: "FOR_SALE",
      type: "Căn hộ chung cư",
      status: "ACTIVE",
      bedrooms: 2,
      bathrooms: 2,
      attributes: {
        numBedrooms: 2,
        numBathrooms: 2,
        floorNumber: 15,
        balconyDirection: "Đông Nam",
        interiorStatus: "Nội thất cao cấp",
        legalStatus: "Sổ hồng",
      } as Record<string, any>,
      prominentFeatures: ["View đẹp", "Nội thất cao cấp", "An ninh 24/7"],
      images: [
        "/src/assets/apartment-sample.jpg",
        "/src/assets/house-sample.jpg",
        "/src/assets/penthouse-sample.jpg",
      ],
    },
    "2": {
      id: "2",
      title: "Nhà phố hiện đại 3 tầng khu Thảo Điền",
      description: "Nhà phố 3 tầng thiết kế hiện đại tại khu Thảo Điền cao cấp. Diện tích đất 120m², diện tích sàn 350m². 4 phòng ngủ, 5 phòng vệ sinh. Thiết kế thông minh, đầy đủ ánh sáng tự nhiên. Sân vườn rộng rãi. Khu vực yên tĩnh, an ninh, gần trường quốc tế.",
      price: "25 tỷ",
      priceValue: 25000000000,
      priceUnit: "TOTAL",
      area: 120,
      location: "Quận 2, TP. Hồ Chí Minh",
      address: {
        street: "Đường Quốc Hương",
        ward: "Phường Thảo Điền",
        district: "Quận 2",
        province: "TP. Hồ Chí Minh",
      },
      coordinates: { lat: 10.8034, lng: 106.7399 },
      contactInfo: {
        name: "Trần Thị B",
        phone: "0923456789",
        email: "tranthib@email.com",
      },
      projectName: null,
      purpose: "FOR_SALE",
      type: "Nhà riêng",
      status: "ACTIVE",
      bedrooms: 4,
      bathrooms: 5,
      attributes: {
        numBedrooms: 4,
        numBathrooms: 5,
        numFloors: 3,
        facadeWidth: 6,
        alleyWidth: 8,
        legalStatus: "Sổ hồng",
        houseDirection: "Đông",
      } as Record<string, any>,
      prominentFeatures: ["Sân vườn", "Gần trường quốc tế", "Thiết kế hiện đại"],
      images: [
        "/src/assets/house-sample.jpg",
        "/src/assets/apartment-sample.jpg",
        "/src/assets/penthouse-sample.jpg",
      ],
    },
  };

  return listings[id as keyof typeof listings] || null;
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy tin đăng</h1>
          <Button onClick={() => navigate("/listings")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const listing = getListingById(id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy tin đăng</h1>
          <Button onClick={() => navigate("/listings")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/listings")}
          className="mb-6"
        >
          ← Quay lại danh sách
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {listing.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative">
                        <img
                          src={image}
                          alt={`${listing.title} - Hình ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>

            {/* Title and Price */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-primary">{listing.price}</p>
                {listing.priceUnit === "PER_SQM" && (
                  <span className="text-muted-foreground">/m²</span>
                )}
                {listing.priceUnit === "PER_MONTH" && (
                  <span className="text-muted-foreground">/tháng</span>
                )}
              </div>
              
              {/* Prominent Features */}
              <div className="flex flex-wrap gap-2">
                {listing.prominentFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin chính</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Maximize className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diện tích</p>
                    <p className="font-semibold text-foreground">{listing.area} m²</p>
                  </div>
                </div>
                
                {listing.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bed className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng ngủ</p>
                      <p className="font-semibold text-foreground">{listing.bedrooms}</p>
                    </div>
                  </div>
                )}
                
                {listing.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bath className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng vệ sinh</p>
                      <p className="font-semibold text-foreground">{listing.bathrooms}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại hình</p>
                    <p className="font-semibold text-foreground">{listing.type}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Attributes */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.attributes.numBedrooms && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số phòng ngủ</span>
                    <span className="font-medium text-foreground">{listing.attributes.numBedrooms}</span>
                  </div>
                )}
                {listing.attributes.numBathrooms && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số phòng vệ sinh</span>
                    <span className="font-medium text-foreground">{listing.attributes.numBathrooms}</span>
                  </div>
                )}
                {listing.attributes.floorNumber && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Tầng</span>
                    <span className="font-medium text-foreground">{listing.attributes.floorNumber}</span>
                  </div>
                )}
                {listing.attributes.numFloors && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số tầng</span>
                    <span className="font-medium text-foreground">{listing.attributes.numFloors}</span>
                  </div>
                )}
                {listing.attributes.balconyDirection && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hướng ban công</span>
                    <span className="font-medium text-foreground">{listing.attributes.balconyDirection}</span>
                  </div>
                )}
                {listing.attributes.houseDirection && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hướng nhà</span>
                    <span className="font-medium text-foreground">{listing.attributes.houseDirection}</span>
                  </div>
                )}
                {listing.attributes.interiorStatus && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Nội thất</span>
                    <span className="font-medium text-foreground">{listing.attributes.interiorStatus}</span>
                  </div>
                )}
                {listing.attributes.legalStatus && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Pháp lý</span>
                    <span className="font-medium text-foreground">{listing.attributes.legalStatus}</span>
                  </div>
                )}
                {listing.attributes.facadeWidth && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Mặt tiền</span>
                    <span className="font-medium text-foreground">{listing.attributes.facadeWidth}m</span>
                  </div>
                )}
                {listing.attributes.alleyWidth && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hẻm</span>
                    <span className="font-medium text-foreground">{listing.attributes.alleyWidth}m</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Mô tả</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Vị trí</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <p className="text-foreground">
                  {listing.address.street}, {listing.address.ward}, {listing.address.district}, {listing.address.province}
                </p>
              </div>
              
              {/* Map Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Bản đồ vị trí</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lat: {listing.coordinates.lat}, Lng: {listing.coordinates.lng}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin liên hệ</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Người đăng</p>
                    <p className="font-medium text-foreground">{listing.contactInfo.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium text-foreground">{listing.contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground text-sm">{listing.contactInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open(`tel:${listing.contactInfo.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Gọi điện
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open(`mailto:${listing.contactInfo.email}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { ListingDetail as default };
