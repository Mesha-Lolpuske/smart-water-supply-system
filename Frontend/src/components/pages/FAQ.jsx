import DashboardLayout from '../layout/DashboardLayout'
import { HelpCircle, ChevronDown, Search, User, Shield, Info, Send, MessageSquare, Plus, CheckCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'
import faqService from '../services/faqService'
import { toast } from 'react-toastify'

function FAQ() {
  const { searchQuery, setSearchQuery } = useSearch()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  
  const [openIndex, setOpenIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Tab State
  const [activeView, setActiveView] = useState('all_faqs') // 'all_faqs' or 'my_questions'
  
  // User "Ask Question" State
  const [showAskModal, setShowAskModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ question: '', category: 'general' })
  const [submitting, setSubmitting] = useState(false)

  // Admin "Answer" State
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [answerForm, setAnswerForm] = useState({ answer: '', isPublic: true })

  useEffect(() => {
    fetchFaqs()
  }, [isAdmin, activeView])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      let res;
      if (isAdmin) {
        res = await faqService.getAdminFaqs()
      } else if (activeView === 'my_questions') {
        res = await faqService.getMyQuestions()
      } else {
        res = await faqService.getPublicFaqs()
      }
      
      if (res.success) {
        setFaqs(res.faqs || [])
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err)
      toast.error('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleAskSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const res = await faqService.askQuestion(newQuestion)
      if (res.success) {
        toast.success('Question submitted! Our team will answer soon.')
        setNewQuestion({ question: '', category: 'general' })
        setShowAskModal(false)
        fetchFaqs()
      }
    } catch (err) {
      toast.error('Failed to submit question')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnswerSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const res = await faqService.answerQuestion(selectedFaq._id, answerForm)
      if (res.success) {
        toast.success('FAQ updated successfully')
        setShowAnswerModal(false)
        fetchFaqs()
      }
    } catch (err) {
      toast.error('Failed to update FAQ')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    // If we are in "My Questions" view, show everything asked by the user without category filtering
    // unless they specifically want to filter their own questions too.
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(query) ||
                         (faq.answer || '').toLowerCase().includes(query);
    
    return matchesCategory && matchesSearch;
  })

  const categories = ['general', 'reports', 'schedules', 'account', 'other']

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
                ? "Manage community questions and provide infrastructure guidance."
                : "Find answers or ask our team about water schedules and infrastructure."}
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
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      {/* Tabs / Categories */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-center gap-3">
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

        {!isAdmin && (
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveView('all_faqs')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'all_faqs' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-blue-950'}`}
            >
              Public FAQ
            </button>
            <button
              onClick={() => setActiveView('my_questions')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'my_questions' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-blue-950'}`}
            >
              My Questions
            </button>
          </div>
        )}
      </div>

      {/* FAQ List */}
      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-sky-500 border-sky-100 rounded-full animate-spin mb-4"></div>
            <p className="font-black text-xs text-blue-950 uppercase tracking-widest">Loading Support Database...</p>
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={faq._id} 
              className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'ring-2 ring-sky-400 border-transparent shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl transition-colors ${openIndex === index ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
                    {faq.category === 'reports' ? <Shield size={20} /> : 
                     faq.category === 'account' ? <User size={20} /> : <Info size={20} />}
                  </div>
                  <div>
                    <span className={`font-black text-lg tracking-tight block ${openIndex === index ? 'text-blue-950' : 'text-slate-700'}`}>
                      {faq.question}
                    </span>
                    {!faq.answer && (
                      <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded">Awaiting Answer</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFaq(faq);
                        setAnswerForm({ answer: faq.answer || '', isPublic: faq.isPublic });
                        setShowAnswerModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10"
                      title="Answer/Edit"
                    >
                      <MessageSquare size={18} />
                    </button>
                  )}
                  <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-sky-500' : 'text-slate-300'}`}>
                    <ChevronDown size={24} />
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-8 ml-16 text-slate-600 font-medium leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer || "This question hasn't been answered yet. Our support team is working on it."}
                  {isAdmin && faq.askedBy && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-400">
                      Asked by: <span className="font-bold">{faq.askedBy.name}</span> ({faq.askedBy.email})
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Search className="mx-auto text-slate-200 mb-4" size={48} />
            <h3 className="text-xl font-black text-blue-950 mb-2">No matching questions</h3>
            <p className="text-slate-500">Try a different search term or category.</p>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="mt-16 p-8 bg-sky-50 rounded-3xl border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg">
            <HelpCircle size={24} />
          </div>
          <div>
            <h4 className="font-black text-blue-950">Can't find what you're looking for?</h4>
            <p className="text-sm text-slate-600">Submit your own question and our team will get back to you.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => isAdmin ? fetchFaqs() : setShowAskModal(true)}
            className="px-8 py-4 bg-blue-950 text-white font-black rounded-xl hover:bg-blue-900 transition-all flex items-center gap-2"
          >
            {isAdmin ? <Plus size={20} /> : <MessageSquare size={20} />}
            {isAdmin ? 'REFRESH LOG' : 'ASK A NEW QUESTION'}
          </button>
        </div>
      </div>

      {/* ===== ASK QUESTION MODAL ===== */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm">
          <form onSubmit={handleAskSubmit} className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Ask a Question</h2>
              <button type="button" onClick={() => setShowAskModal(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                <select 
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-blue-950 outline-none focus:border-sky-500"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Question</label>
                <textarea
                  required
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 outline-none focus:border-sky-500 resize-none"
                  placeholder="How do I...?"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-950 text-white font-black rounded-2xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                <Send size={18} />
                {submitting ? 'SENDING...' : 'SUBMIT QUESTION'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== ANSWER QUESTION MODAL ===== */}
      {showAnswerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm">
          <form onSubmit={handleAnswerSubmit} className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Answer FAQ</h2>
              <button type="button" onClick={() => setShowAnswerModal(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-sky-500">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Question</p>
                <p className="font-bold text-blue-950">{selectedFaq.question}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Answer Content</label>
                <textarea
                  required
                  value={answerForm.answer}
                  onChange={(e) => setAnswerForm({...answerForm, answer: e.target.value})}
                  className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 outline-none focus:border-sky-500 resize-none"
                  placeholder="Provide the answer here..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isPublic"
                  checked={answerForm.isPublic}
                  onChange={(e) => setAnswerForm({...answerForm, isPublic: e.target.checked})}
                  className="w-5 h-5 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                />
                <label htmlFor="isPublic" className="text-sm font-bold text-blue-950">Make Public in FAQ List</label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-sky-500 text-white font-black rounded-2xl hover:bg-sky-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg shadow-sky-500/30"
              >
                <CheckCircle size={18} />
                {submitting ? 'SAVING...' : 'SAVE ANSWER'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}

export default FAQ