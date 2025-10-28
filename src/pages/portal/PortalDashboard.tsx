import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Eye, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useKycStatus } from "@/hooks/useKycStatus";

export default function PortalDashboard() {
  const navigate = useNavigate();
  const { kycStatus, loading } = useKycStatus();

  const stats = [
    {
      title: "Tin đăng hoạt động",
      value: "12",
      change: "+2 tuần này",
      icon: Building,
    },
    {
      title: "Tổng lượt xem",
      value: "1,284",
      change: "+15% so với tháng trước",
      icon: Eye,
    },
    {
      title: "Khách hàng",
      value: "45",
      change: "+5 mới tháng này",
      icon: Users,
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "12.5%",
      change: "+2.3% so với tháng trước",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng đến với portal môi giới</p>
      </div>

      {/* KYC Status Alert */}
      {!loading && kycStatus !== "APPROVED" && (
        <Alert variant={kycStatus === "REJECTED" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {kycStatus === "PENDING_KYC" ? "Hồ sơ đang chờ duyệt" : 
             kycStatus === "REJECTED" ? "Hồ sơ bị từ chối" : 
             "Cần hoàn thành xác thực"}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {kycStatus === "PENDING_KYC" 
                ? "Hồ sơ của bạn đang được xem xét. Một số tính năng có thể bị hạn chế."
                : "Vui lòng hoàn thành đăng ký môi giới để sử dụng đầy đủ tính năng."}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/portal/profile")}
              className="ml-4"
            >
              {kycStatus === "NOT_APPLIED" ? "Đăng ký ngay" : "Xem hồ sơ"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các tác vụ phổ biến và lối tắt</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng sắp ra mắt</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
