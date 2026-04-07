import DashboardLayout from '../layout/DashboardLayout'
import { HelpCircle, ChevronDown, ChevronUp, Search, User, Shield, Info } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'

function FAQ() {
  const { searchQuery, setSearchQuery } = useSearch()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [openIndex, setOpenIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('general')

  const userFaqs = {
    general: [
      {
        question: "What is AquaTrack?",
        answer: "AquaTrack is a smart water supply management system designed to help residents track water schedules, report leaks, and receive important announcements from the water department."
      },
      {
        question: "How do I update my profile information?",
        answer: "Navigate to the 'Profile' section from the sidebar and click 'Edit Profile'. You can update your name, contact details, and address there."
      }
    ],
    reports: [
      {
        question: "How do I report a water leak?",
        answer: "Go to the 'Reports' section and click 'New Report'. You can specify the type of issue, provide a location, and even upload photos to help our team identify the problem."
      },
      {
        question: "How can I track the status of my report?",
        answer: "In the 'My Reports' section, you can see all your submitted reports and their current status (Pending, In Progress, or Resolved)."
      },
      {
        question: "How long does it take to resolve a reported issue?",
        answer: "Emergency issues like major pipe bursts are prioritized and usually addressed within 24 hours. Minor leaks may take 2-3 business days depending on the maintenance queue."
      }
    ],
    schedules: [
      {
        question: "Where can I see the water supply schedule?",
        answer: "The 'Schedules' section provides a real-time list and calendar view of water distribution windows for different areas. You can search for your specific location."
      },
      {
        question: "What should I do during an unannounced water outage?",
        answer: "First, check the 'Announcements' section for any emergency alerts. If no information is listed, please file a 'Water Outage' report immediately."
      }
    ]
  }

  const adminFaqs = {
    management: [
      {
        question: "How do I create a new water supply schedule?",
        answer: "Go to 'Schedules' and click 'Create Schedule'. You'll need to provide a title, select the distribution type (Area/Zone), specify the days, and set the start/end times."
      },
      {
        question: "How do I manage user reports?",
        answer: "The 'Reports' dashboard shows all incoming issues. You can click on any report to view details, update its status, or assign it to a maintenance team."
      },
      {
        question: "Can I edit or delete an announcement?",
        answer: "Yes, in the 'Announcements' section, each post has 'Edit' and 'Delete' options. Changes are updated in real-time for all users."
      }
    ],
    users: [
      {
        question: "How do I view all registered users?",
        answer: "Navigate to 'User Management' in the admin settings. You can see a list of all residents, their contact info, and account status."
      },
      {
        question: "Can I reset a user's password?",
        answer: "For security reasons, users should use the 'Forgot Password' link on the login page. However, you can verify their account status in User Management."
      }
    ],
    system: [
      {
        question: "Where can I see system-wide analytics?",
        answer: "The Admin Dashboard provides a high-level overview of total reports, active schedules, and pending issues through visual charts and counters."
      },
      {
        question: "How do I send an emergency notification?",
        answer: "Use the 'Create Announcement' feature and mark it as 'High Priority' to ensure it stands out on the user's dashboard."
      }
    ]
  }

  const currentFaqs = isAdmin ? adminFaqs : userFaqs
  const categories = Object.keys(currentFaqs)

  const allFaqs = categories.flatMap(cat => 
    currentFaqs[cat].map(faq => ({ ...faq, category: cat }))
  )

  const filteredFaqs = allFaqs.filter(faq => 
    (activeTab === 'all' || faq.category === activeTab) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <DashboardLayout isAdmin={isAdmin}>
      {/* Header Section */}
      <div className="relative p-10 mb-8 overflow-hidden rounded-3xl bg-blue-950 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-amber-400 text-amber-950' : 'bg-sky-400 text-sky-950'}`}>
                {isAdmin ? 'Administrator Help Center' : 'User Support Hub'}
              </span>
            </div>
            <h1 className="text-4xl font-black md:text-5xl tracking-tight">How can we help?</h1>
            <p className="mt-3 text-lg font-medium text-sky-300/70 max-w-xl">
              {isAdmin 
                ? "Find expert guidance on managing the AquaTrack infrastructure and assisting residents."
                : "Find answers to common questions about water schedules, reports, and your account."}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-4 text-sky-400" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 backdrop-blur-sm transition-all"
            />
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/5 blur-3xl"></div>
      </div>

      {/* Tabs / Categories */}
      <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${activeTab === 'all' ? 'bg-blue-950 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          All Questions
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${activeTab === cat ? 'bg-blue-950 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 max-w-4xl mx-auto">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'ring-2 ring-sky-400 border-transparent shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl transition-colors ${openIndex === index ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
                    {faq.category === 'reports' || faq.category === 'management' ? <Shield size={20} /> : 
                     faq.category === 'users' ? <User size={20} /> : <Info size={20} />}
                  </div>
                  <span className={`font-black text-lg tracking-tight transition-colors ${openIndex === index ? 'text-blue-950' : 'text-slate-700'}`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-sky-500' : 'text-slate-300'}`}>
                  <ChevronDown size={24} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-8 ml-16 text-slate-600 font-medium leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-4">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-2">No matching questions found</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      {/* Help Footer */}
      <div className="mt-16 p-8 bg-sky-50 rounded-3xl border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <HelpCircle size={24} />
          </div>
          <div>
            <h4 className="font-black text-blue-950">Still need help?</h4>
            <p className="text-sm text-slate-600">Our support team is available 24/7 for critical issues.</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-blue-950 text-white font-black rounded-xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-950/20 active:scale-95">
          CONTACT SUPPORT
        </button>
      </div>
    </DashboardLayout>
  )
}

export default FAQ
