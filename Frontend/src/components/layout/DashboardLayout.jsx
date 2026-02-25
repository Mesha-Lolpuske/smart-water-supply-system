import Header from './Header'
import UserSidebar from './UserSidebar'
import AdminSidebar from './AdminSidebar'
import Footer from './Footer'

function DashboardLayout({ children, isAdmin = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="flex">
        {/* Conditional Sidebar based on role */}
        {isAdmin ? <AdminSidebar /> : <UserSidebar />}

        <main className="flex flex-col flex-1 mt-20 ml-64 p-6 min-h-screen">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout