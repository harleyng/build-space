import { ArrowRight, Gavel, MapPin, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import apartmentSample from "@/assets/apartment-sample.jpg";
import houseSample from "@/assets/house-sample.jpg";
import penthouseSample from "@/assets/penthouse-sample.jpg";

interface AuctionItem {
  id: string;
  image: string;
  title: string;
  location: string;
  area: number;
  startingPrice: string;
  bidStep: string;
}

const auctionItems: AuctionItem[] = [
  {
    id: "a1",
    image: apartmentSample,
    title: "Căn hộ cao cấp tại Thảo Điền, Quận 2",
    location: "Thảo Điền, Quận 2, TP.HCM",
    area: 120,
    startingPrice: "3.000.000.000",
    bidStep: "50 triệu",
  },
  {
    id: "a2",
    image: houseSample,
    title: "Nhà phố 3 tầng khu dân cư Phú Mỹ Hưng",
    location: "Phú Mỹ Hưng, Quận 7, TP.HCM",
    area: 150,
    startingPrice: "3.800.000.000",
    bidStep: "50 triệu",
  },
  {
    id: "a3",
    image: penthouseSample,
    title: "Đất nền 500m² tại Bình Dương",
    location: "Bình Dương",
    area: 500,
    startingPrice: "1.500.000.000",
    bidStep: "50 triệu",
  },
];

export const AuctionSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gavel className="h-5 w-5 md:h-6 md:w-6 text-foreground" strokeWidth={1.5} />
              <h2 className="text-xl md:text-3xl font-bold text-foreground">
                Phiên đấu giá nổi bật
              </h2>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Các bất động sản đang diễn ra phiên đấu giá với cơ hội mua với giá tốt nhất
            </p>
          </div>
          <Link to="/listings?purpose=auction" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {auctionItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow group">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-foreground/80 text-background hover:bg-foreground/80 text-xs">
                  <Gavel className="h-3 w-3 mr-1" strokeWidth={1.5} />
                  Sắp diễn ra
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 text-foreground leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs line-clamp-1">{item.location}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground mb-3">
                  <Maximize2 className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs">{item.area} m²</span>
                </div>

                <div className="bg-secondary/60 rounded-lg p-3 mb-3">
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5">Giá khởi điểm</p>
                  <p className="text-lg md:text-xl font-bold text-primary">
                    {item.startingPrice} <span className="text-xs font-normal text-muted-foreground">đ</span>
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                    Bước nhảy: <span className="font-semibold text-foreground">{item.bidStep} đ</span>
                  </p>
                </div>

                <Button className="w-full h-9 bg-foreground hover:bg-foreground/90 text-background text-sm">
                  Đăng ký tham gia
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link to="/listings?purpose=auction">
            <Button variant="outline" size="sm">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
