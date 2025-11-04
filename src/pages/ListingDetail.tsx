import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useListingContact } from "@/hooks/useListingContact";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bed, Bath, Maximize, MapPin, Phone, Mail, User, Eye } from "lucide-react";
import { LISTING_STATUSES, PURPOSES } from "@/constants/listing.constants";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: contactData, isLoading: contactLoading } = useListingContact(id || "");
  const contactInfo = contactData?.contact_info || null;

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setError("ID không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch listing first
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();

        if (listingError) throw listingError;

        if (!listingData) {
          setError("Không tìm thấy tin đăng");
          setLoading(false);
          return;
        }

        // Fetch property type separately
        const { data: propertyTypeData, error: propertyTypeError } = await supabase
          .from("property_types")
          .select("name, slug")
          .eq("slug", listingData.property_type_slug)
          .single();

        if (propertyTypeError) {
          console.error("Error fetching property type:", propertyTypeError);
        }

        // Combine the data
        const combinedData = {
          ...listingData,
          property_types: propertyTypeData || { name: "BĐS", slug: listingData.property_type_slug }
        };

        setListing(combinedData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching listing:", err);
        setError(err.message || "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (!id || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error || "Không tìm thấy tin đăng"}
          </h1>
          <Button onClick={() => navigate("/listings")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const address = listing.address || {};
  const addressText = [address.street, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");
  
  const attributes = listing.attributes || {};
  const images = listing.image_url ? [listing.image_url] : [];
  const propertyTypeName = listing.property_types?.name || "BĐS";
  const purposeLabel = listing.purpose === "FOR_SALE" ? PURPOSES.FOR_SALE : PURPOSES.FOR_RENT;
  const formatPrice = (price: number, priceUnit: string) => {
    if (priceUnit === "TOTAL") {
      if (price >= 1000000000) {
        return `${(price / 1000000000).toFixed(1)} tỷ`;
      } else if (price >= 1000000) {
        return `${(price / 1000000).toFixed(0)} triệu`;
      }
      return `${price.toLocaleString()} VND`;
    }
    return `${price.toLocaleString()} VND`;
  };

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
            {images.length > 0 ? (
              <Card className="overflow-hidden">
                <Carousel className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video relative">
                          <img
                            src={image}
                            alt={`${listing.title} - Hình ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="aspect-video relative bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Chưa có hình ảnh</p>
                </div>
              </Card>
            )}

            {/* Title and Price */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(listing.price, listing.price_unit)}
                </p>
                {listing.price_unit === "PER_SQM" && (
                  <span className="text-muted-foreground">/m²</span>
                )}
                {listing.price_unit === "PER_MONTH" && (
                  <span className="text-muted-foreground">/tháng</span>
                )}
              </div>
              
              {/* Prominent Features */}
              {listing.prominent_features && listing.prominent_features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {listing.prominent_features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
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
                
                {listing.num_bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bed className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng ngủ</p>
                      <p className="font-semibold text-foreground">{listing.num_bedrooms}</p>
                    </div>
                  </div>
                )}
                
                {listing.num_bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bath className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng vệ sinh</p>
                      <p className="font-semibold text-foreground">{listing.num_bathrooms}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại hình</p>
                    <p className="font-semibold text-foreground">{propertyTypeName}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Attributes */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.num_bedrooms && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số phòng ngủ</span>
                    <span className="font-medium text-foreground">{listing.num_bedrooms}</span>
                  </div>
                )}
                {listing.num_bathrooms && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số phòng vệ sinh</span>
                    <span className="font-medium text-foreground">{listing.num_bathrooms}</span>
                  </div>
                )}
                {listing.floor_number && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Tầng</span>
                    <span className="font-medium text-foreground">{listing.floor_number}</span>
                  </div>
                )}
                {listing.num_floors && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Số tầng</span>
                    <span className="font-medium text-foreground">{listing.num_floors}</span>
                  </div>
                )}
                {listing.balcony_direction && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hướng ban công</span>
                    <span className="font-medium text-foreground">{listing.balcony_direction}</span>
                  </div>
                )}
                {listing.house_direction && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hướng nhà</span>
                    <span className="font-medium text-foreground">{listing.house_direction}</span>
                  </div>
                )}
                {listing.interior_status && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Nội thất</span>
                    <span className="font-medium text-foreground">{listing.interior_status}</span>
                  </div>
                )}
                {listing.legal_status && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Pháp lý</span>
                    <span className="font-medium text-foreground">{listing.legal_status}</span>
                  </div>
                )}
                {listing.facade_width && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Mặt tiền</span>
                    <span className="font-medium text-foreground">{listing.facade_width}m</span>
                  </div>
                )}
                {listing.alley_width && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hẻm</span>
                    <span className="font-medium text-foreground">{listing.alley_width}m</span>
                  </div>
                )}
                {listing.land_direction && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hướng đất</span>
                    <span className="font-medium text-foreground">{listing.land_direction}</span>
                  </div>
                )}
                {listing.project_name && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Tên dự án</span>
                    <span className="font-medium text-foreground">{listing.project_name}</span>
                  </div>
                )}
                {attributes.amenities && attributes.amenities.length > 0 && (
                  <div className="col-span-2 py-2 border-b border-border">
                    <p className="text-muted-foreground mb-2">Tiện ích</p>
                    <div className="flex flex-wrap gap-2">
                      {attributes.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Mô tả</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description || "Chưa có mô tả"}
              </p>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Vị trí</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <p className="text-foreground">
                  {addressText || "Chưa có thông tin địa chỉ"}
                </p>
              </div>
              
              {/* Map Placeholder */}
              {listing.coordinates && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Bản đồ vị trí</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lat: {listing.coordinates.lat}, Lng: {listing.coordinates.lng}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin liên hệ</h2>
              
              {contactLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : contactInfo ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Người đăng</p>
                        <p className="font-medium text-foreground">{contactInfo.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {showPhone 
                              ? contactInfo.phone 
                              : contactInfo.phone ? `****${contactInfo.phone.slice(-3)}` : '****'
                            }
                          </p>
                          {!showPhone && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowPhone(true)}
                              className="h-7 px-3"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Hiện
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground text-sm">{contactInfo.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => contactInfo.phone && window.open(`tel:${contactInfo.phone}`)}
                      disabled={!contactInfo.phone}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Gọi điện
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      onClick={() => contactInfo.email && window.open(`mailto:${contactInfo.email}`)}
                      disabled={!contactInfo.email}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Gửi email
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Không có thông tin liên hệ
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { ListingDetail as default };
