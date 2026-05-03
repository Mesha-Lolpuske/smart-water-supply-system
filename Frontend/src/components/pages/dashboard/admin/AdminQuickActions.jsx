import { useNavigate } from 'react-router-dom';
import { Calendar, Megaphone, Users, Settings, Zap } from 'lucide-react';

export default function AdminQuickActions({ actions }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
        <h3 className="flex items-center gap-2 mb-6 text-sm font-black tracking-widest uppercase text-blue-950">
          <Zap className="text-sky-500" size={16} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <button 
              key={i}
              onClick={() => navigate(action.path)}
              className={`p-4 text-left border border-slate-100 rounded-xl transition-all group border-slate-200 ${action.bg}`}
            >
              <action.icon className={`${action.color} mb-2 group-hover:scale-110 transition-transform`} size={20} />
              <p className="text-xs font-bold text-blue-950">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border bg-gradient-to-br from-blue-50 to-sky-50 border-sky-100 rounded-2xl">
        <h3 className="mb-4 text-sm font-black tracking-widest uppercase text-blue-950">Network Distribution</h3>
        <div className="space-y-4">
          {[
            { zone: 'Njoro Central', load: '65%', color: 'bg-sky-500' },
            { zone: 'Egerton Hub', load: '92%', color: 'bg-red-500' },
            { zone: 'Kihingo Grid', load: '40%', color: 'bg-emerald-500' },
          ].map((grid, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span className="uppercase text-slate-600">{grid.zone}</span>
                <span className="text-blue-950">{grid.load} Capacity</span>
              </div>
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                <div className={`h-full ${grid.color}`} style={{ width: grid.load }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
