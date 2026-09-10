import React, { useState } from 'react';
import { SardiniaBook, GeneratedChapter } from '../types';
import { Sparkles, BookOpen, Copy, Check, RefreshCw, Layers, Compass } from 'lucide-react';

interface ChapterStudioProps {
  books: SardiniaBook[];
  selectedBookId: string;
  onSelectBookId: (id: string) => void;
}

export const ChapterStudio: React.FC<ChapterStudioProps> = ({
  books,
  selectedBookId,
  onSelectBookId,
}) => {
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [chapterTitle, setChapterTitle] = useState<string>('The Obsidian Awakening');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedChapter, setGeneratedChapter] = useState<GeneratedChapter | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const currentBook = books.find((b) => b.id === selectedBookId) || books[0];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: currentBook.id,
          chapterNumber,
          chapterTitle,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate chapter');
      }

      setGeneratedChapter({
        bookId: currentBook.id,
        chapterNumber,
        chapterTitle: data.chapterTitle || chapterTitle,
        prose: data.prose,
        mythologicalLoreNote: data.mythologicalLoreNote,
        suggestedNextPlotTwist: data.suggestedNextPlotTwist,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating chapter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedChapter) return;
    navigator.clipboard.writeText(
      `# ${currentBook.title}\n## Chapter ${generatedChapter.chapterNumber}: ${generatedChapter.chapterTitle}\n\n${generatedChapter.prose}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h2 className="font-serif font-bold text-lg text-stone-100">The Brain Generator</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Select Book
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => onSelectBookId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mt-1.5 italic">{currentBook.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Chapter Number
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Chapter Title
              </label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="e.g. Whispers of the Nuraghe"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              AI Authoring Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Focus on a sudden coastal storm and discovery of a hidden bronze pendant..."
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-medium text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>The Brain is Crafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Chapter with AI</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-stone-900/60 rounded-2xl p-6 border border-stone-800 text-xs text-stone-400 space-y-2">
          <h3 className="font-semibold text-stone-300 uppercase tracking-wider">Award-Winning Standard</h3>
          <p>Each generated chapter integrates authentic Sardinian geography, rich sensory phrasing, and deep mythic resonance suited for international bestsellers.</p>
        </div>
      </div>

      {/* Output / Preview Area */}
      <div className="lg:col-span-8">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="font-serif font-semibold text-stone-100">
                {currentBook.title}
              </span>
            </div>
            {generatedChapter && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition border border-stone-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Chapter'}</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            {loading ? (
              <div className="my-auto text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center mx-auto animate-spin">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-serif text-stone-200">The Brain is weaving Sardinian magic...</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Consulting ancient archives, drafting award-winning prose, and channeling Nuragic wind spirits.
                </p>
              </div>
            ) : generatedChapter ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                    Chapter {generatedChapter.chapterNumber}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-4">
                    {generatedChapter.chapterTitle}
                  </h2>
                  <div className="w-20 h-1 bg-amber-600 rounded-full mb-6" />
                  <div className="prose prose-invert max-w-none text-stone-200 leading-relaxed font-serif text-base sm:text-lg whitespace-pre-line">
                    {generatedChapter.prose}
                  </div>
                </div>

                {/* Sidebar Cards inside Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-stone-800">
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
                      <Compass className="w-4 h-4" />
                      <span>Mythological & Archaeological Lore</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {generatedChapter.mythologicalLoreNote}
                    </p>
                  </div>
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
                      <Layers className="w-4 h-4" />
                      <span>Suggested Next Plot Twist</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {generatedChapter.suggestedNextPlotTwist}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto text-stone-400">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif text-stone-300">No Chapter Generated Yet</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Configure your chapter number and title on the left, then click <strong className="text-amber-300">Generate Chapter with AI</strong> to bring your Sardinia adventure to life.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
