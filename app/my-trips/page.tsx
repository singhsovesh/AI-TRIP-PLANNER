"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserDetail } from "../provider";
import MyTripCardItem from "./_components/MyTripCardItem";

export type TripInfo = {
  destination: string;
  [key: string]: any; 
};

export type Trip = {
  tripId: any;
  tripDetail: TripInfo;
  _id: string;
};

function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { userDetail } = useUserDetail();
  const convex = useConvex();

  const GetUserTrip = async () => {
    if (!userDetail?._id) return;

    const result = await convex.query(api.tripDetail.GetUserTrips, {
      uid: userDetail._id,
    });

    console.log("Fetched trips:", result);
    setTrips(result || []); 
  };

  useEffect(() => {
    if (userDetail) {
      GetUserTrip();
    }
  }, [userDetail]);

  return (
    <div className="px-10 p-10 md:px-24 lg:px-48">
      <h2 className="font-bold text-3xl">My Trips</h2>

      {trips.length === 0 && (
        <div className="p-7 border flex flex-col items-center justify-center gap-5 mt-6">
          <h2>You don't have any trip plan created!</h2>

          <Link href="/create-new-trip">
            <Button>Create New Trip</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {trips.map((trip, index) => (
          <MyTripCardItem trip={trip} key={index} />
        ))}
      </div>
    </div>
  );
}

export default MyTripsPage;
