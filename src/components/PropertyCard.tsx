import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, ShowerHead, Maximize2, Heart } from "lucide-react";
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
    <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-md cursor-pointer" onClick={handleViewDetails}>
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>
        <Badge
          className={`absolute top-3 left-3 text-xs font-medium ${
            status === "Bán"
              ? "bg-foreground/80 text-background hover:bg-foreground/80"
              : "bg-accent text-accent-foreground hover:bg-accent"
          }`}
        >
          {status}
        </Badge>
      </div>

      <CardContent className="p-3.5 md:p-4">
        <h3 className="font-semibold text-sm md:text-base mb-1.5 line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {bedrooms && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{bedrooms} PN</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1">
              <ShowerHead className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{bathrooms} WC</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{area}m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          <p className="text-lg md:text-xl font-bold text-primary">{price}</p>
          <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {type}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
