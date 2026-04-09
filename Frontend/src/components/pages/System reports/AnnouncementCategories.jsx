import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowLeft, Megaphone, Activity, Download, RefreshCw, BarChart2, PieChart as PieIcon } from 'lucide-react'

function AnnouncementCategories() {
  const navigate = useNavigate()
  useSearch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await analyticsService.getActivityAnalytics()
      if (res.success) setData(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data?.announcementsByCategory) return
    const rows = [
      ['Category', 'Count', 'Engagement %'],
      ...data.announcementsByCategory.map(c => [c._id || c.category, c.count || 0, (c.engagement || 0).toFixed(1)])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csv)
    link.download = 'announcement-categories.csv'
    link.click()
  }

  if (loading) return <DashboardLayout isAdmin={true}><div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div></div></DashboardLayout>

  const categories = data?.announcementsByCategory || []
  const totalAnnouncements = categories.reduce((s, c) => s + (c.count || 0), 0)
  const avgEngagement = categories.length > 0 ? (categories.reduce((s, c) => s + (c.engagement || 0), 0) / categories.length).toFixed(1) : 0
  const topCategory = categories.length > 0 ? categories.reduce((max, c) => (c.count || 0) > (max.count || 0) ? c : max) : null

  const Metric = ({ icon, label, val, sub, bg }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:shadow-lg hover:border-sky-200">
      <div className="flex items-center gap-2 mb-3"><div className={`p-2 rounded-lg ${bg}`}>{React.createElement(icon, { size: 24 })}</div></div>
      <div className="text-3xl font-black text-blue-950">{val}</div>
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  )

  const Chart = ({ icon, title, sub, children }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-lg bg-indigo-50">{React.createElement(icon, { size: 20 })}</div><div><h3 className="font-bold text-blue-950">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div></div>
      <div className="w-full h-64">{children}</div>
    </div>
  )

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-8 mb-8 rounded-2xl bg-blue-950 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 text-sky-400 hover:bg-blue-900 rounded-lg"><ArrowLeft size={24} /></button>
            <div><h1 className="text-3xl font-black text-white">Announcement Categories</h1><p className="text-xs text-slate-400">Communication patterns analysis</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><RefreshCw size={16} /></button>
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><Download size={16} /></button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Metric icon={Megaphone} label="Total Announcements" val={totalAnnouncements} sub="All time" bg="bg-indigo-50" />
        <Metric icon={Activity} label="Categories" val={categories.length} sub="Unique types" bg="bg-blue-50" />
        <Metric icon={BarChart2} label="Top Category" val={topCategory?.count || 0} sub={topCategory?._id || 'N/A'} bg="bg-purple-50" />
        <Metric icon={Megaphone} label="Avg Engagement" val={`${avgEngagement}%`} sub="Across categories" bg="bg-emerald-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Chart icon={BarChart2} title="Category Distribution" sub="Announcements by type">
          <ResponsiveContainer>
            <BarChart data={categories}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart icon={PieIcon} title="Category Pie" sub="Percentage breakdown">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={categories} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="_id">
                {categories.map((_, i) => <Cell key={i} fill={`hsl(${i * 60}, 70%, 50%)`} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <h3 className="font-bold text-blue-950 mb-4">Category Performance</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Category</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Announcements</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Engagement %</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Share %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-blue-950">{cat._id}</td>
                <td className="py-3 px-4">{cat.count}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{width: `${cat.engagement || 0}%`}}></div>
                    </div>
                    <span className="text-xs font-bold">{(cat.engagement || 0).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">{((cat.count / totalAnnouncements) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}

export default AnnouncementCategories
