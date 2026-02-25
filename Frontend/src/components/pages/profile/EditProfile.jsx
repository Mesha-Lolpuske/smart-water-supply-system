import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

function EditProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254745903567',
    location: 'Westlands, Nairobi',
    zone: 'Zone A'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Profile updated successfully!')
    navigate(isAdmin ? '/admin/profile' : '/profile')
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sky-600 hover:text-sky-700 font-semibold"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-blue-950 mb-2">Edit Profile</h1>
        <p className="text-slate-600 mb-8">Update your account information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Water Zone</label>
            <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:border-sky-400">
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg transition-all">
              <Save size={20} />
              Save Changes
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 font-semibold rounded-lg text-blue-950 border-2 border-sky-300 hover:bg-sky-50 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default EditProfile