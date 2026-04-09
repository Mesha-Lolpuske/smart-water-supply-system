import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowLeft, AlertTriangle, TrendingUp, Activity, Download, RefreshCw, BarChart2, Clock, CheckCircle, XCircle } from 'lucide-react'

function IncidentSeverityDistribution() {
  const navigate = useNavigate()
  useSearch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await analyticsService.getIncidentAnalytics()
      if (res.success) setData(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data) return
    const severity = data.severityDistribution || []
    const trend = data.incidentTrend || []
    const rows = [
      ['Severity', 'Count'],
      ...severity.map(s => [s._id || s.level, s.count || 0]),
      [''],
      ['Month', 'Incidents'],
      ...trend.map(t => [t._id || t.name, t.count || t.reports || 0])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csv)
    link.download = 'incident-severity.csv'
    link.click()
  }

  if (loading) return <DashboardLayout isAdmin={true}><div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div></div></DashboardLayout>

  const severity = data?.severityDistribution || []
  const trend = data?.incidentTrend || []
  const critical = severity.find(s => s._id === 'critical')?.count || 0
  const high = severity.find(s => s._id === 'high')?.count || 0
  const total = severity.reduce((s, i) => s + (i.count || 0), 0)

  const severityData = [
    { level: 'Critical', icon: XCircle, color: '#ef4444', count: critical },
    { level: 'High', icon: AlertTriangle, color: '#f97316', count: high },
    { level: 'Medium', icon: Clock, color: '#3b82f6', count: severity.find(s => s._id === 'medium')?.count || 0 },
    { level: 'Low', icon: CheckCircle, color: '#10b981', count: severity.find(s => s._id === 'low')?.count || 0 }
  ]

  const Metric = ({ label, val, color }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:shadow-lg">
      <div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></div></div>
      <div className="text-3xl font-black text-blue-950">{val}</div>
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
    </div>
  )

  const Chart = ({ icon, title, sub, children }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-lg bg-orange-50">{React.createElement(icon, { size: 20 })}</div><div><h3 className="font-bold text-blue-950">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div></div>
      <div className="w-full h-64">{children}</div>
    </div>
  )

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-8 mb-8 rounded-2xl bg-blue-950 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 text-sky-400 hover:bg-blue-900 rounded-lg"><ArrowLeft size={24} /></button>
            <div><h1 className="text-3xl font-black text-white">Incident Severity Analysis</h1><p className="text-xs text-slate-400">Severity breakdown & trends</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><RefreshCw size={16} /></button>
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><Download size={16} /></button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Metric label="Critical" val={critical} color="#ef4444" />
        <Metric label="High" val={high} color="#f97316" />
        <Metric label="Medium" val={severity.find(s => s._id === 'medium')?.count || 0} color="#3b82f6" />
        <Metric label="Total" val={total} color="#6366f1" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Chart icon={BarChart2} title="Distribution" sub="By severity level">
          <ResponsiveContainer>
            <BarChart data={severity}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart icon={PieChart} title="Severity Pie" sub="Percentage breakdown">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={severity} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="_id">
                {severity.map((_, i) => <Cell key={i} fill={severityData[i]?.color || '#ccc'} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <Chart icon={TrendingUp} title="Incident Trend" sub="Reports over time">
        <ResponsiveContainer>
          <LineChart data={trend}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} />
            <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} name="Incidents" />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    </DashboardLayout>
  )
}

export default IncidentSeverityDistribution
