"use client";

import { useState, useEffect } from "react";   
import { Timeline } from "@/components/ui/timeline";
import { Star, Wallet, Ticket, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./ChatBox";
import { ArrowLeft } from "lucide-react";



/* const TRIP_DATA = {
  destination: "Kolkata",
  duration: "6 Days",
  origin: "Mumbai",
  budget: "Luxury",
  group_size: "2",
  hotels: [
    {
      hotel_name: "The Oberoi Grand Kolkata",
      hotel_address:
        "15, Jawaharlal Nehru Rd, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700013",
      price_per_night: "$300 - $500",
      hotel_image_url: "https://example.com/oberoi_grand.jpg",
      geo_coordinates: { latitude: 22.5631, longitude: 88.3593 },
      rating: 4.7,
      description:
        "A historic luxury hotel with elegant rooms, a spa, and multiple dining options.",
    },
    {
      hotel_name: "ITC Sonar, a Luxury Collection Hotel, Kolkata",
      hotel_address:
        "JBS Haldane Avenue, East Metropolitan Bypass, Kolkata, West Bengal 700046",
      price_per_night: "$250 - $450",
      hotel_image_url: "https://example.com/itc_sonar.jpg",
      geo_coordinates: { latitude: 22.5368, longitude: 88.3983 },
      rating: 4.6,
      description:
        "A luxurious hotel with landscaped gardens, a swimming pool, and exquisite dining experiences.",
    },
  ],
 /* itinerary: [
    {
      day: 1,
      day_plan: "Arrival in Kolkata and exploring Victoria Memorial.",
      best_time_to_visit_day: "Morning to Afternoon",
      activities: [
        {
          place_name: "Victoria Memorial",
          place_details:
            "A grand marble building dedicated to Queen Victoria, housing a museum with British Raj artifacts.",
          place_image_url: "https://example.com/victoria_memorial.jpg",
          geo_coordinates: { latitude: 22.5448, longitude: 88.3426 },
          place_address:
            "Victoria Memorial Hall, 1, Queens Way, Kolkata, West Bengal 700071",
          ticket_pricing: "$8 for foreigners, $0.30 for Indians",
          time_travel_each_location: "30 minutes from hotel",
          best_time_to_visit: "10:00 AM - 5:00 PM",
        },
      ],
    },
  ],
}; */

const Itinerary = () => {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  useEffect(() => {
    tripDetailInfo && setTripData(tripDetailInfo);
  }, [tripDetailInfo]);

  const data = tripData
    ? [
        {
          title: "Hotels",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData?.hotels.map((hotel, index) => (
                <HotelCardItem key={index} hotel={hotel} />
              ))}
            </div>
          ),
        },
        ...tripData?.itinerary.map((dayData) => ({
          title: `Day ${dayData?.day}`,
          content: (
            <div>
              <p>Best Time : {dayData?.best_time_to_visit_day}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayData?.activities.map((activity, index) => (
                  <PlaceCardItem key={index} activity={activity} />
                ))}
              </div>
            </div>
          ),
        })),
      ]
    : [];

  return (
    <div className="relative w-full h-[83vh] overflow-auto">
      {tripData && <Timeline data={data} tripData={tripData} />}
      :
      <div>
      <h2 className="absolute left-20 bottom-5 flex items-center gap-2 text-3xl text-white">
      <ArrowLeft /> Getting to Know You to build perfect trip here....
      </h2>
      <Image src={'/travel.png'} alt='travel' width={'800'}
      height={800}
      className='w-full h-full object-cover rounded-3xl'
      />
     
      </div>


    </div>
  );
};

export default Itinerary;
