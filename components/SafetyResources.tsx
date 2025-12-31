
import React from 'react';

const SafetyResources: React.FC = () => {
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-4">
      <div className="flex items-start mb-2">
        <div className="bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
          <i className="fas fa-exclamation text-[10px]"></i>
        </div>
        <div>
          <h4 className="text-rose-900 font-bold text-sm">Need immediate help?</h4>
          <p className="text-rose-800 text-xs leading-relaxed mt-1">
            If you're in crisis or feeling unsafe, please reach out to professional services immediately.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        <a 
          href="tel:988" 
          className="bg-white border border-rose-200 rounded-xl px-3 py-2 flex items-center justify-between hover:bg-rose-100 transition-colors"
        >
          <span className="text-xs font-semibold text-rose-700">988 Suicide & Crisis Lifeline</span>
          <i className="fas fa-phone-alt text-rose-500 text-[10px]"></i>
        </a>
        <a 
          href="sms:741741" 
          className="bg-white border border-rose-200 rounded-xl px-3 py-2 flex items-center justify-between hover:bg-rose-100 transition-colors"
        >
          <span className="text-xs font-semibold text-rose-700">Crisis Text Line (741741)</span>
          <i className="fas fa-comment text-rose-500 text-[10px]"></i>
        </a>
      </div>
    </div>
  );
};

export default SafetyResources;
