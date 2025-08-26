"use client";

import { useState, useEffect } from "react";
import ChatBox from "./_components/ChatBox";
import Itinerary from "./_components/Itinerary";
import GlobalMap from "./_components/GlobalMap";
import { useTripDetail } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { Plane, Globe2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CreateNewTrip() {
  const tripDetail = useTripDetail();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    tripDetail?.setTripDetailInfo(null);
  }, []);

  if (!tripDetail) return null;

  const { tripDetailInfo, setTripDetailInfo } = tripDetail;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10">
      {/* Chatbox takes 2/3 width */}
      <div className="col-span-2">
        <ChatBox />
      </div>

      {/* Travel info/map takes 1/3 width */}
      <div className="col-span-3 relative">
        {activeIndex == 0 ? <Itinerary /> : <GlobalMap />}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"lg"} className='bg-black hover:bg-gray-700'
              onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
              className="absolute bg-black  bottom-10 left-[50%]"
            >
              {activeIndex == 0 ? <Plane /> : <Globe2 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch Between Map and Trip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default CreateNewTrip;
