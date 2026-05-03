import { useState, useEffect } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { userService } from '../../services/userService'
import { Search, User, Shield, Wrench, Trash2, Edit2, Check, X, Filter, UserCheck, UserMinus, MoreVertical } from 'lucide-react'
import { toast } from 'react-toastify'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  // 1. Updated editForm state to use supplyArea instead of zone
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', phone: '', supplyArea: '' })
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await userService.getAllUsers()
      if (res.success) {
        setUsers(res.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await userService.deleteUser(id)
        if (res.success) {
          setUsers(users.filter(u => u._id !== id))
          toast.success('User deleted successfully')
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  const handleUpdateRole = async (id, newRole) => {
    try {
      const res = await userService.updateUserRole(id, newRole)
      if (res.success) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u))
        toast.success(`User role updated to ${newRole}`)
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const startEdit = (user) => {
    setEditingUser(user._id)
    setEditForm({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      phone: user.phone || '', 
      // 2. Map supplyArea to the edit form with a default fallback
      supplyArea: user.supplyArea || 'Njoro Center' 
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
  }

  const handleSaveEdit = async (id) => {
    try {
      const res = await userService.updateUser(id, editForm)
      if (res.success) {
        setUsers(users.map(u => u._id === id ? { ...u, ...editForm } : u))
        setEditingUser(null)
        toast.success('User details updated')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user details')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={16} className="text-blue-600" />
      case 'technician': return <Wrench size={16} className="text-emerald-600" />
      default: return <User size={16} className="text-slate-600" />
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'technician': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-bold text-blue-950">Loading User Management...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-blue-950 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white md:text-4xl uppercase tracking-tight">Citizen & Staff Control</h1>
          <p className="mt-2 text-lg font-medium text-sky-300/80 italic">Manage account permissions, roles, and system access.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search citizens by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-blue-950"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent outline-none font-bold text-blue-950 pr-8 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Citizens (Users)</option>
            <option value="technician">Technicians</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Citizen / Staff</th>
                {/* 3. Updated Table Header */}
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact / Area</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">System Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Reports</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <UserMinus className="mx-auto text-slate-200 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-blue-950">No Accounts Found</h3>
                    <p className="text-slate-500">No users match your current filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-sky-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-3 py-1.5 text-sm border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none font-bold"
                            placeholder="Full Name"
                          />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="w-full px-3 py-1.5 text-sm border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Email Address"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-white ${
                            user.role === 'admin' ? 'bg-blue-600' : user.role === 'technician' ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-blue-950">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="w-full px-3 py-1.5 text-sm border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Phone Number"
                          />
                          {/* 4. Updated Dropdown to Njoro areas */}
                          <select
                            value={editForm.supplyArea}
                            onChange={(e) => setEditForm({...editForm, supplyArea: e.target.value})}
                            className="w-full px-3 py-1.5 text-sm border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                          >
                            <option value="Njoro Center">Njoro Center</option>
                            <option value="Egerton University Area">Egerton University Area</option>
                            <option value="Kihingo Ward">Kihingo Ward</option>
                            <option value="Lare Ward">Lare Ward</option>
                            <option value="Nesuit">Nesuit</option>
                            <option value="Mau Narok">Mau Narok</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-blue-950">{user.phone || 'No phone'}</p>
                          {/* 5. Display the new supplyArea instead of zone */}
                          <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{user.supplyArea || 'No Area'}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="px-3 py-1.5 text-sm border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                        >
                          <option value="user">User</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest ${getRoleBadgeClass(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-blue-950">{user.reports || 0}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Reports</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUser === user._id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSaveEdit(user._id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Save Changes"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Edit"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserManagement