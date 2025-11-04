import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

// Component to handle map view updates
function MapViewController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  
  return null;
}

export const LocationMap = ({ latitude, longitude }: LocationMapProps) => {
  if (!latitude || !longitude) {
    return (
      <div className="w-full h-[300px] rounded-lg border bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Vui lòng chọn địa chỉ để hiển thị bản đồ</p>
      </div>
    );
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Vị trí trên bản đồ</h3>
      <div className="w-full h-[300px] rounded-lg border overflow-hidden">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <MapViewController center={position} />
        </MapContainer>
      </div>
    </div>
  );
};
