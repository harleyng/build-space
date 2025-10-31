import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export const LocationMap = ({ latitude, longitude }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    // Initialize map only once
    if (!map.current) {
      // Use a public Mapbox token or handle token requirement
      mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTR3dTQwcjMwZmFlMmpzYjE2NXNlbDl5In0.OkYt_kL0lRWLHWzgFzXYGg';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: 15,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    // Update marker position
    if (marker.current) {
      marker.current.setLngLat([longitude, latitude]);
    } else {
      marker.current = new mapboxgl.Marker({ color: "#E61E4D" })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Pan to new location
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      essential: true,
    });
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Vị trí trên bản đồ</h3>
      <div
        ref={mapContainer}
        className="w-full h-[300px] rounded-lg border border-border"
      />
    </div>
  );
};
