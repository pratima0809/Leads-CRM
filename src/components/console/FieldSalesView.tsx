'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  User, 
  Clock, 
  Compass, 
  Check, 
  Map, 
  Navigation 
} from 'lucide-react';

export default function FieldSalesView() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [visits, setVisits] = useState([
    { client: 'ABC Metals LLC', address: '12 Steel Road, Industrial Hub', time: '10:30 AM', status: 'COMPLETED' },
    { client: 'Apex Education Group', address: '45 Knowledge Square, Edu Campus', time: '02:00 PM', status: 'PENDING' },
  ]);

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Map Route details list */}
      <div className="lg:col-span-2 premium-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-border-default pb-3">
          <div>
            <h4 className="font-bold text-sm text-text-primary">Field Representative Itinerary</h4>
            <p className="text-xs text-text-secondary font-semibold">Today's assigned on-site customer visits</p>
          </div>
          
          <button 
            onClick={handleCheckIn}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg shadow-card transition-all border ${
              isCheckedIn 
                ? 'bg-warning-light text-warning border-warning-border' 
                : 'bg-surface-card dark:bg-sidebar hover:bg-surface-bg-alt dark:hover:bg-sidebar-hover text-text-primary dark:text-text-inverse border-sidebar'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {isCheckedIn ? 'Check Out of Node' : 'Check In to Site'}
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {visits.map((visit, idx) => (
            <div key={idx} className="border border-border-default rounded-xl p-4 hover:bg-surface-bg-alt transition-colors flex justify-between items-start">
              <div className="space-y-1 font-semibold">
                <h5 className="font-extrabold text-text-primary text-sm">{visit.client}</h5>
                <p className="text-text-secondary">{visit.address}</p>
                <div className="text-[10px] text-text-muted font-semibold flex items-center gap-1 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  Scheduled: {visit.time}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold border ${
                visit.status === 'COMPLETED' ? 'badge-info' : 'badge-warning'
              }`}>
                {visit.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: GPS Info */}
      <div className="space-y-6">
        <div className="premium-card p-5 space-y-4">
          <h4 className="font-bold text-sm text-text-primary border-b border-border-default pb-2">GPS Tracking Details</h4>
          
          <div className="space-y-4 text-xs font-semibold text-text-primary">
            <div className="flex gap-2.5 items-start bg-surface-bg-alt p-3 rounded-lg border border-border-default">
              <Navigation className="w-4.5 h-4.5 text-info mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">Current Geo coordinates</span>
                <p className="text-[10px] text-text-muted mt-1">Latitude: 40.7128° N &bull; Longitude: 74.0060° W</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start bg-surface-bg-alt p-3 rounded-lg border border-border-default">
              <Compass className="w-4.5 h-4.5 text-info mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">Attendance Log</span>
                <p className="text-[10px] text-text-muted mt-1">Checked in at 8:45 AM today. Status: OK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
