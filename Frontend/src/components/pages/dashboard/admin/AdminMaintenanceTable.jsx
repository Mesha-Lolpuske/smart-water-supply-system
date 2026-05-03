import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Zap, MapPin, Droplets } from 'lucide-react';

export default function AdminMaintenanceTable({ reports, searchQuery }) {
  const navigate = useNavigate();

  const getRelativeTime = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return 'bg-orange-100 text-orange-700';
      case 'Technician Assigned': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-sky-100 text-sky-700';
      case 'Fixed': return 'bg-emerald-100 text-emerald-700';
      case 'Resolved': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 bg-white border shadow-sm lg:col-span-2 border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 text-red-600 rounded-lg bg-red-50">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-2xl font-black text-blue-950">
            {searchQuery ? `Search Results (${reports.length})` : 'Active Infrastructure Incidents'}
          </h2>
        </div>
        <button 
          onClick={() => navigate('/admin/reports')}
          className="text-sm font-bold underline text-sky-600 hover:text-sky-700 underline-offset-4"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        {reports.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed bg-slate-50 rounded-2xl border-slate-200">
            <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
            <h3 className="text-xl font-bold text-blue-950">
              {searchQuery ? 'No Matching Records' : 'All Clear'}
            </h3>
            <p className="text-slate-500">
              {searchQuery ? 'Try a different search term.' : 'No urgent infrastructure reports currently require attention.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-2 py-3">Severity</th>
                <th className="px-2 py-3">Incident / Area</th>
                <th className="px-2 py-3">Technician</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.map((report) => (
                <tr 
                  key={report._id}
                  onClick={() => navigate(`/admin/reports/${report._id}`)}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-2 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${getSeverityColor(report.severity)}`}>
                      <Zap size={14} />
                    </span>
                  </td>
                  <td className="px-2 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-blue-950 group-hover:text-blue-600 transition-colors truncate max-w-[180px]">
                        {report.title}
                      </p>
                      {report.issueImage && (
                        <span title="Image Evidence Attached">
                          <Droplets size={12} className="text-sky-500 animate-pulse" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin size={10} /> {report.location}
                    </p>
                  </td>
                  <td className="px-2 py-4 text-slate-600 font-medium">
                    {report.assignedTo?.name || <span className="text-slate-300 italic">Unassigned</span>}
                  </td>
                  <td className="px-2 py-4">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-md ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-right text-[10px] font-bold text-slate-400">
                    {getRelativeTime(report.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
