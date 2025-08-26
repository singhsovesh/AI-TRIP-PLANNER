import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function SelectDaysUi({ onSelectedOption }: { onSelectedOption: (v: string) => void }) {
    return (
        <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-lg'>
            <Calendar className="text-primary h-12 w-12 mb-4" />
            <h2 className="mt-3 text-lg font-semibold text-primary flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                How many days do you want to travel?
            </h2>
            <p className="text-gray-500 text-sm text-center mt-1">
                Enter the number of days for your trip.
            </p>
            <input 
                type="number" 
                min="1"
                className="mt-4 p-2 border rounded-md w-full"
                placeholder="e.g., 7"
                onChange={(e) => onSelectedOption(e.target.value)}
            />
            <Button 
                onClick={() => onSelectedOption("continue")} 
                className="mt-4 w-full"
            > 
                Continue 
            </Button>
        </div>
    )
}