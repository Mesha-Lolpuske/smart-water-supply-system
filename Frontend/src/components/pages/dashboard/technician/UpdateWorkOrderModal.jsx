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
      <div className="w-full max-w-lg p-8 duration-300 bg-white shadow-2xl rounded-3xl animate-in zoom-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight uppercase text-blue-950">Update Work Order</h2>
          <button onClick={() => setShowUpdateModal(false)} className="p-2 transition-colors text-slate-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Task Status</label>
            <div className="grid grid-cols-2 gap-3">
              {/* CHANGED: Removed Cancelled, Added Fixed so the Admin knows to review it! */}
              {['In Progress', 'Fixed'].map(status => (
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
              className="w-full h-32 p-4 font-medium transition-all border-2 outline-none resize-none bg-slate-50 border-slate-100 rounded-2xl text-blue-950 focus:border-emerald-600 focus:ring-0"
              placeholder="Describe the repair work performed or why it can't be completed..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="flex-1 px-6 py-4 text-xs font-black tracking-widest uppercase transition-colors text-slate-400 hover:text-blue-950"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubmit}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-emerald-600 rounded-2xl hover:bg-emerald-700"
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