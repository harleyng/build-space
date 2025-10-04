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
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
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

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={handleViewDetails}>
          {title}
        </h3>
        <p className="text-2xl font-bold text-primary mb-3">{price}</p>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms} PN</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms} WC</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{area}m²</span>
          </div>
        </div>

        {prominentFeatures && prominentFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prominentFeatures.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-xs">
          {type}
        </Badge>
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleViewDetails}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};
