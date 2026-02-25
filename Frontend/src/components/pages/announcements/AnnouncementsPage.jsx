import DashboardLayout from '../../layout/DashboardLayout'
import { Plus, Megaphone, Calendar, Eye } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function AnnouncementsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin')

  const announcements = [
    { id: 1, title: 'Water Shortage Alert', content: 'Limited supply expected in Zone A for the next 48 hours', date: 'Today', urgent: true },
    { id: 2, title: 'Scheduled Maintenance', content: 'System maintenance on Sunday from 10 PM to 6 AM', date: 'Yesterday', urgent: false },
    { id: 3, title: 'New Schedule Released', content: 'Updated water distribution schedule for the month', date: '2 days ago', urgent: false },
    { id: 4, title: 'Service Improvement', content: 'We are upgrading our water quality monitoring system', date: '1 week ago', urgent: false },
  ]

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="flex items-center justify-between p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Megaphone size={32} />
            Announcements
          </h1>
          <p className="text-sky-200">
            {isAdmin ? 'Manage system announcements' : 'Latest updates from AquaTrack'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin/announcements/create')}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-400 to-sky-300 hover:shadow-lg"
          >
            <Plus size={20} />
            New Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className={`p-6 rounded-lg transition-all ${ann.urgent ? 'border-l-4 border-orange-500 bg-orange-50' : 'border-l-4 border-sky-400 bg-white shadow-sm hover:shadow-md'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-950">{ann.title}</h3>
                <p className="mt-2 text-slate-600">{ann.content}</p>
              </div>
              {ann.urgent && (
                <span className="flex-shrink-0 px-3 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">Urgent</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={14} />
                {ann.date}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(isAdmin ? `/admin/announcements/${ann.id}` : `/announcements/${ann.id}`)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-all border rounded-lg text-sky-600 border-sky-300 hover:bg-sky-50"
                >
                  <Eye size={16} />
                  View
                </button>

                {isAdmin && (
                  <button
                    onClick={() => navigate(`/admin/announcements/${ann.id}/edit`)}
                    className="px-3 py-2 text-sm font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default AnnouncementsPage