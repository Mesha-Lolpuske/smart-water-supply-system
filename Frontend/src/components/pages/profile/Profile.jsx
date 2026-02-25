import DashboardLayout from '../../layout/DashboardLayout'
import { Edit, Mail, Phone, MapPin, User, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254745903567',
    location: 'Westlands, Nairobi',
    zone: 'Zone A',
    accountType: isAdmin ? 'Administrator' : 'Resident',
    memberSince: 'January 2024',
    reportsSubmitted: 5,
    avatar: isAdmin ? '👨‍💼' : '👤'
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-sky-200">Manage your account information</p>
      </div>

      <div className="max-w-4xl">
        <div className="p-8 mb-8 bg-white shadow-sm rounded-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-20 h-20 text-4xl rounded-full shadow-lg bg-gradient-to-br from-sky-400 to-sky-300">
                {profile.avatar}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-950">{profile.name}</h2>
                <p className="text-slate-600">{profile.accountType}</p>
                <p className="text-sm text-slate-500">Member since {profile.memberSince}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(isAdmin ? '/admin/profile/edit' : '/profile/edit')}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="p-8 mb-8 bg-white shadow-sm rounded-xl">
          <h3 className="mb-6 text-2xl font-bold text-blue-950">Contact Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <Mail className="flex-shrink-0 mt-1 text-sky-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-semibold text-blue-950">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="flex-shrink-0 mt-1 text-sky-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-semibold text-blue-950">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="flex-shrink-0 mt-1 text-sky-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="font-semibold text-blue-950">{profile.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <User className="flex-shrink-0 mt-1 text-sky-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Water Zone</p>
                <p className="font-semibold text-blue-950">{profile.zone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <p className="mb-2 text-sm text-slate-600">Reports Submitted</p>
            <p className="text-4xl font-bold text-sky-600">{profile.reportsSubmitted}</p>
          </div>
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <p className="mb-2 text-sm text-slate-600">Account Status</p>
            <p className="text-lg font-bold text-emerald-600">Active</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </DashboardLayout>
  )
}

export default Profile