'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    expiryTime: vehicle?.expiryTime ? new Date(vehicle.expiryTime).toISOString().slice(0, 16) : '',
    title: vehicle?.title || '',
    fuelLevel: vehicle?.fuelLevel || 50,
    engineStatus: vehicle?.engineStatus || false,
    location: vehicle?.location || '',
    image: vehicle?.image || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        expiryTime: new Date(formData.expiryTime).toISOString(),
        fuelLevel: parseInt(formData.fuelLevel.toString()),
        lastUpdate: new Date().toISOString(),
      });
      onOpenChange(false);
      setFormData({
        vin: '',
        address: '',
        expiryTime: '',
        title: '',
        fuelLevel: 50,
        engineStatus: false,
        location: '',
        image: '',
      });
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
              <label className="text-xs md:text-sm font-medium">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Vehicle title"
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
            <label className="text-xs md:text-sm font-medium">Location (lat,lng)</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="40.7128,-74.0060"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Image URL</label>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              required
              className="text-sm"
            />
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
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Expiry Time</label>
              <Input
                name="expiryTime"
                type="datetime-local"
                value={formData.expiryTime}
                onChange={handleChange}
                required
                className="text-sm"
              />
            </div>
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
