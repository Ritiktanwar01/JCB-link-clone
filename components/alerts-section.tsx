'use client';

import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AlertsSection() {
  return (
    <div className="px-4 py-4">
      <h2 className="font-bold text-lg text-gray-800 mb-4">Alerts</h2>
      <Card className="p-4 bg-white rounded-lg border-0 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center flex-shrink-0">
          <X size={32} className="text-red-500" strokeWidth={3} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">Service OverDue</p>
        </div>
      </Card>
    </div>
  );
}
