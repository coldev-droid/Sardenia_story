import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  Flame, 
  Sparkles, 
  Zap, 
  AlertCircle,
  BarChart2,
  Sliders,
  CheckCircle2,
  Heart,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line
} from 'recharts';

export interface ScenePacingMetrics {
  sceneNum: number;
  sceneTitle: string;
  tensionScore: number; // 0 to 100
  sensoryScore: number; // 0 to 100
  dialogueRatio: number; // percentage
  actionDensity: number; // 0 to 100
  cliffhangerScore: number; // 0 to 100
  wordCount: number;
}

export interface BookSentimentMetrics {
  bookId: string;
  bookTitle: string;
  epicMythicScore: number; // 0 to 100
  emotionalIntensity: number; // 0 to 100
  wonderAndAwe: number; // 0 to 100
  dreadAndDanger: number; // 0 to 100
  status: string;
}

const SAMPLE_SCENE_METRICS: ScenePacingMetrics[] = [
  { sceneNum: 1, sceneTitle: "Grotta di Nettuno Approach", tensionScore: 45, sensoryScore: 88, dialogueRatio: 25, actionDensity: 30, cliffhangerScore: 50, wordCount: 820 },
  { sceneNum: 2, sceneTitle: "S'Urtzu Acoustic Resonance", tensionScore: 78, sensoryScore: 92, dialogueRatio: 35, actionDensity: 65, cliffhangerScore: 80, wordCount: 950 },
  { sceneNum: 3, sceneTitle: "Decoy Halite Mineral Trap", tensionScore: 85, sensoryScore: 85, dialogueRatio: 40, actionDensity: 75, cliffhangerScore: 90, wordCount: 1100 },
  { sceneNum: 4, sceneTitle: "Split Team Land Rover Transit", tensionScore: 60, sensoryScore: 75, dialogueRatio: 55, actionDensity: 40, cliffhangerScore: 65, wordCount: 780 },
  { sceneNum: 5, sceneTitle: "Anghelu Ruju Necropolis Portal", tensionScore: 95, sensoryScore: 95, dialogueRatio: 30, actionDensity: 90, cliffhangerScore: 98, wordCount: 1250 },
  { sceneNum: 6, sceneTitle: "Oristano Departure & Rest", tensionScore: 50, sensoryScore: 80, dialogueRatio: 60, actionDensity: 20, cliffhangerScore: 70, wordCount: 600 }
];

const FIVE_BOOK_SENTIMENT: BookSentimentMetrics[] = [
  { bookId: "Book I", bookTitle: "S'Urtzu & The Awakening", epicMythicScore: 88, emotionalIntensity: 82, wonderAndAwe: 90, dreadAndDanger: 78, status: "Locked Canon" },
  { bookId: "Book II", bookTitle: "The Obsidian Labyrinth", epicMythicScore: 92, emotionalIntensity: 88, wonderAndAwe: 94, dreadAndDanger: 85, status: "Active Draft" },
  { bookId: "Book III", bookTitle: "Giants' Tomb Resonance", epicMythicScore: 95, emotionalIntensity: 91, wonderAndAwe: 92, dreadAndDanger: 90, status: "Outlined" },
  { bookId: "Book IV", bookTitle: "The Sunken Nuraghe Vaults", epicMythicScore: 97, emotionalIntensity: 94, wonderAndAwe: 96, dreadAndDanger: 93, status: "Planned" },
  { bookId: "Book V", bookTitle: "12 Amulets Convergence", epicMythicScore: 99, emotionalIntensity: 98, wonderAndAwe: 99, dreadAndDanger: 96, status: "Planned Climax" }
];

const SENSORY_BREAKDOWN = [
  { category: "Visual & Lighting", score: 92, fill: "#3b82f6" },
  { category: "Acoustic / Soundscapes", score: 88, fill: "#a855f7" },
  { category: "Tactile & Texture", score: 84, fill: "#10b981" },
  { category: "Olfactory / Smell", score: 76, fill: "#f59e0b" },
  { category: "Thermal / Cold", score: 80, fill: "#06b6d4" }
];

export function NarrativePacingSimulator() {
  const [metrics, setMetrics] = useState<ScenePacingMetrics[]>(SAMPLE_SCENE_METRICS);
  const [selectedScene, setSelectedScene] = useState<ScenePacingMetrics>(SAMPLE_SCENE_METRICS[4]);
  const [targetTensionPeak, setTargetTensionPeak] = useState<number>(95);

  const avgTension = Math.round(metrics.reduce((a, b) => a + b.tensionScore, 0) / metrics.length);
  const avgSensory = Math.round(metrics.reduce((a, b) => a + b.sensoryScore, 0) / metrics.length);
  const totalWords = metrics.reduce((a, b) => a + b.wordCount, 0);

  const CustomPacingTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-stone-700 p-3 rounded-lg shadow-2xl text-xs font-mono space-y-1.5 z-50">
          <div className="font-bold text-amber-400 border-b border-stone-800 pb-1">
            Scene #{data.sceneNum}: {data.sceneTitle}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div>Tension Score: <span className="font-bold text-amber-400">{data.tensionScore}/100</span></div>
            <div>Sensory Score: <span className="font-bold text-emerald-400">{data.sensoryScore}/100</span></div>
            <div>Action Density: <span className="font-bold text-blue-400">{data.actionDensity}%</span></div>
            <div>Dialogue Ratio: <span className="font-bold text-purple-400">{data.dialogueRatio}%</span></div>
          </div>
          <div className="text-stone-400 text-[10px] border-t border-stone-800 pt-1">
            Cliffhanger Score: <span className="text-red-400 font-bold">{data.cliffhangerScore}/100</span> • {data.wordCount} words
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-lg text-stone-100">Narrative Pacing & Reader Retention Simulator</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AUTOPILOT MODULE 2
              </span>
            </div>
            <p className="text-xs text-stone-400">Real-time tension curve modeling, cliffhanger score tracking, and sensory depth auditing per scene.</p>
          </div>
        </div>

        {/* Quick Metrics Badges */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] text-stone-400 uppercase">Avg Tension Peak</span>
            <div className="font-bold text-amber-400">{avgTension}/100</div>
          </div>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] text-stone-400 uppercase">Sensory Depth Index</span>
            <div className="font-bold text-emerald-400">{avgSensory}/100</div>
          </div>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] text-stone-400 uppercase">Total Words</span>
            <div className="font-bold text-stone-200">{totalWords}</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Tension Curve Area Chart (LG 8 Cols) */}
        <div className="lg:col-span-8 bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Chapter Narrative Tension & Cliffhanger Curve</span>
            </div>
            <span className="text-[10px] font-mono text-stone-400">
              6 Scenes Analyzed
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="tensionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="sensoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="sceneTitle" stroke="#a1a1aa" fontSize={9} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomPacingTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="tensionScore" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#tensionGradient)" 
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6, fill: '#fbbf24', stroke: '#78350f', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sensoryScore" 
                  stroke="#10b981" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#sensoryGradient)" 
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-800/80 pt-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-stone-300">Tension Score</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-stone-300">Sensory Depth Score</span>
              </span>
            </div>
            <span className="text-amber-400 font-bold">Climax Scene: #5 (95/100)</span>
          </div>
        </div>

        {/* Sensory Breakdown Bar Chart (LG 4 Cols) */}
        <div className="lg:col-span-4 bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Sensory Modality Audit</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">90% PASS</span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SENSORY_BREAKDOWN} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#a1a1aa" fontSize={9} domain={[0, 100]} tickLine={false} />
                <YAxis dataKey="category" type="category" stroke="#a1a1aa" fontSize={9} width={90} tickLine={false} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {SENSORY_BREAKDOWN.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] font-mono text-stone-400 border-t border-stone-800/80 pt-2 text-center">
            Zero dry exposition scenes detected in current draft.
          </div>
        </div>
      </div>

      {/* 5-Book Narrative Sentiment Analysis Chart Section */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>5-Book Journey: Narrative Sentiment & Mythic Tone Tracking</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-400">
            <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800 font-bold">
              EPIC/MYTHIC PROSE TONE: 96% AVERAGE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FIVE_BOOK_SENTIMENT} margin={{ top: 10, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="bookId" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} domain={[70, 100]} tickLine={false} />
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 border border-stone-700 p-2.5 rounded-lg shadow-2xl text-xs font-mono space-y-1 z-50">
                          <div className="font-bold text-amber-400 border-b border-stone-800 pb-1 flex justify-between gap-2">
                            <span>{data.bookId}: {data.bookTitle}</span>
                            <span className="text-emerald-400">{data.status}</span>
                          </div>
                          <div className="text-pink-400 font-semibold">Epic/Mythic Score: {data.epicMythicScore}%</div>
                          <div className="text-purple-400">Emotional Intensity: {data.emotionalIntensity}%</div>
                          <div className="text-amber-400">Wonder & Awe: {data.wonderAndAwe}%</div>
                          <div className="text-red-400">Dread & Danger: {data.dreadAndDanger}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="epicMythicScore" name="Epic Mythic Score" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="emotionalIntensity" name="Emotional Intensity" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="wonderAndAwe" name="Wonder & Awe" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="dreadAndDanger" name="Dread & Danger" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-4 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase text-stone-400">5-Book Tone Progression Index</div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {FIVE_BOOK_SENTIMENT.map((b) => (
                <div key={b.bookId} className="bg-stone-900 p-2 rounded border border-stone-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{b.bookId}</span>
                    <span className="text-[10px] text-stone-400">{b.status}</span>
                  </div>
                  <div className="text-[11px] text-stone-200 font-sans truncate">{b.bookTitle}</div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5 border-t border-stone-800/60">
                    <span>Mythic: <strong className="text-pink-400">{b.epicMythicScore}%</strong></span>
                    <span>Emotion: <strong className="text-purple-400">{b.emotionalIntensity}%</strong></span>
                    <span>Wonder: <strong className="text-amber-400">{b.wonderAndAwe}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Scene Detailed Inspection */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Scene Inspector & Micro-Pacing Control</span>
          </div>
          <div className="flex items-center space-x-2">
            {metrics.map(m => (
              <button
                key={m.sceneNum}
                onClick={() => setSelectedScene(m)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition ${selectedScene.sceneNum === m.sceneNum ? 'bg-amber-600 text-stone-100 font-bold' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
              >
                Scene #{m.sceneNum}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[10px]">Scene Title</span>
            <span className="font-bold text-amber-400 text-sm">{selectedScene.sceneTitle}</span>
          </div>
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[10px]">Tension & Pacing</span>
            <span className="font-bold text-emerald-400 text-sm">{selectedScene.tensionScore} / 100</span>
          </div>
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[10px]">Action vs. Dialogue</span>
            <span className="font-bold text-blue-400 text-sm">{selectedScene.actionDensity}% Action / {selectedScene.dialogueRatio}% Dialogue</span>
          </div>
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[10px]">Cliffhanger Score</span>
            <span className="font-bold text-purple-400 text-sm">{selectedScene.cliffhangerScore} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
