'use client';

import { MapPin, Wrench, AlertTriangle, X, Clock, Battery, Fuel, Clock3, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Vehicle {
  _id: string;
  name: string;
  vin: string;
  fuelLevel: number;
  engineStatus: boolean;
  location: string;
  address: string;
  image: string;
  workingHours: string;
  lastUpdate: string;
}

export default function MachineCard({ vehicle }: { vehicle: Vehicle }) {
  const lastUpdate = new Date(vehicle.lastUpdate);
  const timeString = lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = lastUpdate.toLocaleDateString('en-US');

  return (
    <Card className="m-4 p-4 bg-white rounded-xl shadow-sm border-0">
      <div className="flex gap-4 mb-4">
        {/* Machine Image - Yellow Circle with Excavator */}
        <div className="w-20 h-20 bg-white rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-yellow-500">
          <img src={vehicle.image} alt={vehicle.name} />
        </div>

        {/* Machine Info */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Status as on {timeString} | {dateString}</p>
          <h3 className="font-extralight text-gray-800 mb-2 text-base">{vehicle.vin}</h3>
          <div className="flex gap-3 mb-4 text-sm w-full">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock3 size={12} />
              <div>
                <p className=" text-gray-800 text-xs flex w-[40px]" >{vehicle.workingHours} Hrs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Fuel size={12} className="text-green-500" />
              <div>
                <p className=" text-gray-800 text-xs">{vehicle.fuelLevel}%</p>
              </div>
            </div>
            <button className={`bg-white text-gray-700 px-3 py-0.5 rounded text-[8px] w-[80px] font-medium hover:bg-gray-100 border border-gray-300 ${vehicle.engineStatus ? 'bg-green-100' : ''}`}>
              Engine {vehicle.engineStatus ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="flex gap-2 mb-4 text-sm">
            <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="text-gray-700">
              <p className="text-xs">{vehicle.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}


      {/* Location */}


      {/* Action Icons */}
      <div className="flex gap-6 justify-center pt-4 border-t border-gray-200">
        <button className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <Pencil size={12} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50">
          <AlertTriangle size={12} className="text-green-500" />
        </button>
        <button className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50">
          <Wrench size={12} className="text-red-500" />
        </button>
      </div>
    </Card>
  );
}
