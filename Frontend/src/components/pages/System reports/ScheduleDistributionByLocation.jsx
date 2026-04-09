import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowLeft, MapPin, Activity, Download, RefreshCw, BarChart2, PieChart as PieIcon } from 'lucide-react'

function ScheduleDistributionByLocation() {
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
    if (!data?.schedulesByLocation) return
    const rows = [
      ['Location', 'Schedules', 'Activity Level'],
      ...data.schedulesByLocation.map(s => [s._id || s.location, s.count || 0, s.activityLevel || 'N/A'])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csv)
    link.download = 'schedule-distribution.csv'
    link.click()
  }

  if (loading) return <DashboardLayout isAdmin={true}><div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-900 animate-spin"></div></div></DashboardLayout>

  const locations = data?.schedulesByLocation || []
  const totalSchedules = locations.reduce((s, l) => s + (l.count || 0), 0)
  const totalLocations = locations.length
  
  const activityLevels = {
    high: locations.filter(l => (l.count || 0) > 10).length,
    medium: locations.filter(l => (l.count || 0) >= 5 && (l.count || 0) <= 10).length,
    low: locations.filter(l => (l.count || 0) < 5).length
  }

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
      <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-lg bg-purple-50"><I size={20} /></div><div><h3 className="font-bold text-blue-950">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div></div>
      <div className="w-full h-64">{children}</div>
    </div>
  )

  return (
    <DashboardLayout isAdmin={true}>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-blue-950">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg text-sky-400 hover:bg-blue-900"><ArrowLeft size={24} /></button>
            <div><h1 className="text-3xl font-black text-white">Schedule Distribution</h1><p className="text-xs text-slate-400">Geographic analysis of schedules</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><RefreshCw size={16} /></button>
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><Download size={16} /></button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 rounded-full w-96 h-96 bg-sky-500/10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={MapPin} label="Total Locations" val={totalLocations} sub="Unique areas" bg="bg-purple-50" />
        <Metric icon={Activity} label="Total Schedules" val={totalSchedules} sub="Active schedules" bg="bg-blue-50" />
        <Metric icon={BarChart2} label="High Activity" val={activityLevels.high} sub=">10 schedules" bg="bg-red-50" />
        <Metric icon={BarChart2} label="Avg per Location" val={(totalSchedules / totalLocations).toFixed(1)} sub="Per location" bg="bg-emerald-50" />
      </div>

      <div className="grid gap-8 mb-8 lg:grid-cols-2">
        <Chart icon={BarChart2} title="Distribution" sub="Schedules by location">
          <ResponsiveContainer>
            <BarChart data={locations} layout="vertical">
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis dataKey="_id" type="category" tick={{fontSize: 12, fill: '#64748b'}} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart icon={PieIcon} title="Activity Levels" sub="Schedule density">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[
                {name: 'High', value: activityLevels.high},
                {name: 'Medium', value: activityLevels.medium},
                {name: 'Low', value: activityLevels.low}
              ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                <Cell fill="#ef4444" />
                <Cell fill="#f97316" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="p-6 overflow-x-auto bg-white border shadow-sm rounded-2xl border-slate-100">
        <h3 className="mb-4 font-bold text-blue-950">Location Details</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-left text-slate-600">Location</th>
              <th className="px-4 py-3 font-bold text-left text-slate-600">Schedules</th>
              <th className="px-4 py-3 font-bold text-left text-slate-600">Activity</th>
              <th className="px-4 py-3 font-bold text-left text-slate-600">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locations.map((loc, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-blue-950">{loc._id}</td>
                <td className="px-4 py-3">{loc.count}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${loc.count > 10 ? 'bg-red-100 text-red-700' : loc.count >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {loc.count > 10 ? 'High' : loc.count >= 5 ? 'Medium' : 'Low'}
                  </span>
                </td>
                <td className="px-4 py-3">{((loc.count / totalSchedules) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}

export default ScheduleDistributionByLocation
