import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComingSoonOverlay } from "@/components/portal/ComingSoonOverlay";

export default function PortalProperties() {
  const navigate = useNavigate();

  return (
    <ComingSoonOverlay>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý tin đăng</h1>
            <p className="text-muted-foreground">Quản lý các tin đăng bất động sản của bạn</p>
          </div>
          <Button onClick={() => navigate("/portal/properties/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Đăng tin mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tin đăng của bạn</CardTitle>
            <CardDescription>Xem và quản lý tất cả các tin đăng</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Danh sách tin đăng sẽ hiển thị tại đây
            </p>
          </CardContent>
        </Card>
      </div>
    </ComingSoonOverlay>
  );
}
