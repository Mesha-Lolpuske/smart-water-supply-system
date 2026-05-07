import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Send, Users, User, AlertTriangle, Bell, CheckCircle, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { notificationService } from '../../services/notificationService'
import { userService } from '../../services/userService'
import { njoroAreas } from '../../utils/njoroData'

function CreateNotification() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    recipientType: 'broadcast', // 'broadcast', 'region', or 'individual'
    recipient: '',
    supplyArea: 'All Areas',
    title: '',
    message: '',
    type: 'info',
    priority: 'normal'
  })

  useEffect(() => {
    if (formData.recipientType === 'individual') {
      fetchUsers()
    }
  }, [formData.recipientType])

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true)
      const res = await userService.getAllUsers()
      if (res.success) {
        // Only show verified users as they are the 'verified citizens' with valid phone numbers
        setUsers(res.users.filter(u => u.isVerified))
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Could not load verified citizen list')
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.recipientType === 'individual' && !formData.recipient) {
      setError('Please select a recipient')
      return
    }

    if (formData.recipientType === 'region' && (!formData.supplyArea || formData.supplyArea === 'All Areas')) {
      setError('Please select a specific region')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      let res;
      if (formData.recipientType === 'broadcast' || formData.recipientType === 'region') {
        // Use broadcast endpoint with optional supplyArea
        res = await notificationService.broadcastNotification({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          priority: formData.priority,
          supplyArea: formData.recipientType === 'region' ? formData.supplyArea : 'All Areas'
        })
      } else {
        // Use individual create endpoint
        res = await notificationService.createNotification({
          recipient: formData.recipient,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          priority: formData.priority
        })
      }

      if (res.success) {
        toast.success('Notification sent successfully!')
        navigate('/admin/notifications')
      }
    } catch (err) {
      console.error('Error sending notification:', err)
      setError(err.response?.data?.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout isAdmin={true}>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-6 font-black text-sky-600 hover:text-sky-700 transition-colors uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={20} />
        Back to Alerts
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-2xl rounded-3xl border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-blue-950 text-white">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Dispatch Alert</h1>
            <p className="text-slate-500 font-medium">Send a system notification to citizens</p>
          </div>
        </div>

        <hr className="my-8 border-slate-100" />

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Selection */}
          <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-100">
            <label className="block mb-4 text-xs font-black text-blue-950 uppercase tracking-widest">
              Select Audience
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, recipientType: 'broadcast'})}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all border-2 text-[10px] tracking-tighter ${
                  formData.recipientType === 'broadcast' 
                    ? 'bg-blue-950 text-white border-blue-950 shadow-lg' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'
                }`}
              >
                <Users size={18} />
                ALL CITIZENS
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, recipientType: 'region'})}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all border-2 text-[10px] tracking-tighter ${
                  formData.recipientType === 'region' 
                    ? 'bg-blue-950 text-white border-blue-950 shadow-lg' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'
                }`}
              >
                <MessageSquare size={18} />
                BY REGION
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, recipientType: 'individual'})}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all border-2 text-[10px] tracking-tighter ${
                  formData.recipientType === 'individual' 
                    ? 'bg-blue-950 text-white border-blue-950 shadow-lg' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'
                }`}
              >
                <User size={18} />
                SPECIFIC USER
              </button>
            </div>

            {formData.recipientType === 'region' && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Choose Region
                </label>
                <select
                  name="supplyArea"
                  value={formData.supplyArea}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl border-sky-200 focus:outline-none focus:border-sky-400 bg-white"
                  required
                >
                  <option value="">Select a region...</option>
                  {njoroAreas.map(area => (
                    <option key={area.id} value={area.name}>{area.name}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.recipientType === 'individual' && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Choose Recipient
                </label>
                <select
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl border-sky-200 focus:outline-none focus:border-sky-400 bg-white"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                {fetchingUsers && <p className="mt-2 text-xs text-sky-600 animate-pulse font-bold">Loading user database...</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xs font-black text-blue-950 uppercase tracking-widest">Alert Heading</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 rounded-xl border-sky-200 focus:outline-none focus:border-sky-400" 
              placeholder="e.g., Water Quality Update"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-xs font-black text-blue-950 uppercase tracking-widest">Alert Category</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-xl border-sky-200 focus:outline-none focus:border-sky-400"
              >
                <option value="info">General Information</option>
                <option value="alert">Critical Alert / Warning</option>
                <option value="system">System Update</option>
                <option value="announcement">Announcement related</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-black text-blue-950 uppercase tracking-widest">Priority Level</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-xl border-sky-200 focus:outline-none focus:border-sky-400"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs font-black text-blue-950 uppercase tracking-widest">Message Body</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              rows="5" 
              className="w-full px-4 py-3 border-2 rounded-xl resize-none border-sky-200 focus:outline-none focus:border-sky-400" 
              placeholder="Describe the alert in detail..."
              required 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-4 font-black text-white transition-all rounded-2xl bg-blue-950 hover:bg-blue-900 shadow-xl shadow-blue-950/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Transmitting...' : (
                <>
                  <Send size={20} />
                  SEND NOTIFICATION
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 px-6 py-4 font-black transition-all border-2 rounded-2xl text-blue-950 border-sky-300 hover:bg-sky-50 uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default CreateNotification
