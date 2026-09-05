import React from 'react';
import { 
  Atom, 
  ShieldCheck, 
  Trees, 
  Cpu, 
  Globe2, 
  Sparkles, 
  Activity,
  Coins,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  epqcBalance: number;
  cqbBalance: number;
  telemetry: {
    coherenceAvg: string;
    totalQubits: number;
    qber: string;
    co2Sequestered: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  epqcBalance,
  cqbBalance,
  telemetry,
}) => {
  const tabs = [
    { id: 'qhfs', label: 'Quantum File System', icon: Atom },
    { id: 'crypto', label: 'Earth Peace Crypto', icon: ShieldCheck },
    { id: 'carbon', label: 'Carbon Exchange & Tokenomics', icon: Trees },
    { id: 'qcf', label: 'Quantum Cloud Functions', icon: Cpu },
    { id: 'mesh', label: 'Planetary Node Mesh', icon: Globe2 },
    { id: 'docs', label: 'Docs & Videos', icon: BookOpen },
    { id: 'gaia', label: 'Gaia Quantum AI', icon: Sparkles },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Telemetry Ticker */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ENTANGLED MESH ONLINE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Q-Coherence: <strong className="text-slate-200">{telemetry.coherenceAvg}</strong></span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>Active Qubits: <strong className="text-cyan-300 font-mono">{telemetry.totalQubits.toLocaleString()}</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>QBER (QKD): <strong className="text-emerald-300 font-mono">{telemetry.qber}</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>CO₂ Sequestered: <strong className="text-emerald-400 font-mono">{telemetry.co2Sequestered.toLocaleString()} t</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Post-Quantum: <strong className="text-indigo-300">Kyber-1024 / Dilithium-5</strong></span>
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 text-slate-300 font-mono text-[11px]">
              <Coins className="w-3 h-3 text-amber-400" />
              <span>{epqcBalance.toFixed(2)} EPQC</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">{cqbBalance.toFixed(1)} CQB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Atom className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                QHFS
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 font-mono">
                  v2.4-HYBRID
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Quantum Hybrid File System &amp; Earth Peace Quantum Network
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
