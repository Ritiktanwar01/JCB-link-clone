'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Vehicle } from '@/lib/auth';

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle;
  onSubmit: (data: any) => Promise<void>;
}

export function VehicleForm({ open, onOpenChange, vehicle, onSubmit }: VehicleFormProps) {

  const [formData, setFormData] = useState({
    vin: vehicle?.vin || '',
    address: vehicle?.address || '',
    // expiryTime: vehicle?.expiryTime ? new Date(vehicle.expiryTime).toISOString().slice(0, 16) : '',
    name: vehicle?.name || '',
    fuelLevel: vehicle?.fuelLevel || 50,
    engineStatus: vehicle?.engineStatus || false,
    location: vehicle?.location || '',
    image: vehicle?.image || '',
    workingHours: vehicle?.workingHours || '',
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData({
      vin: vehicle?.vin || '',
      address: vehicle?.address || '',
      // expiryTime: vehicle?.expiryTime ? new Date(vehicle.expiryTime).toISOString().slice(0, 16) : '',
      name: vehicle?.name || '',
      fuelLevel: vehicle?.fuelLevel || 50,
      engineStatus: vehicle?.engineStatus || false,
      location: vehicle?.location || '',
      image: vehicle?.image ? `${vehicle.image}` : '',
      workingHours: vehicle?.workingHours || '',
    });
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        const fullImageUrl = `https://api.jcb-digital.in${data.url}`;
        setFormData(prev => ({ ...prev, image: fullImageUrl }));
        toast({
          title: "Upload Successful",
          description: "File has been uploaded successfully.",
        });
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Call Nominatim API to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            
            if (response.ok) {
              const data = await response.json();
              
              // Construct address from the response
              let address = '';
              if (data.address) {
                const addr = data.address;
                const parts = [];
                
                if (addr.house_number) parts.push(addr.house_number);
                if (addr.road) parts.push(addr.road);
                if (addr.neighbourhood) parts.push(addr.neighbourhood);
                if (addr.suburb) parts.push(addr.suburb);
                if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
                if (addr.county) parts.push(addr.county);
                if (addr.state_district) parts.push(addr.state_district);
                if (addr.state) parts.push(addr.state);
                if (addr.postcode) parts.push(addr.postcode);
                if (addr.country) parts.push(addr.country);
                
                address = parts.join(', ');
              } else if (data.display_name) {
                address = data.display_name;
              }
              
              setFormData(prev => ({ 
                ...prev, 
                location: `${lat},${lng}`,
                address: address || `${lat}, ${lng}`
              }));
              
              toast({
                title: "Location Retrieved",
                description: address ? `Address: ${address}` : `Location set to ${lat}, ${lng}`,
              });
            } else {
              // Fallback to just coordinates if API fails
              setFormData(prev => ({ ...prev, location: `${lat},${lng}` }));
              toast({
                title: "Location Retrieved",
                description: `Location set to ${lat}, ${lng}`,
              });
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            // Fallback to just coordinates
            setFormData(prev => ({ ...prev, location: `${lat},${lng}` }));
            toast({
              title: "Location Retrieved",
              description: `Location set to ${lat}, ${lng}`,
            });
          }
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let submitData: any = {
        ...formData,
        // expiryTime: new Date(formData.expiryTime).toISOString(),
        fuelLevel: parseInt(formData.fuelLevel.toString()),
        lastUpdate: new Date().toISOString(),
      };

      // If editing and image hasn't changed from original, don't include it
      if (vehicle && formData.image === `${vehicle.image}`) {
        delete submitData.image;
      }

      await onSubmit(submitData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-md md:max-w-lg px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            {vehicle ? 'Update vehicle details' : 'Enter the details of the new vehicle'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle name"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">VIN</label>
              <Input
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Vehicle identification number"
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Vehicle address"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Working Hours</label>
            <Input
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              placeholder="Vehicle working hours"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Lat,Long</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="lat,long"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Location (lat,lng)</label>
            <Button type="button" onClick={handleGetLocation} disabled={loading} className="w-full text-sm">
              {formData.location || 'Get Current Location'}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            {formData.image && (
              <div className="mb-2">
                <img
                  src={'https://api.jcb-digital.in/uploads/vehicle-1769766870671-45496498.jpg'}
                  alt="Vehicle preview"
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <Input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="text-sm"
            />
            {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            {formData.image && !isUploading && (
              <p className="text-sm text-muted-foreground">Current image will be replaced when you upload a new one</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Fuel Level (%)</label>
              <Input
                name="fuelLevel"
                type="number"
                min="0"
                max="100"
                value={formData.fuelLevel}
                onChange={handleChange}
                required
                className="text-sm"
              />
            </div>
            {/* <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Expiry Time</label>
              <Input
                name="expiryTime"
                type="datetime-local"
                value={formData.expiryTime}
                onChange={handleChange}
                required
                className="text-sm"
              />
            </div> */}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="engineStatus"
              checked={formData.engineStatus}
              onChange={handleChange}
              id="engineStatus"
              className="rounded"
            />
            <label htmlFor="engineStatus" className="text-xs md:text-sm font-medium cursor-pointer">
              Engine Running
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto order-1 sm:order-2">
              {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
