"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "./ChatBox";
import axios from "axios";

type Props = {
  activity: Activity;
};

function PlaceCardItem({ activity }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  const GetGooglePlaceDetail = async () => {
    try {
      const result = await axios.post("/api/google-place-detail", {
        placeName: activity?.place_name + ":" + activity?.place_address,
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
    if (activity) {
      GetGooglePlaceDetail();
    }
  }, [activity]); 

  return (
    <div>
      <Image
        src={photoUrl ? photoUrl : "/placeholder.jpg"}
        width={400}
        height={200}
        alt={activity.place_name}
        className="object-cover rounded-xl"
      />
      <h2 className="font-semibold text-lg">{activity?.place_name}</h2>
      <p className="text-gray-500 line-clamp-2">{activity?.place_details}</p>
      <h2 className="flex gap-2 text-blue-500 line-clamp-1">
        <Ticket /> {activity?.ticket_pricing}
      </h2>
      <p className="flex text-orange-400 gap-2 line-clamp-1">
        <Clock /> {activity?.best_time_to_visit}
      </p>
      <Link
        href={
          "https://www.google.com/maps/search/?api=1&query=" +
          activity?.place_name
        }
        target="_blank"
      >
        <Button size={"sm"} variant={"outline"} className="w-full mt-2">
          View <ExternalLink />
        </Button>
      </Link>
    </div>
  );
}

export default PlaceCardItem;
