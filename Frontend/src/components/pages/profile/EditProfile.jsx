import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, User as UserIcon, Mail, Phone, MapPin, Map } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { profileService } from '../../services/profileService'

function EditProfile() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zone: 'Zone A'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        zone: user.zone || 'Zone A'
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await profileService.updateProfile(formData)
      if (res.success) {
        // Update global auth state with new user data
        login(res.data.user)
        navigate(isAdmin ? '/admin/profile' : '/profile')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-slate-500 hover:text-blue-950 font-black text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 bg-blue-950 text-white">
            <h1 className="text-3xl font-black mb-2">Edit Profile</h1>
            <p className="text-sky-300/70 font-medium">Keep your contact information up to date.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  <UserIcon size={14} className="text-sky-500" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-blue-950" 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  <Mail size={14} className="text-sky-500" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-blue-950" 
                  placeholder="john@example.com"
                  required 
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  <Phone size={14} className="text-sky-500" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-blue-950" 
                  placeholder="+254..."
                />
              </div>

              {/* Water Zone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  <Map size={14} className="text-sky-500" />
                  Water Supply Zone
                </label>
                <select 
                  name="zone" 
                  value={formData.zone} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-blue-950 appearance-none"
                >
                  <option value="Zone A">Zone A (Northern)</option>
                  <option value="Zone B (Central)">Zone B (Central)</option>
                  <option value="Zone C (Southern)">Zone C (Southern)</option>
                  <option value="Zone D (Western)">Zone D (Western)</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  <MapPin size={14} className="text-sky-500" />
                  Residential Address
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-blue-950" 
                  placeholder="Street, Building, Apartment No."
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 font-black rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 active:scale-95 shadow-lg shadow-sky-400/20 transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="flex-1 px-8 py-4 font-black rounded-xl text-slate-500 border-2 border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditProfile