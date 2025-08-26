import { Button } from '@/components/ui/button';
import { Globe2, Plane } from 'lucide-react';

// Added export keyword to make this component available for import
export function FinalUi({ viewTrip, disable }: any) {
    return (
        <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-lg'>
            <div className="flex items-center justify-center mb-4">
                <Plane className="text-primary h-8 w-8 mr-2" />
                <Globe2 className="text-primary h-8 w-8" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-primary flex items-center">
                <Plane className="mr-2 h-5 w-5" />
                Planning your dream trip...
            </h2>
            <p className="text-gray-500 text-sm text-center mt-1">
                Gathering best destinations, activities, and travel details for you.
            </p>
            <Button disabled={disable} onClick={viewTrip} className="mt-4 w-full"> 
                View Trip 
            </Button>
        </div>
    )
}
