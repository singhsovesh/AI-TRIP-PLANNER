"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useMutation } from "convex/react";
import { Loader, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";

import { useTripDetail, useUserDetail } from "@/app/provider";

import { v4 as uuidv4 } from "uuid";
import BudgetUi from "./BudgetUi";
import EmptyBoxState from "./EmptyBoxState";
import { FinalUi } from "./FinalUi";
import GroupSizeUi from "./GroupSizeUi";
import { SelectDaysUi } from "./SelectDaysUi";
import Image from "next/image";


type ChatMessage = {
  role: string;
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary;
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const triggeredFinalRef = useRef(false);

  const saveTripDetail = useMutation(api.tripDetail.createTripDetail);
  const { userDetail } = useUserDetail();

  const tripCtx = useTripDetail();
   if (!tripCtx) {
  throw new Error("ChatBox must be wrapped in <Provider>");
}

const { tripDetailInfo, setTripDetailInfo } = tripCtx;

const onSend = async (forceFinal: boolean = false) => {
  if (!userInput?.trim() || isWaiting) return;

  setLoading(true);
  setIsWaiting(true);

  const currentInput = userInput.trim();
  setUserInput("");

  // ✅ Always plain JSON-safe object
  const newMsg: ChatMessage = { 
    role: "user", 
    content: currentInput 
  };

  // update UI immediately
  setMessages((prev) => [...prev, newMsg]);

  try {
    // ✅ make sure only safe data is sent
    const safeHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const result = await axios.post("/api/aimodel", {
      messages: [...safeHistory, newMsg],
      isFinal: forceFinal || isFinal,
    });

    if ((forceFinal || isFinal) && userDetail?._id) {
      setTripDetailInfo(result?.data?.trip_plan);
      const tripId = uuidv4();
      await saveTripDetail({
        tripDetail: result?.data?.trip_plan,
        tripId,
        uid: userDetail._id,
      });
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: result?.data?.resp || "I'm not sure how to respond to that.",
        ui: result?.data?.ui,
      },
    ]);
  } catch (error: any) {
    console.error("API Error:", error);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Error generating trip", ui: "final" },
    ]);
  } finally {
    setLoading(false);
    setTimeout(() => setIsWaiting(false), 1000);
  }
};


  const safeHotels = useMemo(() => {
    const original = tripDetailInfo?.hotels || [];
    return original.map((h) => {
      let safeUrl = h.hotel_image_url || "/hotel-placeholder.png";
  
      // 🚨 Block example.com images
      if (safeUrl.includes("example.com")) {
        safeUrl = "/hotel-placeholder.png"; // fallback to local placeholder
      }
  
      return {
        ...h,
        hotel_image_url: safeUrl,
      };
    });
  }, [tripDetailInfo]);

  const RenderGenerativeUi = ({ ui }: { ui?: string }) => {
    if (!ui) return null;
    const normalizedUi = ui.toLowerCase();
    if (normalizedUi === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v) => {
            // Save user choice as a message
            setMessages((prev) => [
              ...prev,
              { role: "user", content: v },
            ]);
    
           
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `Great! I've set a ${v.toLowerCase()} budget for your trip to ${
                  tripDetailInfo?.destination || "your chosen destination"
                }. I now have almost everything I need to start planning. 
    Just confirm if you have any special requirements or preferences — for example, specific activities or accessibility needs.`,
              },
            ]);
          }}
        />
      );
 
    }else if (normalizedUi === "groupsize") {
      return (
        <GroupSizeUi
          onSelectedOption={(v) => {
            setUserInput(v);
            onSend();
          }}
        />
      );
    } else if (normalizedUi === "tripduration") {
      return (
        <SelectDaysUi
          onSelectedOption={(v) => {
            setUserInput(v);
            onSend();
          }}
        />
      );
    } else if (normalizedUi === "final") {
      return (
        <div>
          <FinalUi disabled={!tripDetailInfo} />

          {safeHotels.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Recommended Hotels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safeHotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg shadow-sm overflow-hidden"
                  >
                    <Image
                      src={hotel.hotel_image_url}
                      alt={hotel.hotel_name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-bold">{hotel.hotel_name}</h3>
                      <p className="text-sm text-gray-600">
                        {hotel.hotel_address}
                      </p>
                      <p className="text-green-600 font-medium">
                        {hotel.price_per_night}
                      </p>
                      <p className="text-sm">{hotel.description}</p>
                      <p className="text-yellow-600">⭐ {hotel.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !triggeredFinalRef.current) {
      triggeredFinalRef.current = true;
      setIsFinal(true);
      onSend(true);
    }
  }, [messages]);

  return (
    <div className="h-[85vh] flex flex-col border shadow rounded-2xl p-5 ">
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v) => {
            setUserInput(v);
            setTimeout(() => onSend(), 100);
          }}
        />
      )}

      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div className="flex justify-end mt-4" key={index}>
              <div className="max-w-lg bg-blue-600 text-white px-4 py-2 rounded-lg rounded-br-none">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start mt-4" key={index}>
             <div className="max-w-full md:max-w-lg break-words bg-gray-100 text-black px-4 py-2 rounded-lg rounded-bl-none">
            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
             {msg.ui && <RenderGenerativeUi ui={msg.ui} />}
            </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start mt-4">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg rounded-bl-none flex items-center">
              <Loader className="animate-spin h-5 w-5 mr-2" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </section>

      <section className="p-4 border-t">
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Start Typing here..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={loading || isWaiting}
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6"
            onClick={onSend}
            disabled={loading || isWaiting || !userInput?.trim()}
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
