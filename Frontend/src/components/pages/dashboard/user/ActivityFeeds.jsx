import { useNavigate } from 'react-router-dom';
import { FileText, Plus, CheckCircle, AlertTriangle, Clock, ArrowRight, Calendar } from 'lucide-react';

export default function ActivityFeeds({ reports, schedules, announcements, searchQuery }) {
  const navigate = useNavigate();

  const getRelativeTime = (date) => {
    const diffMs = new Date() - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffMs / 86400000)}d ago`;
  };

  const getSeverityColor = (severity) => {
    const colors = { critical: 'bg-red-50 text-red-600', high: 'bg-red-50 text-red-600', medium: 'bg-orange-50 text-orange-600', low: 'bg-emerald-50 text-emerald-600' };
    return colors[severity] || 'bg-gray-50 text-slate-600';
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'bg-orange-100 text-orange-700 border-orange-200', investigating: 'bg-blue-100 text-blue-700 border-blue-200', resolved: 'bg-green-100 text-green-700 border-green-200' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
      {/* Recent Incidents */}
      <div className="p-6 bg-white border shadow-sm lg:col-span-2 border-slate-100 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 text-orange-600 rounded-lg bg-orange-50">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-black text-blue-950">
              {searchQuery ? `Search Results (${reports.length})` : 'My Recent Incidents'}
            </h2>
          </div>
          <button onClick={() => navigate('/reports/create')} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200">
            <Plus size={18} /> New Incident
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-500">No matching incidents found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} onClick={() => navigate(`/reports/${report._id}`)} className="flex items-center gap-4 p-5 transition-all border cursor-pointer group border-slate-100 rounded-2xl hover:border-sky-300 hover:bg-sky-50/30">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${getSeverityColor(report.severity)}`}>
                  {report.status === 'resolved' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate transition-colors text-blue-950 group-hover:text-sky-600">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(report.status)}`}>{report.status}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400"><Clock size={12} /> {getRelativeTime(report.createdAt)}</span>
                  </div>
                </div>
                <ArrowRight className="transition-colors text-slate-300 group-hover:text-sky-500" size={20} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Schedules & Alerts Column */}
      <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 text-blue-600 rounded-lg bg-blue-50"><Calendar size={24} /></div>
          <h2 className="text-2xl font-black text-blue-950">Active Flows</h2>
        </div>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule._id} onClick={() => navigate(`/schedules/${schedule._id}`)} className="p-5 transition-all border-2 cursor-pointer border-sky-50 bg-sky-50/50 rounded-2xl hover:border-sky-300">
              <h3 className="mb-3 font-bold text-blue-950">{schedule.title}</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-sky-700"><Clock size={16} /> {schedule.startTime} - {schedule.endTime}</div>
            </div>
          ))}
        </div>

        {/* Announcements inside the side column */}
        <div className="pt-8 mt-8 border-t border-slate-100">
          <h3 className="mb-4 text-sm font-black tracking-widest uppercase text-blue-950">Critical Alerts</h3>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann._id} onClick={() => navigate(`/announcements/${ann._id}`)} className="flex items-start gap-3 p-4 transition-colors border border-red-100 cursor-pointer bg-red-50 rounded-xl hover:bg-red-100">
                <AlertTriangle className="flex-shrink-0 text-red-600" size={18} />
                <div>
                  <h4 className="text-xs font-bold leading-tight text-red-950">{ann.title}</h4>
                  <p className="text-[10px] font-medium text-red-700/80 mt-1 uppercase tracking-wider">{getRelativeTime(ann.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}