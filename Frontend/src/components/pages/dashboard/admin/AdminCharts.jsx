import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

export default function AdminCharts({ stats, trendData }) {
  const statusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Reported', value: stats.reports?.pending || 0, color: '#f97316' },
      { name: 'In Progress', value: stats.reports?.investigating || 0, color: '#3b82f6' },
      { name: 'Fixed', value: stats.reports?.resolved || 0, color: '#10b981' },
    ];
  }, [stats]);

  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
      <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 text-blue-600 rounded-lg bg-blue-50">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-xl font-black text-blue-950">System Activity Trend</h2>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 8}} name="Incident Reports" />
              <Line type="monotone" dataKey="schedules" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 8}} name="Flow Schedules" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 text-orange-600 rounded-lg bg-orange-50">
            <PieIcon size={24} />
          </div>
          <h2 className="text-xl font-black text-blue-950">Incident Status Distribution</h2>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
