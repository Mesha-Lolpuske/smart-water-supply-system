/* eslint-disable no-unused-vars */
import DashboardLayout from '../../layout/DashboardLayout'
import { Plus, Megaphone, Calendar, Eye, Trash2, Edit, AlertCircle, Clock, Search } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { announcementService } from '../../services/announcement'
import { useSearch } from '../../context/SearchContext'

function AnnouncementsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery } = useSearch()
  const isAdmin = location.pathname.startsWith('/admin')

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await announcementService.getAllAnnouncements()
      if (res.success) {
        setAnnouncements(res.announcements || [])
      }
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setError('Failed to load announcements.')
    } finally {
      setLoading(false)
    }
  }

  const filteredAnnouncements = announcements.filter(ann => {
    const query = (searchQuery || '').toLowerCase().trim()
    if (!query) return true
    
    return (
      ann.title.toLowerCase().includes(query) ||
      (ann.content && ann.content.toLowerCase().includes(query)) ||
      (ann.category && ann.category.toLowerCase().includes(query))
    )
  })

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        const res = await announcementService.deleteAnnouncement(id)
        if (res.success) {
          setAnnouncements(prev => prev.filter(a => a._id !== id))
          toast.success('Deleted successfully')
        }
      } catch (error) {
        toast.error('Failed to delete')
      }
    }
  }

  function getRelativeTime(date) {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
          <p className="text-xs font-black tracking-widest uppercase text-blue-950">Fetching announcements...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="relative p-8 mb-8 overflow-hidden text-white shadow-xl rounded-2xl bg-blue-950">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="text-sky-400" size={32} />
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Public Notices</h1>
            </div>
            <p className="text-lg font-medium text-sky-200/80">Stay informed about infrastructure changes and system alerts.</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin/announcements/create')}
              className="flex items-center justify-center gap-2 px-8 py-4 font-black transition-all shadow-lg rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 shadow-sky-400/20 active:scale-95"
            >
              <Plus size={20} />
              NEW NOTICE
            </button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      {searchQuery && (
        <div className="mb-8 p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="text-sky-600" size={20} />
            <p className="text-sm font-bold text-blue-950">
              Filtering notices for: <span className="text-sky-600 font-black">"{searchQuery}"</span>
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
            {filteredAnnouncements.length} match(es)
          </span>
        </div>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
            <Megaphone className="w-20 h-20 mx-auto mb-6 text-slate-200" size={60} />
            <h3 className="mb-2 text-2xl font-black text-blue-950">
              {searchQuery ? 'No Matching Notices' : 'No Recent Notices'}
            </h3>
            <p className="max-w-sm mx-auto text-slate-500">
              {searchQuery ? 'Try a different keyword.' : 'All systems are operating normally. Check back later for updates.'}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div key={ann._id} className={`group p-8 rounded-2xl transition-all border-2 ${ann.priority === 'high' || ann.priority === 'urgent' ? 'border-red-100 bg-red-50/30' : 'border-slate-50 bg-white shadow-sm hover:shadow-xl hover:border-sky-100'}`}>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-black leading-tight transition-colors text-blue-950 group-hover:text-blue-600">{ann.title}</h3>
                    {(ann.priority === 'high' || ann.priority === 'urgent') && (
                      <span className="flex-shrink-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-red-500 rounded-lg shadow-lg shadow-red-500/20 flex items-center gap-1">
                        <AlertCircle size={12} />
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <p className="max-w-3xl mb-6 font-medium leading-relaxed text-slate-600 line-clamp-2">{ann.content || ann.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={14} className="text-sky-500" />
                      {getRelativeTime(ann.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar size={14} className="text-sky-500" />
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 md:flex-col min-w-max">
                  <button
                    onClick={() => navigate(isAdmin ? `/admin/announcements/${ann._id}` : `/announcements/${ann._id}`)}
                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all rounded-xl text-blue-950 bg-slate-100 hover:bg-slate-200"
                  >
                    <Eye size={16} />
                    READ
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/announcements/${ann._id}/edit`)}
                        className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-950 rounded-xl hover:bg-blue-900"
                      >
                        <Edit size={16} />
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleDelete(ann._id)}
                        className="flex items-center justify-center p-3 text-red-600 transition-all border border-red-100 bg-red-50 rounded-xl hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

export default AnnouncementsPage