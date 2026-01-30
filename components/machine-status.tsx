'use client';

import { Card } from '@/components/ui/card';

export default function MachineStatus() {
  return (
    <div className="px-4 py-4">
      <h2 className="font-bold text-base text-gray-800 mb-4">Machine Status</h2>
      <Card className="p-6 bg-white rounded-lg border-0 shadow-sm">
        {/* Chart Placeholder */}
        <div className="flex items-end justify-center gap-2 h-32">
          {[45, 60, 35, 70, 50, 65, 55, 40].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gray-400 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
