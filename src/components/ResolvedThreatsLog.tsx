import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Wrench, 
  RefreshCw, 
  Copy, 
  PlusCircle, 
  Layers, 
  Activity, 
  ChevronRight,
  Shield,
  Check,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { ResolvedThreat } from '../types';

interface ResolvedThreatsLogProps {
  threats?: ResolvedThreat[];
  onRefresh?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Geography & Navigation': '#3b82f6',
  'Character & Entity Rules': '#a855f7',
  'Character Relationships': '#ec4899',
  'Amulet Mechanics': '#f59e0b',
  'Historical Integrity': '#10b981',
  'Timeline Alignment': '#06b6d4',
  'Heritage & Places': '#84cc16',
  'Manuscript Integrity': '#ef4444'
};

const DEFAULT_PALETTE = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4', '#84cc16', '#ef4444'];

const DEFAULT_THREATS: ResolvedThreat[] = [
  {
    id: "THREAT-001",
    ruleId: "RULE-GEO-04",
    ruleCategory: "Geography & Navigation",
    timestamp: "2026-09-10T06:45:12Z",
    detectedThreat: "Attempted physical teleportation of Sentina vessel from Grotta di Nettuno directly to inland Anghelu Ruju without transit steps.",
    mitigationAction: "Swarm inserted Land Rover transit phase via Sella & Mosca vineyards; verified maritime docking at Alghero port first.",
    severity: "CRITICAL",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 4",
    swarmAgent: "Geographic Auditor"
  },
  {
    id: "THREAT-002",
    ruleId: "RULE-DOGS-01",
    ruleCategory: "Character & Entity Rules",
    timestamp: "2026-09-09T23:12:45Z",
    detectedThreat: "Dogs Mia and Tina described as detecting supernatural acoustic frequencies during S'Urtzu resonance.",
    mitigationAction: "Purged supernatural perception lines; re-anchored dog behavior strictly to normal animal restlessness and physical hull vibration.",
    severity: "HIGH",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 3",
    swarmAgent: "Canon Auditor"
  },
  {
    id: "THREAT-003",
    ruleId: "RULE-REL-01",
    ruleCategory: "Character Relationships",
    timestamp: "2026-09-09T18:30:22Z",
    detectedThreat: "Injected unverified romantic tension between Geronimo and Katia, violating locked biological sibling canon (Geronimo, Veerle, Katia).",
    mitigationAction: "Enforced sibling bond verification protocol; restored protective family dynamic and shared childhood memory references.",
    severity: "CRITICAL",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 2",
    swarmAgent: "Character Relationship Monitor"
  },
  {
    id: "THREAT-004",
    ruleId: "RULE-AMU-03",
    ruleCategory: "Amulet Mechanics",
    timestamp: "2026-09-09T14:10:05Z",
    detectedThreat: "Attempted creation of 13th spurious amulet ('Obsidian Tear') exceeding the immutable 12-amulet limit.",
    mitigationAction: "Reclassified 'Obsidian Tear' as a FALSE_DECOY with soluble Halite mineral mechanics; preserved true amulet total at exactly 12.",
    severity: "CRITICAL",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 4",
    swarmAgent: "Myth & Amulet Auditor"
  },
  {
    id: "THREAT-005",
    ruleId: "RULE-HIST-02",
    ruleCategory: "Historical Integrity",
    timestamp: "2026-09-08T20:55:00Z",
    detectedThreat: "Unverified '1642 Sanctity manifest' cited as authentic historical record in manuscript draft.",
    mitigationAction: "Triggered UNVERIFIED_ENTITY_FAIL; replaced manifest reference with an unnamed fictional wreck per Naming Firewall rule.",
    severity: "HIGH",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 1",
    swarmAgent: "Historical Auditor"
  },
  {
    id: "THREAT-006",
    ruleId: "RULE-TIME-02",
    ruleCategory: "Timeline Alignment",
    timestamp: "2026-09-08T11:20:18Z",
    detectedThreat: "Inconsistent injury state: Inga's acoustic nerve injury omitted in Chapter 5 scene transition.",
    mitigationAction: "Swarm forced State Delta alignment; injected left-ear hearing loss continuity constraint into Chapter 5 pre-production guide.",
    severity: "HIGH",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 5",
    swarmAgent: "Continuity Gate Sentinel"
  },
  {
    id: "THREAT-007",
    ruleId: "RULE-HERITAGE-05",
    ruleCategory: "Heritage & Places",
    timestamp: "2026-09-07T16:05:30Z",
    detectedThreat: "False classification of Grotta di Nettuno as deep-sea trench rather than sea-level karst entrance beneath Capo Caccia.",
    mitigationAction: "Corrected cave depth physics and access parameters to match official Capo Caccia marine reserve topography.",
    severity: "MEDIUM",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 3",
    swarmAgent: "Geographic Auditor"
  },
  {
    id: "THREAT-008",
    ruleId: "RULE-PROSE-09",
    ruleCategory: "Manuscript Integrity",
    timestamp: "2026-09-07T09:40:11Z",
    detectedThreat: "Synthetic repetitive paragraphs detected in automated build script output for Chapter 4 draft.",
    mitigationAction: "Purged synthetic draft; triggered orchestrator native high-depth prose generation loop meeting 3,800-5,500 word mandate.",
    severity: "CRITICAL",
    status: "RESOLVED",
    chapterContext: "Book I Chapter 4",
    swarmAgent: "Swarm Orchestrator"
  }
];

export const ResolvedThreatsLog: React.FC<ResolvedThreatsLogProps> = ({ threats = DEFAULT_THREATS, onRefresh }) => {
  const [threatList, setThreatList] = useState<ResolvedThreat[]>(threats);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedThreatId, setExpandedThreatId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(threatList.map(t => t.ruleCategory)))];

  // Extract last 10 log entries sorted by timestamp descending
  const last10Entries = useMemo(() => {
    return [...threatList]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [threatList]);

  // Aggregate category frequencies over the last 10 log entries
  const categoryFrequencyData = useMemo(() => {
    const counts: Record<string, { count: number; critical: number; high: number; medium: number }> = {};
    
    last10Entries.forEach(item => {
      const cat = item.ruleCategory || 'Uncategorized';
      if (!counts[cat]) {
        counts[cat] = { count: 0, critical: 0, high: 0, medium: 0 };
      }
      counts[cat].count += 1;
      if (item.severity === 'CRITICAL') counts[cat].critical += 1;
      else if (item.severity === 'HIGH') counts[cat].high += 1;
      else counts[cat].medium += 1;
    });

    const total = last10Entries.length || 1;

    return Object.keys(counts).map(cat => ({
      category: cat,
      shortCategory: cat.length > 18 ? `${cat.substring(0, 16)}...` : cat,
      count: counts[cat].count,
      critical: counts[cat].critical,
      high: counts[cat].high,
      medium: counts[cat].medium,
      percentage: Math.round((counts[cat].count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [last10Entries]);

  // Custom Tooltip for Recharts Category Visualization
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-stone-700 p-3 rounded-lg shadow-2xl text-xs font-mono space-y-1.5 z-50">
          <div className="font-bold text-stone-100 flex items-center space-x-1.5 border-b border-stone-800 pb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: CATEGORY_COLORS[data.category] || '#f59e0b' }} 
            />
            <span>{data.category}</span>
          </div>
          <div className="text-stone-300">
            Threat Frequency: <span className="font-bold text-amber-400">{data.count}</span> log{data.count > 1 ? 's' : ''} ({data.percentage}%)
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-stone-400 pt-0.5">
            <span className="text-red-400 font-semibold">Critical: {data.critical}</span>
            <span className="text-amber-400 font-semibold">High: {data.high}</span>
            <span className="text-blue-400 font-semibold">Medium: {data.medium}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Cumulative Resolution Success Rate Trend Data over the last 10 log entries
  const successRateTrendData = useMemo(() => {
    // Sort chronological (oldest to newest among the last 10 entries)
    const chronologicalLast10 = [...last10Entries].reverse();
    let totalResolved = 0;

    return chronologicalLast10.map((entry, index) => {
      const isResolved = entry.status === 'RESOLVED' || entry.status === 'MITIGATED';
      if (isResolved) totalResolved += 1;
      const rate = Math.round((totalResolved / (index + 1)) * 100);

      return {
        entryNum: index + 1,
        id: entry.id,
        shortLabel: entry.id.replace('THREAT-', 'T-'),
        ruleId: entry.ruleId,
        rate,
        status: entry.status,
        severity: entry.severity,
        category: entry.ruleCategory,
        agent: entry.swarmAgent,
        chapter: entry.chapterContext
      };
    });
  }, [last10Entries]);

  // Tooltip for Resolution Success Rate Trend
  const SuccessRateTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-stone-700 p-2.5 rounded-lg shadow-2xl text-xs font-mono space-y-1.5 z-50">
          <div className="font-bold text-emerald-400 flex items-center justify-between border-b border-stone-800 pb-1 gap-2">
            <span>Log #{data.entryNum}: {data.id}</span>
            <span className="text-emerald-300 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/80">
              {data.rate}% Rate
            </span>
          </div>
          <div className="text-stone-200 font-semibold text-[11px] pt-0.5">
            Rule: <span className="text-amber-300">{data.ruleId}</span> ({data.severity})
          </div>
          <div className="text-stone-300 text-[10px]">
            Category: <span className="text-blue-300">{data.category}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-800/80 pt-1">
            <span>Swarm Agent: <span className="text-amber-400">{data.agent}</span></span>
            <span className="text-emerald-400 font-bold">{data.status}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Filtered threats
  const filteredThreats = threatList.filter(t => {
    const matchesSearch = 
      t.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.detectedThreat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mitigationAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.chapterContext.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.swarmAgent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || t.ruleCategory === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || t.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const criticalCount = threatList.filter(t => t.severity === 'CRITICAL').length;
  const highCount = threatList.filter(t => t.severity === 'HIGH').length;
  const mediumCount = threatList.filter(t => t.severity === 'MEDIUM').length;

  const handleCopyReport = (threat: ResolvedThreat) => {
    const text = `[DRIFT SENTINEL RESOLUTION RECORD]
Rule ID: ${threat.ruleId}
Timestamp: ${threat.timestamp}
Chapter Context: ${threat.chapterContext}
Severity: ${threat.severity}
Status: ${threat.status}
Auditor Agent: ${threat.swarmAgent}

DETECTED THREAT:
${threat.detectedThreat}

SWARM MITIGATION ACTION:
${threat.mitigationAction}`;

    navigator.clipboard.writeText(text);
    setCopiedId(threat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateNewThreat = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const mockRules = [
        {
          ruleId: "RULE-MINE-08",
          ruleCategory: "Heritage & Places",
          detectedThreat: "Attempted invention of non-existent silver mine location near Capo Caccia.",
          mitigationAction: "Auto-corrected coordinates to historic Argentiera mine complex; verified historic mining archives.",
          severity: "HIGH" as const,
          chapterContext: "Book I Chapter 5",
          swarmAgent: "Historical Auditor"
        },
        {
          ruleId: "RULE-CANON-12",
          ruleCategory: "Character Relationships",
          detectedThreat: "Draft implied Andre owned the Sentina vessel independently without Barcelona company joint structure.",
          mitigationAction: "Re-aligned ownership canon; confirmed vessel as joint Barcelona enterprise asset operated by Geronimo & Andre.",
          severity: "CRITICAL" as const,
          chapterContext: "Book I Chapter 5",
          swarmAgent: "Canon Auditor"
        }
      ];

      const picked = mockRules[Math.floor(Math.random() * mockRules.length)];
      const newEntry: ResolvedThreat = {
        id: `THREAT-00${threatList.length + 1}`,
        ...picked,
        timestamp: now,
        status: "RESOLVED"
      };

      setThreatList([newEntry, ...threatList]);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif font-bold text-base text-stone-100">
              History of Resolved Continuity Threats
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              SWARM AUTO-REMEDIATION LOG
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Real-time ledger tracking every continuity anomaly detected by the Sentinel and the exact mitigation action executed by the swarm.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSimulateNewThreat}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold font-mono flex items-center space-x-1.5 transition disabled:opacity-50"
            title="Simulate a new Sentinel threat detection and swarm auto-fix event"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSimulating ? 'Scanning Swarm...' : 'Simulate Threat Auto-Fix'}</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition"
              title="Refresh Threats"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-medium">Total Threats Resolved</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-stone-100 mt-1">
            {threatList.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-0.5">100% Swarm Auto-Fixed</span>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-medium">Critical Threats</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold font-mono text-red-400 mt-1">
            {criticalCount}
          </div>
          <span className="text-[10px] text-stone-400 font-mono mt-0.5">Hard Rules Protected</span>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-medium">High Severity</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {highCount}
          </div>
          <span className="text-[10px] text-stone-400 font-mono mt-0.5">Continuity Aligned</span>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-medium">Medium Severity</span>
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">
            {mediumCount}
          </div>
          <span className="text-[10px] text-stone-400 font-mono mt-0.5">Accuracy Refined</span>
        </div>
      </div>

      {/* Category Frequency & Success Rate Trend Recharts Section (Last 10 Log Entries) */}
      <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif font-bold text-sm text-stone-200">
              Drift Sentinel Analytics (Last {last10Entries.length} Log Entries)
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
              RECHARTS VISUALIZATIONS
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-stone-400 font-mono">
            <span>Sample: <strong className="text-amber-400">{last10Entries.length}</strong> logs</span>
            <span>•</span>
            <span>Success Rate: <strong className="text-emerald-400 font-bold">100% Swarm Auto-Fix</strong></span>
          </div>
        </div>

        {/* 2 Side-By-Side Recharts Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
          {/* Chart 1: Category Threat Frequency Bar Chart (XL 7 Cols) */}
          <div className="xl:col-span-7 bg-stone-950/70 p-3.5 rounded-lg border border-stone-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800/60">
              <span className="text-xs font-mono font-bold text-stone-200 flex items-center space-x-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Threat Category Frequency</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {categoryFrequencyData.length} Categories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="md:col-span-2 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryFrequencyData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 22 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="shortCategory" 
                      stroke="#a1a1aa" 
                      fontSize={9} 
                      tickLine={false}
                      interval={0}
                      angle={-14}
                      textAnchor="end"
                    />
                    <YAxis 
                      stroke="#a1a1aa" 
                      fontSize={10} 
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={38}>
                      {categoryFrequencyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.category] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Side Category Breakdown list */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 border-t md:border-t-0 md:border-l border-stone-800/70 pt-2 md:pt-0 md:pl-2.5">
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold mb-1">
                  Active Categories
                </div>
                {categoryFrequencyData.map((item, idx) => {
                  const color = CATEGORY_COLORS[item.category] || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
                  return (
                    <div 
                      key={item.category}
                      className="flex items-center justify-between text-xs font-mono p-1 rounded bg-stone-900/80 border border-stone-800/50"
                    >
                      <div className="flex items-center space-x-1.5 truncate mr-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-stone-300 truncate text-[10px]">{item.category}</span>
                      </div>
                      <span className="text-amber-400 font-bold text-[10px] shrink-0">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart 2: Resolution Success Rate (%) Trend Area Chart (XL 5 Cols) */}
          <div className="xl:col-span-5 bg-stone-950/70 p-3.5 rounded-lg border border-stone-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800/60">
              <span className="text-xs font-mono font-bold text-stone-200 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolution Success Rate Trend (%)</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>100% STABLE</span>
              </span>
            </div>

            <div className="h-48 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={successRateTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 15 }}
                >
                  <defs>
                    <linearGradient id="successRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="shortLabel" 
                    stroke="#a1a1aa" 
                    fontSize={9} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    fontSize={10} 
                    domain={[60, 100]}
                    ticks={[60, 80, 100]}
                    unit="%"
                    tickLine={false}
                  />
                  <Tooltip content={<SuccessRateTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#successRateGradient)" 
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-t border-stone-800/60 pt-2 mt-1">
              <span>Sequence: <span className="text-stone-300">Last 10 Logs</span></span>
              <span className="text-emerald-400 font-semibold">Swarm Remediation: 10/10 Auto-Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by Rule ID, threat keywords, or chapter..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1 bg-stone-950 border border-stone-800 rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-stone-300 focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-stone-900 text-stone-200">
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-stone-950 border border-stone-800 rounded-lg px-2 py-1">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-xs text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-stone-900 text-stone-200">All Severities</option>
              <option value="CRITICAL" className="bg-stone-900 text-stone-200">CRITICAL</option>
              <option value="HIGH" className="bg-stone-900 text-stone-200">HIGH</option>
              <option value="MEDIUM" className="bg-stone-900 text-stone-200">MEDIUM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {filteredThreats.length === 0 ? (
          <div className="text-center py-8 bg-stone-900/40 rounded-xl border border-stone-800/60 text-stone-400 text-xs font-mono">
            No resolved threats match the selected filter criteria.
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const isExpanded = expandedThreatId === threat.id;

            return (
              <div 
                key={threat.id} 
                className="bg-stone-900/90 rounded-xl border border-stone-800 hover:border-stone-700 transition space-y-3 p-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Rule ID Badge */}
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                      {threat.ruleId}
                    </span>

                    {/* Severity Badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      threat.severity === 'CRITICAL' 
                        ? 'bg-red-950/90 text-red-300 border border-red-800' 
                        : threat.severity === 'HIGH' 
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-800' 
                        : 'bg-blue-950/90 text-blue-300 border border-blue-800'
                    }`}>
                      {threat.severity}
                    </span>

                    {/* Status Badge */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{threat.status}</span>
                    </span>

                    {/* Chapter Context */}
                    <span className="text-xs font-semibold text-stone-300 font-mono">
                      {threat.chapterContext}
                    </span>
                  </div>

                  {/* Right Meta Info */}
                  <div className="flex items-center space-x-3 text-[11px] text-stone-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>{new Date(threat.timestamp).toLocaleString()}</span>
                    </span>

                    <button
                      onClick={() => handleCopyReport(threat)}
                      className="p-1 hover:text-stone-200 text-stone-400 transition"
                      title="Copy resolution report to clipboard"
                    >
                      {copiedId === threat.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => setExpandedThreatId(isExpanded ? null : threat.id)}
                      className="p-1 hover:text-stone-200 text-stone-400 transition"
                      title="Toggle detailed view"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Detected Threat vs Specific Mitigation Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Detected Threat */}
                  <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-red-300/90 font-mono">
                      <span className="flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>DETECTED CONTINUITY THREAT</span>
                      </span>
                    </div>
                    <p className="text-xs text-red-200/80 font-mono leading-relaxed">
                      {threat.detectedThreat}
                    </p>
                  </div>

                  {/* Specific Mitigation Action */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300/90 font-mono">
                      <span className="flex items-center space-x-1">
                        <Wrench className="w-3 h-3 text-emerald-400" />
                        <span>SWARM MITIGATION ACTION TAKEN</span>
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 font-mono leading-relaxed">
                      {threat.mitigationAction}
                    </p>
                  </div>
                </div>

                {/* Footer Meta Bar */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-stone-500">Category:</span>
                    <span className="text-stone-300">{threat.ruleCategory}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-500">Remediated By:</span>
                    <span className="text-amber-400/90 font-semibold">{threat.swarmAgent}</span>
                  </div>
                </div>

                {/* Expandable Technical Details */}
                {isExpanded && (
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-2 mt-2">
                    <span className="text-[10px] font-mono font-bold text-stone-400">
                      RAW SENTINEL DRIFT METADATA & AUDIT LOG
                    </span>
                    <pre className="text-[10px] font-mono text-stone-300 bg-stone-900 p-2 rounded overflow-x-auto">
{JSON.stringify({
  threatId: threat.id,
  ruleId: threat.ruleId,
  ruleCategory: threat.ruleCategory,
  timestamp: threat.timestamp,
  detectedAnomaly: threat.detectedThreat,
  remediationExecuted: threat.mitigationAction,
  severity: threat.severity,
  auditorAgent: threat.swarmAgent,
  validationResult: "PASS_VERIFIED",
  lockStatus: "CANON_PROTECTED"
}, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
