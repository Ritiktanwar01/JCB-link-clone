'use client';

import { useState, useEffect } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/session';
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
      const sess = await getSession();
      if (sess) {
        setSession(sess);
        try {
          const res = await fetch('/api/vehicles');
          if (res.ok) {
            setVehicles(await res.json());
          }
        } catch (err) {
          console.error('Failed to fetch vehicles:', err);
        }
      }
      setLoading(false);
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
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, {session?.name}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Here's an overview of your vehicle fleet</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card hover:bg-card/80 transition-colors">
              <CardHeader className="p-3 md:p-4 pb-2 md:pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <div className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Recent Vehicles</CardTitle>
            <CardDescription className="text-xs md:text-sm">Latest updates from your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No vehicles in fleet</p>
            ) : (
              <div className="space-y-3">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{vehicle.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">VIN: {vehicle.vin}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{vehicle.fuelLevel}%</p>
                        <p className="text-xs text-muted-foreground">Fuel</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
