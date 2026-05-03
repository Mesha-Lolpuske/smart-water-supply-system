import React from 'react';
import { X, Save } from 'lucide-react';

export default function UpdateWorkOrderModal({ 
  showUpdateModal, 
  setShowUpdateModal, 
  updateForm, 
  setUpdateForm, 
  handleUpdateSubmit 
}) {
  if (!showUpdateModal) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Update Work Order</h2>
          <button onClick={() => setShowUpdateModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Task Status</label>
            <div className="grid grid-cols-2 gap-3">
              {['In Progress', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setUpdateForm({...updateForm, status})}
                  className={`p-3 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                    updateForm.status === status ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-600/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Technical Findings / Notes</label>
            <textarea
              value={updateForm.notes}
              onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
              className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 focus:border-emerald-600 focus:ring-0 outline-none transition-all resize-none"
              placeholder="Describe the repair work performed..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="flex-1 px-6 py-4 font-black text-slate-400 hover:text-blue-950 transition-colors uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubmit}
              className="flex-1 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <Save size={18} />
              Save Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
