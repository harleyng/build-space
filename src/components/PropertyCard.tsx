import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id?: string;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  type: string;
  status: "Bán" | "Cho thuê";
  prominentFeatures?: string[];
  attributes?: {
    houseDirection?: string;
    balconyDirection?: string;
    landDirection?: string;
    facadeWidth?: number;
    alleyWidth?: number;
    legalStatus?: string;
    interiorStatus?: string;
    floorNumber?: number;
    numFloors?: number;
    [key: string]: any;
  };
}

export const PropertyCard = ({
  id = "1",
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
  status,
  prominentFeatures,
  attributes,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleViewDetails = () => {
    navigate(`/listings/${id}`);
  };

  return (
    <Card className="group overflow-hidden border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        <img
          src={image}
          alt={title}
          className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </Button>
        <Badge
          className={`absolute top-3 left-3 ${
            status === "Bán"
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
          }`}
        >
          {status}
        </Badge>
      </div>

      <CardContent className="p-3 md:p-4">
        <h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={handleViewDetails}>
          {title}
        </h3>
        <p className="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3">{price}</p>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-2 md:mb-3">
          <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span className="text-xs md:text-sm line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 flex-wrap">
          {bedrooms && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bed className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{bedrooms} PN</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bath className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{bathrooms} WC</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 md:gap-1">
            <Square className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>{area}m²</span>
          </div>
        </div>

        {prominentFeatures && prominentFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
            {prominentFeatures.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 md:p-4 pt-0 flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5">
          {type}
        </Badge>
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleViewDetails}
          className="hover:bg-primary hover:text-primary-foreground transition-colors text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};
