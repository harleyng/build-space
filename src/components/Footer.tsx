import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">BĐS Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng giao dịch bất động sản hàng đầu Việt Nam
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Quy chế hoạt động</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Đăng tin</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Tư vấn</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Định giá BĐS</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Hỗ trợ pháp lý</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@bds.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BĐS Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
