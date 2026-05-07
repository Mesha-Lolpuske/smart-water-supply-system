/* eslint-disable no-unused-vars */
import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, Calendar, User, AlertCircle, Map } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { announcementService } from '../../services/announcement'
import { toast } from 'react-toastify'

function AnnouncementDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await announcementService.getAnnouncementById(id)
        if (res.success) {
          setAnnouncement(res.announcement)
        }
      } catch (err) {
        toast.error("Failed to load announcement details")
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const res = await announcementService.deleteAnnouncement(id)
        if (res.success) {
          toast.success('Announcement deleted successfully')
          navigate('/admin/announcements')
        }
      } catch (err) {
        toast.error('Failed to delete announcement')
      }
    }
  }

  if (loading) return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
      </div>
    </DashboardLayout>
  )

  if (!announcement) return null

  const isUrgent = announcement.priority === 'high' || announcement.priority === 'urgent'

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
              {isUrgent && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                  <AlertCircle size={14} />
                  Urgent
                </span>
              )}
              <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full text-sky-700 bg-sky-100">
                {announcement.category}
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
              <button 
                onClick={handleDelete}
                className="px-4 py-2 font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b-2 border-sky-200">
          <div className="flex items-center gap-2 text-slate-600">
            <User size={18} />
            <span>{announcement.createdBy?.name || 'System Admin'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            <span>Published: {new Date(announcement.publishDate).toLocaleDateString()}</span>
          </div>
          {announcement.expiryDate && (
             <div className="flex items-center gap-2 px-3 py-1 text-sm font-bold text-orange-700 rounded-lg bg-orange-50">
               <Calendar size={16} />
               Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
             </div>
          )}
        </div>

        <div className="p-6 mb-8 border-l-4 rounded-lg bg-sky-50 border-sky-400">
          <h3 className="mb-3 font-semibold text-blue-950">Content</h3>
          <p className="leading-relaxed whitespace-pre-wrap text-slate-700">{announcement.content}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 border-2 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-600">
              <Map size={16} />
              Target Supply Area
            </p>
            <span className="px-4 py-1.5 text-sm font-bold bg-white border shadow-sm rounded-full text-sky-700 border-sky-300">
              {announcement.supplyArea || 'All Areas'}
            </span>
          </div>
          <div className="p-4 border-2 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <p className="mb-2 text-sm font-semibold text-slate-600">Total Views</p>
            <p className="text-3xl font-bold text-emerald-600">{announcement.views || 1}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AnnouncementDetails