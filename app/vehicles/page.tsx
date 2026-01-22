'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { VehicleForm } from '@/components/vehicle-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
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
      const res = await fetch('/api/vehicles');
      if (res.ok) {
        setVehicles(await res.json());
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (data: any) => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await loadVehicles();
      }
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  const handleEditVehicle = async (data: any) => {
    if (!selectedVehicle) return;
    try {
      const res = await fetch(`/api/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await loadVehicles();
        setSelectedVehicle(undefined);
      }
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadVehicles();
        setDeleteConfirm(null);
      }
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
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vehicles</h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Manage your fleet of vehicles</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {(['grid', 'table'] as const).map(mode => (
                <Button
                  key={mode}
                  size="sm"
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  onClick={() => setViewMode(mode)}
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
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Vehicle</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No vehicles in your fleet yet</p>
              <Button onClick={() => setFormOpen(true)}>Add Your First Vehicle</Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {vehicle.image && (
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-base md:text-lg truncate">{vehicle.title}</CardTitle>
                  <CardDescription className="text-xs truncate">VIN: {vehicle.vin}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Fuel Level</p>
                      <p className="font-semibold">{vehicle.fuelLevel}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Engine</p>
                      <p className={`font-semibold text-sm ${vehicle.engineStatus ? 'text-green-600' : 'text-gray-600'}`}>
                        {vehicle.engineStatus ? 'Running' : 'Off'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{vehicle.address}</p>
                  <div className="flex gap-1.5 pt-3 mt-auto">
                    <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                      <Button size="sm" variant="default" className="w-full gap-2 text-xs">
                        <Eye className="w-4 h-4" />
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
                      className="bg-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirm(vehicle.id)}
                      className="bg-transparent text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold">Title</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold hidden md:table-cell">VIN</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold">Fuel</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">Engine</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold hidden lg:table-cell">Location</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 md:py-3 px-2 md:px-4 truncate max-w-[100px] md:max-w-none">{vehicle.title}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 font-mono text-xs hidden md:table-cell">{vehicle.vin.slice(0, 8)}...</td>
                        <td className="py-2 md:py-3 px-2 md:px-4">{vehicle.fuelLevel}%</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            vehicle.engineStatus
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {vehicle.engineStatus ? 'Running' : 'Off'}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[150px]">{vehicle.address}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <div className="flex gap-1">
                            <Link href={`/vehicles/${vehicle.id}`}>
                              <Button size="sm" variant="ghost" className="gap-1 h-8 px-2">
                                <Eye className="w-3 md:w-4 h-3 md:h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setFormOpen(true);
                              }}
                              className="h-8 px-2"
                            >
                              <Edit2 className="w-3 md:w-4 h-3 md:h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm(vehicle.id)}
                              className="h-8 px-2"
                            >
                              <Trash2 className="w-3 md:w-4 h-3 md:h-4" />
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
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Delete Vehicle</CardTitle>
                <CardDescription className="text-xs md:text-sm">Are you sure you want to delete this vehicle?</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2 justify-end flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="order-2 sm:order-1 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteVehicle(deleteConfirm)}
                  className="order-1 sm:order-2 w-full sm:w-auto"
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
