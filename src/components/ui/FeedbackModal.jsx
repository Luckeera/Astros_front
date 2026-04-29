import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const FeedbackModal = ({ isOpen, type = 'success', title, message, onClose }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="p-8 text-center">
          <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
            isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
          }`}>
            {isSuccess ? <CheckCircle2 className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
          </div>
          
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
            {message}
          </p>

          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
              isSuccess 
                ? 'bg-gray-900 text-white hover:bg-black shadow-gray-200' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-red-100'
            }`}
          >
            {isSuccess ? 'Entendido' : 'Tentar Novamente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
