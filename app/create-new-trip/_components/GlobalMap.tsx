"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { useTripDetail } from "./../../provider";

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); 
  const { tripDetailInfo } = useTripDetail();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";

    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 1.5,
      projection: "globe",
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !tripDetailInfo) return;

    tripDetailInfo?.itinerary?.forEach((itinerary: any) => {
      itinerary.activity?.forEach((activity: any) => {
        if (
          activity?.geo_coordinates?.longitude &&
          activity?.geo_coordinates?.latitude
        ) {
          new mapboxgl.Marker({ color: "red" })
            .setLngLat([
              activity.geo_coordinates.longitude,
              activity.geo_coordinates.latitude,
            ])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name)
            )
            .addTo(mapRef.current!);

         
          const coordinates = [
            activity.geo_coordinates.longitude,
            activity.geo_coordinates.latitude,
          ] as [number, number];

          mapRef.current.flyTo({
            center: coordinates,
            zoom: 7,
            essential: true,
          });
        }
      });
    });
  }, [tripDetailInfo]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{
          width: "95%",
          height: "85vh",
          borderRadius: 20,
        }}
      />
    </div>
  );
}

export default GlobalMap;
