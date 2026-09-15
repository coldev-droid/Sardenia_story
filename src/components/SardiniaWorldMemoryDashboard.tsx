import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  MapPin, 
  Users, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  GitBranch, 
  Tag, 
  Link2, 
  Sparkles, 
  Layers,
  History,
  RotateCcw,
  Plus,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';

export interface WorldMemoryEntity {
  id: string;
  name: string;
  sardinianName?: string;
  category: 'CHARACTER' | 'LOCATION' | 'HISTORICAL_EVENT' | 'ARTIFACT_MINERAL' | 'CULTURAL_FOLKLORE';
  bookPresence: string[];
  summary: string;
  verifiedFactDetails: string;
  connectedEntities: string[];
  verificationStatus: 'VERIFIED_FACT' | 'FOLK_TRADITION' | 'ORIGINAL_FICTIONAL_TRANSFORMATION';
  sourceReference: string;
}

export interface CanonSnapshot {
  id: string;
  timestamp: string;
  label: string;
  author: string;
  sha256: string;
  lockedCount: string;
  status: 'ACTIVE_HEAD' | 'STABLE_SNAPSHOT';
  summary: string;
}

const INITIAL_SNAPSHOTS: CanonSnapshot[] = [
  {
    id: "SNAP-003",
    timestamp: "2026-09-10 18:00:00",
    label: "Book II Monte Arci Alignment & 12 Amulets Lock",
    author: "Canon Gatekeeper Swarm",
    sha256: "sha256:8f9a2b7c4d1e0f3a6b5c",
    lockedCount: "30/30 Book I, 12/30 Book II",
    status: "ACTIVE_HEAD",
    summary: "Production state with verified obsidian palm scar resonance and 784Hz acoustic cave logs."
  },
  {
    id: "SNAP-002",
    timestamp: "2026-09-10 12:30:00",
    label: "Pre-Monte Arci Revision Baseline",
    author: "Historical Auditor",
    sha256: "sha256:1a2b3c4d5e6f7a8b9c0d",
    lockedCount: "30/30 Book I, 08/30 Book II",
    status: "STABLE_SNAPSHOT",
    summary: "Baseline before updating Inga mineral test sequence in Monte Arci obsidian deposits."
  },
  {
    id: "SNAP-001",
    timestamp: "2026-09-09 09:15:00",
    label: "Book I Complete Final Release Lock",
    author: "Geronimo Lead Editor",
    sha256: "sha256:9f8e7d6c5b4a3f2e1d0c",
    lockedCount: "30/30 Book I",
    status: "STABLE_SNAPSHOT",
    summary: "Initial verified lock of Book I Capo Caccia and Sentina arrival saga."
  }
];

const WORLD_MEMORY_ENTITIES: WorldMemoryEntity[] = [
  {
    id: "ENT-01",
    name: "Geronimo, Veerle & Katia Sibling Nexus",
    category: "CHARACTER",
    bookPresence: ["Book I", "Book II", "Book III", "Book IV", "Book V"],
    summary: "Biological siblings sharing locked family memory canon, joint software/engineering heritage, and protective instincts.",
    verifiedFactDetails: "Locked biological sibling relationship. Shared childhood memories in Barcelona predating the Sentina expedition.",
    connectedEntities: ["Sentina Vessel", "Barcelona Tech Company", "Monte Arci Obsidian"],
    verificationStatus: "VERIFIED_FACT",
    sourceReference: "Canonical Relationship Matrix Rule 1"
  },
  {
    id: "ENT-02",
    name: "Grotta di Nettuno & Escala del Cabirol",
    sardinianName: "Crotte de Nettunu",
    category: "LOCATION",
    bookPresence: ["Book I", "Book II"],
    summary: "Sea-level marine karst cave system situated at the base of Capo Caccia cliffs, accessible via 654 steps.",
    verifiedFactDetails: "Carved into marine limestone cliffs. Entrance sits at sea level. Strictly non-deep-sea trench topography.",
    connectedEntities: ["Capo Caccia", "Alghero Port", "S'Urtzu Acoustic Resonance"],
    verificationStatus: "VERIFIED_FACT",
    sourceReference: "Parco Naturale Regionale di Porto Conte & Italian Ministry of Culture"
  },
  {
    id: "ENT-03",
    name: "Santa Cristina Sacred Well Alignment",
    sardinianName: "Pozzo Sacro de Santa Cristina",
    category: "LOCATION",
    bookPresence: ["Book I", "Book III", "Book V"],
    summary: "Bronze Age keyhole-shaped basalt subterranean well, famous for precise astronomical lunar equinox reflections.",
    verifiedFactDetails: "Dated to ~1100 BC. Keyhole masonry stairwell leads to subterranean freshwater chamber.",
    connectedEntities: ["Paulilatino", "Halite Solution", "Amulet #03 Convergence"],
    verificationStatus: "VERIFIED_FACT",
    sourceReference: "Sardegna Cultura & UNESCO Tentative List"
  },
  {
    id: "ENT-04",
    name: "Sanctuaria Historic Shipwreck Wreckage",
    category: "HISTORICAL_EVENT",
    bookPresence: ["Book I", "Book IV"],
    summary: "17th-century unidentified wreck off Capo Caccia carrying unverified maritime ledgers.",
    verifiedFactDetails: "Unnamed historical maritime wreck. Reclassified to strictly prohibit fake historical 1642 Sanctity manifests.",
    connectedEntities: ["Capo Caccia", "André Maritime Chart", "Sentina Expedition"],
    verificationStatus: "ORIGINAL_FICTIONAL_TRANSFORMATION",
    sourceReference: "Zero-Invention Research Firewall Rule 8"
  },
  {
    id: "ENT-05",
    name: "Monte Arci Obsidian Mineral Matrix",
    sardinianName: "Obsidiana de Monte Arci",
    category: "ARTIFACT_MINERAL",
    bookPresence: ["Book I", "Book II", "Book III", "Book IV", "Book V"],
    summary: "Volcanic glass deposits exploited since the Neolithic era in Sardinia for tool making and ritual blades.",
    verifiedFactDetails: "Geologically present at Monte Arci (Pau region). High silica volcanic glass exhibiting conchoidal fracture.",
    connectedEntities: ["Su Murtarolu", "Inga Mineral Field Tests", "Amulet #01 Matrix"],
    verificationStatus: "VERIFIED_FACT",
    sourceReference: "Museo dell'Ossidiana di Pau & Geological Survey of Sardinia"
  },
  {
    id: "ENT-06",
    name: "Su Scultone Karst Serpent Myth",
    sardinianName: "Su Scultone de Baunei",
    category: "CULTURAL_FOLKLORE",
    bookPresence: ["Book II", "Book IV"],
    summary: "Legendary subterranean serpentine creature associated with Baunei karst limestone chasms and acoustic rumblings.",
    verifiedFactDetails: "Authentic Sardinian oral folklore recorded in Ogliastra region regarding limestone chasms.",
    connectedEntities: ["Golgo Plateau", "Baunei Chasm", "Cogas Myth Crossing"],
    verificationStatus: "FOLK_TRADITION",
    sourceReference: "Sardinia Regional Folklore Archives & Baunei Municipal Traditions"
  }
];

export function SardiniaWorldMemoryDashboard() {
  const [entities] = useState<WorldMemoryEntity[]>(WORLD_MEMORY_ENTITIES);
  const [snapshots, setSnapshots] = useState<CanonSnapshot[]>(INITIAL_SNAPSHOTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<WorldMemoryEntity>(WORLD_MEMORY_ENTITIES[0]);
  const [newSnapshotLabel, setNewSnapshotLabel] = useState('');
  const [activeTab, setActiveTab] = useState<'ENTITIES' | 'VERSION_CONTROL'>('VERSION_CONTROL');
  const [rollbackSuccessMsg, setRollbackSuccessMsg] = useState<string | null>(null);

  const filteredEntities = entities.filter(ent => {
    const matchesCategory = selectedCategory === 'ALL' || ent.category === selectedCategory;
    const matchesSearch = 
      ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ent.sardinianName && ent.sardinianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ent.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.verifiedFactDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSnapshot = () => {
    if (!newSnapshotLabel.trim()) return;
    const newSnap: CanonSnapshot = {
      id: `SNAP-00${snapshots.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      label: newSnapshotLabel,
      author: "Canon Gatekeeper Swarm",
      sha256: `sha256:${Math.random().toString(16).substring(2, 14)}`,
      lockedCount: "30/30 Book I, 14/30 Book II",
      status: "ACTIVE_HEAD",
      summary: "User-created snapshot capturing current World Memory and Saga Continuity Map state."
    };

    setSnapshots(prev => [newSnap, ...prev.map(s => ({ ...s, status: 'STABLE_SNAPSHOT' as const }))]);
    setNewSnapshotLabel('');
    setRollbackSuccessMsg(`Created snapshot ${newSnap.id}: "${newSnap.label}"`);
    setTimeout(() => setRollbackSuccessMsg(null), 3000);
  };

  const handleRollback = (snap: CanonSnapshot) => {
    setSnapshots(prev => prev.map(s => s.id === snap.id ? { ...s, status: 'ACTIVE_HEAD' as const } : { ...s, status: 'STABLE_SNAPSHOT' as const }));
    setRollbackSuccessMsg(`Saga Continuity Map successfully rolled back to ${snap.id} (${snap.label})`);
    setTimeout(() => setRollbackSuccessMsg(null), 4000);
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-400 shadow-md">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Sardinia World Memory & Version Control</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                CANON GATEKEEPER SNAPSHOT ENGINE
              </span>
            </div>
            <p className="text-xs text-stone-400">Snapshot state, track deltas, and rollback Saga Continuity Map state across 5 books.</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('VERSION_CONTROL')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 font-bold ${
              activeTab === 'VERSION_CONTROL' ? 'bg-amber-600 text-stone-100 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version Control ({snapshots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ENTITIES')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 font-bold ${
              activeTab === 'ENTITIES' ? 'bg-amber-600 text-stone-100 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>World Memory Graph ({entities.length})</span>
          </button>
        </div>
      </div>

      {rollbackSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-lg">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{rollbackSuccessMsg}</span>
        </div>
      )}

      {/* VERSION CONTROL TAB VIEW */}
      {activeTab === 'VERSION_CONTROL' && (
        <div className="space-y-6">
          {/* Create Snapshot Bar */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 block uppercase">Create Canon Snapshot</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSnapshotLabel}
                onChange={(e) => setNewSnapshotLabel(e.target.value)}
                placeholder="Snapshot label e.g. 'Post-Baunei Chasm Su Scultone Audit Lock'..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleCreateSnapshot}
                disabled={!newSnapshotLabel.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-mono text-xs font-bold rounded-xl shadow transition flex items-center space-x-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Take Snapshot</span>
              </button>
            </div>
          </div>

          {/* Snapshots History List */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-stone-300 block uppercase">
              Saga State Version Control Ledger ({snapshots.length} Snapshots)
            </span>

            <div className="space-y-3">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    snap.status === 'ACTIVE_HEAD'
                      ? 'bg-amber-950/30 border-amber-500 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{snap.id}</span>
                      <h4 className="font-serif font-bold text-sm text-stone-100">{snap.label}</h4>
                      {snap.status === 'ACTIVE_HEAD' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold">
                          ACTIVE CANON HEAD
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-300 font-sans">{snap.summary}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-stone-400 pt-1">
                      <span>Timestamp: {snap.timestamp}</span>
                      <span>Checksum: {snap.sha256}</span>
                      <span>Locked: {snap.lockedCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
                    {snap.status !== 'ACTIVE_HEAD' ? (
                      <button
                        onClick={() => handleRollback(snap)}
                        className="px-3.5 py-2 bg-stone-900 hover:bg-amber-950 hover:border-amber-700 text-amber-400 border border-stone-800 font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Rollback to State</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold rounded-lg text-[11px] flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Current Active State</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WORLD MEMORY GRAPH TAB VIEW */}
      {activeTab === 'ENTITIES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search characters, sites, events..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {['ALL', 'CHARACTER', 'LOCATION', 'HISTORICAL_EVENT', 'ARTIFACT_MINERAL'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg border transition text-[11px] ${
                    selectedCategory === cat
                      ? 'bg-amber-600 border-amber-500 text-stone-100 font-bold'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left List */}
            <div className="lg:col-span-7 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredEntities.map((entity) => {
                const isSelected = selectedEntity.id === entity.id;
                return (
                  <div
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{entity.id} • {entity.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{entity.verificationStatus}</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans line-clamp-2">{entity.summary}</p>
                  </div>
                );
              })}
            </div>

            {/* Right Graph Detail */}
            <div className="lg:col-span-5 bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{selectedEntity.category}</span>
              <h3 className="font-serif font-bold text-base text-stone-100">{selectedEntity.name}</h3>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">{selectedEntity.verifiedFactDetails}</p>
              <div className="p-3 bg-stone-900 rounded border border-stone-800 text-[11px] font-mono text-stone-400">
                Source: <span className="text-stone-200">{selectedEntity.sourceReference}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
