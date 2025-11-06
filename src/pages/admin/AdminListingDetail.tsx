import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useListingContact } from "@/hooks/useListingContact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { AmenitiesDisplay } from "@/components/listings/AmenitiesDisplay";
import { FeesTable } from "@/components/listings/FeesTable";
import { LocationMap } from "@/components/listings/LocationMap";
import { 
  Bed, Bath, Maximize, MapPin, Phone, Mail, User, Eye, 
  ArrowLeft, ExternalLink, Check, X, Power, Loader2, Building2, Calendar 
} from "lucide-react";
import { LISTING_STATUSES, PURPOSES } from "@/constants/listing.constants";
import { formatPrice, formatDate } from "@/utils/formatters";

const AdminListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: contactData, isLoading: contactLoading } = useListingContact(id || "");
  const contactInfo = contactData?.contact_info || null;

  useEffect(() => {
    if (isAdmin) {
      fetchListing();
    }
  }, [isAdmin, id]);

  const fetchListing = async () => {
    if (!id) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select(`
          *,
          profiles:user_id (
            email,
            name
          )
        `)
        .eq("id", id)
        .single();

      if (listingError) throw listingError;

      if (!listingData) {
        setError("Không tìm thấy tin đăng");
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

  const updateListingStatus = async (newStatus: "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "SOLD" | "RENTED") => {
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

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (!id || error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error || "Không tìm thấy tin đăng"}
          </h1>
          <Button onClick={() => navigate("/admin/properties")} className="mt-4">
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
          <Button onClick={() => navigate("/admin/properties")} className="mt-4">
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
  const coordinates = listing.coordinates || {};
  const customAttributes = listing.custom_attributes || {};
  const amenities = customAttributes.amenities || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/properties")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open(`/listings/${listing.id}`, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Xem trên sàn
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Management Info Card */}
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-lg font-semibold mb-4">Thông tin quản lý</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Người đăng</p>
                  <p className="font-medium">{listing.profiles?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{formatDate(listing.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật</p>
                  <p className="font-medium">{formatDate(listing.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                  <p className="font-medium">{listing.views_count || 0}</p>
                </div>
              </div>
            </Card>

            {/* Image Gallery */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hình ảnh ({images.length})</h2>
              <ImageGallery images={images} title={listing.title} />
            </Card>

            {/* Title, Status and Price */}
            <Card className="p-6">
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
            </Card>

            {/* Admin Actions */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-lg font-semibold mb-4">Quản lý trạng thái</h2>
              <div className="flex flex-wrap gap-2">
                {(listing.status === "PENDING_APPROVAL" || listing.status === "DRAFT") && (
                  <>
                    <Button
                      onClick={() => updateListingStatus("ACTIVE")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Duyệt
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateListingStatus("INACTIVE")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <X className="mr-2 h-4 w-4" />
                      )}
                      Từ chối
                    </Button>
                  </>
                )}

                {listing.status === "ACTIVE" && (
                  <Button
                    variant="outline"
                    onClick={() => updateListingStatus("INACTIVE")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="mr-2 h-4 w-4" />
                    )}
                    Ngừng hoạt động
                  </Button>
                )}

                {listing.status === "INACTIVE" && (
                  <Button
                    variant="outline"
                    onClick={() => updateListingStatus("ACTIVE")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="mr-2 h-4 w-4" />
                    )}
                    Kích hoạt
                  </Button>
                )}
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Loại giao dịch</span>
                  <span className="font-medium">{purposeLabel}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Loại BĐS</span>
                  <span className="font-medium">{propertyTypeName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Diện tích</span>
                  <span className="font-medium">{listing.area} m²</span>
                </div>
                {listing.project_name && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Dự án</span>
                    <span className="font-medium">{listing.project_name}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Address & Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Địa chỉ & vị trí</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">{addressText || "Chưa có thông tin địa chỉ"}</p>
                </div>
                
                {listing.building_name && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tòa nhà</p>
                      <p className="font-medium">{listing.building_name}</p>
                    </div>
                  </div>
                )}
                
                {listing.apartment_floor_info && (
                  <div className="pl-8">
                    <p className="text-sm text-muted-foreground">Thông tin tầng</p>
                    <p className="font-medium">{listing.apartment_floor_info}</p>
                  </div>
                )}
                
                {coordinates.lat && coordinates.lng && (
                  <div className="mt-4">
                    <LocationMap latitude={coordinates.lat} longitude={coordinates.lng} />
                  </div>
                )}
              </div>
            </Card>

            {/* Technical Specs - Same as BrokerPropertyDetail */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {listing.num_bedrooms && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Phòng ngủ</span>
                    <span className="font-medium">{listing.num_bedrooms}</span>
                  </div>
                )}
                {listing.num_bathrooms && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Phòng tắm</span>
                    <span className="font-medium">{listing.num_bathrooms}</span>
                  </div>
                )}
                {listing.num_floors && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Số tầng</span>
                    <span className="font-medium">{listing.num_floors}</span>
                  </div>
                )}
                {listing.floor_number && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Tầng số</span>
                    <span className="font-medium">{listing.floor_number}</span>
                  </div>
                )}
                {listing.house_direction && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Hướng nhà</span>
                    <span className="font-medium">{listing.house_direction}</span>
                  </div>
                )}
                {listing.balcony_direction && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Hướng ban công</span>
                    <span className="font-medium">{listing.balcony_direction}</span>
                  </div>
                )}
                {listing.land_direction && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Hướng đất</span>
                    <span className="font-medium">{listing.land_direction}</span>
                  </div>
                )}
                {listing.facade_width && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Mặt tiền</span>
                    <span className="font-medium">{listing.facade_width} m</span>
                  </div>
                )}
                {listing.depth && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Chiều sâu</span>
                    <span className="font-medium">{listing.depth} m</span>
                  </div>
                )}
                {listing.alley_width && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Độ rộng hẻm</span>
                    <span className="font-medium">{listing.alley_width} m</span>
                  </div>
                )}
                {listing.ceiling_height && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Chiều cao trần</span>
                    <span className="font-medium">{listing.ceiling_height} m</span>
                  </div>
                )}
                {listing.floor_load && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Tải trọng sàn</span>
                    <span className="font-medium">{listing.floor_load} kg/m²</span>
                  </div>
                )}
                {listing.legal_status && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Giấy tờ pháp lý</span>
                    <span className="font-medium">{listing.legal_status}</span>
                  </div>
                )}
                {listing.interior_status && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Tình trạng nội thất</span>
                    <span className="font-medium">{listing.interior_status}</span>
                  </div>
                )}
                {listing.land_type && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Loại đất</span>
                    <span className="font-medium">{listing.land_type}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tiện ích</h2>
                <AmenitiesDisplay amenities={amenities} />
              </Card>
            )}

            {/* Fees */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chi phí & phí</h2>
              <FeesTable 
                fees={customAttributes.fees} 
                serviceCosts={listing.service_costs}
              />
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mô tả chi tiết</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description || "Chưa có mô tả"}
              </p>
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
                          {!showPhone && contactInfo.phone && (
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
      </div>
    </div>
  );
};

export default AdminListingDetail;
