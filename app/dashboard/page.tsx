'use client';

import { useState, useEffect } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicleAPI, authAPI } from '@/lib/api';
import type { Vehicle } from '@/lib/auth';

interface Session {
  userId: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await authAPI.verifyToken();
        setSession(userData.user);
        const vehiclesData = await vehicleAPI.getVehicles();
        setVehicles(vehiclesData.vehicles || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    {
      title: 'Total Vehicles',
      value: vehicles.length.toString(),
      description: 'Active vehicles in fleet',
    },
    {
      title: 'Engine Running',
      value: vehicles.filter(v => v.engineStatus).length.toString(),
      description: 'Currently active',
    },
    {
      title: 'Avg Fuel Level',
      value: vehicles.length > 0
        ? Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length) + '%'
        : '0%',
      description: 'Fleet average',
    },
    {
      title: 'Last Update',
      value: vehicles.length > 0
        ? new Date(Math.max(...vehicles.map(v => new Date(v.lastUpdate).getTime())))
            .toLocaleTimeString()
        : '-',
      description: 'Most recent update',
    },
  ];

  if (loading) {
    return (
      <ProtectedLayout>
        <div>Loading...</div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome, {session?.name}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Here's an overview of your vehicle fleet</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-3 sm:p-6">
              <CardHeader className="pb-2 sm:pb-3 p-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Vehicles */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Recent Vehicles</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest updates from your fleet</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {vehicles.length === 0 ? (
              <p className="text-muted-foreground text-xs sm:text-sm">No vehicles in fleet</p>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{vehicle.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">VIN: {vehicle.vin}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-wrap">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-medium text-foreground">{vehicle.fuelLevel}%</p>
                        <p className="text-xs text-muted-foreground">Fuel</p>
                      </div>
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        vehicle.engineStatus
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {vehicle.engineStatus ? 'Running' : 'Off'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
