// UsersReport.jsx - COMPLETE WORKING VERSION
import React, { useState, useMemo } from 'react';
import { Search, Calendar, Download, Filter, ChevronLeft, ChevronRight, Eye, Users as UsersIcon } from 'lucide-react';
import { usePdfExport } from '../../../hooks/usePdfExport';
import PrintableReport from '../PrintableReport';

export default function UsersReport({ processedUsers, timeFilter, rawData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('all');
  
  // PDF Export hook
  const { componentRef, handlePrint } = usePdfExport();

  if (!processedUsers || !processedUsers.list) {
    return (
      <div className="p-12 text-center bg-white border rounded-2xl border-slate-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
          <UsersIcon size={28} className="text-slate-400" />
        </div>
        <p className="font-medium text-slate-500">No user data available</p>
        <p className="text-sm text-slate-400">Check back later for user registrations</p>
      </div>
    );
  }

  const users = processedUsers.list;
  
  // PDF columns
  const pdfColumns = [
    { label: 'Registration Date', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { label: 'Full Name', key: 'name', render: (row) => row.name || 'N/A' },
    { label: 'Email', key: 'email', render: (row) => row.email || 'N/A' },
    { label: 'Role', key: 'role', align: 'center', render: (row) => row.role || 'User' },
    { label: 'Month Joined', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) },
  ];

  const pdfSummaryStats = {
    'Total Users': users.length,
    'This Month': users.filter(u => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    'Active Roles': [...new Set(users.map(u => u.role))].filter(Boolean).length,
  };
  
  // Group data based on view mode
  const groupedData = useMemo(() => {
    if (viewMode === 'all') return { type: 'list', data: users };
    
    const groups = {};
    users.forEach(user => {
      const d = new Date(user.createdAt);
      let key;
      if (viewMode === 'weekly') {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = `Week of ${weekStart.toLocaleDateString()}`;
      } else {
        key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(user);
    });
    return { type: 'grouped', data: Object.entries(groups).map(([period, periodUsers]) => ({
      period,
      count: periodUsers.length,
      users: periodUsers
    })) };
  }, [users, viewMode]);

  // Filter by search
  const filteredData = useMemo(() => {
    if (!searchTerm) return groupedData;
    
    if (groupedData.type === 'list') {
      return {
        ...groupedData,
        data: groupedData.data.filter(user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700',
      technician: 'bg-blue-100 text-blue-700',
      user: 'bg-emerald-100 text-emerald-700',
      default: 'bg-slate-100 text-slate-700'
    };
    return colors[role?.toLowerCase()] || colors.default;
  };

  return (
    <div className="space-y-6">
      {/* HIDDEN PDF COMPONENT */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableReport
          ref={componentRef}
          title="User Activity Report"
          subtitle={`Complete user registration data - ${timeFilter === 'all' ? 'All Time' : timeFilter === '30d' ? 'Last 30 Days' : 'Last 7 Days'}`}
          data={users}
          columns={pdfColumns}
          summaryStats={pdfSummaryStats}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border rounded-2xl border-slate-100 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'weekly' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'monthly' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Monthly View
          </button>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={viewMode === 'list' ? "Search users..." : "Search by period..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 py-2 pl-10 pr-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          
          {/* DOWNLOAD BUTTON */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all shadow-md bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-emerald-200"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-5 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-blue-800 uppercase">Total Registrations</h3>
            <p className="text-3xl font-bold text-blue-900">{users.length}</p>
            <p className="mt-1 text-xs text-blue-600">as of {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700">
              {viewMode === 'monthly' ? 'Monthly breakdown' : viewMode === 'weekly' ? 'Weekly breakdown' : 'Complete list'}
            </p>
          </div>
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
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Registration Date</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Full Name</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Email</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Role</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Month Joined</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Period</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center uppercase text-slate-500">New Users</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Growth Trend</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.type === 'list' ? (
                paginatedData.data.length > 0 ? (
                  paginatedData.data.map((user, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">{user.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.role)}`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users found matching your search
                    </td>
                  </tr>
                )
              ) : (
                paginatedData.data.length > 0 ? (
                  paginatedData.data.map((group, idx) => {
                    const maxCount = Math.max(...paginatedData.data.map(g => g.count), 0);
                    const percentage = maxCount > 0 ? (group.count / maxCount) * 100 : 0;
                    return (
                      <tr key={idx} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{group.period}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold text-blue-700 rounded-full bg-blue-50">
                            {group.count}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div 
                                className="h-full transition-all bg-blue-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{percentage.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
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
    </div>
  );
}