import React from 'react';
import { Wrench } from 'lucide-react';

export default function TechnicianHeader({ isHistoryView }) {
  return (
    <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase border rounded-lg text-emerald-400 border-emerald-400/20 bg-emerald-400/5">
          <Wrench size={14} />
          <span>Field Technician Console</span>
        </div>
        <h1 className="text-3xl font-black text-white md:text-4xl">
          {isHistoryView ? 'Job History' : 'Service Assignments'}
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-400">
          {isHistoryView ? 'Review your completed maintenance records.' : 'Manage your active maintenance tickets and repair logs.'}
        </p>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
    </div>
  );
}
