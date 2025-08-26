import { createContext } from "react";
import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";

export type TripContextType={
    tripDetailInfo:TripInfo,
    setTripDetailInfo:React.Dispatch<React.SetStateAction<TripInfo | null>>;
}

export const TripDetailContext=createContext<TripContextType|undefined>(undefined);