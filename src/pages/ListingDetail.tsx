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
import { ImageGallery } from "@/components/listings/ImageGallery";
import { AmenitiesDisplay } from "@/components/listings/AmenitiesDisplay";
import { FeesTable } from "@/components/listings/FeesTable";
import { LocationMap } from "@/components/listings/LocationMap";
import { Bed, Bath, Maximize, MapPin, Phone, Mail, User, Eye, Building2 } from "lucide-react";
import { LISTING_STATUSES, PURPOSES } from "@/constants/listing.constants";
import { formatPrice, formatDate } from "@/utils/formatters";

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
  
  const images = listing.image_url ? [listing.image_url] : [];
  const propertyTypeName = listing.property_types?.name || "BĐS";
  const purposeLabel = listing.purpose === "FOR_SALE" ? PURPOSES.FOR_SALE : PURPOSES.FOR_RENT;
  const coordinates = listing.coordinates || {};
  const customAttributes = listing.custom_attributes || {};
  const amenities = customAttributes.amenities || [];

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
            {/* Hero Image Gallery */}
            <ImageGallery images={images} title={listing.title} />

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

            {/* Key Highlights */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Điểm nổi bật</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Maximize className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{listing.area} m²</p>
                  <p className="text-sm text-muted-foreground">Diện tích</p>
                </div>
                {listing.num_bedrooms && (
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Bed className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{listing.num_bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Phòng ngủ</p>
                  </div>
                )}
                {listing.num_bathrooms && (
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Bath className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{listing.num_bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Phòng tắm</p>
                  </div>
                )}
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">{propertyTypeName}</p>
                  <p className="text-sm text-muted-foreground">Loại hình</p>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tiện ích</h2>
                <AmenitiesDisplay amenities={amenities} />
              </Card>
            )}

            {/* Estimated Costs */}
            {(listing.service_costs || customAttributes.fees?.length > 0) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Chi phí dự kiến</h2>
                <FeesTable fees={customAttributes.fees} serviceCosts={listing.service_costs} />
              </Card>
            )}

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Mô tả</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description || "Chưa có mô tả"}
              </p>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vị trí</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <p className="text-foreground">{addressText || "Chưa có thông tin địa chỉ"}</p>
                </div>
                {listing.building_name && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-1" />
                    <p className="text-foreground">{listing.building_name}</p>
                  </div>
                )}
                {coordinates.lat && coordinates.lng && (
                  <LocationMap latitude={coordinates.lat} longitude={coordinates.lng} />
                )}
              </div>
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
