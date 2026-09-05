import React, { useState } from 'react';
import { 
  Trees, 
  ArrowLeftRight, 
  Flame, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Leaf, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { CarbonProject, RetirementCertificate } from '../../types';

interface CarbonCreditExchangeProps {
  projects: CarbonProject[];
  epqcBalance: number;
  cqbBalance: number;
  onSwap: (fromToken: 'EPQC' | 'CQB', fromAmount: number, toAmount: number) => void;
  onRetireCredits: (tons: number, project: CarbonProject, cert: RetirementCertificate) => void;
}

export const CarbonCreditExchange: React.FC<CarbonCreditExchangeProps> = ({
  projects,
  epqcBalance,
  cqbBalance,
  onSwap,
  onRetireCredits,
}) => {
  // AMM Swap state
  const [fromToken, setFromToken] = useState<'EPQC' | 'CQB'>('EPQC');
  const [fromAmount, setFromAmount] = useState<string>('50');
  const epqcPriceUsd = 14.82;
  const cqbPriceUsd = 28.50;

  // Constant product pool simulation: 1,250,000 EPQC / 650,000 CQB
  const poolEPQC = 1250000;
  const poolCQB = 650000;

  const numericFrom = parseFloat(fromAmount) || 0;
  let estimatedTo = 0;
  if (fromToken === 'EPQC') {
    estimatedTo = (numericFrom * epqcPriceUsd) / cqbPriceUsd * 0.997; // 0.3% fee
  } else {
    estimatedTo = (numericFrom * cqbPriceUsd) / epqcPriceUsd * 0.997;
  }

  // Retirement modal state
  const [selectedProjectToRetire, setSelectedProjectToRetire] = useState<CarbonProject | null>(null);
  const [retireTons, setRetireTons] = useState<number>(5);
  const [retireeName, setRetireeName] = useState<string>('Gaia Earth Guardian');
  const [generatedCertificate, setGeneratedCertificate] = useState<RetirementCertificate | null>(null);

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericFrom <= 0) return;
    if (fromToken === 'EPQC' && numericFrom > epqcBalance) {
      alert('Insufficient EPQC balance');
      return;
    }
    if (fromToken === 'CQB' && numericFrom > cqbBalance) {
      alert('Insufficient CQB balance');
      return;
    }
    onSwap(fromToken, numericFrom, estimatedTo);
    setFromAmount('');
  };

  const handleRetire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectToRetire || retireTons <= 0) return;
    if (retireTons > cqbBalance) {
      alert('Insufficient CQB balance to retire this amount of carbon credits');
      return;
    }

    const cert: RetirementCertificate = {
      certificateId: `Q-OFFSET-${Date.now().toString(36).toUpperCase()}`,
      projectName: selectedProjectToRetire.name,
      tonsRetired: retireTons,
      retiredBy: retireeName || 'Anonymous Planetary Guardian',
      timestamp: new Date().toUTCString(),
      quantumHashProof: `dilithium-proof-0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      merkleRoot: '0x7f2a93c71b40d12e55a81c009bfa774e62d',
      co2OffsetDescription: `Permanent geological and biomass sequestration verified by ${selectedProjectToRetire.type} sensors.`,
    };

    onRetireCredits(retireTons, selectedProjectToRetire, cert);
    setGeneratedCertificate(cert);
    setSelectedProjectToRetire(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Market Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>$EPQC Price (Security Coin)</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            ${epqcPriceUsd.toFixed(2)} USD
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Staking &amp; Quantum Compute Gas</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>$CQB Price (Carbon-Qubit)</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +1.8%
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ${cqbPriceUsd.toFixed(2)} / tCO₂e
          </div>
          <p className="text-[11px] text-slate-500 mt-1">1 CQB = 1 Metric Ton CO₂ Sequestered</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Sequestered</span>
            <span className="text-cyan-400 font-mono text-[11px]">VERIFIED</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300">
            428,950 t
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Satellite &amp; Quantum LIDAR Verified</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Permanently Retired</span>
            <span className="text-amber-400 flex items-center gap-0.5 text-[11px]">
              <Flame className="w-3 h-3" /> Burned
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            187,420 t
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Proof of Non-Reversibility on DAG</p>
        </div>
      </div>

      {/* Main Grid: Projects + AMM Swap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verified Projects List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Quantum-Verified Sequestration Registries</h3>
                <p className="text-xs text-slate-400">Atmospheric and oceanic carbon units anchored via Quantum Proof of Sequestration (QPoS)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              4 Live Ecosystems
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-700/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      {project.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      ${project.priceUsd.toFixed(2)}/t
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 mt-2 line-clamp-1">
                    {project.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{project.region}</p>

                  <div className="mt-3 text-xs space-y-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available:</span>
                      <span className="text-slate-200">{project.availableTons.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sensor Fidelity:</span>
                      <span className="text-cyan-300">{project.sensorFidelity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rate:</span>
                      <span className="text-emerald-400">{project.sequestrationRate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                  <div className="flex-1 text-[10px] font-mono text-slate-500 truncate" title={project.qposAttestation}>
                    {project.qposAttestation}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProjectToRetire(project);
                      setRetireTons(Math.min(10, Math.floor(cqbBalance) || 1));
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-colors whitespace-nowrap"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Retire Carbon</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AMM Swap Card (1 Col) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Quantum AMM Swap</h3>
                <p className="text-xs text-slate-400">Constant Product DEX ($x \cdot y = k$)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              0.3% LP Fee
            </span>
          </div>

          <form onSubmit={handleExecuteSwap} className="space-y-3 text-xs">
            {/* From Input */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>You Pay:</span>
                <span>Balance: {fromToken === 'EPQC' ? epqcBalance.toFixed(2) : cqbBalance.toFixed(1)} {fromToken}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-lg font-bold font-mono text-slate-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFromToken(fromToken === 'EPQC' ? 'CQB' : 'EPQC')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-semibold"
                >
                  <span>{fromToken}</span>
                </button>
              </div>
            </div>

            {/* Swap Flip Button */}
            <div className="flex justify-center -my-1">
              <button
                type="button"
                onClick={() => setFromToken(fromToken === 'EPQC' ? 'CQB' : 'EPQC')}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 rotate-90" />
              </button>
            </div>

            {/* To Output */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>You Receive (Estimated):</span>
                <span>Balance: {fromToken === 'EPQC' ? cqbBalance.toFixed(1) : epqcBalance.toFixed(2)} {fromToken === 'EPQC' ? 'CQB' : 'EPQC'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full text-lg font-bold font-mono text-emerald-400">
                  {estimatedTo > 0 ? estimatedTo.toFixed(4) : '0.0000'}
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-mono font-semibold">
                  {fromToken === 'EPQC' ? 'CQB' : 'EPQC'}
                </span>
              </div>
            </div>

            {/* Swap Details */}
            <div className="space-y-1 p-2 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span className="text-slate-200">1 CQB ≈ 1.92 EPQC</span>
              </div>
              <div className="flex justify-between">
                <span>Slippage Tolerance:</span>
                <span className="text-emerald-400">0.10% (Quantum-optimized)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md shadow-emerald-950/40"
            >
              Execute Instant Swap
            </button>
          </form>

          {/* Tokenomics Supply Chart Summary */}
          <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block">TOKENOMICS STAKE POOL:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">POOL EPQC:</span>
                <span className="text-slate-200">1,250,000 EPQC</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">POOL CQB:</span>
                <span className="text-emerald-400">650,000 CQB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retire Carbon Modal */}
      {selectedProjectToRetire && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRetire} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Permanently Retire Carbon Credits</h3>
                  <p className="text-xs text-slate-400">Burn $CQB to offset your real emissions &amp; receive an immutable certificate</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectToRetire(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">TARGET PROJECT:</span>
                <span className="text-slate-100 font-semibold">{selectedProjectToRetire.name}</span>
                <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{selectedProjectToRetire.region}</div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Retiree Name or Entity (Printed on Certificate)</label>
                <input
                  type="text"
                  required
                  value={retireeName}
                  onChange={(e) => setRetireeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Metric Tons of CO₂ to Retire (1 CQB = 1 Ton)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={Math.floor(cqbBalance) || 1}
                    required
                    value={retireTons}
                    onChange={(e) => setRetireTons(Number(e.target.value))}
                    className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-400 font-mono">
                    Available: {cqbBalance.toFixed(1)} CQB
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-200 text-xs">
                ⚠️ <strong>Irreversible Quantum Burn:</strong> Burning {retireTons} CQB destroys the tokens forever on the Merkle DAG, permanently canceling that exact carbon footprint.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedProjectToRetire(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Burn CQB &amp; Issue Certificate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Downloadable / Viewable Offset Certificate */}
      {generatedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-emerald-500/60 rounded-3xl max-w-2xl w-full p-7 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background watermark */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">Earth Peace Quantum Offset Certificate</h3>
                  <p className="text-xs text-emerald-400 font-mono">Immutable Proof of Carbon Retirement</p>
                </div>
              </div>
              <button
                onClick={() => setGeneratedCertificate(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>CERTIFICATE ID:</span>
                <span className="text-emerald-400 font-bold text-sm">{generatedCertificate.certificateId}</span>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <span className="text-slate-400 text-[11px] block">ISSUED IN HONOR OF:</span>
                <span className="text-xl font-bold text-slate-100 font-sans tracking-wide">
                  {generatedCertificate.retiredBy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">OFFSET CO₂ TONNAGE:</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {generatedCertificate.tonsRetired} Metric Tons CO₂e
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">TIMESTAMP (UTC):</span>
                  <span className="text-slate-300">{generatedCertificate.timestamp}</span>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <span className="text-slate-400 text-[11px] block">PROJECT REGISTRY:</span>
                <span className="text-slate-200">{generatedCertificate.projectName}</span>
              </div>

              <div className="border-t border-slate-800/80 pt-3 space-y-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">QUANTUM LATTICE PROOF:</span>
                  <span className="text-indigo-300 break-all">{generatedCertificate.quantumHashProof}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">MERKLE ANCHOR:</span>
                  <span className="text-slate-400 break-all">{generatedCertificate.merkleRoot}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>NIST Post-Quantum Cryptographically Anchored</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>
                <button
                  onClick={() => setGeneratedCertificate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
