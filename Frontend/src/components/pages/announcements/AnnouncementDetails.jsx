import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, Calendar, User, AlertCircle } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

function AnnouncementDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin')

  const announcement = {
    id,
    title: 'Water Shortage Alert',
    type: 'alert',
    urgent: true,
    content: 'Limited water supply is expected in Zone A for the next 48 hours due to maintenance work on the main distribution line. We recommend residents store water for essential use and minimize non-essential consumption during this period.',
    author: 'Admin User',
    createdAt: 'Today at 2:30 PM',
    updatedAt: 'Today at 3:15 PM',
    affectedZones: ['Zone A', 'Zone B'],
    views: 1250
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl p-8 bg-white shadow-sm rounded-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {announcement.urgent && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                  <AlertCircle size={14} />
                  Urgent
                </span>
              )}
              <span className="px-3 py-1 text-xs font-bold rounded-full text-sky-700 bg-sky-100">
                {announcement.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-blue-950">{announcement.title}</h1>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/announcements/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
              >
                <Edit size={18} />
                Edit
              </button>
              <button className="px-4 py-2 font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 pb-6 mb-8 border-b-2 border-sky-200">
          <div className="flex items-center gap-2 text-slate-600">
            <User size={18} />
            <span>{announcement.author}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            <span>{announcement.createdAt}</span>
          </div>
          <div className="text-sm text-slate-600">Updated: {announcement.updatedAt}</div>
        </div>

        <div className="p-6 mb-8 border-l-4 rounded-lg bg-sky-50 border-sky-400">
          <h3 className="mb-3 font-semibold text-blue-950">Content</h3>
          <p className="leading-relaxed text-slate-700">{announcement.content}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 border-2 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
            <p className="mb-2 text-sm text-slate-600">Affected Zones</p>
            <div className="flex flex-wrap gap-2">
              {announcement.affectedZones.map((zone, idx) => (
                <span key={idx} className="px-3 py-1 text-sm font-semibold bg-white border rounded-full text-sky-700 border-sky-300">
                  {zone}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 border-2 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <p className="mb-2 text-sm text-slate-600">Views</p>
            <p className="text-3xl font-bold text-emerald-600">{announcement.views.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AnnouncementDetails