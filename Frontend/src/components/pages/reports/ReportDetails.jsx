import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, MessageSquare, Clock, MapPin, CheckCircle } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

function ReportDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin')

  const report = {
    id,
    title: 'No water supply',
    user: 'John Doe',
    severity: 'critical',
    status: 'investigating',
    description: 'There has been no water supply in our area since early this morning. This is affecting multiple households.',
    location: 'Westlands, House No. 123',
    createdAt: 'Today at 10:30 AM',
    updatedAt: 'Today at 2:45 PM',
    updates: [
      { time: '2:45 PM', message: 'Status updated to investigating', user: 'System' },
      { time: '1:30 PM', message: 'Report assigned to maintenance team', user: 'Admin' },
      { time: '10:30 AM', message: 'Report created', user: 'John Doe' },
    ]
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl p-8 bg-white shadow-sm rounded-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-blue-950">{report.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><MapPin size={16} />{report.location}</span>
              <span className="flex items-center gap-1"><Clock size={16} />{report.createdAt}</span>
            </div>
            {/* Admin sees who submitted */}
            {isAdmin && (
              <p className="mt-2 text-sm text-slate-600">
                Submitted by <span className="font-semibold text-sky-600">{report.user}</span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {/* Admin actions: change status + delete */}
            {isAdmin ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 font-semibold transition-all border rounded-lg text-emerald-600 border-emerald-300 hover:bg-emerald-50">
                  <CheckCircle size={18} />
                  Mark Resolved
                </button>
                <button className="px-4 py-2 font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              /* User actions: edit their own report (only if pending) */
              report.status === 'pending' && (
                <button
                  onClick={() => navigate(`/reports/edit/${id}`)}
                  className="flex items-center gap-2 px-4 py-2 font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
                >
                  <Edit size={18} />
                  Edit
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${report.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
            {report.severity}
          </span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${report.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {report.status}
          </span>
        </div>

        <div className="p-6 mb-8 border-l-4 rounded-lg bg-slate-50 border-sky-400">
          <h3 className="mb-2 font-semibold text-blue-950">Description</h3>
          <p className="text-slate-600">{report.description}</p>
        </div>

        <div>
          <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-blue-950">
            <MessageSquare size={24} />
            Updates
          </h3>
          <div className="space-y-4">
            {report.updates.map((update, idx) => (
              <div key={idx} className="p-4 border-l-4 rounded border-sky-300 bg-sky-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-blue-950">{update.message}</p>
                  <span className="px-2 py-1 text-xs font-semibold bg-white rounded text-slate-600">
                    {update.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600">by {update.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReportDetails