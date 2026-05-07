import React from 'react';

// eslint-disable-next-line no-unused-vars
export default function MetricCard({ icon: Icon, label, value, subtext, colorClass }) {
  return (
    <div className="p-6 transition-all duration-300 bg-white border shadow-sm rounded-2xl border-slate-100 hover:shadow-md group">
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <h4 className="mb-1 text-sm font-semibold tracking-wider uppercase text-slate-500">{label}</h4>
      <div className="mb-1 text-3xl font-bold text-slate-900">{value}</div>
      <p className="text-xs font-medium text-slate-400">{subtext}</p>
    </div>
  );
}
