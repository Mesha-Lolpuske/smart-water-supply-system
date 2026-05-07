// PerformanceReport.jsx - WITH PDF DOWNLOAD BUTTON
import React, { useState, useMemo } from 'react';
import { Search, Wrench, CheckCircle, XCircle, User, Calendar, ChevronLeft, ChevronRight, TrendingUp, Download } from 'lucide-react';
import { usePdfExport } from '../../../hooks/usePdfExport';
import PrintableReport from '../PrintableReport';

export default function PerformanceReport({ rawData, timeFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all'); // all, solved, unsolved

  const maintenanceLogs = rawData?.detailed?.maintenanceLogs || [];

  // PDF Export hook
  const { componentRef, handlePrint } = usePdfExport();

  // PDF Columns
  const pdfColumns = [
    { label: 'Date', key: 'createdAt', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A' },
    { label: 'Technician', key: 'assignedTo', render: (row) => row.assignedTo?.name || 'Unassigned' },
    { label: 'Job Title', key: 'title', render: (row) => row.title || 'Untitled Job' },
    { label: 'Issue Type', key: 'issueType', render: (row) => row.issueType || 'Maintenance' },
    { label: 'Supply Area', key: 'supplyArea', render: (row) => row.supplyArea || 'N/A' },
    { label: 'Status', key: 'status', align: 'center', render: (row) => ['Resolved', 'Fixed'].includes(row.status) ? 'Solved' : 'Unsolved' },
  ];

  // PDF Summary Stats
  const totalJobs = maintenanceLogs.length;
  const solvedJobs = maintenanceLogs.filter(l => ['Resolved', 'Fixed'].includes(l.status)).length;
  const unsolvedJobs = totalJobs - solvedJobs;
  const overallRate = totalJobs > 0 ? ((solvedJobs / totalJobs) * 100).toFixed(1) : 0;

  const pdfSummaryStats = {
    'Total Jobs': totalJobs,
    'Solved': solvedJobs,
    'Unsolved': unsolvedJobs,
    'Completion Rate': `${overallRate}%`,
    'Technicians': [...new Set(maintenanceLogs.map(l => l.assignedTo?.name).filter(Boolean))].length,
  };

  if (!maintenanceLogs.length) {
    return (
      <div className="p-12 text-center bg-white border rounded-2xl border-slate-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
          <Wrench size={28} className="text-slate-400" />
        </div>
        <p className="font-medium text-slate-500">No maintenance logs available</p>
        <p className="text-sm text-slate-400">Technician performance data will appear here</p>
      </div>
    );
  }

  // Filter by status
  const filteredLogs = useMemo(() => {
    if (statusFilter === 'all') return maintenanceLogs;
    const isSolved = statusFilter === 'solved';
    return maintenanceLogs.filter(log => 
      isSolved ? ['Resolved', 'Fixed'].includes(log.status) : !['Resolved', 'Fixed'].includes(log.status)
    );
  }, [maintenanceLogs, statusFilter]);

  // Filter by search
  const filteredData = useMemo(() => {
    if (!searchTerm) return filteredLogs;
    return filteredLogs.filter(log => 
      log.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.supplyArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredLogs, searchTerm]);

  // Technician performance summary
  const techSummary = useMemo(() => {
    const summary = {};
    maintenanceLogs.forEach(log => {
      const techName = log.assignedTo?.name || 'Unassigned';
      if (!summary[techName]) {
        summary[techName] = { total: 0, solved: 0, unsolved: 0 };
      }
      summary[techName].total++;
      if (['Resolved', 'Fixed'].includes(log.status)) {
        summary[techName].solved++;
      } else {
        summary[techName].unsolved++;
      }
    });
    return Object.entries(summary).map(([name, stats]) => ({
      name,
      ...stats,
      rate: stats.total > 0 ? ((stats.solved / stats.total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.rate - a.rate);
  }, [maintenanceLogs]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const getStatusBadge = (status) => {
    if (['Resolved', 'Fixed'].includes(status)) {
      return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, text: 'Solved' };
    }
    return { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Unsolved' };
  };

  return (
    <div className="space-y-6">
      {/* HIDDEN PDF COMPONENT */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableReport
          ref={componentRef}
          title="Technician Performance Report"
          subtitle={`Complete maintenance job tracking data - ${timeFilter === 'all' ? 'All Time' : 'Last 30 Days'}`}
          data={maintenanceLogs}
          columns={pdfColumns}
          summaryStats={pdfSummaryStats}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="p-4 border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700">Total Jobs</p>
              <p className="text-2xl font-bold text-purple-900">{totalJobs}</p>
            </div>
            <Wrench size={28} className="text-purple-400" />
          </div>
        </div>
        <div className="p-4 border bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700">Solved</p>
              <p className="text-2xl font-bold text-emerald-900">{solvedJobs}</p>
            </div>
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
        </div>
        <div className="p-4 border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-700">Unsolved</p>
              <p className="text-2xl font-bold text-red-900">{unsolvedJobs}</p>
            </div>
            <XCircle size={28} className="text-red-400" />
          </div>
        </div>
        <div className="p-4 border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-900">{overallRate}%</p>
            </div>
            <TrendingUp size={28} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* Technician Leaderboard */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
        <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
          <User size={16} /> Technician Performance Ranking
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techSummary.map((tech, idx) => {
            const rankColors = [
              'bg-yellow-100 text-yellow-700 border-yellow-200',
              'bg-slate-100 text-slate-700 border-slate-200',
              'bg-orange-100 text-orange-700 border-orange-200',
              'bg-blue-100 text-blue-700 border-blue-200'
            ];
            return (
              <div key={tech.name} className={`p-3 rounded-xl border ${rankColors[Math.min(idx, 3)]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{tech.name}</p>
                    <p className="text-xs opacity-75">{tech.solved}/{tech.total} jobs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{tech.rate}%</p>
                    <p className="text-xs opacity-75">success rate</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-current rounded-full"
                    style={{ width: `${tech.rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border rounded-2xl border-slate-100 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'solved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle size={14} /> Solved Only
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'unsolved' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <XCircle size={14} /> Unsolved Only
            </button>
          </div>
          
          {/* DOWNLOAD BUTTON */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all shadow-md bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-emerald-200"
          >
            <Download size={16} /> Download PDF Report
          </button>
        </div>
        
        <div className="relative">
          <Search size={18} className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by technician, issue, or area..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 pl-10 pr-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-slate-50 border-slate-200">
                <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Date</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Technician</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Issue / Job Title</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Supply Area</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((log, idx) => {
                  const statusInfo = getStatusBadge(log.status);
                  const StatusIcon = statusInfo.icon;
                  const jobMonth = log.createdAt ? new Date(log.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown';
                  return (
                    <tr key={idx} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A'}</div>
                        <div className="text-xs text-slate-400">{jobMonth}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">{log.assignedTo?.name || 'Unassigned'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{log.title || 'Untitled Job'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{log.description?.substring(0, 60) || 'No description'}</div>
                       </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.supplyArea || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          <StatusIcon size={12} />
                          {statusInfo.text}
                        </span>
                       </td>
                     </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No jobs found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50 border-slate-200 print:hidden">
            <p className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} jobs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white border rounded-lg border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border rounded-lg border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Note for Print */}
      <div className="hidden text-xs text-center text-slate-400 print:block">
        Generated on {new Date().toLocaleString()} | Technician Performance Report
      </div>
    </div>
  );
}