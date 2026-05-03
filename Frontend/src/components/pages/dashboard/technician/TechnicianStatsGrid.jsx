import React from 'react';
import { ClipboardList, Clock, CheckSquare, AlertTriangle } from 'lucide-react';

export default function TechnicianStatsGrid({ stats }) {
  const mainStats = [
    { icon: ClipboardList, label: 'Work Orders', value: stats.total, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Clock, label: 'Active Tasks', value: stats.pending, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: CheckSquare, label: 'Completed', value: stats.resolved, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: AlertTriangle, label: 'High Priority', value: stats.critical, bg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {mainStats.map((stat, index) => (
        <div key={index} className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-xl ${stat.bg}`}>
            <stat.icon className={stat.iconColor} size={24} />
          </div>
          <div className="text-3xl font-black text-blue-950">{stat.value}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
