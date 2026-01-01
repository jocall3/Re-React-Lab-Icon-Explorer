
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';
import { IconEntry } from '../types';

export const IconGallery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 60;

  const filteredIcons = useMemo(() => {
    return ICONS.filter(icon => 
      icon.key.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  const paginatedIcons = filteredIcons.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Icon Registry</h2>
          <p className="text-sm text-slate-500">{filteredIcons.length} icons available from logic</p>
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {paginatedIcons.length > 0 ? (
          paginatedIcons.map((icon, idx) => (
            <div 
              key={`${icon.key}-${idx}`}
              className="group flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer"
              title={icon.key}
            >
              <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">{icon.emoji}</span>
              <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">{icon.key}</span>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <i className="fa-solid fa-face-frown text-4xl text-slate-200 mb-3"></i>
            <p className="text-slate-400">No icons match your search</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="text-sm font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};
