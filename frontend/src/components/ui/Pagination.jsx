import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-monday-border bg-white rounded-b-2xl">
      <div className="text-sm font-semibold text-monday-gray">
        Showing <span className="font-bold text-monday-black">{startItem}</span> to <span className="font-bold text-monday-black">{endItem}</span> of <span className="font-bold text-monday-black">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-monday-border text-monday-gray hover:bg-monday-gray-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === page 
                ? 'bg-monday-blue text-white' 
                : 'border border-monday-border text-monday-black hover:bg-monday-gray-background'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-monday-border text-monday-gray hover:bg-monday-gray-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
