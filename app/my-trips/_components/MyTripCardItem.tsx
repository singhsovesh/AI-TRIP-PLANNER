import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Trip } from './types';
import Link from 'next/link';   
type Props = {
  trip: Trip;
};

function MyTripCardItem({ trip }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  const GetGooglePlaceDetail = async () => {
    try {
      const placeName = trip?.tripDetail?.destination;
      if (!placeName) return;

      const result = await axios.post("/api/google-place-detail", {
        placeName,
      });

      if (!result?.data) return;

      setPhotoUrl(result.data);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    if (trip?.tripDetail?.destination) {
      GetGooglePlaceDetail();
    }
  }, [trip]);

  return (
    <Link
      href={`/view-trip/${trip?.tripId}`}
      className="p-4 border rounded-lg mb-3 flex flex-col items-start gap-2"
    >
      <Image
        src={photoUrl || "/placeholder.jpg"}
        alt={trip?.tripId || "trip image"}
        width={400}
        height={400}
        className="rounded-xl object-cover"
      />
      <h2 className="text-lg font-semibold mt-2">
        {trip?.tripDetail?.destination}
      </h2>
      <h2 className="text-gray-500">
        {trip?.tripDetail?.duration} Trip with {trip?.tripDetail?.budget} Budget
      </h2>
    </Link>   
  );
}

export default MyTripCardItem;
