import { suggestions } from "@/app/_components/Hero";

function EmptyBoxState({ onSelectOption }: any) {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl text-center">
        Start Planning New <strong className="text-primary">Trip</strong> using AI
      </h2>
      <p className="text-center text-gray-400 mt-2">
        ✨ "Discover personalized travel itineraries crafted just for you with the power of AI. 
        Whether you’re seeking hidden gems, iconic landmarks, or unique local experiences, our 
        planner curates trips that match your interests, budget, and travel style. From solo 
        adventures to family getaways, enjoy a seamless journey where every detail is tailored 
        to make your travel unforgettable."
      </p>

      <div className="flex flex-col gap-5 mt-7">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(suggestion.title)}
            className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary"
          >
            {suggestion.icon}
            <h2 className="text-lg">{suggestion.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmptyBoxState;
