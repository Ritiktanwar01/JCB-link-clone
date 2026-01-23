'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Vehicle } from '@/lib/auth';
import { vehicleAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareDuration, setShareDuration] = useState('2');
  const [shareUrl, setShareUrl] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await vehicleAPI.getVehicle(id);
        if (res) {
          setVehicle(res.vehicle);
          console.log('Vehicle data:', res);
        } else {
          setVehicle(null);
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
    setShareDialogOpen(true);
  };

  const handleGenerateShareLink = async () => {
    if (!vehicle) return;

    setGeneratingLink(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          duration: shareDuration,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
        // Copy to clipboard automatically
        navigator.clipboard.writeText(data.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setGeneratingLink(false);
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
        <div className="space-y-3 sm:space-y-4">
          <Link href="/vehicles">
            <Button variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Back
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-4 sm:pt-6 text-center text-xs sm:text-sm text-muted-foreground">
              Vehicle not found
            </CardContent>
          </Card>
        </div>
      </ProtectedLayout>
    );
  }

  // const [lat, lng] = vehicle.location.split(',');
  // const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <ProtectedLayout>
      <div className="space-y-3 sm:space-y-6">
        <Link href="/vehicles">
          <Button variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Vehicles</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>

        {/* Main Vehicle Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {vehicle.image && (
                  <img
                    src={getImageUrl(vehicle.image)}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl truncate">{vehicle.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">VIN: {vehicle.vin}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-muted p-2 sm:p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Fuel Level</p>
                    <p className="text-lg sm:text-2xl font-bold">{vehicle.fuelLevel}%</p>
                    <div className="mt-2 w-full bg-background rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all"
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-2 sm:p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Engine</p>
                    <p className={`text-lg sm:text-2xl font-bold ${vehicle.engineStatus ? 'text-green-600' : 'text-gray-600'}`}>
                      {vehicle.engineStatus ? 'On' : 'Off'}
                    </p>
                  </div>

                  <div className="bg-muted p-2 sm:p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Update</p>
                    <p className="text-xs sm:text-sm font-semibold truncate">
                      {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Address</p>
                    <p className="text-xs sm:text-base">{vehicle.address}</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Coordinates</p>
                    <p className="text-xs sm:text-base font-mono">{vehicle.location}</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Expiry</p>
                    <p className="text-xs sm:text-base">
                      {new Date(vehicle.expiryTime).toLocaleDateString()} {' '}
                      <span className="hidden sm:inline">{new Date(vehicle.expiryTime).toLocaleTimeString()}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">Location</span>
                  <span className="sm:hidden">Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative max-h-60 sm:max-h-80">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    // src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDNV6oSu1NjrA-RxLz7IXFX_jn7OsX6Yjo&q=${lat},${lng}`}
                    title="Vehicle Location"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleShareLocation}
                    className="w-full gap-2 text-xs sm:text-sm h-8 sm:h-9"
                    size="sm"
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Share Location</span>
                    <span className="sm:hidden">Share</span>
                  </Button>

                  <Button
                    onClick={handleCopyLocation}
                    variant="outline"
                    className="w-full gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Copied!</span>
                        <span className="sm:hidden">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Copy Maps Link</span>
                        <span className="sm:hidden">Copy</span>
                      </>
                    )}
                  </Button>

                  {/* <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                      size="sm"
                      asChild
                    >
                      <span>Open in Maps</span>
                    </Button>
                  </a> */}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b text-xs sm:text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    vehicle.engineStatus
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {vehicle.engineStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b text-xs sm:text-sm">
                  <span className="text-muted-foreground">Fuel Range</span>
                  <span className="font-semibold">{Math.round(vehicle.fuelLevel * 3)} km</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Next Service</span>
                  <span className="font-semibold">
                    {Math.ceil((new Date(vehicle.expiryTime).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Share Location Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Vehicle Location</DialogTitle>
              <DialogDescription>
                Generate a shareable link for this vehicle's location. Choose how long the link should remain active.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Duration</label>
                <Select value={shareDuration} onValueChange={setShareDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {shareUrl && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Share Link Generated:</p>
                  <p className="text-xs text-muted-foreground break-all">{shareUrl}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {copied ? '✓ Link copied to clipboard!' : 'Link copied to clipboard'}
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShareDialogOpen(false)}
                  disabled={generatingLink}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateShareLink}
                  disabled={generatingLink}
                >
                  {generatingLink ? 'Generating...' : shareUrl ? 'Generate New Link' : 'Generate Link'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedLayout>
  );
}
