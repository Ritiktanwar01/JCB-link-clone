'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SharedVehiclePage() {
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    // Redirect to the backend shared vehicle page
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/shared/${token}`;
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading shared vehicle...</p>
      </div>
    </div>
  );
}