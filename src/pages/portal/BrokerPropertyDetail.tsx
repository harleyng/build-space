import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useListingContact } from "@/hooks/useListingContact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Bed, Bath, Maximize, MapPin, Phone, Mail, User, Eye, 
  ArrowLeft, ExternalLink, Check, Edit, Loader2 
} from "lucide-react";
import { LISTING_STATUSES, PURPOSES } from "@/constants/listing.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BrokerPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: contactData, isLoading: contactLoading } = useListingContact(id || "");
  const contactInfo = contactData?.contact_info || null;

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    if (!id) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Vui lòng đăng nhập");
        setLoading(false);
        return;
      }
      
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single();

      if (listingError) throw listingError;

      if (!listingData) {
        setError("Không tìm thấy tin đăng hoặc bạn không có quyền xem");
        setLoading(false);
        return;
      }

      const { data: propertyTypeData } = await supabase
        .from("property_types")
        .select("name, slug")
        .eq("slug", listingData.property_type_slug)
        .single();

      setListing({
        ...listingData,
        property_types: propertyTypeData || { name: "BĐS", slug: listingData.property_type_slug }
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching listing:", err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus as any })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Cập nhật thành công",
        description: `Trạng thái đã được cập nhật`,
      });

      fetchListing();
    } catch (error: any) {
      toast({
        title: "Lỗi cập nhật",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: "Bản nháp",
      PENDING_APPROVAL: "Chờ duyệt",
      ACTIVE: "Đang hoạt động",
      INACTIVE: "Ngừng hoạt động",
      SOLD: "Đã bán",
      RENTED: "Đã cho thuê",
    };
    return labels[status] || status;
  };

  if (!id || error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error || "Không tìm thấy tin đăng"}
          </h1>
          <Button onClick={() => navigate("/broker/properties")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
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
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy tin đăng</h1>
          <Button onClick={() => navigate("/broker/properties")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/broker/properties")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/broker/properties/${listing.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/listings/${listing.id}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem trên sàn
            </Button>
          </div>
        </div>

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

            {/* Title, Status and Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-foreground flex-1">{listing.title}</h1>
                <Badge variant="outline" className="text-base">
                  {getStatusLabel(listing.status)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
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

            {/* Status Management */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-lg font-semibold mb-4">Quản lý trạng thái</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái tin đăng</label>
                  <Select 
                    value={listing.status} 
                    onValueChange={updateListingStatus}
                    disabled={actionLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Chờ duyệt</SelectItem>
                      <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
                      <SelectItem value="SOLD">Đã bán</SelectItem>
                      <SelectItem value="RENTED">Đã cho thuê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {actionLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang cập nhật...</span>
                  </div>
                )}
              </div>
            </Card>

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
                        <p className="font-medium text-foreground">
                          {contactInfo.phone || 'N/A'}
                        </p>
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
      </div>
    </div>
  );
};

export default BrokerPropertyDetail;
