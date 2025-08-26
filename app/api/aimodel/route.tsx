import { NextRequest, NextResponse } from "next/server";
import arcjet from "@arcjet/next";
import { currentUser } from "@clerk/nextjs/server";


const aj = arcjet({
  key: process.env.ARCJET_KEY!, 
  rules: [
    {
      type: "TOKEN_BUCKET",
      refillRate: 5,   // tokens added per interval
      interval: "1m",  // interval length
      capacity: 10,    // max tokens
    },
  ],
});

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.  

Only ask questions about the following details in order, and wait for the user’s answer before asking the next:  
1. Starting location (source)  
2. Destination city or country  
3. Group size (Solo, Couple, Family, Friends)  
4. Budget (Low, Medium, High)  
5. Trip duration (number of days)  
6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)  
7. Special requirements or preferences (if any)  

Do not ask multiple questions at once, and never ask irrelevant questions.  
If any answer is missing or unclear, politely ask the user to clarify before proceeding.  
Always maintain a conversational, interactive style while asking questions.  

Along with each response, also send which UI component to display for generative UI (for example \`budget/groupsize/tripduration/final\`), where \`final\` means AI generating complete final output.  

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with the following schema:  

{
  "resp": "Text Response",
  "ui": "budget/groupsize/tripduration/final"
}
`;

const FINAL_PROMPT = `Generate Travel Plan with given details. Provide Hotels list (name, address, price, image url, geo coordinates, rating, description) and itinerary (places, details, image url, geo coordinates, address, ticket pricing, travel time, best time to visit).  

Return ONLY strict JSON in this schema:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": "number", "longitude": "number" },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": "number", "longitude": "number" },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}`;

export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();
  const user = await currentUser();

  const {has} = await auth();
  const hasPremiumAccess = has({ plan: 'monthly' })
  console.log("hasPremiumAccess",hasPremiumAccess)

  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress ?? "",
    requested: isFinal? 5 : 0
  });

  console.log(decision);
  if(decision?.reason?.remaining == 0 && !hasPremiumAccess ) {
  return NextResponse.json({
    resp: 'No Free Credit Remaining',
    ui: 'limit'
  })
  }

  try {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: isFinal ? FINAL_PROMPT : PROMPT }],
            },
            ...messages.map((msg: any) => ({
              role: msg.role === "assistant" ? "model" : "user",
              parts: [{ text: msg.content }],
            })),
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini Raw Response:", data);

    const textResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '{"resp":"Error","ui":"final"}';

    let parsed;
    try {
      parsed = JSON.parse(textResponse);
    } catch {
      parsed = { resp: "Error parsing response", ui: "final" };
    }

    if (parsed.ui) parsed.ui = parsed.ui.toLowerCase();

    if (parsed.trip_plan) {
      return NextResponse.json({
        resp: "Okay, I have all the information needed. Here’s your trip plan.",
        ui: "final",
        trip_plan: parsed.trip_plan,
      });
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
