'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { VehicleForm } from '@/components/vehicle-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { vehicleAPI } from '@/lib/api';
import type { Vehicle } from '@/lib/auth';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleAPI.getVehicles();
      setVehicles(data.vehicles || []);
      console.log('Loaded vehicles:', data.vehicles);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (data: any) => {
    try {
      await vehicleAPI.createVehicle(data);
      await loadVehicles();
      setFormOpen(false);
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  const handleEditVehicle = async (data: any) => {
    if (!selectedVehicle) return;
    try {
      await vehicleAPI.updateVehicle(selectedVehicle._id, data);
      await loadVehicles();
      setSelectedVehicle(undefined);
      setFormOpen(false);
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      await loadVehicles();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div>Loading...</div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Vehicles</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Manage your fleet of vehicles</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {(['grid', 'table'] as const).map(mode => (
                <Button
                  key={mode}
                  size="sm"
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  onClick={() => setViewMode(mode)}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {mode === 'grid' ? '⊞' : '≡'}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => {
                setSelectedVehicle(undefined);
                setFormOpen(true);
              }}
              className="gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Vehicle</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="pt-4 sm:pt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">No vehicles in your fleet yet</p>
              <Button onClick={() => setFormOpen(true)} size="sm">Add Your First Vehicle</Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {vehicle.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${vehicle.image}`}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg truncate">{vehicle.name}</CardTitle>
                  <CardDescription className="text-xs truncate">VIN: {vehicle.vin}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Fuel Level</p>
                      <p className="font-semibold">{vehicle.fuelLevel}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Engine</p>
                      <p className={`font-semibold ${vehicle.engineStatus ? 'text-green-600' : 'text-gray-600'}`}>
                        {vehicle.engineStatus ? 'Running' : 'Off'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{vehicle.address}</p>
                  <div className="flex gap-1 sm:gap-2 pt-2 mt-auto">
                    <Link href={`/vehicles/${vehicle._id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setFormOpen(true);
                      }}
                      className="gap-1 h-8 sm:h-9"
                    >
                      <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirm(vehicle._id)}
                      className="gap-1 h-8 sm:h-9"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-3 sm:pt-6 p-2 sm:p-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold">Title</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold hidden sm:table-cell">VIN</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold">Fuel</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold hidden md:table-cell">Engine</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold hidden lg:table-cell">Location</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle._id} className="border-b hover:bg-muted/50 text-xs sm:text-sm">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 truncate font-medium">{vehicle.name}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-mono text-xs hidden sm:table-cell truncate">{vehicle.vin}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">{vehicle.fuelLevel}%</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            vehicle.engineStatus
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {vehicle.engineStatus ? 'Running' : 'Off'}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs text-muted-foreground hidden lg:table-cell truncate">{vehicle.address}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex gap-1">
                            <Link href={`/vehicles/${vehicle._id}`}>
                              <Button size="sm" variant="ghost" className="gap-1 h-7 w-7 sm:h-8 sm:w-8 p-0">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setFormOpen(true);
                              }}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm(vehicle._id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Delete Vehicle</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Are you sure you want to delete this vehicle?</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2 justify-end p-4 sm:p-6">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteVehicle(deleteConfirm)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <VehicleForm
          open={formOpen}
          onOpenChange={setFormOpen}
          vehicle={selectedVehicle}
          onSubmit={selectedVehicle ? handleEditVehicle : handleAddVehicle}
        />
      </div>
    </ProtectedLayout>
  );
}
