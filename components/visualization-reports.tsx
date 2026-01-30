'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VisualizationReports() {
  return (
    <div className="px-4 py-4">
      <h2 className="font-bold text-base text-gray-800 mb-4">Visualization Reports</h2>
      <Card className="p-8 bg-white rounded-lg border-0 shadow-sm flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-sm text-center">Join Livelink premium to access these reports data</p>
        <Button className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-2 text-sm">
          Join Premium
        </Button>
      </Card>
    </div>
  );
}
