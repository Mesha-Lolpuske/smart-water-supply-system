import DashboardLayout from '../../layout/DashboardLayout'
import { Bell, Trash2, Eye, X, Clock, CheckCircle, Info, AlertTriangle, Plus, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { notificationService } from '../../services/notificationService'
import { useSearch } from '../../context/SearchContext'

function Notifications() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const { searchQuery, setSearchQuery } = useSearch()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [, setError] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = isAdmin 
        ? await notificationService.getAllNotifications()
        : await notificationService.getMyNotifications()
      
      if (res.success) {
        let notifs = res.notifications || []
        
        // DEDUPLICATION FOR ADMIN VIEW
        if (isAdmin) {
          const seen = new Set()
          notifs = notifs.filter(n => {
            // Group by title, message and approximate time (within 10 seconds)
            const timeKey = Math.floor(new Date(n.createdAt).getTime() / 10000)
            const key = `${n.title}-${n.message}-${timeKey}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
        }
        
        setNotifications(notifs)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Failed to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (notif) => {
    setSelectedNotification(notif)
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id)
        setNotifications(prev => 
          prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
        )
      } catch (err) {
        console.error('Error marking as read:', err)
      }
    }
  }

  const handleClose = () => setSelectedNotification(null)

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await notificationService.deleteNotification(id)
        setNotifications(prev => prev.filter(n => n._id !== id))
        if (selectedNotification?._id === id) setSelectedNotification(null)
      } catch {
        toast.error('Failed to delete')
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch {
      toast.error('Failed to update notifications')
    }
  }

  const getRelativeTime = (date) => {
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

  const filteredNotifications = notifications.filter(n => {
    const query = (searchQuery || '').toLowerCase().trim()
    if (!query) return true
    return (
      n.title.toLowerCase().includes(query) ||
      n.message.toLowerCase().includes(query) ||
      (n.type && n.type.toLowerCase().includes(query))
    )
  })

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle className="text-red-500" size={20} />
      case 'report': return <Info className="text-blue-500" size={20} />
      case 'schedule': return <Calendar className="text-sky-500" size={20} />
      case 'announcement': return <Megaphone className="text-orange-500" size={20} />
      case 'system': return <Settings className="text-slate-500" size={20} />
      default: return <Bell className="text-sky-500" size={20} />
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
          <p className="text-xs font-black tracking-widest uppercase text-blue-950">Syncing alerts...</p>
        </div>
      </DashboardLayout>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="relative p-8 mb-8 overflow-hidden text-white shadow-xl rounded-2xl bg-blue-950">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Notification Center</h1>
            <p className="mt-2 text-lg font-medium text-sky-300/70">System alerts, report updates, and broadcasts.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/notifications/create')}
                className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-black transition-all rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 shadow-lg shadow-sky-400/20 active:scale-95 uppercase tracking-widest"
              >
                <Plus size={18} />
                DISPATCH ALERT
              </button>
            )}
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-6 py-3 text-xs font-black tracking-widest uppercase transition-all border rounded-xl bg-white/10 hover:bg-white/20 border-white/10"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      {searchQuery && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="text-sky-600" size={20} />
            <p className="text-sm font-bold text-blue-950">
              Showing alerts for: <span className="text-sky-600 font-black">"{searchQuery}"</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
              {filteredNotifications.length} match(es)
            </span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-black transition-colors text-sky-600 hover:text-sky-800 underline underline-offset-4"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
            <Bell className="w-20 h-20 mx-auto mb-6 text-slate-200" size={60} />
            <h3 className="mb-2 text-2xl font-black text-blue-950">
              {searchQuery ? 'No Matching Alerts' : 'Inbox Clear'}
            </h3>
            <p className="max-w-sm mx-auto text-slate-500">
              {searchQuery ? 'Try searching for something else.' : 'You have no new notifications at this time.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`group relative p-6 rounded-2xl transition-all border-2 ${
                notif.isRead 
                  ? 'bg-slate-50/50 border-slate-100 opacity-75' 
                  : 'bg-white border-sky-100 shadow-lg shadow-sky-900/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${notif.isRead ? 'bg-slate-100' : 'bg-sky-50 shadow-inner'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex flex-col">
                      <h3 className={`text-lg font-black transition-colors ${notif.isRead ? 'text-slate-500' : 'text-blue-950 group-hover:text-sky-600'}`}>
                        {notif.title}
                      </h3>
                      {isAdmin && (
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mt-0.5">
                          Recipient: {notif.recipient?.name || 'User'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {getRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed line-clamp-1 ${notif.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 mt-4 transition-opacity border-t opacity-0 border-slate-50 group-hover:opacity-100">
                <button 
                  onClick={() => handleView(notif)}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black transition-all rounded-lg text-blue-950 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest"
                >
                  <Eye size={14} />
                  Open
                </button>
                <button 
                  onClick={() => handleDelete(notif._id)}
                  className="p-2 text-red-400 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              {!notif.isRead && (
                <div className="absolute w-2 h-2 rounded-full shadow-lg top-6 right-6 bg-sky-500 shadow-sky-500/50"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modern Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm" onClick={handleClose}>
          <div 
            className="w-full max-w-xl overflow-hidden duration-200 bg-white shadow-2xl rounded-3xl animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-8 text-white bg-blue-950">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                  {getIcon(selectedNotification.type)}
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 transition-all rounded-xl bg-white/5 hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="mb-2 text-2xl font-black">{selectedNotification.title}</h2>
              <div className="flex items-center gap-4 text-xs font-bold text-sky-300/60 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(selectedNotification.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="p-6 mb-8 border-2 bg-slate-50 rounded-2xl border-slate-100">
                <p className="text-lg font-medium leading-relaxed text-slate-700">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleClose}
                  className="flex-1 px-6 py-4 text-xs font-black tracking-widest uppercase transition-all rounded-xl text-blue-950 bg-slate-100 hover:bg-slate-200"
                >
                  DISMISS
                </button>
                <button 
                  onClick={() => handleDelete(selectedNotification._id)}
                  className="px-6 py-4 text-xs font-black tracking-widest text-red-600 uppercase transition-all bg-red-50 hover:bg-red-100 rounded-xl"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Notifications