'use client';

import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function UtilizationChart() {
  const [activeTab, setActiveTab] = useState('engine');
  const dates = ['10.Jan', '11.Jan', '12.Jan', '13.Jan', '14.Jan', '15.Jan'];

  return (
    <div className="px-4 py-4">
      <h2 className="font-bold text-base text-gray-800 mb-4">Weekly Utilization</h2>
      <Card className="p-4 bg-white rounded-lg border-0 shadow-sm">
        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('engine')}
            className={`pb-2 text-sm font-semibold ${activeTab === 'engine' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}
          >
            Engine Utilization
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`pb-2 text-sm font-semibold ${activeTab === 'fuel' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}
          >
            Fuel Utilization
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button className="text-amber-500 font-semibold text-sm">View Details &gt;</button>
        </div>
        
        {/* No Data Message */}
        <div className="flex items-center justify-center h-40 mb-4">
          <p className="text-amber-500 font-semibold text-sm">No chart data available.</p>
        </div>

        {/* Status and Legend */}
        <div className="flex items-center gap-6 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-semibold">Engine Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-gray-700 font-semibold">Fuel Level</span>
          </div>
        </div>

        {/* Date Range Buttons */}
        <div className="flex gap-2 justify-between overflow-x-auto pb-2">
          <button className="text-gray-600 text-xs font-medium px-2 py-1">Jan</button>
          <button className="bg-amber-400 text-white text-xs font-semibold px-3 py-2 rounded">Today</button>
          {dates.map((date) => (
            <button key={date} className="text-gray-600 text-xs font-medium px-2 py-1 border border-gray-300 rounded">
              {date}
            </button>
          ))}
          <button className="bg-amber-400 text-white text-xs font-semibold px-3 py-2 rounded">Today</button>
        </div>
      </Card>
    </div>
  );
}
