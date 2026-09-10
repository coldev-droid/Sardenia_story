import React from 'react';
import { SardiniaBook } from '../types';
import { BookOpen, Sparkles, MapPin, Layers, ArrowRight } from 'lucide-react';

interface BooksOverviewProps {
  books: SardiniaBook[];
  onSelectBook: (bookId: string) => void;
}

export const BooksOverview: React.FC<BooksOverviewProps> = ({ books, onSelectBook }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-8 sm:p-12 border border-amber-900/50 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Sardinia Magical Saga • 5 Masterpieces</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight mb-4">
            Generate Your 5 Award-Winning Adventure Books in Sardinia
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-6">
            Welcome to <strong className="text-amber-300 font-semibold">The Brain</strong>—the ultimate AI authoring studio. Harness ancient Sardinian myths, Nuragic stone towers, colossal obsidian statues, and master storytelling to craft five literary masterpieces destined for international acclaim.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onSelectBook('book-1')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-100 font-medium hover:from-amber-500 hover:to-amber-600 transition shadow-lg flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Generating Book 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 5 books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="group relative bg-stone-900/90 rounded-2xl p-6 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                  Book {index + 1} of 5
                </span>
                <span className="text-xs text-stone-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{book.chaptersCount} Chapters</span>
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors mb-1">
                {book.title}
              </h2>
              <p className="text-xs font-medium text-amber-400/90 mb-3">{book.subtitle}</p>

              <div className="flex items-center space-x-1.5 text-xs text-stone-400 mb-3">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{book.setting}</span>
              </div>

              <p className="text-stone-300 text-sm line-clamp-3 mb-6 leading-relaxed">
                {book.synopsis}
              </p>
            </div>

            <button
              onClick={() => onSelectBook(book.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-stone-100 font-medium text-sm transition flex items-center justify-center space-x-2 border border-stone-700 hover:border-amber-500"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Chapter Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
