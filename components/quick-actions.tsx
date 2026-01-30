'use client';

import { MapPin, FileText, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function QuickActions() {
  const actions = [
    { icon: Zap, label: 'Fuel Utilization', color: 'text-gray-300' },
    { icon: MapPin, label: 'Machine Location', color: 'text-gray-300' },
    { icon: FileText, label: 'Machine\nOperating Report', color: 'text-gray-300' },
    { icon: Clock, label: 'Machine\nFencing', color: 'text-gray-300' },
  ];

  return (
    <div className="px-4 py-4">
      <h2 className="font-bold text-base text-gray-800 mb-4">Quick Actions</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {actions.map((action, idx) => (
          <Card key={idx} className="p-4 bg-gray-100 rounded-lg border-0 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-200 flex-shrink-0 w-32">
            <action.icon size={44} className={action.color} strokeWidth={1.5} />
            <p className="text-xs text-center font-medium text-gray-600 leading-tight">{action.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
