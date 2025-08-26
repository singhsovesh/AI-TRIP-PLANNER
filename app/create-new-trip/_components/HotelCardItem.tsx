"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Hotel } from "./ChatBox";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import axios from "axios";

type Props = {
  hotel: Hotel;
};

function HotelCardItem({ hotel }: Props) {

  const [photoUrl, setPhotoUrl] = useState<string>();
  const GetGooglePlaceDetail = async () => {
    try {
      const result = await axios.post("/api/google-place-detail", {
        placeName: hotel?.hotel_name,
      });

      if (result?.data?.e) {
        return;
      }

      setPhotoUrl(result?.data); 
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    if (hotel) {
      GetGooglePlaceDetail();
    }
  }, [hotel]);

  return (
    <div className="border rounded-xl shadow-md p-3 hover:shadow-lg transition">
      <Image
        src={photoUrl ? photoUrl : "/placeholder.jpg"}
        width={400}
        height={200}
        alt={hotel?.hotel_name}
        className="object-cover rounded-xl"
      />
      <h2 className="font-semibold text-lg mt-2">{hotel?.hotel_name}</h2>
      <p className="text-gray-500 line-clamp-2">{hotel?.hotel_address}</p>
      <p className="text-blue-500 font-medium">⭐ {hotel?.rating}</p>
      <Link
        href={
          "https://www.google.com/maps/search/?api=1&query=" + hotel?.hotel_name
        }
        target="_blank"
      >
        <Button size="sm" variant="outline" className="w-full mt-2">
          View <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

export default HotelCardItem;
