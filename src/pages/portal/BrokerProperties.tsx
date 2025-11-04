import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Eye, Edit, Trash2, Loader2, ExternalLink } from "lucide-react";
import { ComingSoonOverlay } from "@/components/portal/ComingSoonOverlay";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ListingStatus } from "@/types/listing.types";
import { formatPrice, formatAddress } from "@/utils/formatters";
import { LISTING_STATUSES, PURPOSES } from "@/constants/listing.constants";

export default function BrokerProperties() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [purposeFilter, setPurposeFilter] = useState<string>("ALL");
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [statusFilter, purposeFilter]);

  const fetchListings = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let query = supabase
      .from("listings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (statusFilter !== "ALL") {
      query = query.eq("status", statusFilter as any);
    }

    if (purposeFilter !== "ALL") {
      query = query.eq("purpose", purposeFilter as any);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tin đăng",
        variant: "destructive",
      });
    } else {
      setListings(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteListingId) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", deleteListingId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin đăng",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Đã xóa tin đăng",
      });
      fetchListings();
    }

    setDeleteListingId(null);
  };

  return (
    <ComingSoonOverlay>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý tin đăng</h1>
            <p className="text-muted-foreground">Quản lý các tin đăng bất động sản của bạn</p>
          </div>
          <Button onClick={() => navigate("/broker/properties/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Đăng tin mới
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {Object.entries(LISTING_STATUSES).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={purposeFilter} onValueChange={setPurposeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Mục đích" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả mục đích</SelectItem>
              {Object.entries(PURPOSES).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Chưa có tin đăng nào</p>
              <Button onClick={() => navigate("/broker/properties/new")} className="mt-4">
                Tạo tin đăng đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {listing.image_url && (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatAddress(listing.address)}
                          </p>
                        </div>
                        <StatusBadge status={listing.status as ListingStatus} />
                      </div>
                      <p className="text-primary font-semibold mb-2">
                        {formatPrice(listing.price, listing.price_unit)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Diện tích: {listing.area} m²
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => navigate(`/broker/properties/${listing.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/listings/${listing.id}`, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Xem trên sàn
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/broker/properties/${listing.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteListingId(listing.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteListingId} onOpenChange={() => setDeleteListingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ComingSoonOverlay>
  );
}
