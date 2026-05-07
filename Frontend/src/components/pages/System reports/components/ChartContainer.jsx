import React from 'react';
import { ResponsiveContainer } from 'recharts';

export default function ChartContainer({ title, sub, children }) {
  return (
    <div className="flex flex-col p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
      <div className="flex-1 w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}