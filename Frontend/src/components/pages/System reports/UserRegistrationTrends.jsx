import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowLeft, Users, TrendingUp, Calendar, ShieldCheck, Download, RefreshCw, BarChart2, PieChart as PieIcon } from 'lucide-react'

function UserRegistrationTrends() {
  const navigate = useNavigate()
  useSearch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await analyticsService.getUserAnalytics()
      if (res.success) setData(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data?.registrationTrend) return
    const rows = [
      ['Month', 'Registrations', 'Cumulative', 'Growth %'],
      ...data.registrationTrend.map((item, i) => {
        const prev = data.registrationTrend[i - 1]
        const cum = data.registrationTrend.slice(0, i + 1).reduce((s, x) => s + x.users, 0)
        const gr = prev ? (((item.users - prev.users) / prev.users) * 100).toFixed(1) : 'N/A'
        return [item.name, item.users, cum, gr]
      })
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csv)
    link.download = 'user-registration-trends.csv'
    link.click()
  }

  if (loading) return <DashboardLayout isAdmin={true}><div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-900 animate-spin"></div></div></DashboardLayout>

  const trend = data?.registrationTrend || []
  const roles = data?.roleDistribution || []
  const total = trend.reduce((s, i) => s + i.users, 0)
  const latest = trend[trend.length - 1]
  const previous = trend[trend.length - 2]
  const growth = previous ? (((latest?.users - previous.users) / previous.users) * 100).toFixed(1) : 0
  const enhanced = trend.map((item, i) => ({ ...item, cum: trend.slice(0, i + 1).reduce((s, x) => s + x.users, 0) }))

  // eslint-disable-next-line no-unused-vars
  const Metric = ({ icon: I, label, val, sub, bg }) => (
    <div className="p-6 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-lg hover:border-sky-200">
      <div className="flex items-center gap-2 mb-3"><div className={`p-2 rounded-lg ${bg}`}><I size={24} /></div></div>
      <div className="text-3xl font-black text-blue-950">{val}</div>
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  )

  // eslint-disable-next-line no-unused-vars
  const Chart = ({ icon: I, title, sub, children }) => (
    <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-lg bg-blue-50"><I size={20} /></div><div><h3 className="font-bold text-blue-950">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div></div>
      <div className="w-full h-64">{children}</div>
    </div>
  )

  return (
    <DashboardLayout isAdmin={true}>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-blue-950">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg text-sky-400 hover:bg-blue-900"><ArrowLeft size={24} /></button>
            <div><h1 className="text-3xl font-black text-white">User Registration Trends</h1><p className="text-xs text-slate-400">User growth analysis</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><RefreshCw size={16} /></button>
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><Download size={16} /></button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 rounded-full w-96 h-96 bg-sky-500/10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Users} label="Total Users" val={total} sub="Last 6 months" bg="bg-blue-50" />
        <Metric icon={TrendingUp} label="Growth Rate" val={`${growth}%`} sub="Month over month" bg="bg-emerald-50" />
        <Metric icon={Calendar} label="Latest Month" val={latest?.users || 0} sub={latest?.name || 'N/A'} bg="bg-purple-50" />
        <Metric icon={ShieldCheck} label="User Roles" val={roles.length} sub="Active types" bg="bg-indigo-50" />
      </div>

      <div className="grid gap-8 mb-8 lg:grid-cols-2">
        <Chart icon={TrendingUp} title="Monthly Trend" sub="Registrations over time">
          <ResponsiveContainer>
            <AreaChart data={trend}>
              <defs><linearGradient id="g1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart icon={BarChart2} title="Cumulative Growth" sub="Total over time">
          <ResponsiveContainer>
            <LineChart data={enhanced}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cum" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Chart icon={ShieldCheck} title="Roles (Bar)" sub="Users by type">
          <ResponsiveContainer>
            <BarChart data={roles}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart icon={PieIcon} title="Roles (Pie)" sub="Distribution %">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={roles} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="_id">
                {roles.map((_, i) => <Cell key={i} fill={`hsl(${i * 60}, 70%, 50%)`} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    </DashboardLayout>
  )
}

export default UserRegistrationTrends
