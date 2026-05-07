// SchedulesReport.jsx - WITH PDF DOWNLOAD BUTTON
import React, { useState, useMemo } from 'react';
import { Search, Droplet, Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { usePdfExport } from '../../../hooks/usePdfExport';
import PrintableReport from '../PrintableReport';

export default function SchedulesReport({ rawData, timeFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('all'); // all, weekly, monthly

  const schedules = rawData?.detailed?.waterSchedules || [];

  // PDF Export hook
  const { componentRef, handlePrint } = usePdfExport();

  // PDF Columns
  const pdfColumns = [
    { label: 'Title', key: 'title', render: (row) => row.title || 'Untitled' },
    { label: 'Supply Area', key: 'supplyArea', render: (row) => row.supplyArea || 'All Areas' },
    { label: 'Type', key: 'scheduleType', render: (row) => row.scheduleType || 'Regular' },
    { label: 'Days', key: 'daysOfWeek', render: (row) => row.daysOfWeek?.join(', ') || 'Full Week' },
    { label: 'Time', key: 'time', render: (row) => `${row.startTime || 'N/A'} - ${row.endTime || 'N/A'}` },
  ];

  // PDF Summary Stats
  const pdfSummaryStats = {
    'Total Schedules': schedules.length,
    'Regular': schedules.filter(s => s.scheduleType === 'regular').length,
    'Maintenance': schedules.filter(s => s.scheduleType === 'maintenance').length,
    'Emergency': schedules.filter(s => s.scheduleType === 'emergency').length,
    'Areas Covered': [...new Set(schedules.map(s => s.supplyArea).filter(Boolean))].length,
  };

  if (!schedules.length) {
    return (
      <div className="p-12 text-center bg-white border rounded-2xl border-slate-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
          <Droplet size={28} className="text-slate-400" />
        </div>
        <p className="font-medium text-slate-500">No water schedules available</p>
        <p className="text-sm text-slate-400">Create schedules to manage water distribution</p>
      </div>
    );
  }

  // Group data based on view mode
  const groupedData = useMemo(() => {
    if (viewMode === 'all') return { type: 'list', data: schedules };
    
    const groups = {};
    schedules.forEach(schedule => {
      // Use createdAt if available, otherwise use current date
      const date = schedule.createdAt ? new Date(schedule.createdAt) : new Date();
      let key;
      if (viewMode === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `Week of ${weekStart.toLocaleDateString()}`;
      } else {
        key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(schedule);
    });
    return { 
      type: 'grouped', 
      data: Object.entries(groups).map(([period, periodSchedules]) => ({
        period,
        count: periodSchedules.length,
        schedules: periodSchedules,
        byType: periodSchedules.reduce((acc, s) => {
          const type = s.scheduleType || 'regular';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      }))
    };
  }, [schedules, viewMode]);

  // Filter by search
  const filteredData = useMemo(() => {
    if (!searchTerm) return groupedData;
    
    if (groupedData.type === 'list') {
      return {
        ...groupedData,
        data: groupedData.data.filter(schedule => 
          schedule.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.supplyArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.scheduleType?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getTypeBadge = (type) => {
    const colors = {
      emergency: 'bg-red-100 text-red-700',
      maintenance: 'bg-orange-100 text-orange-700',
      rationing: 'bg-yellow-100 text-yellow-700',
      regular: 'bg-emerald-100 text-emerald-700',
      default: 'bg-slate-100 text-slate-700'
    };
    return colors[type] || colors.default;
  };

  // Summary stats
  const regularCount = schedules.filter(s => s.scheduleType === 'regular').length;
  const maintenanceCount = schedules.filter(s => s.scheduleType === 'maintenance').length;
  const emergencyCount = schedules.filter(s => s.scheduleType === 'emergency').length;
  const areas = [...new Set(schedules.map(s => s.supplyArea).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* HIDDEN PDF COMPONENT */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableReport
          ref={componentRef}
          title="Water Schedules Report"
          subtitle={`Complete water distribution schedule data - ${timeFilter === 'all' ? 'All Time' : 'Last 30 Days'}`}
          data={schedules}
          columns={pdfColumns}
          summaryStats={pdfSummaryStats}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="p-4 border bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700">Total Schedules</p>
              <p className="text-2xl font-bold text-emerald-900">{schedules.length}</p>
            </div>
            <Droplet size={28} className="text-emerald-400" />
          </div>
        </div>
        <div className="p-4 border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Regular</p>
              <p className="text-2xl font-bold text-blue-900">{regularCount}</p>
            </div>
            <Calendar size={28} className="text-blue-400" />
          </div>
        </div>
        <div className="p-4 border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700">Maintenance</p>
              <p className="text-2xl font-bold text-orange-900">{maintenanceCount}</p>
            </div>
            <Clock size={28} className="text-orange-400" />
          </div>
        </div>
        <div className="p-4 border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-700">Emergency</p>
              <p className="text-2xl font-bold text-red-900">{emergencyCount}</p>
            </div>
            <MapPin size={28} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Coverage Info */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">📋 Coverage:</span> {areas.length} supply area(s) • 
          {regularCount > 0 && ` ${regularCount} regular schedule(s)`}
          {maintenanceCount > 0 && ` • ${maintenanceCount} maintenance`}
          {emergencyCount > 0 && ` • ${emergencyCount} emergency`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border rounded-2xl border-slate-100 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Schedules
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Monthly View
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
            placeholder={viewMode === 'list' ? "Search by title, area, or type..." : "Search by period..."}
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
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Title</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Supply Area</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Type</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Days</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Time</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Period</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Total Schedules</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Regular</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Maintenance</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">Emergency</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.type === 'list' ? (
                paginatedData.data.length > 0 ? (
                  paginatedData.data.map((schedule, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{schedule.title || 'Untitled'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{schedule.supplyArea || 'All Areas'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getTypeBadge(schedule.scheduleType)}`}>
                          {schedule.scheduleType || 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {schedule.daysOfWeek?.join(', ') || 'Full Week'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-sm text-slate-700">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No schedules found matching your search
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
                          {group.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-center text-emerald-600">
                        {group.byType.regular || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-center text-orange-600">
                        {group.byType.maintenance || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-center text-red-600">
                        {group.byType.emergency || 0}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} schedules
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
        Generated on {new Date().toLocaleString()} | Water Schedule Report
      </div>
    </div>
  );
}