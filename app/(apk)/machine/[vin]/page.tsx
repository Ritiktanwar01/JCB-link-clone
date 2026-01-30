'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import MachineCard from '@/components/machine-card';
import QuickActions from '@/components/quick-actions';
import AlertsSection from '@/components/alerts-section';
import UtilizationChart from '@/components/utilization-chart';
import VisualizationReports from '@/components/visualization-reports';
import MachineStatus from '@/components/machine-status';
import { apiCall } from '@/lib/api';
import { MapEmbed } from '@/components/Map';

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

export default function Home() {
  const params = useParams();
  const vin = params.vin as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Back = () => {
    window.location.href = 'https://jcb-digital.in/vehicles/' + vehicle?._id;
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await apiCall(`/vehicles/vin/${vin}`);
        setVehicle(data.vehicle);
      } catch (err) {
        setError('Failed to load vehicle data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (vin) {
      fetchVehicle();
    }
  }, [vin]);

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-red-500">{error || 'Vehicle not found'}</div>
      </div>
    );
  }

  const [lat, lng] = vehicle.location.split(',').map(Number);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Phone Frame */}
      <div className="max-w-md mx-auto bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-400 px-4 py-3 flex items-center gap-4">
          <button className="text-black hover:opacity-75" onClick={Back}>
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-black font-bold text-base">{vehicle.vin}</h1>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto h-screen" style={{ scrollbarWidth: 'thin' }}>
          {/* Map Section */}
          <div className="bg-gray-300 relative h-56 flex items-center justify-center">
            <MapEmbed lat={lat} lng={lng} />
          </div>

          {/* Machine Card */}
          <MachineCard vehicle={vehicle} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Alerts Section */}
          <AlertsSection />

          {/* Weekly Utilization */}
          <UtilizationChart />

          {/* Visualization Reports */}
          <VisualizationReports />

          {/* Machine Status */}
          <MachineStatus />

          {/* Padding for scroll */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
