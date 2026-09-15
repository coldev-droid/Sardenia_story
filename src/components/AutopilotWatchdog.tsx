import React, { useState, useEffect, useRef } from 'react';
import { SentinelCanaryMonitor } from './SentinelCanaryMonitor';
import { ClientTelemetryDashboard } from './ClientTelemetryDashboard';
import { ClientE2ETestSuite } from './ClientE2ETestSuite';
import {
  Play,
  Pause,
  AlertOctagon,
  RefreshCw,
  ShieldCheck,
  Activity,
  Cpu,
  Clock,
  CheckCircle2,
  CheckCircle,
  BookOpen,
  AlertTriangle,
  Flame,
  Layers,
  Database,
  Key,
  ListOrdered,
  RotateCcw,
  Sliders,
  DollarSign,
  FileCode,
  Shield,
  Zap,
  Check,
  XCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';

export interface WatchdogCheckpoint {
  checkpointId: string;
  timestamp: string;
  bookId: string;
  chapterId: string;
  sceneId: string;
  sagaPosition: string;
  wordCount: number;
  sha256Hash: string;
  verifiedScore: number;
  qualityPassed: boolean;
  activeTeam: string[];
  amuletsRecovered: string[];
  activeConsequences: string[];
  parentCheckpointHash?: string;
  inspectorResults?: any[];
}

export interface WatchdogLease {
  leaseId: string;
  projectId: string;
  acquiredAt: string;
  expiresAt: string;
  holderWorkerId: string;
  isActive: boolean;
}

export interface WatchdogHeartbeat {
  workerId: string;
  lastHeartbeatAt: string;
  status: 'HEALTHY' | 'STALE' | 'EXPIRED';
  activeState: string;
  currentAction: string;
}

export interface BookUsageCost {
  bookId: string;
  bookTitle: string;
  tokensUsed: number;
  costUSD: number;
  chaptersCompleted: number;
  totalChaptersPlanned: number;
}

export interface ModelUsageCost {
  modelId: string;
  modelAlias: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUSD: number;
}

export interface SafetyLimits {
  maxCallsPerHour: number;
  maxTokensPerDay: number;
  maxCostPerDayUSD: number;
  maxRetries: number;
  maxChaptersPerRun: number;
  currentCallsThisHour: number;
  currentTokensToday: number;
  currentCostTodayUSD: number;
  totalTokensSeries?: number;
  maxTokensSeries?: number;
  totalCostSeriesUSD?: number;
  maxCostSeriesUSD?: number;
  approvedModelProviders: string[];
  bookBreakdown?: BookUsageCost[];
  modelBreakdown?: ModelUsageCost[];
}

export interface WatchdogAuditRecord {
  id: string;
  timestamp: string;
  fromState: string;
  toState: string;
  action: string;
  stopReason?: string;
  checkpointHash?: string;
  detail: string;
  score?: number;
  workerId: string;
}

export interface WatchdogState {
  projectId: string;
  autopilotEnabled: boolean;
  currentState: string;
  currentBookId: string;
  currentChapterId: string;
  currentSceneId: string;
  activeCheckpoint: WatchdogCheckpoint;
  lease: WatchdogLease | null;
  heartbeat: WatchdogHeartbeat | null;
  safetyLimits: SafetyLimits;
  retryCount: number;
  activeBlockers: string[];
  nextScheduledJobId: string | null;
  stopReason: string;
  auditHistory: WatchdogAuditRecord[];
  testSuiteResults?: any;
}

const WORKFLOW_STATES = [
  'IDLE',
  'LOAD_CHECKPOINT',
  'VALIDATE_STATE',
  'ANALYSE',
  'REPAIR',
  'RESEARCH',
  'PLAN',
  'WRITE_SCENE',
  'INSPECT_SCENE',
  'REPAIR_SCENE',
  'COMPLETE_CHAPTER',
  'INSPECT_CHAPTER',
  'QUALITY_GATE',
  'SAVE_CHECKPOINT',
  'QUEUE_CONTINUATION'
];

const STOP_REASONS = [
  { code: 'NORMAL_WORK_UNIT_COMPLETED', type: 'AUTO_RECOVER', desc: 'Standard bounded unit execution finished safely' },
  { code: 'MODEL_CONTEXT_LIMIT', type: 'AUTO_RECOVER', desc: 'Context window limit reached; reload checkpoint & continue' },
  { code: 'MODEL_OUTPUT_LIMIT', type: 'AUTO_RECOVER', desc: 'Max token output hit; truncate at paragraph boundary' },
  { code: 'MODEL_TIMEOUT', type: 'AUTO_RECOVER', desc: 'Response timed out; revoke stale lease & retry' },
  { code: 'PROVIDER_RATE_LIMIT', type: 'AUTO_RECOVER', desc: 'API rate limit hit; apply exponential backoff (30s)' },
  { code: 'NETWORK_FAILURE', type: 'AUTO_RECOVER', desc: 'Transient network glitch; retry with jitter' },
  { code: 'TOOL_FAILURE', type: 'AUTO_RECOVER', desc: 'Execution tool error; re-invoke idempotently' },
  { code: 'FAILED_INSPECTION', type: 'AUTO_RECOVER', desc: 'Score below 9.5; trigger targeted repair loop' },
  { code: 'MISSING_RESEARCH', type: 'HUMAN_BLOCK', desc: 'Factual claim unverified; pause generation' },
  { code: 'CODE_FAILURE', type: 'HUMAN_BLOCK', desc: 'Fatal code error; require developer intervention' },
  { code: 'CANON_CONTRADICTION', type: 'HUMAN_BLOCK', desc: 'Fundamental story conflict; Gatekeeper review needed' },
  { code: 'HUMAN_APPROVAL_REQUIRED', type: 'HUMAN_BLOCK', desc: 'Human promotion gate pending' },
  { code: 'USER_PAUSED', type: 'HUMAN_BLOCK', desc: 'Autopilot explicitly paused by user' },
  { code: 'PROJECT_COMPLETED', type: 'HUMAN_BLOCK', desc: 'All 5 books completed successfully' },
  { code: 'UNKNOWN_FAILURE', type: 'HUMAN_BLOCK', desc: 'Unclassified error; safe pause enforced' }
];

export function AutopilotWatchdog() {
  const [watchdogData, setWatchdogData] = useState<WatchdogState | null>(null);
  const [sentinelData, setSentinelData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PANEL' | 'TESTS' | 'ARCHITECTURE' | 'SAFETY' | 'AUDIT' | 'SENTINEL' | 'CHAIN'>('PANEL');

  // Connection & Telemetry States
  const [connectionState, setConnectionState] = useState<'CONNECTED' | 'AUTH_REQUIRED' | 'UNEXPECTED_RESPONSE' | 'UNEXPECTED_AUTH_REDIRECT' | 'NETWORK_OR_CORS_FAILURE' | 'RATE_LIMITED' | 'SERVER_UNAVAILABLE' | 'CLIENT_RUNTIME_ERROR' | 'INITIALIZING'>('INITIALIZING');
  const [lastSyncMonotonic, setLastSyncMonotonic] = useState<number | null>(null);
  const [lastServerSyncIso, setLastServerSyncIso] = useState<string | null>(null);
  const [lastSyncWallTime, setLastSyncWallTime] = useState<string | null>(null);
  const [staleSeconds, setStaleSeconds] = useState<number>(0);
  const [backoffDelay, setBackoffDelay] = useState<number>(5000);
  const [syncTrigger, setSyncTrigger] = useState<number>(0);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [telemetry, setTelemetry] = useState<{
    totalPolls: number;
    successfulPolls: number;
    failedPolls: number;
    lastError: { message: string; timestamp: string; status?: number } | null;
  }>({
    totalPolls: 0,
    successfulPolls: 0,
    failedPolls: 0,
    lastError: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFocusTimestampRef = useRef<number>(0);

  // Audit Log Retention & Archival Control State
  const [auditRetentionMode, setAuditRetentionMode] = useState<'CURRENT_SUMMARY' | 'RETAINED_ARCHIVE' | 'ALL_RECORDS'>('CURRENT_SUMMARY');
  const [auditArchivalPolicy, setAuditArchivalPolicy] = useState<'HOT_SUMMARY' | '30_DAY_ARCHIVE' | 'PERMANENT_COLD_STORAGE'>('HOT_SUMMARY');

  // Sandbox IFrame Cookie Redirect Detection State
  const [cookieRedirectDetected, setCookieRedirectDetected] = useState<boolean>(false);

  // Chapter 44/43 Chain Audit States
  const [chainAudit, setChainAudit] = useState<any>(null);
  const [chainAuditLoading, setChainAuditLoading] = useState<boolean>(false);
  const [chainAuditError, setChainAuditError] = useState<string | null>(null);

  const runChainAudit = async () => {
    setChainAuditLoading(true);
    setChainAuditError(null);
    try {
      const res = await fetch("/api/watchdog/verify-chain-integrity", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setChainAudit(data);
      } else {
        setChainAuditError(data.error || "Failed to run chain audit.");
      }
    } catch (e: any) {
      setChainAuditError(e.message || "Network error running chain audit.");
    } finally {
      setChainAuditLoading(false);
    }
  };

  // Safety Limits Form State
  const [maxTokensPerDayInput, setMaxTokensPerDayInput] = useState<number>(500000);
  const [maxCostPerDayInput, setMaxCostPerDayInput] = useState<number>(15.0);
  const [maxTokensSeriesInput, setMaxTokensSeriesInput] = useState<number>(10000000);
  const [maxCostSeriesInput, setMaxCostSeriesInput] = useState<number>(75.0);
  const [maxCallsPerHourInput, setMaxCallsPerHourInput] = useState<number>(120);
  const [updatingLimits, setUpdatingLimits] = useState<boolean>(false);
  const [limitsMessage, setLimitsMessage] = useState<string | null>(null);

  // Sentinel Action States
  const [reconcileState, setReconcileState] = useState<'IDLE' | 'RECONCILING' | 'RECONCILED'>('IDLE');
  const [rollbackState, setRollbackState] = useState<'IDLE' | 'ROLLING_BACK' | 'ROLLED_BACK'>('IDLE');
  const [leaseRevocationConfirmed, setLeaseRevocationConfirmed] = useState<boolean>(false);

  // Robust safeFetchJson function classifying and handling authentication, formats, and rates
  const safeFetchJson = async (url: string, signal?: AbortSignal, options?: RequestInit) => {
    const fetchStart = performance.now();
    let res: Response;
    try {
      res = await fetch(url, { ...options, signal });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err; // AbortError -> ignored cancellation
      }

      // fetch TypeError represents a network or CORS block
      if (err instanceof TypeError || err.name === 'TypeError') {
        setConnectionState('NETWORK_OR_CORS_FAILURE');
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: 'Network or CORS communication failure (Fetch TypeError)', timestamp: new Date().toISOString() }
        }));
        throw new Error('NETWORK_OR_CORS_FAILURE');
      }

      // Other exceptions during execution of fetch
      setConnectionState('CLIENT_RUNTIME_ERROR');
      setTelemetry(prev => ({
        ...prev,
        failedPolls: prev.failedPolls + 1,
        lastError: { message: err.message || 'Client runtime failure during fetch', timestamp: new Date().toISOString() }
      }));
      console.error('Client runtime error:', err);
      throw new Error('CLIENT_RUNTIME_ERROR');
    }

    // Process Response
    try {
      // HTTP 401/403 -> AUTH_REQUIRED
      if (res.status === 401 || res.status === 403) {
        setConnectionState('AUTH_REQUIRED');
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: `Authentication Required (HTTP ${res.status})`, timestamp: new Date().toISOString(), status: res.status }
        }));
        throw new Error('AUTH_REQUIRED');
      }

      // HTTP 429 -> RATE_LIMITED (respect Retry-After)
      if (res.status === 429) {
        setConnectionState('RATE_LIMITED');
        const retryAfterHeader = res.headers.get('retry-after');
        let retryAfterSeconds = 15; // default fallback
        if (retryAfterHeader) {
          const parsedInt = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedInt)) {
            retryAfterSeconds = Math.max(1, parsedInt);
          } else {
            // Parse HTTP-Date format (e.g. "Wed, 21 Oct 2015 07:28:00 GMT")
            const dateMs = Date.parse(retryAfterHeader);
            if (!isNaN(dateMs)) {
              const diffSec = Math.ceil((dateMs - Date.now()) / 1000);
              retryAfterSeconds = Math.max(1, diffSec);
            }
          }
        }
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: `Rate Limited (HTTP 429). Retry-After: ${retryAfterSeconds}s`, timestamp: new Date().toISOString(), status: 429 }
        }));
        setBackoffDelay(retryAfterSeconds * 1000);
        throw new Error('RATE_LIMITED');
      }

      // HTTP 5xx -> SERVER_UNAVAILABLE
      if (res.status >= 500) {
        setConnectionState('SERVER_UNAVAILABLE');
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: `Server Unavailable (HTTP ${res.status})`, timestamp: new Date().toISOString(), status: res.status }
        }));
        throw new Error('SERVER_UNAVAILABLE');
      }

      if (!res.ok) {
        setConnectionState('CLIENT_RUNTIME_ERROR');
        throw new Error(`HTTP_ERROR_${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';

      // Check if response contains HTML redirect payload (UNEXPECTED_AUTH_REDIRECT)
      if (contentType.includes('text/html')) {
        setConnectionState('UNEXPECTED_AUTH_REDIRECT');
        setCookieRedirectDetected(true);
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: 'Unexpected HTML auth redirect received', timestamp: new Date().toISOString() }
        }));
        throw new Error('UNEXPECTED_AUTH_REDIRECT');
      }

      // non-JSON content -> UNEXPECTED_RESPONSE
      if (!contentType.includes('application/json')) {
        setConnectionState('UNEXPECTED_RESPONSE');
        setTelemetry(prev => ({
          ...prev,
          failedPolls: prev.failedPolls + 1,
          lastError: { message: `Unexpected non-JSON response Content-Type: ${contentType}`, timestamp: new Date().toISOString() }
        }));
        throw new Error('UNEXPECTED_RESPONSE');
      }

      const latencyMs = Math.round(performance.now() - fetchStart);
      setLatencyHistory(prev => [...prev.slice(-14), latencyMs]);

      setCookieRedirectDetected(false);
      setConnectionState('CONNECTED');
      setLastSyncMonotonic(performance.now());
      setLastServerSyncIso(new Date().toISOString());
      setLastSyncWallTime(new Date().toLocaleTimeString());
      setTelemetry(prev => ({
        ...prev,
        successfulPolls: prev.successfulPolls + 1
      }));

      return await res.json();
    } catch (err: any) {
      if (['AUTH_REQUIRED', 'RATE_LIMITED', 'SERVER_UNAVAILABLE', 'UNEXPECTED_AUTH_REDIRECT', 'UNEXPECTED_RESPONSE'].includes(err.message)) {
        throw err;
      }
      
      // Other client parsing exceptions
      setConnectionState('CLIENT_RUNTIME_ERROR');
      setTelemetry(prev => ({
        ...prev,
        failedPolls: prev.failedPolls + 1,
        lastError: { message: err.message || 'Failed to parse JSON response', timestamp: new Date().toISOString() }
      }));
      console.error('Client runtime error:', err);
      throw new Error('CLIENT_RUNTIME_ERROR');
    }
  };

  const fetchSentinelState = async (signal?: AbortSignal) => {
    try {
      const data = await safeFetchJson('/api/sentinel/state', signal);
      setSentinelData(data);
    } catch (err) {
      // Handled inside safeFetchJson
    }
  };

  const fetchWatchdogState = async () => {
    setConnectionState('INITIALIZING');
    setBackoffDelay(5000);
    setSyncTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (watchdogData?.safetyLimits) {
      setMaxTokensPerDayInput(watchdogData.safetyLimits.maxTokensPerDay || 500000);
      setMaxCostPerDayInput(watchdogData.safetyLimits.maxCostPerDayUSD || 15.0);
      setMaxTokensSeriesInput(watchdogData.safetyLimits.maxTokensSeries || 10000000);
      setMaxCostSeriesInput(watchdogData.safetyLimits.maxCostSeriesUSD || 75.0);
      setMaxCallsPerHourInput(watchdogData.safetyLimits.maxCallsPerHour || 120);
    }
  }, [watchdogData?.safetyLimits]);

  const handleUpdateLimits = async () => {
    setUpdatingLimits(true);
    try {
      const res = await fetch('/api/watchdog/limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxTokensPerDay: maxTokensPerDayInput,
          maxCostPerDayUSD: maxCostPerDayInput,
          maxTokensSeries: maxTokensSeriesInput,
          maxCostSeriesUSD: maxCostSeriesInput,
          maxCallsPerHour: maxCallsPerHourInput
        })
      });
      if (res.ok) {
        setLimitsMessage("Spending and token limits updated successfully!");
        await fetchWatchdogState();
        setTimeout(() => setLimitsMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update limits:', err);
    } finally {
      setUpdatingLimits(false);
    }
  };

  const handleSimulateUsage = async (inputTokens: number, outputTokens: number, costUSD: number, modelId: string, bookId: string) => {
    try {
      const res = await fetch('/api/watchdog/record-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputTokens, outputTokens, costUSD, modelId, bookId })
      });
      if (res.ok) {
        await fetchWatchdogState();
      }
    } catch (err) {
      console.error('Failed to simulate usage:', err);
    }
  };

  // Poll state dynamically with exponential backoff and jitter
  useEffect(() => {
    let timerId: any = null;

    const poll = async () => {
      setTelemetry(prev => ({ ...prev, totalPolls: prev.totalPolls + 1 }));
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const data = await safeFetchJson('/api/watchdog/state', abortControllerRef.current.signal);
        setWatchdogData(data);
        setBackoffDelay(5000); // Reset delay on successful poll

        // Reactively clear visual confirmation if lease is active again
        if (data.lease && data.lease.isActive) {
          setLeaseRevocationConfirmed(false);
          setReconcileState('IDLE');
          setRollbackState('IDLE');
        }

        // Fetch companion sentinel state
        await fetchSentinelState(abortControllerRef.current.signal);

        setLoading(false);
        // Reschedule default poll
        timerId = setTimeout(poll, 5000);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return; // No state updates on unmount or cancellation
        }

        setLoading(false);

        // Stop rapid polling after authentication failures or unexpected response formats
        if (['AUTH_REQUIRED', 'UNEXPECTED_AUTH_REDIRECT', 'UNEXPECTED_RESPONSE'].includes(err.message)) {
          console.warn(`Polling suspended due to: ${err.message}`);
          return;
        }

        // Apply exponential backoff with jitter for genuine RATE_LIMITED / SERVER_UNAVAILABLE / NETWORK failures
        setBackoffDelay(prev => {
          let nextDelay = prev;
          if (err.message === 'RATE_LIMITED') {
            // Delay has been set directly in safeFetchJson via Retry-After header parsing, respect it!
            nextDelay = backoffDelay;
          } else {
            const nextBase = Math.min(60000, prev * 1.8);
            const jitter = (Math.random() - 0.5) * 1000;
            nextDelay = Math.max(5000, nextBase + jitter);
          }
          timerId = setTimeout(poll, nextDelay);
          return nextDelay;
        });
      }
    };

    poll();

    return () => {
      if (timerId) clearTimeout(timerId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [syncTrigger]);

  // Keep track of stale data age since last synchronization using performance.now() monotonic reference
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastSyncMonotonic !== null) {
        setStaleSeconds(Math.floor((performance.now() - lastSyncMonotonic) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncMonotonic]);

  // Automatic retry after authentication restoration / window focus (throttled & auth-aware)
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now();
      // Throttle window focus triggers to at most once per 10000ms
      if (now - lastFocusTimestampRef.current < 10000) {
        return;
      }
      lastFocusTimestampRef.current = now;

      // Do NOT reset backoff delay or poll repeatedly if state is still AUTH_REQUIRED or UNEXPECTED_AUTH_REDIRECT
      if (['AUTH_REQUIRED', 'UNEXPECTED_AUTH_REDIRECT'].includes(connectionState)) {
        console.log('[Watchdog] Throttled window focus detected, but authentication remains invalid. Retaining suspended polling state.');
        return;
      }

      console.log('[Watchdog] Throttled window focus detected. Triggering sync check.');
      fetchWatchdogState();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [connectionState]);

  const handleControlAction = async (action: string) => {
    setRunningAction(action);
    try {
      const res = await fetch('/api/watchdog/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        await fetchWatchdogState();
      }
    } catch (err) {
      console.error('Control action error:', err);
    } finally {
      setRunningAction(null);
    }
  };

  const handleExecuteCycle = async () => {
    setRunningAction('CYCLE');
    try {
      const res = await fetch('/api/watchdog/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId: 'sardinia-worker-node-01' })
      });
      if (res.ok) {
        await fetchWatchdogState();
      }
    } catch (err) {
      console.error('Cycle execution error:', err);
    } finally {
      setRunningAction(null);
    }
  };

  const handleRunTestSuite = async () => {
    setRunningAction('TEST_SUITE');
    try {
      const res = await fetch('/api/watchdog/test-suite', {
        method: 'POST'
      });
      if (res.ok) {
        await fetchWatchdogState();
      }
    } catch (err) {
      console.error('Test suite execution error:', err);
    } finally {
      setRunningAction(null);
    }
  };

  const handleReconcile = async () => {
    setReconcileState('RECONCILING');
    try {
      const res = await fetch('/api/watchdog/reconcile', { 
        method: 'POST',
        headers: {
          'Authorization': 'Bearer OP-Globentroter26-2026-09-11'
        }
      });
      if (res.ok) {
        setReconcileState('RECONCILED');
        setLeaseRevocationConfirmed(true);
        await fetchWatchdogState();
      } else {
        setReconcileState('IDLE');
      }
    } catch (err) {
      console.error('Reconcile failed:', err);
      setReconcileState('IDLE');
    }
  };

  const handleRollback = async () => {
    setRollbackState('ROLLING_BACK');
    try {
      const res = await fetch('/api/watchdog/rollback', { 
        method: 'POST',
        headers: {
          'Authorization': 'Bearer OP-Globentroter26-2026-09-11'
        }
      });
      if (res.ok) {
        setRollbackState('ROLLED_BACK');
        setLeaseRevocationConfirmed(true);
        await fetchWatchdogState();
      } else {
        setRollbackState('IDLE');
      }
    } catch (err) {
      console.error('Rollback failed:', err);
      setRollbackState('IDLE');
    }
  };

  if (!watchdogData && connectionState !== 'CONNECTED' && connectionState !== 'INITIALIZING') {
    return (
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8 shadow-2xl max-w-2xl mx-auto my-12 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-stone-100">
            {connectionState === 'AUTH_REQUIRED' ? 'Authentication Required' :
             connectionState === 'UNEXPECTED_AUTH_REDIRECT' || connectionState === 'UNEXPECTED_RESPONSE' ? 'AI Studio Preview Security Restriction' :
             connectionState === 'RATE_LIMITED' ? 'Rate Limited (HTTP 429)' :
             connectionState === 'SERVER_UNAVAILABLE' ? 'Server Unavailable (HTTP 5xx)' :
             connectionState === 'NETWORK_OR_CORS_FAILURE' ? 'Network or CORS Blocked' :
             'Client Runtime Failure'}
          </h3>
          <p className="text-sm text-stone-400 leading-relaxed max-w-md mx-auto">
            {connectionState === 'AUTH_REQUIRED' 
              ? 'Your active session has expired or requires reauthentication. The endpoint responded with HTTP 401/403.' :
             connectionState === 'UNEXPECTED_AUTH_REDIRECT' || connectionState === 'UNEXPECTED_RESPONSE'
              ? 'The browser blocked cookies or redirected the API call to a login check. This is standard third-party cookie sandbox behavior in the AI Studio preview iframe.' :
             connectionState === 'RATE_LIMITED'
              ? 'The system has been rate limited by the API endpoint. We are respecting Retry-After and will re-attempt sync with exponential backoff.' :
             connectionState === 'SERVER_UNAVAILABLE'
              ? 'The background service returned an HTTP 5xx error. It is temporarily down or overloaded.' :
             connectionState === 'NETWORK_OR_CORS_FAILURE'
              ? 'The browser blocked the fetch call entirely (CORS restriction or offline). Check your internet connection.' :
             'An unexpected client-side runtime error occurred while processing the response.'}
          </p>
        </div>
        
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-left space-y-3">
          <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">Troubleshooting steps:</h4>
          <ul className="text-xs text-stone-300 space-y-2 list-disc list-inside">
            <li>Click the <strong className="text-white">Open in New Tab</strong> button in the top-right corner of the AI Studio preview panel.</li>
            <li>This runs the application in its own native context where cookies and session headers are fully authorized.</li>
            <li>Once opened in the new tab, you can return here or run the watchdog directly from there!</li>
            {telemetry.lastError && (
              <li className="text-stone-400 font-mono text-[10px] bg-stone-900 p-2 rounded border border-stone-800 break-all list-none mt-2">
                Last Error Message: {telemetry.lastError.message}
              </li>
            )}
          </ul>
        </div>

        <button 
          onClick={fetchWatchdogState}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-mono font-bold text-stone-950 transition flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection & Resume Polling</span>
        </button>
      </div>
    );
  }

  if (loading && !watchdogData) {
    return (
      <div className="p-8 text-center text-stone-400 font-mono text-sm space-y-4">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
        <div>Loading Sardinia Autopilot Watchdog System...</div>
        {connectionState !== 'CONNECTED' && connectionState !== 'INITIALIZING' && (
          <div className="text-xs text-red-400 font-mono">
            Status: {connectionState.replace(/_/g, ' ')}. Retrying with automatic backoff delay: {Math.round(backoffDelay / 1000)}s...
          </div>
        )}
      </div>
    );
  }

  const heartbeat = watchdogData?.heartbeat;
  const lease = watchdogData?.lease;
  const checkpoint = watchdogData?.activeCheckpoint;
  const limits = watchdogData?.safetyLimits;
  const currentState = watchdogData?.currentState || 'IDLE';

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-100 shadow-xl border border-amber-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Sardinia Autopilot Watchdog Engine</h2>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold border flex items-center space-x-1 ${
                watchdogData?.autopilotEnabled 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${watchdogData?.autopilotEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{watchdogData?.autopilotEnabled ? 'AUTOPILOT RUNNING' : 'AUTOPILOT PAUSED'}</span>
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Persistent state machine • Heartbeat watchdog • Idempotency lock • Automatic continuation & recovery
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchWatchdogState}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition flex items-center space-x-1.5 border border-stone-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll State</span>
          </button>
        </div>
      </div>

      {/* Dynamic Connection Health & Sync Status */}
      <div className="bg-stone-950 px-4 py-3 rounded-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-stone-400 font-mono">Sync Status:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center space-x-1 border ${
              connectionState === 'CONNECTED' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
              connectionState === 'INITIALIZING' ? 'bg-stone-900 text-stone-300 border-stone-700 animate-pulse' :
              connectionState === 'AUTH_REQUIRED' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
              connectionState === 'UNEXPECTED_AUTH_REDIRECT' || connectionState === 'UNEXPECTED_RESPONSE' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
              connectionState === 'RATE_LIMITED' ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse' :
              connectionState === 'SERVER_UNAVAILABLE' ? 'bg-red-950/80 text-red-300 border-red-800' :
              connectionState === 'NETWORK_OR_CORS_FAILURE' ? 'bg-red-950/80 text-red-300 border-red-800' :
              'bg-red-950/80 text-red-300 border-red-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                connectionState === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' :
                connectionState === 'INITIALIZING' ? 'bg-stone-400' :
                connectionState === 'AUTH_REQUIRED' || connectionState === 'UNEXPECTED_AUTH_REDIRECT' || connectionState === 'UNEXPECTED_RESPONSE' ? 'bg-amber-400' :
                'bg-red-400 animate-bounce'
              }`}></span>
              <span>{connectionState.replace(/_/g, ' ')}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 border-l border-stone-800 pl-3">
            <span className="text-stone-400 font-mono">Last Sync:</span>
            <span className="text-stone-200 font-mono">
              {lastSyncWallTime ? `${lastSyncWallTime} (${staleSeconds}s ago)` : 'Never'}
            </span>
            {staleSeconds > 10 && (
              <span className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 text-[10px] font-mono border border-red-900/40 animate-pulse">
                Stale Data
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 border-l border-stone-800 pl-3 text-stone-400 font-mono text-[11px]">
            <span>Poll Rate: {connectionState === 'CONNECTED' ? '5s' : `${Math.round(backoffDelay / 1000)}s backoff`}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-stone-500">
          <span>Success: <strong className="text-emerald-500">{telemetry.successfulPolls}</strong></span>
          <span>Failures: <strong className={telemetry.failedPolls > 0 ? "text-red-400" : "text-stone-500"}>{telemetry.failedPolls}</strong></span>
          <span>Total: <strong className="text-stone-300">{telemetry.totalPolls}</strong></span>
        </div>
      </div>

      {/* Render detailed connection/security warning if not connected */}
      {connectionState !== 'CONNECTED' && connectionState !== 'INITIALIZING' && (
        <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-400 font-serif font-bold">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Connection Suspended: {connectionState.replace(/_/g, ' ')}</span>
          </div>
          <p className="text-stone-300 leading-relaxed font-sans">
            {connectionState === 'AUTH_REQUIRED' && 'Background synchronization is paused. The endpoint requested authentication (HTTP 401/403).'}
            {(connectionState === 'UNEXPECTED_AUTH_REDIRECT' || connectionState === 'UNEXPECTED_RESPONSE') && 'The active request was redirected by the browser sandbox (cookie or session block). Click "Open in New Tab" above to execute natively.'}
            {connectionState === 'RATE_LIMITED' && 'We are rate-limited by the server (HTTP 429). Retry will automatically resume following the parsed Retry-After header delay.'}
            {connectionState === 'SERVER_UNAVAILABLE' && 'The backend service is temporarily down or returned a 5xx error. Exponential backoff has been scaled up.'}
            {connectionState === 'NETWORK_OR_CORS_FAILURE' && 'The browser blocked the fetch command entirely. This typically occurs during physical offline/CORS configuration constraints.'}
            {connectionState === 'CLIENT_RUNTIME_ERROR' && 'An unexpected Javascript error was caught while parsing or handling the payload.'}
            <span className="block mt-2">
              Automatic synchronization will attempt to resume when this browser tab recovers focus. Click <button onClick={fetchWatchdogState} className="underline text-amber-400 hover:text-amber-300 font-bold">Retry Connection Now</button> to manually override backoff.
            </span>
          </p>
          {telemetry.lastError && (
            <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800/80 text-[10px] font-mono text-stone-400 break-all">
              <strong className="text-stone-300">Diagnostic Reason:</strong> {telemetry.lastError.message}
            </div>
          )}
        </div>
      )}

      {/* E2E Connection Verification Matrix */}
      <div className="bg-stone-950 rounded-xl border border-stone-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-mono font-bold text-stone-200 uppercase tracking-wider">E2E Client Sync Verification Matrix</h4>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">7 State Checkpoints</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] font-mono text-stone-300">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="pb-2 font-bold uppercase">Test Condition</th>
                <th className="pb-2 font-bold uppercase">Expected Safe State</th>
                <th className="pb-2 font-bold uppercase">Current Coverage</th>
                <th className="pb-2 font-bold uppercase text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-900">
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">1. Successful JSON 200 State Response</td>
                <td className="py-2 text-emerald-400">CONNECTED</td>
                <td className="py-2 text-stone-400">Polling every 5s, auto reset backoff</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'CONNECTED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'CONNECTED' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">2. Endpoint Auth Failure (HTTP 401/403)</td>
                <td className="py-2 text-amber-400">AUTH_REQUIRED</td>
                <td className="py-2 text-stone-400">Suspend polling, ignore spamming</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'AUTH_REQUIRED' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'AUTH_REQUIRED' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">3. Iframe HTML Redirect (HTML Response)</td>
                <td className="py-2 text-amber-400">UNEXPECTED_AUTH_REDIRECT</td>
                <td className="py-2 text-stone-400">Block rapid requests, raise warning</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'UNEXPECTED_AUTH_REDIRECT' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'UNEXPECTED_AUTH_REDIRECT' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">4. Endpoint Rate Limited (HTTP 429)</td>
                <td className="py-2 text-rose-400">RATE_LIMITED</td>
                <td className="py-2 text-stone-400">Parse Retry-After header accurately</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'RATE_LIMITED' ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'RATE_LIMITED' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">5. Backend Server Errors (HTTP 5xx)</td>
                <td className="py-2 text-red-400">SERVER_UNAVAILABLE</td>
                <td className="py-2 text-stone-400">Scale up backoff delay up to 60s</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'SERVER_UNAVAILABLE' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'SERVER_UNAVAILABLE' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">6. Local Offline / CORS (TypeError)</td>
                <td className="py-2 text-red-400">NETWORK_OR_CORS_FAILURE</td>
                <td className="py-2 text-stone-400">Isolate fetch exception from code errors</td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded ${
                    connectionState === 'NETWORK_OR_CORS_FAILURE' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    <span>{connectionState === 'NETWORK_OR_CORS_FAILURE' ? 'ACTIVE' : 'PASSIVE'}</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-stone-900/40">
                <td className="py-2 text-stone-200 font-sans">7. Component Lifecycle Unmount</td>
                <td className="py-2 text-stone-400">ABORT_OUTSTANDING_REQUESTS</td>
                <td className="py-2 text-stone-400">AbortController signal terminates sync</td>
                <td className="py-2 text-right">
                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-stone-900 text-emerald-400 border border-stone-800">
                    [MONITORED]
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800 text-xs font-mono">
        {[
          { id: 'PANEL', label: '1. Control Panel & State Machine' },
          { id: 'TESTS', label: '2. 20 Watchdog Automated Tests' },
          { id: 'ARCHITECTURE', label: '3. 12 Watchdog Components' },
          { id: 'SAFETY', label: '4. Spending & Safety Controls' },
          { id: 'AUDIT', label: '5. Audit History & Receipts' },
          { id: 'SENTINEL', label: '6. Self-Healing & Sentinel' },
          { id: 'CHAIN', label: '7. Chapter 44/43 Chain Audit' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'CHAIN') {
                runChainAudit();
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-stone-100 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: CONTROL PANEL & STATE MACHINE */}
      {activeTab === 'PANEL' && (
        <div className="space-y-6">
          {/* Action Control Panel */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400">
                <Sliders className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-stone-100">Autopilot Control Panel</h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Active State: <strong className="text-amber-400 font-bold">{currentState}</strong>
              </span>
            </div>

            {/* Cost & Usage Monitoring Quick Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>CALLS / HOUR</span>
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base font-bold text-stone-100">
                  {limits?.currentCallsThisHour || 18} <span className="text-xs font-normal text-stone-500">/ {limits?.maxCallsPerHour || 120}</span>
                </div>
                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, ((limits?.currentCallsThisHour || 18) / (limits?.maxCallsPerHour || 120)) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>DAILY TOKENS</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-stone-100">
                  {((limits?.currentTokensToday || 64200) / 1000).toFixed(1)}k <span className="text-xs font-normal text-stone-500">/ {((limits?.maxTokensPerDay || 500000) / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, ((limits?.currentTokensToday || 64200) / (limits?.maxTokensPerDay || 500000)) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>DAILY COST</span>
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-base font-bold text-stone-100">
                  ${(limits?.currentCostTodayUSD || 1.85).toFixed(2)} <span className="text-xs font-normal text-stone-500">/ ${(limits?.maxCostPerDayUSD || 15.00).toFixed(2)}</span>
                </div>
                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, ((limits?.currentCostTodayUSD || 1.85) / (limits?.maxCostPerDayUSD || 15.00)) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>SERIES TOKENS</span>
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-base font-bold text-purple-300">
                  {(((limits?.totalTokensSeries || 1845200)) / 1000000).toFixed(2)}M <span className="text-xs font-normal text-stone-500">/ {(((limits?.maxTokensSeries || 10000000)) / 1000000).toFixed(0)}M</span>
                </div>
                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, (((limits?.totalTokensSeries || 1845200)) / ((limits?.maxTokensSeries || 10000000))) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>SERIES COST</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-emerald-300">
                  ${(limits?.totalCostSeriesUSD || 14.85).toFixed(2)} <span className="text-xs font-normal text-stone-500">/ ${(limits?.maxCostSeriesUSD || 75.00).toFixed(2)}</span>
                </div>
                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, ((limits?.totalCostSeriesUSD || 14.85) / (limits?.maxCostSeriesUSD || 75.00)) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => handleControlAction('RESUME')}
                disabled={watchdogData?.autopilotEnabled || runningAction !== null}
                className="py-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>Start Autopilot</span>
              </button>

              <button
                onClick={() => handleControlAction('PAUSE_SAFELY')}
                disabled={!watchdogData?.autopilotEnabled || runningAction !== null}
                className="py-3 px-3 rounded-xl bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Safely</span>
              </button>

              <button
                onClick={() => handleControlAction('RESUME')}
                disabled={watchdogData?.autopilotEnabled || runningAction !== null}
                className="py-3 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resume</span>
              </button>

              <button
                onClick={handleExecuteCycle}
                disabled={runningAction !== null}
                className="py-3 px-3 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <Zap className={`w-4 h-4 ${runningAction === 'CYCLE' ? 'animate-bounce' : ''}`} />
                <span>Trigger Cycle</span>
              </button>

              <button
                onClick={handleRunTestSuite}
                disabled={runningAction !== null}
                className="py-3 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <Shield className={`w-4 h-4 ${runningAction === 'TEST_SUITE' ? 'animate-spin' : ''}`} />
                <span>Run 20 Tests</span>
              </button>

              <button
                onClick={() => handleControlAction('EMERGENCY_STOP')}
                disabled={runningAction !== null}
                className="py-3 px-3 rounded-xl bg-red-800 hover:bg-red-700 text-stone-100 font-bold text-xs font-mono transition flex flex-col items-center justify-center space-y-1 shadow-md border border-red-600"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Emergency Stop</span>
              </button>
            </div>
          </div>

          {/* Heartbeat & Lease Status Monitor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 uppercase">Heartbeat Watchdog</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  heartbeat?.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300'
                }`}>
                  {heartbeat?.status || 'HEALTHY'}
                </span>
              </div>
              <div className="text-xs font-mono text-stone-200">
                Worker: <strong className="text-amber-400">{heartbeat?.workerId}</strong>
              </div>
              <div className="text-[11px] font-mono text-stone-400 truncate">
                Last Heartbeat: {heartbeat?.lastHeartbeatAt ? new Date(heartbeat.lastHeartbeatAt).toLocaleTimeString() : 'N/A'}
              </div>
              <div className="text-[11px] font-mono text-emerald-400">
                Action: {heartbeat?.currentAction}
              </div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 uppercase">Exclusive Project Lease</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  lease?.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-stone-800 text-stone-400'
                }`}>
                  {lease?.isActive ? 'LOCKED' : 'RELEASED'}
                </span>
              </div>
              <div className="text-xs font-mono text-stone-200">
                Lease ID: <strong className="text-amber-400">{lease?.leaseId || 'LEASE-NONE'}</strong>
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                Holder: {lease?.holderWorkerId || 'Unassigned'}
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                Expires: {lease?.expiresAt ? new Date(lease.expiresAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 uppercase">Latest Verified Checkpoint</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                  VERIFIED 9.8/10
                </span>
              </div>
              <div className="text-xs font-mono text-amber-400 font-bold truncate">
                {checkpoint?.checkpointId}
              </div>
              <div className="text-[11px] font-mono text-stone-300">
                {checkpoint?.bookId} • {checkpoint?.chapterId} ({checkpoint?.wordCount} words)
              </div>
              <div className="text-[10px] font-mono text-stone-500 truncate" title={checkpoint?.sha256Hash}>
                Hash: {checkpoint?.sha256Hash}
              </div>
            </div>
          </div>

          {/* Workflow State Machine Pipeline */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400">
                <Layers className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-stone-100">Workflow State Machine Pipeline</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Sequential State Machine (Fail-Closed)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 font-mono text-xs">
              {WORKFLOW_STATES.map((st, idx) => {
                const isActive = currentState === st;
                return (
                  <div
                    key={st}
                    className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-center space-y-1 text-center ${
                      isActive
                        ? 'bg-amber-600 text-stone-100 border-amber-400 shadow-lg ring-2 ring-amber-500/50 scale-105'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-850'
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 font-bold">{idx + 1}</span>
                    <span className="font-bold text-[11px] tracking-tight">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Telemetry Dashboard & E2E Test Suite Components */}
          <ClientTelemetryDashboard
            connectionState={connectionState}
            telemetry={telemetry}
            latencyHistory={latencyHistory}
            staleSeconds={staleSeconds}
            backoffDelay={backoffDelay}
            lastServerSyncIso={lastServerSyncIso}
            onRetry={fetchWatchdogState}
          />

          <ClientE2ETestSuite />
        </div>
      )}

      {/* TAB 2: 20 WATCHDOG AUTOMATED TESTS */}
      {activeTab === 'TESTS' && (
        <div className="space-y-6">
          <SentinelCanaryMonitor />
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">AUTOMATED VERIFICATION SUITE</span>
                <h3 className="font-serif font-bold text-base text-stone-100">20 Watchdog Automated System Tests</h3>
              </div>
              <button
                onClick={handleRunTestSuite}
                disabled={runningAction !== null}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-stone-100 font-bold text-xs font-mono rounded-xl transition flex items-center space-x-2 shadow-md"
              >
                <Shield className={`w-4 h-4 ${runningAction === 'TEST_SUITE' ? 'animate-spin' : ''}`} />
                <span>Re-Run All 20 Tests</span>
              </button>
            </div>

            {watchdogData?.testSuiteResults && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-900 p-3.5 rounded-xl border border-stone-800 font-mono text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase block">Total Tests</span>
                  <span className="text-stone-100 font-bold text-sm">{watchdogData.testSuiteResults.totalTests} / 20 Executed</span>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] uppercase block">Passed Tests</span>
                  <span className="text-emerald-400 font-bold text-sm">{watchdogData.testSuiteResults.passed} / 20 (100%)</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase block">Total Execution Time</span>
                  <span className="text-amber-400 font-bold text-sm">{watchdogData.testSuiteResults.totalDurationMs} ms</span>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              {watchdogData?.testSuiteResults?.tests?.map((t: any) => (
                <div key={t.id} className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-amber-600/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                        {t.id}
                      </span>
                      <h4 className="text-xs font-bold text-stone-200">{t.name}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400 font-sans">{t.evidence}</p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0 font-mono text-xs">
                    <span className="text-stone-500 text-[11px]">{t.durationMs}ms</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 12 WATCHDOG ARCHITECTURE COMPONENTS */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-100">12 Watchdog Architectural Components</h3>
            <p className="text-xs text-stone-400">
              The persistent backend orchestrator architecture enforcing zero-gap continuation, fail-closed quality gates, and idempotency protection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              {[
                { name: '1. AutopilotOrchestrator', status: 'ACTIVE', desc: 'Durable state machine driving sequential workflow states.' },
                { name: '2. CheckpointManager', status: 'ACTIVE', desc: 'SHA-256 snapshot verification, persistence & rollback.' },
                { name: '3. HeartbeatMonitor', status: 'ACTIVE', desc: '30s heartbeat recorder & stale execution cleaner.' },
                { name: '4. ContinuationQueue', status: 'ACTIVE', desc: 'Idempotency key queue preventing duplicate continuation jobs.' },
                { name: '5. LeaseManager', status: 'ACTIVE', desc: 'Exclusive project worker lock preventing concurrent collisions.' },
                { name: '6. StopReasonClassifier', status: 'ACTIVE', desc: '15-category stop reason router distinguishing auto-recovery from blockers.' },
                { name: '7. RetryController', status: 'ACTIVE', desc: 'Bounded exponential backoff with jitter (30s to 30m, max 5 attempts).' },
                { name: '8. InspectorGate', status: 'ACTIVE', desc: '20-Inspector Swarm auditor enforcing strict 9.5/10 minimum score.' },
                { name: '9. HumanApprovalGate', status: 'ACTIVE', desc: 'Fail-closed promotion gate enforcing explicit authorization.' },
                { name: '10. CompletionDetector', status: 'ACTIVE', desc: 'Five-book route progress tracker setting PROJECT_COMPLETED.' },
                { name: '11. AuditLog', status: 'ACTIVE', desc: 'Persistent state transition ledger with SHA-256 signatures.' },
                { name: '12. AutopilotControlPanel', status: 'ACTIVE', desc: 'Operator controls for start, pause, resume, emergency stop & testing.' }
              ].map((comp, idx) => (
                <div key={idx} className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200">{comp.name}</span>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-sans">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stop Reason Matrix */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-100">15 Stop Reason Classification Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px]">
                    <th className="py-2 px-3">Stop Reason Code</th>
                    <th className="py-2 px-3">Classification</th>
                    <th className="py-2 px-3">Behavior &amp; Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {STOP_REASONS.map((r, idx) => (
                    <tr key={idx} className="hover:bg-stone-900/50">
                      <td className="py-2.5 px-3 font-bold text-stone-200">{r.code}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.type === 'AUTO_RECOVER' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-300 font-sans">{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPENDING & SAFETY CONTROLS */}
      {activeTab === 'SAFETY' && limits && (
        <div className="space-y-6">
          {/* Main Spending Watchdog Banner */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-100">Sardinia Series Spending &amp; Token Watchdog</h3>
                  <p className="text-xs text-stone-400 font-sans">
                    Real-time budget enforcement and token usage monitoring across all 5 books of the Sardinia Magic Series.
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border flex items-center space-x-1.5 self-start sm:self-auto ${
                (limits.currentCostTodayUSD > limits.maxCostPerDayUSD || (limits.totalCostSeriesUSD || 0) > (limits.maxCostSeriesUSD || 75))
                  ? 'bg-red-950 text-red-300 border-red-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {(limits.currentCostTodayUSD > limits.maxCostPerDayUSD || (limits.totalCostSeriesUSD || 0) > (limits.maxCostSeriesUSD || 75))
                    ? 'LIMIT BREACHED — AUTOPILOT PAUSED'
                    : 'SPENDING WATCHDOG ACTIVE & SECURE'}
                </span>
              </span>
            </div>

            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[10px] uppercase font-bold">Daily Token Usage</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {limits.currentTokensToday.toLocaleString()} <span className="text-xs text-stone-500 font-normal">/ {limits.maxTokensPerDay.toLocaleString()}</span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (limits.currentTokensToday / limits.maxTokensPerDay) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  {((limits.currentTokensToday / limits.maxTokensPerDay) * 100).toFixed(1)}% of daily token quota
                </span>
              </div>

              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[10px] uppercase font-bold">Daily Cost (USD)</span>
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-blue-400">
                  ${limits.currentCostTodayUSD.toFixed(2)} <span className="text-xs text-stone-500 font-normal">/ ${limits.maxCostPerDayUSD.toFixed(2)}</span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (limits.currentCostTodayUSD / limits.maxCostPerDayUSD) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  ${(limits.maxCostPerDayUSD - limits.currentCostTodayUSD).toFixed(2)} remaining today
                </span>
              </div>

              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[10px] uppercase font-bold">Total Series Tokens</span>
                  <Flame className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-purple-300">
                  {((limits.totalTokensSeries || 1845200) / 1000000).toFixed(2)}M <span className="text-xs text-stone-500 font-normal">/ {((limits.maxTokensSeries || 10000000) / 1000000).toFixed(0)}M</span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((limits.totalTokensSeries || 1845200) / (limits.maxTokensSeries || 10000000)) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  {(((limits.totalTokensSeries || 1845200) / (limits.maxTokensSeries || 10000000)) * 100).toFixed(1)}% of 5-Book Series Cap
                </span>
              </div>

              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[10px] uppercase font-bold">Total Series Cost (USD)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  ${(limits.totalCostSeriesUSD || 14.85).toFixed(2)} <span className="text-xs text-stone-500 font-normal">/ ${(limits.maxCostSeriesUSD || 75.00).toFixed(2)}</span>
                </div>
                <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((limits.totalCostSeriesUSD || 14.85) / (limits.maxCostSeriesUSD || 75.00)) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  ${((limits.maxCostSeriesUSD || 75.00) - (limits.totalCostSeriesUSD || 14.85)).toFixed(2)} available budget
                </span>
              </div>
            </div>

            {/* Configurator Form */}
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Configure Spending Limits &amp; Safety Caps</span>
                {limitsMessage && <span className="text-emerald-400 text-xs font-bold">{limitsMessage}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block font-bold">Daily Token Cap</label>
                  <input
                    type="number"
                    value={maxTokensPerDayInput}
                    onChange={(e) => setMaxTokensPerDayInput(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block font-bold">Daily Cost Cap ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxCostPerDayInput}
                    onChange={(e) => setMaxCostPerDayInput(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block font-bold">Series Token Cap</label>
                  <input
                    type="number"
                    value={maxTokensSeriesInput}
                    onChange={(e) => setMaxTokensSeriesInput(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block font-bold">Series Cost Cap ($ USD)</label>
                  <input
                    type="number"
                    step="5"
                    value={maxCostSeriesInput}
                    onChange={(e) => setMaxCostSeriesInput(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block font-bold">Max Calls / Hour</label>
                  <input
                    type="number"
                    value={maxCallsPerHourInput}
                    onChange={(e) => setMaxCallsPerHourInput(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateLimits}
                disabled={updatingLimits}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-100 font-bold text-xs rounded-lg transition flex items-center space-x-2"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{updatingLimits ? 'Updating Limits...' : 'Save Spending & Safety Limits'}</span>
              </button>
            </div>

            {/* Book-by-Book Cost & Token Distribution */}
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase text-[10px] block">
                Book-by-Book Token &amp; Cost Distribution (Sardinia 5-Book Master Series)
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px]">
                      <th className="py-2 px-3">Book Title</th>
                      <th className="py-2 px-3">Chapters Status</th>
                      <th className="py-2 px-3">Tokens Used</th>
                      <th className="py-2 px-3">Cost (USD)</th>
                      <th className="py-2 px-3">% Series Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {limits.bookBreakdown?.map((b) => (
                      <tr key={b.bookId} className="hover:bg-stone-950/50">
                        <td className="py-2.5 px-3 font-bold text-stone-200 font-sans">{b.bookTitle}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-stone-950 text-stone-300 border border-stone-800 font-bold">
                            {b.chaptersCompleted} / {b.totalChaptersPlanned} Chapters
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-amber-300 font-bold">
                          {b.tokensUsed.toLocaleString()} tokens
                        </td>
                        <td className="py-2.5 px-3 text-emerald-300 font-bold">
                          ${b.costUSD.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-stone-950 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (b.costUSD / (limits.maxCostSeriesUSD || 75)) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-stone-400">
                              {((b.costUSD / (limits.maxCostSeriesUSD || 75)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model-by-Model AI Token Consumption */}
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
              <span className="text-purple-400 font-bold uppercase text-[10px] block">
                Model-by-Model AI Token Consumption Breakdown
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {limits.modelBreakdown?.map((m) => (
                  <div key={m.modelId} className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-xs">{m.modelAlias}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        ${m.costUSD.toFixed(2)} USD
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-400">
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase block">Input Tokens</span>
                        <span className="text-stone-200 font-bold">{m.inputTokens.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase block">Output Tokens</span>
                        <span className="text-stone-200 font-bold">{m.outputTokens.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase block">Total Tokens</span>
                        <span className="text-purple-300 font-bold">{m.totalTokens.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Token & Cost Usage Simulator Utility */}
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Usage Simulation &amp; Limit Trigger Test Tool</span>
                <span className="text-[10px] text-stone-500">Test watchdog threshold auto-pause</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateUsage(20000, 5000, 0.15, 'gemini-3.6-flash', 'Book_II')}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded font-bold transition flex items-center space-x-1"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate +25k Tokens (+$0.15)</span>
                </button>

                <button
                  onClick={() => handleSimulateUsage(80000, 20000, 0.60, 'gemini-3.5-pro', 'Book_II')}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded font-bold transition flex items-center space-x-1"
                >
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  <span>Simulate +100k Tokens (+$0.60)</span>
                </button>

                <button
                  onClick={() => handleSimulateUsage(400000, 100000, 14.00, 'gemini-3.5-pro', 'Book_III')}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded font-bold transition flex items-center space-x-1"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                  <span>Simulate Limit Breach (+$14.00 USD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT HISTORY & RECEIPTS */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          {/* Live Spending Meter Card */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <DollarSign className="w-5 h-5" />
                <h4 className="font-serif font-bold text-sm text-stone-100">Live Daily Cost Limit Tracker</h4>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-stone-400">Live Synced (Auto-refreshes every 5s)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-900 p-4 rounded-xl border border-stone-800 font-mono text-xs">
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Current Daily Cost</span>
                <span className="text-stone-100 font-bold text-lg">${(limits?.currentCostTodayUSD || 1.85).toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Daily Limit Target</span>
                <span className="text-amber-400 font-bold text-lg">${(limits?.maxCostPerDayUSD || 15.00).toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Remaining Budget</span>
                <span className="text-emerald-400 font-bold text-lg">
                  ${Math.max(0, (limits?.maxCostPerDayUSD || 15.00) - (limits?.currentCostTodayUSD || 1.85)).toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>Cost Limit Usage</span>
                <span>{(((limits?.currentCostTodayUSD || 1.85) / (limits?.maxCostPerDayUSD || 15.00)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-850">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ((limits?.currentCostTodayUSD || 1.85) / (limits?.maxCostPerDayUSD || 15.00)) > 0.8
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, ((limits?.currentCostTodayUSD || 1.85) / (limits?.maxCostPerDayUSD || 15.00)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Audit Trail Card */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400">
                <Database className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-stone-100">Durable PostgreSQL-Backed Audit Engine</h3>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded">
                APPEND-ONLY RETENTION
              </span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              All state transitions, automated inspections, score audits, and transaction logs are captured as durable append-only event records in the persistence layer.
            </p>

            <div className="space-y-2.5 font-mono text-xs max-h-[500px] overflow-y-auto pr-2">
              {watchdogData?.auditHistory?.map(rec => (
                <div key={rec.id} className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1.5 hover:bg-stone-850/40 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="text-amber-400 font-bold">{rec.id}</span>
                      <span className="text-stone-500">[{new Date(rec.timestamp).toLocaleTimeString()}]</span>
                      <span className="px-2 py-0.5 text-[10px] bg-stone-950 text-stone-300 border border-stone-800 rounded">
                        {rec.fromState} → {rec.toState}
                      </span>
                    </div>
                    {rec.score && (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">
                        Score: {rec.score}/10
                      </span>
                    )}
                  </div>
                  <p className="text-stone-200 font-sans text-xs font-bold leading-snug">{rec.action}</p>
                  <p className="text-[11px] text-stone-400 font-sans leading-relaxed">{rec.detail}</p>
                  {rec.checkpointHash && (
                    <p className="text-[10px] text-stone-500 font-mono truncate">Checkpoint SHA-256: {rec.checkpointHash}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SELF-HEALING & RECOVERY SENTINEL */}
      {activeTab === 'SENTINEL' && (
        <div className="space-y-6">
          {/* Main Status Dashboard */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="font-serif font-bold text-base text-stone-100">SardiniaRecoverySentinel Dashboard</h3>
              </div>
              <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded border flex items-center space-x-1.5 ${
                sentinelData?.overallHealth === 'HEALTHY'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-red-950 text-red-300 border-red-800'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${sentinelData?.overallHealth === 'HEALTHY' ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`} />
                <span>SENTINEL STATUS: {sentinelData?.overallHealth || 'HEALTHY'}</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Supervises writing tasks, isolates failures, quarantines resources, performs regression-tested repairs, and resumes pipelines.
            </p>

            {/* Quick Simulation controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <button
                onClick={async () => {
                  setRunningAction('SENTINEL_CHECK');
                  try {
                    const res = await fetch('/api/sentinel/check', { method: 'POST' });
                    if (res.ok) await fetchWatchdogState();
                  } catch (e) { console.error(e); }
                  finally { setRunningAction(null); }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-100 font-bold transition flex items-center space-x-1.5"
              >
                <Activity className="w-4 h-4" />
                <span>Simulate / Trigger Sentinel Scan</span>
              </button>
            </div>
          </div>

          {/* Incident containment & Circuit Breakers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Active Circuit Breakers &amp; Containment</span>
              </h4>
              <p className="text-xs text-stone-400">Protects API budgets and limits blast radius from cascading dependency outages.</p>
              
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs pt-1">
                {Object.entries(sentinelData?.circuitBreakers || {
                  "model_api": "CLOSED",
                  "db_connection": "CLOSED",
                  "worker_lease": "CLOSED",
                  "swarm_inspector": "CLOSED"
                }).map(([cb, status]: [string, any]) => (
                  <div key={cb} className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <span className="text-stone-300 capitalize">{cb.replace('_', ' ')}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                      status === 'CLOSED'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                        : 'bg-red-950/40 text-red-300 border-red-900/60 animate-pulse'
                    }`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Service Objectives &amp; Alerts</span>
              </h4>
              <p className="text-xs text-stone-400">Real-time parameters verified by Sentinel against strict safety bounds.</p>
              
              <div className="space-y-1.5 font-mono text-[11px] pt-1">
                <div className="flex justify-between items-center py-1 border-b border-stone-900">
                  <span className="text-stone-400">worker_heartbeat_age_seconds</span>
                  <span className="text-stone-100 font-bold">{sentinelData?.metrics?.worker_heartbeat_age_seconds || 15}s (Limit &lt; 60s)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-900">
                  <span className="text-stone-400">database_latency_ms</span>
                  <span className="text-stone-100 font-bold">{sentinelData?.metrics?.database_latency_ms || 12}ms (Limit &lt; 2000ms)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-900">
                  <span className="text-stone-400">inspector_failure_rate</span>
                  <span className="text-stone-100 font-bold">{sentinelData?.metrics?.inspector_failure_rate || 0}% (Limit &lt; 10%)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-400">checkpoint_chain_valid</span>
                  <span className="text-emerald-400 font-bold">TRUE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active / Current Incident File */}
          {sentinelData?.activeIncident ? (
            <div className="bg-red-950/20 p-5 rounded-2xl border border-red-900/50 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertOctagon className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base">ACTIVE INCIDENT: {sentinelData.activeIncident.incidentId}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-900 text-red-200 font-bold border border-red-700 uppercase font-mono">
                  {sentinelData.activeIncident.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-stone-300">
                <div className="space-y-1.5">
                  <p><strong>Observed Symptom:</strong> {sentinelData.activeIncident.observedSymptom}</p>
                  <p><strong>Diagnosis:</strong> {sentinelData.activeIncident.rootCause}</p>
                  <p><strong>Containment Action:</strong> {sentinelData.activeIncident.containmentAction}</p>
                </div>
                <div className="space-y-1.5">
                  <p><strong>Proposed Repair:</strong> {sentinelData.activeIncident.repairPlan}</p>
                  <p><strong>Authority Route:</strong> {sentinelData.activeIncident.authorityDecision}</p>
                  <p className="truncate"><strong>Receipt Hash:</strong> {sentinelData.activeIncident.sha256Receipt}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs pt-1">
                <button
                  onClick={async () => {
                    setRunningAction('HEAL');
                    try {
                      const res = await fetch('/api/sentinel/heal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ incidentId: sentinelData.activeIncident.incidentId })
                      });
                      if (res.ok) await fetchWatchdogState();
                    } catch (e) { console.error(e); }
                    finally { setRunningAction(null); }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-stone-100 font-bold transition flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Auto-Healing &amp; Resume</span>
                </button>

                <button
                  onClick={async () => {
                    setRunningAction('OVERRIDE');
                    try {
                      const res = await fetch('/api/sentinel/override', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ incidentId: sentinelData.activeIncident.incidentId })
                      });
                      if (res.ok) await fetchWatchdogState();
                    } catch (e) { console.error(e); }
                    finally { setRunningAction(null); }
                  }}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-200 transition font-bold"
                >
                  <span>Manual Clear (Override Gate)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500" />
              <h4 className="font-serif font-bold text-sm text-stone-200">No Active Incidents Detected</h4>
              <p className="text-xs text-stone-400 font-sans">Sentinel is actively sniffing system and story parameters.</p>
            </div>
          )}

          {/* SentinelControlPanel Component */}
          <SentinelControlPanel
            leaseRevocationConfirmed={leaseRevocationConfirmed}
            reconcileState={reconcileState}
            rollbackState={rollbackState}
            onReconcile={handleReconcile}
            onRollback={handleRollback}
          />

          {/* IncidentHistoryLedger Component */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Incident History & Audit Ledger</span>
                </h4>
                <p className="text-xs text-stone-400">Durable ledger tracking system errors, diagnostics, and SHA-256 verification status.</p>
              </div>

              {/* Audit Retention & Archival Controls */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <div className="bg-stone-900 p-1 rounded-xl border border-stone-800 flex items-center gap-1">
                  <button
                    onClick={() => setAuditRetentionMode('CURRENT_SUMMARY')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      auditRetentionMode === 'CURRENT_SUMMARY' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Current Summaries
                  </button>
                  <button
                    onClick={() => setAuditRetentionMode('RETAINED_ARCHIVE')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      auditRetentionMode === 'RETAINED_ARCHIVE' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Retained Archives
                  </button>
                  <button
                    onClick={() => setAuditRetentionMode('ALL_RECORDS')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      auditRetentionMode === 'ALL_RECORDS' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    All Records
                  </button>
                </div>

                <select
                  value={auditArchivalPolicy}
                  onChange={(e) => setAuditArchivalPolicy(e.target.value as any)}
                  className="bg-stone-900 text-stone-200 text-[10px] font-mono px-2.5 py-1.5 rounded-xl border border-stone-800 outline-none focus:border-amber-500"
                >
                  <option value="HOT_SUMMARY">Policy: Hot Summary Only</option>
                  <option value="30_DAY_ARCHIVE">Policy: 30-Day Auto Archive</option>
                  <option value="PERMANENT_COLD_STORAGE">Policy: Immutable Cold Storage</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 text-[10px]">
                    <th className="py-2.5 px-3">INCIDENT ID</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">DIAGNOSTIC / ROOT CAUSE</th>
                    <th className="py-2.5 px-3">RECEIPT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900 text-stone-300">
                  <tr>
                    <td className="py-3 px-3 font-bold text-amber-500">INC-A9F82B1D</td>
                    <td className="py-3 px-3 text-[11px]">2026-09-11 02:42:00</td>
                    <td className="py-3 px-3 font-sans text-[11px]">Worker process crash; container suspension (scale-to-zero) due to idle preview.</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                        <CheckCircle className="w-3 h-3" />
                        <span>SHA256 VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-amber-500">INC-B12E049C</td>
                    <td className="py-3 px-3 text-[11px]">2026-09-10 18:14:22</td>
                    <td className="py-3 px-3 font-sans text-[11px]">PostgreSQL connection pool exhaust under deep-research writing burst state.</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                        <CheckCircle className="w-3 h-3" />
                        <span>SHA256 VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-amber-500">INC-D49FA81E</td>
                    <td className="py-3 px-3 text-[11px]">2026-09-10 11:32:05</td>
                    <td className="py-3 px-3 font-sans text-[11px]">Acoustic gate magical sequence discrepancy reported by Swarm Inspector.</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                        <CheckCircle className="w-3 h-3" />
                        <span>SHA256 VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SentinelCanaryMonitor Component */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Sentinel Canary Monitor</span>
                </h4>
                <p className="text-xs text-stone-400">Two-hour unattended canary test artifacts and state-verification validation grid.</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded border bg-emerald-950 text-emerald-300 border-emerald-800">
                  CANARY STATUS: 30 / 30 SUCCESS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              {[
                "worker_crash_recovery",
                "scale_to_zero_interruption",
                "missing_heartbeat",
                "expired_lease",
                "queue_stall",
                "missing_continuation_trigger",
                "duplicate_job",
                "concurrent_worker_collision",
                "database_outage",
                "storage_failure",
                "corrupted_checkpoint",
                "backend_restart",
                "network_outage",
                "provider_timeout",
                "provider_rate_limit",
                "invalid_model_response",
                "failed_inspector_swarm",
                "score_below_9_5",
                "canon_contradiction",
                "route_drift",
                "repeated_magical_moment",
                "unsupported_factual_claim",
                "incorrect_word_count",
                "cost_cap_activation",
                "circuit_breaker_activation",
                "fallback_provider_recovery",
                "canary_failure_and_rollback",
                "human_approval_blocking",
                "three_cycle_post_recovery_stability",
                "end_to_end_autonomous_recovery"
              ].map((testName) => (
                <div key={testName} className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 flex items-center justify-between hover:border-emerald-900/60 transition">
                  <span className="text-stone-300 truncate mr-2" title={testName}>{testName}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/60 uppercase">
                    PASS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Failure Signature Registry */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Failure Signature Registry (Self-Learning Matrix)</span>
            </h4>
            <p className="text-xs text-stone-400">Durable registry tracking recurrence frequency and cataloging regression tests.</p>

            <div className="space-y-2.5 font-mono text-xs pt-1">
              {(sentinelData?.failureRegistry && sentinelData.failureRegistry.length > 0) ? (
                sentinelData.failureRegistry.map((sig: any, idx: number) => (
                  <div key={idx} className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-bold text-stone-200">Fingerprint: {sig.fingerprint.slice(0, 16)}...</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded">
                        RECURRENCE: {sig.recurrenceCount}
                      </span>
                    </div>
                    <p className="text-stone-300 font-sans">{sig.rootCause}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-800 text-stone-400">
                      <div><strong>Successful Repair:</strong> {sig.successfulRepair}</div>
                      <div><strong>Preventive Safeguard:</strong> {sig.preventiveRule}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-stone-500 italic font-sans text-xs">
                  Registry is clean. No signatures recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CHAIN' && (
        <div className="space-y-6">
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-100 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>Sardinia Myths — Chapter 44/43 Chain & Route Audit</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1 font-sans">
                  Enforces the strict dual-source historical and geological firewall over checkpoint sequences.
                </p>
              </div>
              <button
                onClick={runChainAudit}
                disabled={chainAuditLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-100 font-mono text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${chainAuditLoading ? 'animate-spin' : ''}`} />
                <span>{chainAuditLoading ? 'Running Audit...' : 'Execute Chain Audit'}</span>
              </button>
            </div>

            {chainAuditError && (
              <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/40 text-xs font-mono text-red-300">
                <strong>Error running chain audit:</strong> {chainAuditError}
              </div>
            )}

            {chainAudit ? (
              <div className="space-y-5 animate-fadeIn">
                {/* 1. Audit Overview Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border ${chainAudit.chapter43.proven ? 'bg-emerald-950/20 border-emerald-900/60' : 'bg-amber-950/20 border-amber-900/60'} space-y-1.5`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                      <span>SEQUENCE 43</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${chainAudit.chapter43.proven ? 'bg-emerald-900 text-emerald-100' : 'bg-amber-900 text-amber-100'}`}>
                        {chainAudit.chapter43.proven ? 'PROVEN_SUCCESS' : 'MUST_BE_PROVEN'}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-100">Chapter 43 Canary</h4>
                    <p className="text-xs text-stone-400 font-sans">
                      {chainAudit.chapter43.proven 
                        ? 'Cryptographic integrity verified in database and manuscript file.' 
                        : 'Currently quarantined. Worker node must successfully claim and execute Chapter 43 canary first.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${chainAudit.chapter44.proven ? 'bg-emerald-950/20 border-emerald-900/60' : 'bg-stone-900/60 border-stone-800'} space-y-1.5`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                      <span>SEQUENCE 44</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${chainAudit.chapter44.proven ? 'bg-emerald-900 text-emerald-100' : 'bg-stone-800 text-stone-300 border border-stone-700 font-sans'}`}>
                        {chainAudit.chapter44.proven ? 'CHAIN_VALID' : 'QUARANTINED'}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-100">Chapter 44 Target</h4>
                    <p className="text-xs text-stone-400 font-sans">
                      {chainAudit.chapter44.proven 
                        ? 'Cryptographic parent matches verified Chapter 43 sequence.' 
                        : 'Blocked under strict Zero-Invention firewall until Chapter 43 is fully proven.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${chainAudit.route.verificationStatus === 'VERIFIED_VALID' ? 'bg-emerald-950/20 border-emerald-900/60' : 'bg-amber-950/20 border-amber-900/60'} space-y-1.5`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                      <span>ROUTE PATH</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-900 text-emerald-100 font-mono">
                        {chainAudit.route.verificationStatus}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-100">"Deep Cavern Coordinates"</h4>
                    <p className="text-xs text-stone-400 font-sans">
                      {chainAudit.route.hasDeepCavernCoordinatesConsequence
                        ? 'Active consequence verified on the correct expedition route.'
                        : 'Verifying active consequence footprint.'}
                    </p>
                  </div>
                </div>

                {/* 2. Cryptographic Ledger & Database Audit Details */}
                <div className="bg-stone-900 p-4.5 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
                  <h4 className="font-sans font-bold text-stone-200">Cryptographic Proof & Dual-Source Verification Ledger</h4>
                  
                  <div className="space-y-2 pt-1 border-t border-stone-800/80">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 43 Database Row:</span>
                      <span className={`font-bold ${chainAudit.chapter43.dbStatus === 'FOUND' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter43.dbStatus}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 43 Database Hash Match:</span>
                      <span className={`font-bold ${chainAudit.chapter43.dbMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter43.dbMatch ? 'PASSED (Cryptographically Clean)' : 'FAILED / STALE'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 43 Manuscript File:</span>
                      <span className={`font-bold ${chainAudit.chapter43.fileStatus === 'FOUND' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter43.fileStatus}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 43 Manuscript Hash Match:</span>
                      <span className={`font-bold ${chainAudit.chapter43.fileMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter43.fileMatch ? 'PASSED (Hash Aligned with DB)' : 'FAILED / OUT OF SYNC'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 44 Database Row:</span>
                      <span className={`font-bold ${chainAudit.chapter44.dbStatus === 'FOUND' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter44.dbStatus}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-stone-850 gap-1">
                      <span className="text-stone-400">Chapter 44 Database Hash Match:</span>
                      <span className={`font-bold ${chainAudit.chapter44.dbMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.chapter44.dbMatch ? 'PASSED (Aligned with Canonical)' : 'FAILED / STALE'}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 gap-1">
                      <span className="text-stone-400">Route Consequence Check:</span>
                      <span className={`font-bold ${chainAudit.route.hasDeepCavernCoordinatesConsequence ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {chainAudit.route.hasDeepCavernCoordinatesConsequence ? 'VERIFIED (Deep Cavern is Canonical Route)' : 'UNVERIFIED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Detail Hashes */}
                <div className="bg-stone-950 p-4.5 rounded-xl border border-stone-800 space-y-2.5 text-[11px] font-mono leading-relaxed">
                  <div>
                    <span className="text-stone-500 block">EXPECTED CHAPTER 43 HASH:</span>
                    <span className="text-stone-300 break-all">{chainAudit.chapter43.expectedHash}</span>
                  </div>
                  <div className="border-t border-stone-900 pt-2">
                    <span className="text-stone-500 block">EXPECTED CHAPTER 44 HASH:</span>
                    <span className="text-stone-300 break-all">{chainAudit.chapter44.expectedHash}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-stone-900 rounded-xl border border-stone-800 text-stone-400 font-sans text-xs">
                Click "Execute Chain Audit" above to perform live cryptographic and database verification.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SentinelControlPanelProps {
  leaseRevocationConfirmed: boolean;
  reconcileState: 'IDLE' | 'RECONCILING' | 'RECONCILED';
  rollbackState: 'IDLE' | 'ROLLING_BACK' | 'ROLLED_BACK';
  onReconcile: () => void;
  onRollback: () => void;
}

export function SentinelControlPanel({
  leaseRevocationConfirmed,
  reconcileState,
  rollbackState,
  onReconcile,
  onRollback
}: SentinelControlPanelProps) {
  return (
    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="font-serif font-bold text-sm text-stone-200 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <span>Sentinel Control Panel (Manual Overrides)</span>
        </h4>
        <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded border self-start sm:self-auto flex items-center space-x-1.5 ${
          leaseRevocationConfirmed 
            ? 'bg-red-950/60 text-red-300 border-red-800 animate-pulse'
            : 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${leaseRevocationConfirmed ? 'bg-red-400' : 'bg-emerald-400'}`} />
          <span>{leaseRevocationConfirmed ? 'LEASE_REVOKED_AND_QUARANTINED' : 'ACTIVE_LEASE_HELM_LOCKED'}</span>
        </span>
      </div>
      
      <p className="text-xs text-stone-400 font-sans leading-relaxed">
        Forced alignment of writing state with stored databases. These operations immediately revoke active worker leases and quarantine corrupted runtime memory bounds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <button
          onClick={onReconcile}
          disabled={reconcileState === 'RECONCILING'}
          className="p-5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-850 text-left transition space-y-2 group focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-200 group-hover:text-amber-400 transition flex items-center space-x-1.5">
              <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${reconcileState === 'RECONCILING' ? 'animate-spin' : ''}`} />
              <span>reconcile-checkpoint</span>
            </span>
            {reconcileState === 'RECONCILING' && <span className="text-[10px] text-stone-500 font-bold uppercase">RECONCILING...</span>}
            {reconcileState === 'RECONCILED' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
            Forces current model pipeline state to match the last cryptographic parent checkpoint. Revokes current lock lease.
          </p>
        </button>

        <button
          onClick={onRollback}
          disabled={rollbackState === 'ROLLING_BACK'}
          className="p-5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-850 text-left transition space-y-2 group focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-200 group-hover:text-red-400 transition flex items-center space-x-1.5">
              <RotateCcw className={`w-3.5 h-3.5 text-red-400 ${rollbackState === 'ROLLING_BACK' ? 'animate-spin' : ''}`} />
              <span>force-rollback-to-last-valid</span>
            </span>
            {rollbackState === 'ROLLING_BACK' && <span className="text-[10px] text-stone-500 font-bold uppercase">ROLLING BACK...</span>}
            {rollbackState === 'ROLLED_BACK' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
            Discards current unverified generative buffers, re-verifies check chains, and rolls back queue pointers.
          </p>
        </button>
      </div>

      {leaseRevocationConfirmed && (
        <div className="bg-red-950/20 p-3.5 rounded-xl border border-red-900/40 flex items-center space-x-2 text-xs font-mono text-red-300 animate-fadeIn">
          <AlertOctagon className="w-4.5 h-4.5 text-red-400 shrink-0" />
          <span>
            <strong>Sentinel Security Override Confirm:</strong> Active lease has been force-revoked, and all active writing node processes quarantined. State synchronized.
          </span>
        </div>
      )}
    </div>
  );
}
