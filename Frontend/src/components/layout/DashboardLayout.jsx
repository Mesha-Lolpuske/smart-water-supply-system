import Header from './Header'
import UserSidebar from './UserSidebar'
import AdminSidebar from './AdminSidebar'
import TechnicianSidebar from './TechnicianSidebar'
import Footer from './Footer'
import { useAuth } from '../hooks/useAuth'

function DashboardLayout({ children, isAdmin: isAdminProp = false }) {
  const { user, isAdmin, isTechnician } = useAuth()
  
  const renderSidebar = () => {
    if (isAdmin) return <AdminSidebar />
    if (isTechnician) return <TechnicianSidebar />
    return <UserSidebar />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="flex">
        {/* Conditional Sidebar based on role */}
        {renderSidebar()}

        <main className="flex flex-col flex-1 mt-20 ml-64 p-6 min-h-screen">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout