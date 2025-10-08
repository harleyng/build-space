import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Eye, Power, Check } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface UserListing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  price_unit: string;
  purpose: string;
  status: string;
  property_type_slug: string;
  address: any;
  area: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const MyListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPurpose, setFilterPurpose] = useState<string>("all");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user's listings
  useEffect(() => {
    if (!session) return;
    fetchListings();
  }, [session, filterStatus, filterPurpose]);

  const fetchListings = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus as any);
      }
      if (filterPurpose !== "all") {
        query = query.eq("purpose", filterPurpose);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (listingId: string, newStatus: "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "SOLD_RENTED") => {
    setActionLoading(listingId);
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", listingId)
        .eq("user_id", session?.user.id); // Ensure user owns the listing

      if (error) throw error;

      toast({
        title: "Cập nhật thành công",
        description: `Trạng thái tin đăng đã được cập nhật`,
      });

      fetchListings();
    } catch (error: any) {
      toast({
        title: "Lỗi cập nhật",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteListing = async () => {
    if (!listingToDelete) return;

    setActionLoading(listingToDelete);
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingToDelete)
        .eq("user_id", session?.user.id); // Ensure user owns the listing

      if (error) throw error;

      toast({
        title: "Xóa thành công",
        description: "Tin đăng đã được xóa",
      });

      fetchListings();
    } catch (error: any) {
      toast({
        title: "Lỗi xóa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const formatPrice = (price: number, priceUnit: string) => {
    if (priceUnit === "PER_MONTH") {
      return `${(price / 1000000).toLocaleString('vi-VN')} triệu/tháng`;
    }
    const priceInBillions = price / 1000000000;
    if (priceInBillions >= 1) {
      return `${priceInBillions.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
    }
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: "Bản nháp", variant: "secondary" as const },
      PENDING_APPROVAL: { label: "Chờ duyệt", variant: "default" as const },
      ACTIVE: { label: "Đang hoạt động", variant: "default" as const },
      INACTIVE: { label: "Ngừng hoạt động", variant: "secondary" as const },
      SOLD_RENTED: { label: "Đã bán/thuê", variant: "secondary" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "default" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Quản lý tin đăng của tôi</h1>
              <p className="text-muted-foreground mt-1">
                Xem và quản lý tất cả tin đăng bất động sản của bạn
              </p>
            </div>
            <Button onClick={() => navigate("/submit-listing")}>
              <Plus className="mr-2 h-4 w-4" />
              Đăng tin mới
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filterStatus">Trạng thái</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="filterStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Chờ duyệt</SelectItem>
                      <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
                      <SelectItem value="SOLD_RENTED">Đã bán/thuê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filterPurpose">Mục đích</Label>
                  <Select value={filterPurpose} onValueChange={setFilterPurpose}>
                    <SelectTrigger id="filterPurpose">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="FOR_SALE">Bán</SelectItem>
                      <SelectItem value="FOR_RENT">Cho thuê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listings */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {filterStatus !== "all" || filterPurpose !== "all"
                    ? "Không tìm thấy tin đăng nào với bộ lọc này."
                    : "Bạn chưa có tin đăng nào."}
                </p>
                <Button onClick={() => navigate("/submit-listing")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Đăng tin mới
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {listing.image_url ? (
                          <img
                            src={listing.image_url}
                            alt={listing.title}
                            className="w-48 h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">Không có ảnh</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
                            <div className="flex gap-2 items-center">
                              {getStatusBadge(listing.status)}
                              <Badge variant="outline">
                                {listing.purpose === "FOR_SALE" ? "Bán" : "Cho thuê"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(listing.price, listing.price_unit)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {listing.area} m²
                            </p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {listing.description}
                        </p>

                        <p className="text-sm text-muted-foreground mb-4">
                          📍 {listing.address?.district || "Chưa cập nhật"}
                          {listing.address?.province && `, ${listing.address.province}`}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/listings/${listing.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/submit-listing?edit=${listing.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Button>

                          {listing.status === "ACTIVE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateListingStatus(listing.id, "INACTIVE")}
                              disabled={actionLoading === listing.id}
                            >
                              {actionLoading === listing.id ? (
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
                              size="sm"
                              onClick={() => updateListingStatus(listing.id, "PENDING_APPROVAL")}
                              disabled={actionLoading === listing.id}
                            >
                              {actionLoading === listing.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Power className="mr-2 h-4 w-4" />
                              )}
                              Kích hoạt lại
                            </Button>
                          )}

                          {(listing.status === "ACTIVE" || listing.status === "INACTIVE") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateListingStatus(listing.id, "SOLD_RENTED")}
                              disabled={actionLoading === listing.id}
                            >
                              {actionLoading === listing.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              Đã bán/thuê
                            </Button>
                          )}

                          {(listing.status === "PENDING_APPROVAL" || listing.status === "DRAFT") && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setListingToDelete(listing.id);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={actionLoading === listing.id}
                            >
                              {actionLoading === listing.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Xóa
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setListingToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteListing} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;
