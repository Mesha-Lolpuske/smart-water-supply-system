import DashboardLayout from '../../layout/DashboardLayout'
import { Settings, Bell, Shield, Database, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoResolveReports: false,
    maintenanceMode: false,
    reportDeadlineDays: '7',
    systemName: 'AquaTrack'
  })

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Settings size={32} />
          System Settings
        </h1>
        <p className="text-sky-200">Configure system preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* General Settings */}
        <div className="p-6 bg-white border-2 shadow-sm rounded-xl border-sky-100">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-950">
            <Database size={22} className="text-sky-600" />
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">System Name</label>
              <input
                type="text"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">
                Report Resolution Deadline (days)
              </label>
              <input
                type="number"
                name="reportDeadlineDays"
                value={settings.reportDeadlineDays}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6 bg-white border-2 shadow-sm rounded-xl border-sky-100">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-950">
            <Bell size={22} className="text-sky-600" />
            Notifications
          </h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for new reports' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS alerts for critical reports' },
              { key: 'autoResolveReports', label: 'Auto-resolve Reports', desc: 'Automatically resolve reports after deadline' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border-2 rounded-lg bg-sky-50 border-sky-100">
                <div>
                  <p className="font-semibold text-blue-950">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    settings[item.key] ? 'bg-sky-500' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    settings[item.key] ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 bg-white border-2 shadow-sm rounded-xl border-sky-100">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-950">
            <Shield size={22} className="text-sky-600" />
            Security
          </h2>
          <div className="flex items-center justify-between p-4 border-2 border-red-100 rounded-lg bg-red-50">
            <div>
              <p className="font-semibold text-blue-950">Maintenance Mode</p>
              <p className="text-sm text-slate-500">Disable access for regular users</p>
            </div>
            <button
              onClick={() => handleToggle('maintenanceMode')}
              className={`relative w-12 h-6 rounded-full transition-all ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                settings.maintenanceMode ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => toast.success('Settings saved!')}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  )
}

export default AdminSettings