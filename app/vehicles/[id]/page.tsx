'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Copy, Check } from 'lucide-react';
import type { Vehicle } from '@/lib/auth';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${id}`);
        if (res.ok) {
          setVehicle(await res.json());
        }
      } catch (err) {
        console.error('Failed to load vehicle:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [id]);

  const handleShareLocation = () => {
    if (!vehicle?.location) return;
    
    const [lat, lng] = vehicle.location.split(',');
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.title} Location`,
        text: `Check out the location of ${vehicle.title}`,
        url: mapsUrl,
      });
    } else {
      window.open(mapsUrl, '_blank');
    }
  };

  const handleCopyLocation = () => {
    if (!vehicle?.location) return;
    
    const [lat, lng] = vehicle.location.split(',');
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    navigator.clipboard.writeText(mapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div>Loading...</div>
      </ProtectedLayout>
    );
  }

  if (!vehicle) {
    return (
      <ProtectedLayout>
        <div className="space-y-4">
          <Link href="/vehicles">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Vehicle not found
            </CardContent>
          </Card>
        </div>
      </ProtectedLayout>
    );
  }

  const [lat, lng] = vehicle.location.split(',');
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <ProtectedLayout>
      <div className="space-y-4 md:space-y-6">
        <Link href="/vehicles">
          <Button variant="outline" className="gap-2 bg-transparent text-xs md:text-sm">
            <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
            Back to Vehicles
          </Button>
        </Link>

        {/* Main Vehicle Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {vehicle.image && (
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl truncate">{vehicle.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm truncate">VIN: {vehicle.vin}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-muted p-3 md:p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Fuel Level</p>
                    <p className="text-xl md:text-2xl font-bold">{vehicle.fuelLevel}%</p>
                    <div className="mt-2 w-full bg-background rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-3 md:p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Engine Status</p>
                    <p className={`text-xl md:text-2xl font-bold ${vehicle.engineStatus ? 'text-green-600' : 'text-gray-600'}`}>
                      {vehicle.engineStatus ? 'Running' : 'Off'}
                    </p>
                  </div>

                  <div className="bg-muted p-3 md:p-4 rounded-lg col-span-1 sm:col-span-2 lg:col-span-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Last Update</p>
                    <p className="text-xs md:text-sm font-semibold truncate">
                      {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium mb-2">Address</p>
                    <p className="text-sm md:text-base break-words">{vehicle.address}</p>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium mb-2">Coordinates</p>
                    <p className="text-xs md:text-base font-mono break-all">{vehicle.location}</p>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium mb-2">Expiry Time</p>
                    <p className="text-xs md:text-base">
                      {new Date(vehicle.expiryTime).toLocaleDateString()} at{' '}
                      {new Date(vehicle.expiryTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <MapPin className="w-4 md:w-5 h-4 md:h-5 flex-shrink-0" />
                  <span className="truncate">Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDNV6oSu1NjrA-RxLz7IXFX_jn7OsX6Yjo&q=${lat},${lng}`}
                    title="Vehicle Location"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Button
                    onClick={handleShareLocation}
                    className="w-full gap-2"
                    size="sm"
                  >
                    <MapPin className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="text-xs md:text-sm">Share Location</span>
                  </Button>

                  <Button
                    onClick={handleCopyLocation}
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 md:w-4 h-3 md:h-4" />
                        <span className="text-xs md:text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 md:w-4 h-3 md:h-4" />
                        <span className="text-xs md:text-sm">Copy Maps Link</span>
                      </>
                    )}
                  </Button>

                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      size="sm"
                      asChild
                    >
                      <span className="text-xs md:text-sm">Open in Maps</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center pb-3 border-b gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Status</span>
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    vehicle.engineStatus
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {vehicle.engineStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Fuel Range</span>
                  <span className="font-semibold text-xs md:text-sm">{Math.round(vehicle.fuelLevel * 3)} km</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Next Service</span>
                  <span className="font-semibold text-xs md:text-sm">
                    {Math.ceil((new Date(vehicle.expiryTime).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
