import React from 'react';
import { Sparkles, Target } from 'lucide-react';

const FilterChips = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'macro_area', label: 'Minhas Áreas', icon: Sparkles },
    { id: 'target', label: 'Colaborações', icon: Target },
  ];

  const isFirstActive = activeFilter === 'macro_area' || activeFilter === 'course';

  return (
    <div className="relative flex justify-center items-center mb-14 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-80 mx-auto overflow-hidden">
      {/* Background Sliding Pill */}
      <div 
        className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-[#FFA900] shadow-lg shadow-[#FFA900]/20 transition-all duration-500 ease-in-out"
        style={{ 
          width: 'calc(50% - 6px)',
          transform: isFirstActive ? 'translateX(0)' : 'translateX(100%)',
        }}
      />

      {filters.map((f) => {
        const isActive = activeFilter === f.id || (f.id === 'macro_area' && activeFilter === 'course');
        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`relative z-10 flex-1 flex justify-center items-center gap-3 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-colors duration-500 ${
              isActive 
                ? 'text-black' 
                : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <f.icon className={`h-4 w-4 transition-colors duration-500 ${isActive ? 'text-black' : 'text-gray-400'}`} />
            {f.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
