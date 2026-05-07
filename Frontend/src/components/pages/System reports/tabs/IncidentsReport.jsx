// IncidentsReport.jsx - WITH PDF DOWNLOAD BUTTON
import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, TrendingUp, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { usePdfExport } from '../../../hooks/usePdfExport';
import PrintableReport from '../PrintableReport';

export default function IncidentsReport({ processedIncidents }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all'); // all, resolved, unresolved
  const [viewMode, setViewMode] = useState('all'); // all, weekly, monthly

  // PDF Export hook
  const { componentRef, handlePrint } = usePdfExport();

  if (!processedIncidents || !processedIncidents.list) {
    return (
      <div className="p-12 text-center bg-white border rounded-2xl border-slate-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
          <AlertTriangle size={28} className="text-slate-400" />
        </div>
        <p className="font-medium text-slate-500">No incident data available</p>
        <p className="text-sm text-slate-400">Incidents will appear here once reported</p>
      </div>
    );
  }

  const incidents = processedIncidents.list;

  // PDF Columns
  const pdfColumns = [
    { label: 'Report Date', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { label: 'Supply Area', key: 'supplyArea', render: (row) => row.supplyArea || 'N/A' },
    { label: 'Issue Type', key: 'reportType', render: (row) => row.reportType?.replace(/_/g, ' ') || 'Other' },
    { label: 'Description', key: 'description', render: (row) => (row.description || row.title || 'No description')?.substring(0, 100) },
    { label: 'Status', key: 'status', align: 'center', render: (row) => ['Fixed', 'Resolved', 'Closed'].includes(row.status) ? 'Resolved' : 'Pending' },
  ];

  // PDF Summary Stats
  const pdfSummaryStats = {
    'Total Incidents': processedIncidents.total,
    'Resolved': processedIncidents.resolved,
    'Unresolved': processedIncidents.unresolved,
    'Resolution Rate': `${processedIncidents.resolutionRate}%`,
  };
  
  // Filter incidents by status
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return incidents;
    const isResolved = statusFilter === 'resolved';
    return incidents.filter(inc => 
      isResolved ? ['Fixed', 'Resolved', 'Closed'].includes(inc.status) : !['Fixed', 'Resolved', 'Closed'].includes(inc.status)
    );
  }, [incidents, statusFilter]);

  // Group data based on view mode
  const groupedData = useMemo(() => {
    if (viewMode === 'all') return { type: 'list', data: filteredByStatus };
    
    const groups = {};
    filteredByStatus.forEach(incident => {
      const d = new Date(incident.createdAt);
      let key;
      if (viewMode === 'weekly') {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = `Week of ${weekStart.toLocaleDateString()}`;
      } else {
        key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      if (!groups[key]) groups[key] = { total: 0, resolved: 0, unresolved: 0 };
      groups[key].total++;
      if (['Fixed', 'Resolved', 'Closed'].includes(incident.status)) {
        groups[key].resolved++;
      } else {
        groups[key].unresolved++;
      }
    });
    return { 
      type: 'grouped', 
      data: Object.entries(groups).map(([period, stats]) => ({
        period,
        ...stats,
        resolutionRate: stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0
      }))
    };
  }, [filteredByStatus, viewMode]);

  // Filter by search
  const filteredData = useMemo(() => {
    if (!searchTerm) return groupedData;
    
    if (groupedData.type === 'list') {
      return {
        ...groupedData,
        data: groupedData.data.filter(inc => 
          inc.supplyArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.status?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    } else {
      return {
        ...groupedData,
        data: groupedData.data.filter(group => 
          group.period.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    }
  }, [groupedData, searchTerm]);

  // Pagination
  const totalItems = filteredData.type === 'list' ? filteredData.data.length : filteredData.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = useMemo(() => {
    if (filteredData.type === 'list') {
      const start = (currentPage - 1) * itemsPerPage;
      return {
        ...filteredData,
        data: filteredData.data.slice(start, start + itemsPerPage)
      };
    }
    return filteredData;
  }, [filteredData, currentPage, itemsPerPage]);

  const getStatusBadge = (status) => {
    if (['Fixed', 'Resolved', 'Closed'].includes(status)) {
      return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, text: 'Resolved' };
    }
    return { color: 'bg-orange-100 text-orange-700', icon: XCircle, text: 'Pending' };
  };

  const getTypeBadge = (type) => {
    const colors = {
      water_outage: 'bg-red-100 text-red-700',
      water_quality: 'bg-yellow-100 text-yellow-700',
      infrastructure: 'bg-purple-100 text-purple-700',
      default: 'bg-slate-100 text-slate-700'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="space-y-6">
      {/* HIDDEN PDF COMPONENT */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableReport
          ref={componentRef}
          title="Incident Analytics Report"
          subtitle="Complete incident tracking and resolution data"
          data={incidents}
          columns={pdfColumns}
          summaryStats={pdfSummaryStats}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Total Incidents</p>
              <p className="text-2xl font-bold text-orange-900">{processedIncidents.total}</p>
            </div>
            <AlertTriangle size={32} className="text-orange-400" />
          </div>
        </div>
        <div className="p-4 border bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Resolved</p>
              <p className="text-2xl font-bold text-emerald-900">{processedIncidents.resolved}</p>
            </div>
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
        </div>
        <div className="p-4 border bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Resolution Rate</p>
              <p className="text-2xl font-bold text-amber-900">{processedIncidents.resolutionRate}%</p>
            </div>
            <TrendingUp size={32} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border rounded-2xl border-slate-100 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Incidents
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Monthly View
            </button>
            <div className="w-px h-8 mx-2 bg-slate-200" />
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle size={14} /> Resolved
            </button>
            <button
              onClick={() => setStatusFilter('unresolved')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'unresolved' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <XCircle size={14} /> Pending
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
            placeholder={viewMode === 'list' ? "Search by area, type, or status..." : "Search by period..."}
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
                {paginatedData.type === 'list' ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Report Date</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Supply Area</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Issue Type</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Description</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Period</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Total</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Resolved</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Pending</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Resolution Rate</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.type === 'list' ? (
                paginatedData.data.length > 0 ? (
                  paginatedData.data.map((incident, idx) => {
                    const statusInfo = getStatusBadge(incident.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={idx} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{incident.supplyArea || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getTypeBadge(incident.reportType)}`}>
                            {incident.reportType?.replace(/_/g, ' ') || 'Other'}
                          </span>
                        </td>
                        <td className="max-w-md px-6 py-4 text-sm truncate text-slate-600">
                          {incident.description || incident.title || 'No description'}
                        </td>
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
                      No incidents found matching your filters
                    </td>
                  </tr>
                )
              ) : (
                paginatedData.data.length > 0 ? (
                  paginatedData.data.map((group, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{group.period}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold rounded-full text-slate-700 bg-slate-100">
                          {group.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold rounded-full text-emerald-700 bg-emerald-50">
                          {group.resolved}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold text-orange-700 rounded-full bg-orange-50">
                          {group.unresolved}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${group.resolutionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-emerald-600">{group.resolutionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No data available for this period
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedData.type === 'list' && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50 border-slate-200 print:hidden">
            <p className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} incidents
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

      {/* Footer */}
      <div className="hidden text-xs text-center text-slate-400 print:block">
        Generated on {new Date().toLocaleString()} | Incident Report
      </div>
    </div>
  );
}