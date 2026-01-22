'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDummyKeyReplaceMeWithYourOwnKey123456';

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  onAddressChange?: (address: string) => void;
}

// Global script loading state
let googleMapsPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function LocationPicker({ value, onChange, onAddressChange }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const mountedRef = useRef(true);

  // Initialize map on mount
  useEffect(() => {
    mountedRef.current = true;

    const initMap = async () => {
      try {
        await loadGoogleMaps();

        if (!mountedRef.current || !mapContainerRef.current) return;

        const defaultLat = 40.7128;
        const defaultLng = -74.006;

        // Create map instance
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: defaultLat, lng: defaultLng },
          zoom: 13,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
        });

        mapRef.current = map;

        // Parse and display existing location if available
        if (value) {
          try {
            const [lat, lng] = value.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              map.setCenter({ lat, lng });
              map.setZoom(15);
              createMarker(map, lat, lng);
            }
          } catch (err) {
            console.log('[v0] Error parsing location:', err);
          }
        }

        // Add click listener to map
        map.addListener('click', (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          createMarker(map, lat, lng);
          const newLocation = `${lat.toFixed(6)},${lng.toFixed(6)}`;
          onChange(newLocation);
          reverseGeocode(lat, lng);
        });

        // Initialize autocomplete
        if (searchInputRef.current) {
          try {
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
              componentRestrictions: { country: 'us' },
              types: ['geocode'],
            });

            autocompleteRef.current = autocomplete;

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();

              if (!place.geometry?.location) {
                console.log('[v0] No geometry for place');
                return;
              }

              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();

              if (mapRef.current) {
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(15);
              }

              createMarker(map, lat, lng);
              const newLocation = `${lat.toFixed(6)},${lng.toFixed(6)}`;
              onChange(newLocation);

              if (place.formatted_address) {
                setSelectedAddress(place.formatted_address);
                onAddressChange?.(place.formatted_address);
              }
            });
          } catch (err) {
            console.log('[v0] Error setting up autocomplete:', err);
          }
        }

        setLoading(false);
      } catch (err) {
        console.log('[v0] Error loading maps:', err);
        if (mountedRef.current) {
          setError('Failed to load Google Maps. Please check your API key.');
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mountedRef.current = false;
    };
  }, [onChange, onAddressChange, value]);

  const createMarker = (map: any, lat: number, lng: number) => {
    // Remove old marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: 'Vehicle Location',
      animation: window.google.maps.Animation.DROP,
    });
  };

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (!mountedRef.current) return;

      if (status === 'OK' && results && results[0]) {
        setSelectedAddress(results[0].formatted_address);
        onAddressChange?.(results[0].formatted_address);
      }
    });
  }, [onAddressChange]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    setIsGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mountedRef.current) return;

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        mapRef.current.setCenter({ lat, lng });
        mapRef.current.setZoom(15);
        createMarker(mapRef.current, lat, lng);

        const newLocation = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        onChange(newLocation);
        reverseGeocode(lat, lng);
        setIsGeolocationLoading(false);
      },
      () => {
        if (mountedRef.current) {
          setIsGeolocationLoading(false);
          setError('Unable to get your location. Please enable location access.');
        }
      }
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Location</label>
        <div className="flex gap-2">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCurrentLocation}
            disabled={loading || isGeolocationLoading}
            size="sm"
          >
            {isGeolocationLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-1" />
                Current
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Map (Click to pin location)</label>
        <div
          ref={mapContainerRef}
          className="w-full border rounded-lg bg-gray-100 overflow-hidden"
          style={{ height: '350px' }}
        >
          {loading && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-6 h-6 animate-spin text-gray-500" />
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-1">Address:</p>
          <p className="text-sm text-blue-800">{selectedAddress}</p>
        </div>
      )}

      {/* Coordinates Display */}
      {value && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-900 mb-1">Coordinates:</p>
          <p className="text-sm font-mono text-green-800">{value}</p>
        </div>
      )}
    </div>
  );
}
