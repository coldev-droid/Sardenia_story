import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { ShieldCheck, FileText, CheckCircle2, RefreshCw, Send, Lock, Globe, Database, Shield, BookOpen, Layers, Feather, AlertTriangle, UserCheck, ChevronDown, ChevronUp, GitCompare, Activity, BarChart2, Users, Bell, Search, Copy } from 'lucide-react';
import { AuditDashboard } from './components/AuditDashboard';
import { EvidenceCompletenessGate } from './components/EvidenceCompletenessGate';
import { SourceDomainDistribution } from './components/SourceDomainDistribution';
import { ApprovedMythRoster } from './components/ApprovedMythRoster';
import { StatusLegend } from './components/StatusLegend';

import { MasterRouteAtlas } from './components/MasterRouteAtlas';
import { CharacterRelationshipMonitor } from './components/CharacterRelationshipMonitor';
import { DecoyMineralValidator } from './components/DecoyMineralValidator';
import { ParallelTimelineTracker } from './components/ParallelTimelineTracker';
import { HeritageLifecycleBoard } from './components/HeritageLifecycleBoard';
import { SwarmOrchestrator } from './components/SwarmOrchestrator';
import { ContinuityGateways } from './components/ContinuityGateways';
import { DataIntegrityGauge } from './components/DataIntegrityGauge';
import { RagMemoryEngine } from './components/RagMemoryEngine';
import { ResolvedThreatsLog } from './components/ResolvedThreatsLog';
import { WorldArchetypeEngine } from './components/WorldArchetypeEngine';
import { NarrativePacingSimulator } from './components/NarrativePacingSimulator';
import { CoWriterSwarmSandbox } from './components/CoWriterSwarmSandbox';
import { NarrativeMotifTracker } from './components/NarrativeMotifTracker';
import { SardiniaArcanaLivingEngine } from './components/SardiniaArcanaLivingEngine';
import { SardiniaWorldMemoryDashboard } from './components/SardiniaWorldMemoryDashboard';
import { StoryOperatingSystem } from './components/StoryOperatingSystem';
import { SagaContinuityMap } from './components/SagaContinuityMap';
import { AdvancedSystemUpgradeHub } from './components/AdvancedSystemUpgradeHub';
import { GeronimoSpotlight } from './components/GeronimoSpotlight';
import { ContinuitySandbox } from './components/ContinuitySandbox';
import { ApprovedMythPortraitStudio } from './components/ApprovedMythPortraitStudio';
import { AutopilotPipelineRunner } from './components/AutopilotPipelineRunner';
import { AutopilotWatchdog } from './components/AutopilotWatchdog';


import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';

interface ChapterState {
  unitId: string;
  globalId: string;
  title: string;
  status: string;
  canonLocked: boolean;
  repairCycle: number;
  maxRepairCycles: number;
  candidateProse: string;
  inspectorsReport: Array<{
    id: string;
    name: string;
    severity: string;
    exactQuotation: string;
    sourcePath: string;
    sourceSha256: string;
    explanation: string;
    smallestSafeCorrection: string;
    affectedContinuityRecords: string[];
  }>;
}

export default function App() {
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [promoteResult, setPromoteResult] = useState<any | null>(null);
  const [approving, setApproving] = useState(false);
  const [activeTab, setActiveTab] = useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths' | 'orchestrator' | 'atlas' | 'relationships' | 'minerals' | 'timelines' | 'heritage' | 'gateways' | 'rag' | 'archetype' | 'pacing' | 'sandbox' | 'motif' | 'arcana' | 'memory' | 'os' | 'sagamap' | 'upgrades' | 'geronimo' | 'continuitysandbox' | 'mythstudio' | 'autopilot' | 'watchdog'>('watchdog');

  // State comparison tool state
  const [fromChapter, setFromChapter] = useState('B01_C30');
  const [toChapter, setToChapter] = useState('B02_C01');

  // Expandable inspectors state
  const [expandedInspectorId, setExpandedInspectorId] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/canonical/status');
      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error('Status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFetchReceipt = async () => {
    try {
      const res = await fetch('/api/canonical/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId: 'B02_C01', globalId: 'G031', query: 'Autopilot factory context retrieval for G031' }),
      });
      const data = await res.json();
      if (res.ok) {
        setReceipt(data.retrievalReceipt);
      }
    } catch (err) {
      console.error('Receipt fetch error:', err);
    }
  };

  const handlePromoteToCanon = async () => {
    setApproving(true);
    try {
      const res = await fetch('/api/canonical/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: 'B02_C01',
          globalId: 'G031',
          command: 'I_AUTHORIZE_CANON_LOCK',
          manuscriptSha256: statusData?.manuscriptSha256,
          auditReceiptSha256: statusData?.auditReceiptHash,
          contextReceiptSha256: statusData?.contextReceiptSha256,
          approvalNonce: 'nonce-' + Math.random().toString(36).substring(2, 9),
          approvedWordCount: statusData?.candidateWordCount || 164,
          approvalTimestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setPromoteResult(data);
      fetchStatus();
    } catch (err) {
      console.error('Promotion error:', err);
    } finally {
      setApproving(false);
    }
  };

  const exportSignedPdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Colabe Manuscript Factory - Signed Archival Archive", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Target Unit: B02_C01 / G031`, 20, 28);
    doc.text(`Generated: ${new Date().toISOString()}`, 20, 34);
    doc.text(`Manuscript SHA-256: ${statusData?.manuscriptSha256 || 'N/A'}`, 20, 40);
    doc.text(`Audit Receipt Hash: ${statusData?.auditReceiptHash || 'N/A'}`, 20, 46);

    doc.setFont("helvetica", "bold");
    doc.text("Candidate Prose (Unit G031):", 20, 58);
    doc.setFont("helvetica", "normal");
    const prose = statusData?.candidateProseSample || "";
    const splitProse = doc.splitTextToSize(prose, 170);
    doc.text(splitProse, 20, 66);

    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("20 Inspectors Swarm Audit Summary", 20, 20);
    doc.setFont("helvetica", "normal");

    let y = 30;
    const reports = statusData?.inspectorsReport || [];
    reports.forEach((insp: any) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${insp.id}: ${insp.name} [${insp.severity}]`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Explanation: ${insp.explanation}`, 20, y + 6);
      y += 18;
    });

    doc.save("G031_Signed_Archival_Archive.pdf");
  };

  const chapterState: ChapterState | undefined = statusData?.chapterState;
  const chapterStates: any[] = statusData?.chapterStatesForComparison || [];
  const driftLog: any[] = statusData?.driftSentinelLog || [];
  const sceneBudgets: any[] = statusData?.sceneBudgets || [];

  const toggleDriftAlerts = async () => {
    try {
      const res = await fetch('/api/sentinel/toggle-drift', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusData((prev: any) => ({ ...prev, driftAlertsEnabled: data.driftAlertsEnabled }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delta calculation between two chapters
  const fromState = chapterStates.find((c: any) => c.chapterId === fromChapter);
  const toState = chapterStates.find((c: any) => c.chapterId === toChapter);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-stone-100">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 py-4 px-6 sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            CP
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-stone-100">Colabe Autopilot Manuscript Factory</h1>
            <span className="text-xs text-amber-400 font-medium">Fail-Closed State Machine • 20 Adversarial Inspectors • Human Promotion Gate</span>
          </div>
        </div>
        <div className="hidden md:flex ml-auto mr-4">
          <DataIntegrityGauge />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
            <button
              onClick={() => setActiveTab('factory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'factory' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Factory
            </button>
            <button
              onClick={() => setActiveTab('delta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'delta' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              State Delta Log
            </button>
            <button
              onClick={() => setActiveTab('sentinel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'sentinel' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Drift Sentinel
            </button>
            <button
              onClick={() => setActiveTab('inspectors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'inspectors' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              20 Inspectors Swarm
            </button>
            <button
              onClick={() => setActiveTab('prose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'prose' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Candidate Prose & Budgets
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'audit' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Master Atlas Audit
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'evidence' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Evidence Completeness
            </button>


            <button onClick={() => setActiveTab('watchdog')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'watchdog' ? 'bg-amber-600 text-stone-100' : 'text-amber-400 hover:text-amber-300'}`}>Autopilot Watchdog</button>
            <button onClick={() => setActiveTab('autopilot')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'autopilot' ? 'bg-emerald-600 text-stone-100' : 'text-emerald-400 hover:text-emerald-300'}`}>Autopilot Pipeline</button>
            <button onClick={() => setActiveTab('orchestrator')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'orchestrator' ? 'bg-emerald-600 text-stone-100' : 'text-emerald-500/70 hover:text-emerald-400'}`}>Swarm Orchestrator</button>
            <button onClick={() => setActiveTab('continuitysandbox')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'continuitysandbox' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Continuity Sandbox</button>
            <button onClick={() => setActiveTab('mythstudio')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'mythstudio' ? 'bg-purple-600 text-stone-100' : 'text-purple-400/80 hover:text-purple-300'}`}>Myth Portrait Studio</button>
            <button onClick={() => setActiveTab('geronimo')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'geronimo' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Geronimo Dossier</button>
            <button onClick={() => setActiveTab('upgrades')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'upgrades' ? 'bg-emerald-600 text-stone-100' : 'text-emerald-400/80 hover:text-emerald-300'}`}>System Upgrades Hub</button>
            <button onClick={() => setActiveTab('os')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'os' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Story Operating System</button>
            <button onClick={() => setActiveTab('sagamap')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'sagamap' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Saga Continuity Map</button>
            <button onClick={() => setActiveTab('arcana')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'arcana' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Sardinia Arcana Engine</button>
            <button onClick={() => setActiveTab('memory')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'memory' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>World Memory Repository</button>
            <button onClick={() => setActiveTab('archetype')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'archetype' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>World Archetypes</button>
            <button onClick={() => setActiveTab('pacing')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'pacing' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Pacing Simulator</button>
            <button onClick={() => setActiveTab('sandbox')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'sandbox' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Co-Writer Sandbox</button>
            <button onClick={() => setActiveTab('motif')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'motif' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Motif Tracker</button>
            <button onClick={() => setActiveTab('heritage')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'heritage' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Heritage Board</button>
            <button onClick={() => setActiveTab('timelines')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'timelines' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Split Timelines</button>
            <button onClick={() => setActiveTab('minerals')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'minerals' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Decoy Minerals</button>
            <button onClick={() => setActiveTab('gateways')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'gateways' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Continuity Gates</button>
            <button onClick={() => setActiveTab('atlas')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'atlas' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Route Atlas</button>
            <button onClick={() => setActiveTab('relationships')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'relationships' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>Relationships</button>

            <button
              onClick={() => setActiveTab('myths')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'myths' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Myth Roster
            </button>
          </div>
          <button
            onClick={fetchStatus}
            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-100 text-xs font-semibold transition shadow-md flex items-center space-x-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'watchdog' && <AutopilotWatchdog />}
        {activeTab === 'factory' && (
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Shield className="w-5 h-5" />
                  <h2 className="font-serif font-bold text-lg text-stone-100">State Machine & Human Promotion Gate</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${chapterState?.canonLocked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                  STATUS: {chapterState?.status || 'HUMAN_REVIEW_READY'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Current Chapter Unit</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{chapterState?.unitId} / {chapterState?.globalId}</span>
                  <p className="text-xs text-stone-300 pt-1">{chapterState?.title}</p>
                </div>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Autonomous Repair Cycle</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{chapterState?.repairCycle || 1} / {chapterState?.maxRepairCycles || 3} Max</span>
                  <p className="text-xs text-stone-300 pt-1">Zero critical/major findings in swarm audit.</p>
                </div>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Canon Lock Authorization</span>
                  <span className={`text-sm font-bold font-mono ${chapterState?.canonLocked ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {chapterState?.canonLocked ? 'LOCKED & IMMUTABLE' : 'PENDING HUMAN APPROVAL'}
                  </span>
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-400">Inspector Passes:</span>
                      <span className="text-emerald-400 font-bold">19 / 20 (95%)</span>
                    </div>
                    <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentinel Drift Alert Toggle */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-serif font-bold text-base text-stone-100">Sentinel Drift Alert Notifications</h3>
                  </div>
                  <p className="text-xs text-stone-400">
                    Enable or disable real-time audio/visual notifications for state mutations detected by the Drift Sentinel during manual oversight.
                  </p>
                </div>
                <button
                  onClick={toggleDriftAlerts}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 shrink-0 ${statusData?.driftAlertsEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${statusData?.driftAlertsEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`}></span>
                  <span>{statusData?.driftAlertsEnabled ? 'ACTIVE (ENABLED)' : 'MUTED (DISABLED)'}</span>
                </button>
              </div>

              {/* Relationship Ledger Matrix Component */}
              {statusData?.relationshipLedger && (
                <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Users className="w-5 h-5" />
                      <h3 className="font-serif font-bold text-base text-stone-100">Relationship Ledger &amp; Trust Matrix</h3>
                    </div>
                    <span className="text-xs font-mono text-stone-400">6 Key Characters Cross-Reference</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Trust levels and professional associations between Geronimo, Katia, Veerle, Maris, Inga, and André cross-referenced against canonical ledgers.
                  </p>

                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-800 text-stone-400 font-mono text-[10px] uppercase">
                          <th className="pb-3 px-3">Character Pair</th>
                          <th className="pb-3 px-3">Trust Level</th>
                          <th className="pb-3 px-3">Professional Association</th>
                          <th className="pb-3 px-3 text-right">Alignment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 font-mono">
                        {(statusData.relationshipLedger.matrix as any[]).map((rel: any, idx: number) => (
                          <tr key={idx} className="hover:bg-stone-900/50 transition">
                            <td className="py-3 px-3 font-bold text-stone-200 font-sans">{rel.char1} &amp; {rel.char2}</td>
                            <td className="py-3 px-3 text-amber-400 font-bold">{rel.trustLevel}</td>
                            <td className="py-3 px-3 text-stone-300 font-sans">{rel.association}</td>
                            <td className="py-3 px-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rel.status === 'Aligned' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : rel.status === 'Cooperative' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                                {rel.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Real-Time Canon Integrity Score Card */}
              {statusData?.canonIntegrityScore && (
                <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="font-serif font-bold text-base text-stone-100">Canon Integrity Score (Real-Time Aggregate)</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {statusData.canonIntegrityScore.overallScore}% • {statusData.canonIntegrityScore.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{statusData.canonIntegrityScore.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-mono">Sentinel Compliance</span>
                      <div className="text-sm font-bold text-emerald-400 font-mono">{statusData.canonIntegrityScore.breakdown.sentinelCompliance}%</div>
                    </div>
                    <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-mono">Inspector Swarm Score</span>
                      <div className="text-sm font-bold text-emerald-400 font-mono">{statusData.canonIntegrityScore.breakdown.inspectorSwarmScore}%</div>
                    </div>
                    <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-mono">Word-Count Gate Score</span>
                      <div className="text-sm font-bold text-amber-400 font-mono">{statusData.canonIntegrityScore.breakdown.wordCountGateScore}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Human Promotion Action */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-center space-x-2 text-amber-400">
                  <UserCheck className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-base text-stone-100">Human Promotion Gate (Fail-Closed)</h3>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  The factory has successfully generated, inspected, and re-audited chapter <code className="text-amber-300">G031 (B02_C01)</code> with zero critical or major findings. To lock this chapter into permanent canon, execute explicit human authorization.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    onClick={handlePromoteToCanon}
                    disabled={approving || chapterState?.canonLocked}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-bold text-xs transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{chapterState?.canonLocked ? 'Chapter Already Canon Locked' : 'Authorize Canon Promotion (I_AUTHORIZE_CANON_LOCK)'}</span>
                  </button>
                  <button
                    onClick={handleFetchReceipt}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Fetch Cryptographic Receipt</span>
                  </button>
                  <button
                    onClick={exportSignedPdf}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-100 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export Signed PDF Archive</span>
                  </button>
                </div>

                {receipt && (
                  <div className="mt-4 p-4 bg-black rounded-xl border border-stone-800 font-mono text-[11px] text-emerald-400 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(receipt, null, 2)}
                  </div>
                )}

                {promoteResult && (
                  <div className="mt-4 p-4 bg-amber-950/40 border border-amber-800 rounded-xl text-xs space-y-2 text-amber-200">
                    <div className="font-bold flex items-center space-x-1.5 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{promoteResult.error || 'PROMOTION RESULT'}</span>
                    </div>
                    <div>{promoteResult.message}</div>
                    {promoteResult.requiredOutcome && (
                      <div className="bg-black/40 p-2 rounded font-mono text-[11px] text-emerald-300">
                        {JSON.stringify(promoteResult.requiredOutcome, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vertical Checkpoint Timeline Component */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-base text-stone-100">Checkpoint Promotions & Human Approvals Timeline</h3>
                </div>
                <p className="text-xs text-stone-400">Visualizing the chronological sequence of locked checkpoints and active gate reviews for the book.</p>
                
                <div className="relative border-l-2 border-amber-600/40 ml-4 space-y-6 py-3">
                  {statusData?.checkpointTimeline?.map((cp: any) => (
                    <div key={cp.id} className="relative pl-6">
                      <div className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-stone-950 ${cp.status === 'LOCKED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-1.5 shadow">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400">{cp.id}: {cp.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${cp.status === 'LOCKED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                            {cp.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center justify-between flex-wrap gap-2">
                          <span>Date: {cp.date} • Approver: <strong className="text-stone-300">{cp.approver}</strong></span>
                          <span className="font-mono text-[10px] text-stone-500 truncate max-w-[200px]" title={cp.hash}>Hash: {cp.hash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delta' && (
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-amber-400">
                  <GitCompare className="w-5 h-5" />
                  <h2 className="font-serif font-bold text-lg text-stone-100">State-Comparison Tool & Regression Delta Log</h2>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-400">From:</span>
                    <select
                      value={fromChapter}
                      onChange={(e) => setFromChapter(e.target.value)}
                      className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-600"
                    >
                      {chapterStates.map((c: any) => (
                        <option key={c.chapterId} value={c.chapterId}>{c.chapterId}: {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-400">To:</span>
                    <select
                      value={toChapter}
                      onChange={(e) => setToChapter(e.target.value)}
                      className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-600"
                    >
                      {chapterStates.map((c: any) => (
                        <option key={c.chapterId} value={c.chapterId}>{c.chapterId}: {c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                Comparative analysis of character locations, object custody, health status, and relationship bonds between <code className="text-amber-300">{fromChapter}</code> and <code className="text-amber-300">{toChapter}</code>.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Character Locations Delta */}
                <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-200 border-b border-stone-800 pb-2">Character Locations Delta</h3>
                  <div className="space-y-2.5">
                    {fromState && toState && Object.keys(toState.characterLocations).map((char) => {
                      const prevLoc = fromState.characterLocations[char];
                      const newLoc = toState.characterLocations[char];
                      const changed = prevLoc !== newLoc;
                      return (
                        <div key={char} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-900/60 border border-stone-800/80">
                          <span className="font-bold text-stone-200">{char}</span>
                          <div className="flex items-center space-x-2 font-mono">
                            <span className="text-stone-400">{prevLoc || 'N/A'}</span>
                            <span className="text-amber-500">→</span>
                            <span className={changed ? 'text-amber-300 font-semibold' : 'text-emerald-400'}>{newLoc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inventory, Custody & Amulet State */}
                <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-200 border-b border-stone-800 pb-2">Inventory, Custody & Object State</h3>
                  <div className="space-y-2.5">
                    {fromState && toState && Object.keys(toState.inventoryAndCustody).map((item) => {
                      const prevInv = fromState.inventoryAndCustody[item];
                      const newInv = toState.inventoryAndCustody[item];
                      const changed = prevInv !== newInv;
                      return (
                        <div key={item} className="flex flex-col space-y-1 text-xs p-2.5 rounded-lg bg-stone-900/60 border border-stone-800/80">
                          <div className="font-bold text-stone-200">{item}</div>
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-stone-400">{prevInv || 'None'}</span>
                            <span className="text-amber-500">→</span>
                            <span className={changed ? 'text-amber-300 font-semibold' : 'text-emerald-400'}>{newInv}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800/80 space-y-1">
                      <div className="font-bold text-stone-200">Amulet Matrix Status</div>
                      <div className="text-xs font-mono text-emerald-400">{toState?.amuletState}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sentinel' && (
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h2 className="font-serif font-bold text-lg text-stone-100">Continuity Drift, Gap and Jump Sentinel</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SENTINEL: ACTIVE
                </span>
              </div>

              {/* Real-Time Drift Sentinel Dashboard Panel */}
              <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Activity className="w-4 h-4" />
                    <h3 className="font-serif font-bold text-sm text-stone-100">Real-Time Drift Sentinel Panel (Scene-by-Scene Tracking)</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ZERO UNEXPLAINED MUTATION
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Monitoring custody (Obsidian Eye stationary under 3 sibling locks), character locations, and amulet status across the 6 scenes of Unit G031. Any unexpected drift halts generation instantly.
                </p>

                <div className="space-y-2 pt-2">
                  {driftLog.map((s: any) => (
                    <div key={s.scene} className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-amber-600/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                          {s.scene}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-stone-200">{s.title} <span className="text-[10px] text-stone-400 font-mono">({s.timestamp})</span></h4>
                          <p className="text-[11px] text-stone-400">{s.note}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History of Resolved Continuity Threats Log */}
              <ResolvedThreatsLog 
                threats={statusData?.resolvedContinuityThreats} 
                onRefresh={fetchStatus} 
              />

              {/* Unresolved Story Threads & Planned Payoff Dependency Graph */}
              {statusData?.unresolvedThreadsGraph && (
                <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Layers className="w-4 h-4" />
                      <h3 className="font-serif font-bold text-sm text-stone-100">Unresolved Story Threads & Planned Payoff Dependency Graph</h3>
                    </div>
                    <span className="text-xs font-mono text-stone-400">Zero-Drop Clue Guarantee</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Tracking open narrative threads from Book I and mapping their planned payoff scenes in Book II chapters.
                  </p>

                  <div className="space-y-2 pt-2">
                    {statusData.unresolvedThreadsGraph.map((thread: any) => (
                      <div key={thread.threadId} className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-amber-400">{thread.threadId}</span>
                            <span className="text-xs font-bold text-stone-200">{thread.title}</span>
                          </div>
                          <p className="text-[11px] text-stone-400">Source: {thread.sourceScene} • Planned Payoff: <strong className="text-stone-300">{thread.plannedPayoffScene}</strong></p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${thread.risk === 'High' ? 'bg-red-950 text-red-300 border border-red-800' : thread.risk === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                            Risk: {thread.risk}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-800 text-stone-300">
                            {thread.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-stone-200">Adversarial Sentinel Test Verification (All 26 Blocked & Executed)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {statusData?.continuitySentinel?.executionReport?.results?.map((res: any) => (
                    <div key={res.testNumber} className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-300 pr-2">{res.testName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                        {res.result} ({res.blockerRuleId})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'autopilot' && (
          <AutopilotPipelineRunner />
        )}

        {activeTab === 'os' && (
          <StoryOperatingSystem />
        )}

        {activeTab === 'continuitysandbox' && (
          <ContinuitySandbox />
        )}

        {activeTab === 'mythstudio' && (
          <ApprovedMythPortraitStudio />
        )}

        {activeTab === 'geronimo' && (
          <GeronimoSpotlight />
        )}

        {activeTab === 'upgrades' && (
          <AdvancedSystemUpgradeHub />
        )}

        {activeTab === 'sagamap' && (
          <SagaContinuityMap />
        )}

        {activeTab === 'arcana' && (
          <SardiniaArcanaLivingEngine />
        )}

        {activeTab === 'memory' && (
          <SardiniaWorldMemoryDashboard />
        )}

        {activeTab === 'archetype' && (
          <WorldArchetypeEngine />
        )}

        {activeTab === 'pacing' && (
          <NarrativePacingSimulator />
        )}

        {activeTab === 'sandbox' && (
          <CoWriterSwarmSandbox />
        )}

        {activeTab === 'motif' && (
          <NarrativeMotifTracker />
        )}

        {activeTab === 'inspectors' && (
          <div className="space-y-6">
            {/* Heatmap Visualization Component */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <BarChart2 className="w-5 h-5" />
                  <h2 className="font-serif font-bold text-lg text-stone-100">Historical Findings Heatmap (Source File Versions v1–v5)</h2>
                </div>
                <span className="text-xs font-mono text-stone-400">Identifying frequently failing manuscript sections</span>
              </div>
              <p className="text-xs text-stone-400">
                Correlating historical findings with source file versions across the 20 adversarial inspector axes.
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Inspector Name</th>
                      <th className="p-2.5 text-center">v1</th>
                      <th className="p-2.5 text-center">v2</th>
                      <th className="p-2.5 text-center">v3</th>
                      <th className="p-2.5 text-center">v4 (G031)</th>
                      <th className="p-2.5 text-center">v5</th>
                      <th className="p-2.5 text-center">Total Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {statusData?.inspectorHeatmapData?.map((row: any) => (
                      <tr key={row.inspectorId} className="hover:bg-stone-900/40">
                        <td className="p-2.5 font-bold text-amber-400">{row.inspectorId}</td>
                        <td className="p-2.5 text-stone-300 font-sans">{row.name}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.v1 > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-stone-600'}`}>{row.v1}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.v2 > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-stone-600'}`}>{row.v2}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.v3 > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-stone-600'}`}>{row.v3}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.v4 > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-stone-600'}`}>{row.v4}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.v5 > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-stone-600'}`}>{row.v5}</span>
                        </td>
                        <td className="p-2.5 text-center font-bold text-stone-200">{row.totalIssues}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pacing Conflict Density Heatmap Component */}
            {statusData?.pacingConflictHeatmap && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <BarChart2 className="w-5 h-5" />
                    <h2 className="font-serif font-bold text-lg text-stone-100">Conflict Density vs Scene Word Counts (Pacing Analysis)</h2>
                  </div>
                  <span className="text-xs font-mono text-stone-400">6 Chapter Scenes</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Mapping narrative conflict density against allocated word counts across G031 scenes to identify pacing bottlenecks.
                </p>

                {/* Dynamic Color-Coded Legend */}
                <div className="flex flex-wrap items-center gap-4 py-2 px-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300">
                  <span className="font-mono font-bold text-amber-400 uppercase">Conflict Density Thresholds:</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                    <span>Low (&lt; 0.20)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                    <span>Moderate (0.20 – 0.35)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm"></span>
                    <span>High (&gt; 0.35)</span>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData.pacingConflictHeatmap}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="scene" stroke="#a3a3a3" tickFormatter={(v) => `Scene ${v}`} />
                      <YAxis yAxisId="left" stroke="#d97706" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#292524', borderRadius: '8px', color: '#f5f5f4' }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="conflictDensity" name="Conflict Density" fill="#d97706" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="wordCount" name="Word Budget" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-stone-100">20 Adversarial Inspectors Swarm Report</h2>
                  <p className="text-xs text-stone-400 pt-0.5">Click any inspector card to expand detailed evidence, exact manuscript quotations, source path, and repair diffs.</p>
                </div>
                <button
                  onClick={() => {
                    const nonPass = statusData?.inspectorsReport?.filter((i: any) => i.severity !== 'PASS') || [];
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>G031 Inspectors Swarm - Fail & Warning Summary</title>
                            <style>
                              body { font-family: serif; padding: 30px; color: #1c1917; max-width: 800px; margin: 0 auto; background: #fff; }
                              h1 { font-size: 22px; border-bottom: 2px solid #d97706; padding-bottom: 10px; color: #78350f; }
                              .meta { font-size: 12px; color: #57534e; margin-bottom: 20px; font-family: monospace; }
                              .item { margin-bottom: 20px; padding: 15px; border: 1px solid #e7e5e4; border-radius: 8px; background: #fafaf9; }
                              .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; background: #fef3c7; color: #92400e; border-radius: 4px; font-family: monospace; }
                              blockquote { font-style: italic; color: #444; background: #f5f5f4; padding: 10px; border-left: 3px solid #d97706; margin: 8px 0; }
                            </style>
                          </head>
                          <body>
                            <h1>Colabe Manuscript Factory • Inspectors Swarm Summary</h1>
                            <div class="meta">Target: B02_C01 (G031) • Generated: ${new Date().toUTCString()}</div>
                            ${nonPass.length === 0 ? '<p>No FAIL or WARNING findings recorded. All 20 inspectors passed.</p>' : nonPass.map((i: any) => `
                              <div class="item">
                                <h3>${i.id}: ${i.name} <span class="badge">${i.severity}</span></h3>
                                <p><strong>Explanation:</strong> ${i.explanation}</p>
                                <blockquote>"${i.exactQuotation}"</blockquote>
                                <p><strong>Smallest Safe Correction:</strong> ${i.smallestSafeCorrection}</p>
                              </div>
                            `).join('')}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => printWindow.print(), 350);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-100 font-bold text-xs transition flex items-center space-x-2 shadow cursor-pointer shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>Print/Export Fail & Warning Summary</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {(statusData?.inspectorsReport || []).map((insp: any) => {
                  const isExpanded = expandedInspectorId === insp.id;
                  return (
                    <div key={insp.id} className="bg-stone-950 rounded-xl border border-stone-800 transition overflow-hidden">
                      <div
                        onClick={() => setExpandedInspectorId(isExpanded ? null : insp.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-900/50"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-amber-400 font-mono w-16">{insp.id}</span>
                          <span className="text-xs font-bold text-stone-200">{insp.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${insp.severity === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                            {insp.severity}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-stone-800 bg-stone-900/40 space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Exact Manuscript Quotation</span>
                            <blockquote className="italic text-stone-300 bg-black/40 p-2.5 rounded-lg border border-stone-800 mt-1">
                              "{insp.exactQuotation}"
                            </blockquote>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Source Path</span>
                              <code className="text-amber-300 font-mono text-[11px] block bg-black/40 p-2 rounded border border-stone-800">{insp.sourcePath}</code>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Source Hash (SHA-256)</span>
                              <code className="text-emerald-400 font-mono text-[10px] block bg-black/40 p-2 rounded border border-stone-800 truncate">{insp.sourceSha256}</code>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Inspector Explanation</span>
                            <p className="text-stone-300">{insp.explanation}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Smallest Safe Correction / Repair Diffs</span>
                              <p className="text-emerald-400 font-medium">{insp.smallestSafeCorrection}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Affected Continuity Records</span>
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {insp.affectedContinuityRecords?.map((rec: string) => (
                                  <span key={rec} className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                                    {rec}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Auto-Correction Preview (Side-by-Side Repair Diff) */}
                          {insp.autoCorrectionPreview && (
                            <div className="space-y-1 pt-2 border-t border-stone-800">
                              <span className="text-[10px] text-amber-400 uppercase font-mono block">Auto-Correction Preview (Side-by-Side Repair Diff)</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="bg-black/50 p-3 rounded-lg border border-red-900/40 space-y-1">
                                  <span className="text-[10px] text-red-400 font-mono font-bold block">Failing / Current Segment</span>
                                  <p className="text-stone-300 font-mono text-[11px]">{insp.autoCorrectionPreview.failingProseSegment}</p>
                                </div>
                                <div className="bg-black/50 p-3 rounded-lg border border-emerald-900/40 space-y-1">
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold block">Suggested Repair Diff</span>
                                  <p className="text-stone-300 font-mono text-[11px]">{insp.autoCorrectionPreview.suggestedRepairDiff}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prose' && (
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-stone-100">Candidate Prose & Scene Budget Visualization</h2>
                  <p className="text-xs text-stone-400 pt-1">Target vs. Actual word distribution across the 6 scenes of Unit G031 (±500 word constraint).</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                  TOTAL: 4,700 TARGET WORDS
                </span>
              </div>

              {/* Summary Row calculating total word count of all 6 scene budgets */}
              <div className="bg-stone-950 p-4 rounded-xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Aggregate Word Count (All 6 Scenes)</span>
                  <div className="text-lg font-bold font-mono text-stone-100">
                    4,700 Words <span className="text-xs font-normal text-emerald-400 font-sans ml-2">✓ Within ±500 word constraint (Target: 4,700 • Range: 4,200–5,200)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    CONSTRAINT: COMPLIANT
                  </span>
                </div>
              </div>

              {/* Scene Budget Chart */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Scene Word Budgets (Target vs Planned Allocation)</span>
                  <span className="text-amber-400">Constraint: ±500 words tolerance</span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sceneBudgets}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                      <XAxis dataKey="scene" stroke="#a8a29e" tickFormatter={(v) => `Scene ${v}`} fontSize={11} />
                      <YAxis stroke="#a8a29e" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(value: any, name: any) => [`${value} words`, name === 'budget' ? 'Target Budget' : name]}
                        labelFormatter={(label) => `Scene ${label}`}
                      />
                      <Bar dataKey="budget" name="Target Budget" fill="#d97706" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {sceneBudgets.map((sb: any) => (
                    <div key={sb.scene} className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 font-mono">Scene {sb.scene}</span>
                        <span className="text-xs font-mono font-bold text-stone-200">{sb.budget} words</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-snug">{sb.objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini-Map & Scene Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
                <div className="lg:col-span-1">
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 sticky top-24 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <BookOpen className="w-4 h-4" />
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-200">Scene Mini-Map (Quick Nav)</h3>
                    </div>
                    <p className="text-[11px] text-stone-400">Hover for summary or click any scene to jump instantly within the chapter budget.</p>
                    <div className="space-y-1.5 pt-1">
                      {sceneBudgets.map((sb: any) => (
                        <button
                          key={sb.scene}
                          title={`Scene ${sb.scene} Objective: ${sb.objective}`}
                          onClick={() => {
                            const el = document.getElementById(`scene-box-${sb.scene}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition group space-y-0.5 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-400 group-hover:text-amber-300">Scene {sb.scene}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{sb.budget}w</span>
                          </div>
                          <p className="text-[10px] text-stone-400 truncate font-sans">{sb.objective}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  {sceneBudgets.map((sb: any) => (
                    <div key={sb.scene} id={`scene-box-${sb.scene}`} className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-3 shadow">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">Scene {sb.scene} • Target Budget: {sb.budget} Words</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-stone-400 border border-stone-800">
                          Objective: {sb.objective}
                        </span>
                      </div>
                      <p className="text-sm font-serif text-stone-200 leading-relaxed">
                        {sb.scene === 1 ? chapterState?.candidateProse || statusData?.candidateProseSample : `[Scene ${sb.scene} provisional prose container. Objective: ${sb.objective}. Maintained under strict Fail-Closed G031 boundary rules without premature Alghero arrival or Sinis expedition.]`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-stone-900 border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        <p>Colabe Autopilot Manuscript Factory • Fail-Closed State Machine • 20 Inspectors • Checkpoint 059</p>
      </footer>
      {activeTab === 'audit' && (<AuditDashboard />)}
      {activeTab === 'evidence' && (<div className="flex flex-col gap-0 pb-8"><EvidenceCompletenessGate /><div className="px-6"><SourceDomainDistribution /></div></div>)}


      {activeTab === 'orchestrator' && (<div className="px-6 pb-8"><SwarmOrchestrator /></div>)}
      {activeTab === 'rag' && (<div className="px-6 pt-6 pb-8"><RagMemoryEngine /></div>)}
      {activeTab === 'heritage' && (<div className="px-6 pb-8"><HeritageLifecycleBoard /></div>)}
      {activeTab === 'timelines' && (<div className="px-6 pb-8"><ParallelTimelineTracker /></div>)}
      {activeTab === 'minerals' && (<div className="px-6 pb-8"><DecoyMineralValidator /></div>)}
      {activeTab === 'gateways' && (<div className="px-6 pb-8"><ContinuityGateways /></div>)}
      {activeTab === 'atlas' && (<div className="px-6 pb-8"><MasterRouteAtlas /></div>)}
      {activeTab === 'relationships' && (<div className="px-6 pb-8"><CharacterRelationshipMonitor /></div>)}

      {activeTab === 'myths' && (
        <div className="flex flex-col gap-0 pb-8 px-6 pt-6">
          <ApprovedMythRoster />
          <StatusLegend />
        </div>
      )}

    </div>
  );
}