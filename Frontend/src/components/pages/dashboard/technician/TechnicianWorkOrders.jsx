import React from 'react';
import { History, ClipboardList, CheckCircle, Zap, Droplets, Wrench } from 'lucide-react';

export default function TechnicianWorkOrders({ 
  isHistoryView, 
  filteredReports, 
  navigate, 
  handleOpenUpdate, 
  getSeverityColor, 
  getStatusColor, 
  getRelativeTime 
}) {
  return (
    <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isHistoryView ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isHistoryView ? <History size={24} /> : <ClipboardList size={24} />}
          </div>
          <h2 className="text-2xl font-black text-blue-950">
            {isHistoryView ? 'Completed Jobs' : 'Active Work Orders'}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            {isHistoryView ? (
              <>
                <History className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-blue-950">No History</h3>
                <p className="text-slate-500">You haven't completed any work orders yet.</p>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-blue-950">No Active Tasks</h3>
                <p className="text-slate-500">All your assigned work orders are currently completed.</p>
              </>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report._id}
              onClick={() => navigate(`/reports/${report._id}`)}
              className="group flex flex-col md:flex-row md:items-center gap-4 p-5 transition-all border border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-slate-50/50"
            >
              <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 border ${getSeverityColor(report.severity)}`}>
                <Zap size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-blue-950 truncate group-hover:text-emerald-600 transition-colors">{report.title}</h3>
                  {report.issueImage && (
                    <span title="Image Evidence Attached">
                      <Droplets size={12} className="text-sky-500 animate-pulse" />
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{report.ward} • {report.specificLocation} • {getRelativeTime(report.createdAt)}</p>
                <p className="text-sm text-slate-600 mt-2 line-clamp-1">{report.description}</p>
              </div>
              {!isHistoryView && (
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                  <button 
                    onClick={(e) => handleOpenUpdate(report, e)}
                    className="px-6 py-2.5 text-xs font-black text-white bg-blue-950 rounded-xl hover:bg-blue-900 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Wrench size={14} />
                    UPDATE LOG
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
