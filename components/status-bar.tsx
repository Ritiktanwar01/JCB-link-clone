'use client';

import { Signal, Wifi, Battery } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="bg-amber-400 px-4 py-2 flex justify-between items-center text-xs font-semibold text-black">
      <span>1:25</span>
      <div className="flex gap-1 items-center">
        <Wifi size={14} />
        <Signal size={14} />
        <span>4G</span>
        <Battery size={14} className="ml-1" />
        <span>41%</span>
      </div>
    </div>
  );
}
