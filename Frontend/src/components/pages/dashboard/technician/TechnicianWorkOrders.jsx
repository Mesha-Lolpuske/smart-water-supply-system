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
    <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
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
          <div className="py-20 text-center border-2 border-dashed bg-slate-50 rounded-2xl border-slate-200">
            {isHistoryView ? (
              <>
                <History className="mx-auto mb-4 text-slate-300" size={48} />
                <h3 className="text-xl font-bold text-blue-950">No History</h3>
                <p className="text-slate-500">You haven't completed any work orders yet.</p>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
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
              className="flex flex-col gap-4 p-5 transition-all border cursor-pointer group md:flex-row md:items-center border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-slate-50/50"
            >
              <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 border ${getSeverityColor(report.severity)}`}>
                <Zap size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold truncate transition-colors text-blue-950 group-hover:text-emerald-600">{report.title}</h3>
                  {report.issueImage && (
                    <span title="Image Evidence Attached">
                      <Droplets size={12} className="text-sky-500 animate-pulse" />
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                {/* CHANGED: Swapped report.ward for report.supplyArea to fix the missing location bug */}
                <p className="text-xs font-medium text-slate-500 mt-0.5">{report.supplyArea} • {report.specificLocation} • {getRelativeTime(report.createdAt)}</p>
                <p className="mt-2 text-sm text-slate-600 line-clamp-1">{report.description}</p>
              </div>
              {!isHistoryView && (
                <div className="flex items-center justify-between gap-2 md:flex-col md:items-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenUpdate(report);
                    }}
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