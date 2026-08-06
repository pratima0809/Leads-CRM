'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { BrainCircuit, TrendingUp, Sparkles, Target } from 'lucide-react';

const mockForecast = [
  { month: 'Jul', Actual: 229000, Projected: 229000, Target: 200000 },
  { month: 'Aug', Projected: 245000, Target: 210000 },
  { month: 'Sep', Projected: 280000, Target: 220000 },
  { month: 'Oct', Projected: 320000, Target: 240000 },
  { month: 'Nov', Projected: 390000, Target: 260000 },
  { month: 'Dec', Projected: 450000, Target: 300000 },
];

export default function ForecastingView() {
  return (
    <div className="space-y-6">
      
      {/* Forecasting banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-card dark:bg-sidebar text-text-primary dark:text-text-inverse p-6 border-0 rounded-xl relative overflow-hidden shadow-card">
        {/* flat dark card — no decorative gradient */}
        <div className="relative z-10 flex flex-col justify-between space-y-4 col-span-1 md:col-span-2">
          <div>
            <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" />
              AI Revenue Forecast
            </span>
            <h3 className="font-extrabold text-xl mt-2 tracking-tight">Q3 & Q4 Financial Modeling</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-lg">
              Predictive revenue modeling leveraging deal velocities, pipeline health, historical conversions, and representative performance variables.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center bg-white/5 border border-white/10 p-5 rounded-xl text-center">
          <Target className="w-8 h-8 text-[#8B5CF6] mb-2" />
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Accuracy rate</div>
          <div className="text-2xl font-extrabold text-text-inverse mt-1">94.8%</div>
        </div>
      </div>
 
      {/* Main Forecast Chart */}
      <div className="premium-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm text-text-primary">AI Forecast Projections (H2)</h4>
            <p className="text-xs text-text-secondary">Includes confidence-interval forecasting margins</p>
          </div>
        </div>
 
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockForecast} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-bg-alt)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Projected" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" name="Projected Revenue ($)" />
              <Area type="monotone" dataKey="Actual" stroke="var(--info)" strokeWidth={2.5} fillOpacity={0} name="Actual Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
