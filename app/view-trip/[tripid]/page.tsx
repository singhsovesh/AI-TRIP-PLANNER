"use client";

import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import type { Trip } from '@/app/my-trips/page';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTripDetail, useUserDetail } from './../../provider';
import GlobalMap from '@/app/create-new-trip/_components/GlobalMap';  

function ViewTrip() {
  const { tripid } = useParams();
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [tripData, setTripData] = useState<Trip>();
  const { setTripDetailInfo } = useTripDetail();

  const GetTrip = async () => {
    const result = await convex.query(api.tripDetail.GetTripById, {
      uid: userDetail?._id,
      tripid: tripid + '',
    });

    console.log("Fetched trip:", result);

    setTripData(result);
    setTripDetailInfo(result?.tripDetail);

    return result;
  };

  useEffect(() => {
    if (userDetail?._id && tripid) {
      GetTrip();
    }
  }, [userDetail, tripid]);

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3">
        <Itinerary />
      </div>
      <div className="col-span-2">
        <GlobalMap /> 
      </div>
    </div>
  );
}

export default ViewTrip;
