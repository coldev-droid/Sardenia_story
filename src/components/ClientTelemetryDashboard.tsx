import React from 'react';
import { Activity, Clock, ShieldAlert, CheckCircle2, RefreshCw, BarChart2, Server, Wifi } from 'lucide-react';

export interface TelemetryData {
  totalPolls: number;
  successfulPolls: number;
  failedPolls: number;
  lastError: { message: string; timestamp: string; status?: number } | null;
}

interface ClientTelemetryDashboardProps {
  connectionState: string;
  telemetry: TelemetryData;
  latencyHistory: number[];
  staleSeconds: number;
  backoffDelay: number;
  lastServerSyncIso: string | null;
  onRetry: () => void;
}

export const ClientTelemetryDashboard: React.FC<ClientTelemetryDashboardProps> = ({
  connectionState,
  telemetry,
  latencyHistory,
  staleSeconds,
  backoffDelay,
  lastServerSyncIso,
  onRetry
}) => {
  const successRate = telemetry.totalPolls > 0 
    ? Math.round((telemetry.successfulPolls / telemetry.totalPolls) * 100) 
    : 100;

  const avgLatency = latencyHistory.length > 0 
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length) 
    : 0;

  const maxLatency = latencyHistory.length > 0 ? Math.max(...latencyHistory) : 0;

  return (
    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-5 text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-serif font-bold text-sm text-stone-100">Client Connectivity & Sync Telemetry</h3>
            <p className="text-[11px] text-stone-400 font-sans">
              Real-time fetch latency, monotonic sync timing, and sanitized error diagnostics.
            </p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition flex items-center space-x-1.5 border border-stone-700 text-[11px] font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Manual Sync Trigger</span>
        </button>
      </div>

      {/* Primary Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-[10px]">
            <span>SYNC STATUS</span>
            <Wifi className="w-3.5 h-3.5 text-stone-500" />
          </div>
          <div className={`font-bold text-xs uppercase truncate ${
            connectionState === 'CONNECTED' ? 'text-emerald-400' :
            connectionState.includes('AUTH') ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {connectionState.replace(/_/g, ' ')}
          </div>
          <div className="text-[10px] text-stone-500">Backoff: {Math.round(backoffDelay / 1000)}s</div>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-[10px]">
            <span>SUCCESS RATE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-bold text-sm text-stone-100">
            {successRate}% <span className="text-[10px] text-stone-400 font-normal">({telemetry.successfulPolls}/{telemetry.totalPolls})</span>
          </div>
          <div className="text-[10px] text-stone-500">Failures: {telemetry.failedPolls}</div>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-[10px]">
            <span>AVG LATENCY</span>
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="font-bold text-sm text-stone-100">
            {avgLatency} ms <span className="text-[10px] text-stone-400 font-normal">(Max: {maxLatency}ms)</span>
          </div>
          <div className="text-[10px] text-stone-500">Sample: Last {latencyHistory.length} polls</div>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-[10px]">
            <span>STALE AGE</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className={`font-bold text-sm ${staleSeconds > 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {staleSeconds}s elapsed
          </div>
          <div className="text-[10px] text-stone-500 truncate">
            {lastServerSyncIso ? new Date(lastServerSyncIso).toLocaleTimeString() : 'No sync yet'}
          </div>
        </div>
      </div>

      {/* Latency History Spark Bar Visualizer */}
      <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/80 space-y-2">
        <div className="flex justify-between items-center text-[10px] text-stone-400">
          <span className="font-bold uppercase tracking-wider text-stone-300">Recent Fetch Latency Histogram (ms)</span>
          <span>{latencyHistory.length > 0 ? `${latencyHistory[latencyHistory.length - 1]} ms latest` : 'Awaiting samples'}</span>
        </div>
        <div className="h-12 flex items-end gap-1 pt-1 border-b border-stone-800">
          {latencyHistory.length === 0 ? (
            <div className="text-stone-600 text-[10px] w-full text-center py-3">No latency samples recorded yet</div>
          ) : (
            latencyHistory.map((lat, idx) => {
              const maxVal = Math.max(...latencyHistory, 100);
              const heightPct = Math.max(15, Math.min(100, Math.round((lat / maxVal) * 100)));
              const isHigh = lat > 500;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all ${
                      isHigh ? 'bg-amber-500' : 'bg-emerald-500/80 hover:bg-emerald-400'
                    }`}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-stone-900 text-stone-200 px-1.5 py-0.5 rounded text-[9px] border border-stone-700 whitespace-nowrap z-10 pointer-events-none">
                    {lat} ms
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sanitized Telemetry Security Guarantee */}
      <div className="bg-stone-900/40 p-3 rounded-xl border border-stone-800/60 text-[10px] text-stone-400 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-200">Sanitizer Active:</strong> No tokens, authorization headers, cookies, request payload bodies, or proxy details are saved or displayed in client telemetry buffers.
        </div>
      </div>
    </div>
  );
};
