import DashboardLayout from '../../layout/DashboardLayout'
import { Bell, Trash2, Eye } from 'lucide-react'
import { useLocation } from 'react-router-dom'

function Notifications() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const notifications = [
    { id: 1, title: 'Water Supply Update', message: 'Morning supply schedule has been updated for your zone', time: '30 mins ago', read: false, type: 'update' },
    { id: 2, title: 'Report Status Changed', message: 'Your report #1234 status has been updated to investigating', time: '2 hours ago', read: false, type: 'report' },
    { id: 3, title: 'Maintenance Notice', message: 'Scheduled maintenance on Sunday from 10 PM to 6 AM', time: '5 hours ago', read: true, type: 'maintenance' },
    { id: 4, title: 'Emergency Alert', message: 'Water contamination detected in Zone B - avoid using tap water', time: '1 day ago', read: true, type: 'alert' },
  ]

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Bell size={32} />
          Notifications
        </h1>
        <p className="text-sky-200">Manage your water supply alerts and updates</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-6 rounded-lg border-l-4 transition-all ${notif.read ? 'bg-slate-50 border-slate-300' : 'bg-white border-sky-400 shadow-md'}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-blue-950">{notif.title}</h3>
                <p className="mt-1 text-slate-600">{notif.message}</p>
              </div>
              {!notif.read && <span className="flex-shrink-0 w-3 h-3 mt-2 rounded-full bg-sky-500"></span>}
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">{notif.time}</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-all border rounded-lg text-sky-600 border-sky-300 hover:bg-sky-50">
                  <Eye size={16} />
                  View
                </button>
                <button className="px-3 py-2 text-sm font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default Notifications