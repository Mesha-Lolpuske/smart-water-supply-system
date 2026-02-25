import DashboardLayout from '../../layout/DashboardLayout'
import { Users, Search, Edit, Trash2, X, Save } from 'lucide-react'
import { useState } from 'react'

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', zone: 'Zone A', status: 'active', reports: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', zone: 'Zone B', status: 'active', reports: 3 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', zone: 'Zone C', status: 'inactive', reports: 1 },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', zone: 'Zone A', status: 'active', reports: 7 },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user.id)
    setEditForm({ ...user })
  }

  // Save edited user
  const handleEditSave = () => {
    setUsers(users.map(u => u.id === editingUser ? { ...editForm } : u))
    setEditingUser(null)
  }

  // Delete user
  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id))
    setDeleteConfirmId(null)
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Users size={32} />
          User Management
        </h1>
        <p className="text-sky-200">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 p-4 mb-6 bg-white border-2 shadow-sm rounded-xl border-sky-200">
        <Search size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white border-l-4 border-blue-400 rounded-lg shadow-sm">
          <p className="text-sm text-slate-600">Total Users</p>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="p-4 bg-white border-l-4 rounded-lg shadow-sm border-emerald-400">
          <p className="text-sm text-slate-600">Active</p>
          <p className="text-2xl font-bold text-emerald-600">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="p-4 bg-white border-l-4 border-red-400 rounded-lg shadow-sm">
          <p className="text-sm text-slate-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === 'inactive').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white border-2 shadow-sm rounded-xl border-sky-100">
        <table className="w-full">
          <thead className="text-white bg-gradient-to-r from-blue-950 to-blue-900">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-left">User</th>
              <th className="px-6 py-4 text-sm font-semibold text-left">Zone</th>
              <th className="px-6 py-4 text-sm font-semibold text-left">Reports</th>
              <th className="px-6 py-4 text-sm font-semibold text-left">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-all hover:bg-sky-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-gradient-to-br from-sky-400 to-blue-500">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.zone}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-bold rounded-full text-sky-700 bg-sky-100">
                    {user.reports} reports
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(user.id)}
                      className="px-3 py-2 text-sm font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-950">Edit User</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 transition-all rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-blue-950">Full Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-blue-950">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-blue-950">Zone</label>
                <select
                  value={editForm.zone || ''}
                  onChange={(e) => setEditForm({ ...editForm, zone: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                  <option value="Zone D">Zone D</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-blue-950">Status</label>
                <select
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleEditSave}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm p-8 mx-4 text-center bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-blue-950">Delete User?</h2>
            <p className="mb-6 text-slate-600">
              This action cannot be undone. The user will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}

export default UserManagement