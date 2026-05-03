import { Users, FileText, Wrench, CheckCircle, Activity } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  const mainStats = [
    { icon: Users, label: 'Total Citizens', value: stats?.users?.total || 0, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: FileText, label: 'New Reports', value: stats?.reports?.pending || 0, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Wrench, label: 'Work In Progress', value: stats?.reports?.investigating || 0, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: CheckCircle, label: 'Resolved Tickets', value: stats?.reports?.resolved || 0, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {mainStats.map((stat, index) => (
        <div key={index} className="p-6 transition-all duration-300 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-sky-100 group">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={stat.iconColor} size={28} />
            </div>
            <Activity className="text-blue-200 transition-opacity opacity-0 group-hover:opacity-100" size={20} />
          </div>
          <div className="text-3xl font-black text-blue-950">{stat.value}</div>
          <div className="text-sm font-bold tracking-wider uppercase text-slate-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
