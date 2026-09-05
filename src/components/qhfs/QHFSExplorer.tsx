import React, { useState } from 'react';
import { 
  QFile, 
  StorageTier,
  PeaceNode 
} from '../../types';
import { 
  Plus, 
  Search, 
  Eye, 
  RotateCw, 
  Shield, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  HardDrive,
  Cpu,
  Share2,
  Trash2,
  Lock,
  Binary,
  X,
  FileCode2,
  UploadCloud,
  Download,
  Copy,
  Check,
  Globe2
} from 'lucide-react';
import { QuantumIpfsUploadModal } from '../upload/QuantumIpfsUploadModal';

interface QHFSExplorerProps {
  files: QFile[];
  nodes?: PeaceNode[];
  onAddFile: (file: QFile) => void;
  onObserveFile: (id: string) => void;
  onRefreshQEC: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onTogglePinFile?: (fileId: string, nodeId: string) => void;
}

export const QHFSExplorer: React.FC<QHFSExplorerProps> = ({
  files,
  nodes = [],
  onAddFile,
  onObserveFile,
  onRefreshQEC,
  onDeleteFile,
  onTogglePinFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<StorageTier | 'All'>('All');
  const [inspectFile, setInspectFile] = useState<QFile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIpfsUploadModalOpen, setIsIpfsUploadModalOpen] = useState(false);
  const [showMerkleDag, setShowMerkleDag] = useState(false);
  const [copiedCid, setCopiedCid] = useState(false);

  // New file form states
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<QFile['category']>('climate-telemetry');
  const [newFileTier, setNewFileTier] = useState<StorageTier>('QRAM Superposition');
  const [newFileState, setNewFileState] = useState<QFile['quantumState']>('Superposition |ψ⟩');
  const [newFileContent, setNewFileContent] = useState('');

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || file.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  // Calculate storage tier metrics
  const qramFiles = files.filter(f => f.tier === 'QRAM Superposition');
  const entangledFiles = files.filter(f => f.tier === 'Entangled Nodes');
  const cryoFiles = files.filter(f => f.tier === 'Post-Quantum Cryo-NVMe');

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newQFile: QFile = {
      id: `qhfs-${Date.now().toString(36)}`,
      name: newFileName.endsWith('.qdat') || newFileName.endsWith('.epqc') ? newFileName : `${newFileName}.qdat`,
      qcid: `bafy2bzace${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`,
      pinnedNodes: ['node-geneva'],
      sizeBytes: Math.floor(Math.random() * 50000000) + 500000,
      tier: newFileTier,
      quantumState: newFileState,
      qubitsRequired: newFileTier === 'QRAM Superposition' ? 12 : newFileTier === 'Entangled Nodes' ? 8 : 4,
      coherenceTimeRemainingMs: newFileTier === 'Post-Quantum Cryo-NVMe' ? 3600000 : 120000,
      maxCoherenceTimeMs: newFileTier === 'Post-Quantum Cryo-NVMe' ? 3600000 : 120000,
      merkleProof: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      latticeHash: `kyber1024-secp-${Math.random().toString(36).substring(2, 10)}`,
      category: newFileCategory,
      contentPreview: newFileContent || 'Quantum encrypted state vector payload verified by Earth Peace lattice consensus.',
      isObserved: false,
    };

    onAddFile(newQFile);
    setNewFileName('');
    setNewFileContent('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 0: QRAM */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Tier 0: QRAM Superposition</h3>
                <p className="text-[11px] text-cyan-400 font-mono">Sub-nanosecond Coherent Cache</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              {qramFiles.length} files
            </span>
          </div>
          <div className="mt-3 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Allocated Qubits:</span>
              <span className="font-mono text-cyan-300">64 / 256 Qubits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Coherence T₂*:</span>
              <span className="font-mono text-emerald-400">85.4 μs (Active QEC)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '38%' }} />
            </div>
          </div>
        </div>

        {/* Tier 1: Entangled Nodes */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Tier 1: Entangled Nodes</h3>
                <p className="text-[11px] text-emerald-400 font-mono">Distributed Bell Pairs |Φ⁺⟩</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              {entangledFiles.length} files
            </span>
          </div>
          <div className="mt-3 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Mesh Sync Nodes:</span>
              <span className="font-mono text-emerald-300">Geneva ↔ Svalbard ↔ Tokyo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Entanglement Fidelity:</span>
              <span className="font-mono text-emerald-400">99.84% (Bell-state verified)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>

        {/* Tier 2: Cryo-NVMe */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Tier 2: Post-Quantum Cryo-NVMe</h3>
                <p className="text-[11px] text-indigo-400 font-mono">CRYSTALS-Kyber-1024 Vault</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              {cryoFiles.length} files
            </span>
          </div>
          <div className="mt-3 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Vault Security:</span>
              <span className="font-mono text-indigo-300">NIST Level 5 (Quantum Immune)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cold Capacity:</span>
              <span className="font-mono text-slate-300">1.42 PB / 5.00 PB</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search quantum hybrid blocks, tags, or hashes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {(['All', 'QRAM Superposition', 'Entangled Nodes', 'Post-Quantum Cryo-NVMe'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  selectedTier === tier
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMerkleDag(!showMerkleDag)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showMerkleDag
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showMerkleDag ? 'Hide Merkle DAG' : 'View Merkle DAG'}</span>
          </button>

          <button
            onClick={() => setIsIpfsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/40 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (IPFS)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Encode New File</span>
          </button>
        </div>
      </div>

      {/* Merkle DAG Visualization Drawer */}
      {showMerkleDag && (
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-800/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Quantum-State Merkle Directed Acyclic Graph (DAG)</h4>
                <p className="text-xs text-slate-400">Cryptographically anchoring quantum superposition states into post-quantum lattice roots</p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              Root Hash: 0x7f2a...98e1 (Verified)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono mb-1">LEVEL 0: GLOBAL ROOT</div>
              <div className="font-mono text-indigo-300 truncate">0x7f2a93c71b40d12e</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Earth Peace Consensus Anchor
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono mb-1">LEVEL 1: QRAM BRANCH</div>
              <div className="font-mono text-cyan-300 truncate">0x8f2a93c71b40d12e</div>
              <div className="text-[10px] text-cyan-400 mt-1">
                3 Superposition Leaves Active
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono mb-1">LEVEL 1: ENTANGLED BRANCH</div>
              <div className="font-mono text-emerald-300 truncate">0x1c98bf3409a234e7</div>
              <div className="text-[10px] text-emerald-400 mt-1">
                Bell Pair |Φ⁺⟩ Sync Verified
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono mb-1">LEVEL 1: CRYO-NVME VAULT</div>
              <div className="font-mono text-indigo-300 truncate">0x99a32c091d34e65b</div>
              <div className="text-[10px] text-indigo-400 mt-1">
                Kyber-1024 Encapsulated
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files Table / List */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">File Name &amp; Category</th>
                <th className="py-3 px-4">Storage Tier</th>
                <th className="py-3 px-4">IPFS Node Pins</th>
                <th className="py-3 px-4">Quantum State</th>
                <th className="py-3 px-4">Coherence Lifetime</th>
                <th className="py-3 px-4">Qubits</th>
                <th className="py-3 px-4">Lattice Proof</th>
                <th className="py-3 px-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No files found matching current quantum tier filters.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => {
                  const coherencePct = Math.max(0, Math.min(100, (file.coherenceTimeRemainingMs / file.maxCoherenceTimeMs) * 100));
                  const isDecohering = coherencePct < 30 && file.tier !== 'Post-Quantum Cryo-NVMe';

                  return (
                    <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            file.tier === 'QRAM Superposition'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                              : file.tier === 'Entangled Nodes'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                          }`}>
                            <FileCode2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-100 flex items-center gap-2">
                              <span>{file.name}</span>
                              {file.isObserved && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60" title="Wavefunction observed into classical state">
                                  Observed
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{(file.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span className="capitalize">{file.category.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          file.tier === 'QRAM Superposition'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : file.tier === 'Entangled Nodes'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            file.tier === 'QRAM Superposition'
                              ? 'bg-cyan-400 animate-pulse'
                              : file.tier === 'Entangled Nodes'
                              ? 'bg-emerald-400'
                              : 'bg-indigo-400'
                          }`} />
                          {file.tier}
                        </span>
                      </td>

                      {/* Stored on Nodes (IPFS Pins) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap max-w-[170px]">
                          {file.pinnedNodes && file.pinnedNodes.length > 0 ? (
                            file.pinnedNodes.map((nid) => {
                              const nodeObj = nodes.find((n) => n.id === nid);
                              return (
                                <span
                                  key={nid}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono"
                                  title={`Stored on ${nodeObj?.name || nid} (${nodeObj?.location || 'Planetary Mesh'})`}
                                >
                                  📌 {nodeObj?.name.split(' ')[0] || nid}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">
                              Pinned (Geneva)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quantum State */}
                      <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border ${
                          file.quantumState.includes('Superposition')
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                            : file.quantumState.includes('Entangled')
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                            : file.quantumState.includes('Stabilizer')
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-700/60'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {file.quantumState}
                        </span>
                      </td>

                      {/* Coherence Lifetime */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {file.tier === 'Post-Quantum Cryo-NVMe' ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
                            <Lock className="w-3 h-3" />
                            <span>Immune (Cryo)</span>
                          </div>
                        ) : (
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className={isDecohering ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                                {(file.coherenceTimeRemainingMs / 1000).toFixed(1)}s
                              </span>
                              <span className="text-slate-500">{coherencePct.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDecohering ? 'bg-amber-400' : 'bg-cyan-400'
                                }`}
                                style={{ width: `${coherencePct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Qubits */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                        {file.qubitsRequired} qubits
                      </td>

                      {/* Merkle / Lattice Hash */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        <span className="truncate max-w-[120px] inline-block" title={file.latticeHash}>
                          {file.latticeHash.substring(0, 14)}...
                        </span>
                      </td>

                      {/* Operations */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Observe / Collapse Wavefunction */}
                          <button
                            onClick={() => onObserveFile(file.id)}
                            title="Observe File (Simulate Wavefunction Collapse)"
                            className="p-1.5 rounded bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* QEC Refresh */}
                          {file.tier !== 'Post-Quantum Cryo-NVMe' && (
                            <button
                              onClick={() => onRefreshQEC(file.id)}
                              title="Quantum Error Correction (Surface Code Stabilizer Refresh)"
                              className="p-1.5 rounded bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700 transition-colors"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Inspect Modal */}
                          <button
                            onClick={() => setInspectFile(file)}
                            title="Inspect Quantum State & Lattice Proof"
                            className="p-1.5 rounded bg-slate-800 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-700 hover:border-indigo-700 transition-colors"
                          >
                            <Binary className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteFile(file.id)}
                            title="Deallocate / Purge Qubit Block"
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Quantum Inspector Modal */}
      {inspectFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInspectFile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{inspectFile.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">Quantum State Vector Inspection</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono space-y-1.5">
                <div className="text-slate-400 text-[11px]">STATE VECTOR DECOMPOSITION:</div>
                <div className="text-cyan-300 font-bold">
                  {inspectFile.quantumState.includes('Superposition')
                    ? '|ψ⟩ = 0.7071 |0000⟩ + 0.7071 e^{iπ/4} |1111⟩'
                    : inspectFile.quantumState.includes('Entangled')
                    ? '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2  (Node-Entangled Pair)'
                    : '|0000⟩ (Wavefunction Collapsed into Classical Basis)'}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  P(|0⟩) = 50.0% | P(|1⟩) = 50.0% | Relative Phase θ = 45.0°
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">LATTICE ENCAPSULATION</div>
                  <div className="font-mono text-indigo-300 mt-0.5 truncate">{inspectFile.latticeHash}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Kyber-1024 Verified
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">MERKLE LEAF PROOF</div>
                  <div className="font-mono text-slate-300 mt-0.5 truncate">{inspectFile.merkleProof}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Consensus Anchor OK
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>IPFS QUANTUM CONTENT IDENTIFIER (QCID)</span>
                  {inspectFile.qcid && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectFile.qcid || '');
                        setCopiedCid(true);
                        setTimeout(() => setCopiedCid(false), 2000);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px]"
                    >
                      {copiedCid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCid ? 'Copied' : 'Copy QCID'}
                    </button>
                  )}
                </div>
                <div className="font-mono text-cyan-300 text-xs break-all bg-slate-900/80 p-2 rounded border border-cyan-900/40">
                  {inspectFile.qcid || `bafy2bzace${inspectFile.latticeHash.replace(/[^a-z0-9]/gi, '')}q${inspectFile.id.replace(/[^a-z0-9]/gi, '')}`}
                </div>
              </div>

              {/* Pinned Nodes on Planetary Mesh */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                    PLANETARY IPFS NODE PINNING TOPOLOGY
                  </span>
                  <span className="text-cyan-300">
                    {(inspectFile.pinnedNodes || []).length} / {nodes.length} Nodes Pinned
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {nodes.map((node) => {
                    const isPinned = (inspectFile.pinnedNodes || []).includes(node.id);
                    return (
                      <div
                        key={node.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                          isPinned
                            ? 'bg-cyan-950/40 border-cyan-700/60 text-slate-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium truncate flex items-center gap-1">
                            {isPinned && <span className="text-cyan-400 text-xs">📌</span>}
                            {node.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{node.location}</div>
                        </div>

                        {onTogglePinFile && (
                          <button
                            onClick={() => {
                              onTogglePinFile(inspectFile.id, node.id);
                              // Update inspectFile local reference
                              const currentPins = inspectFile.pinnedNodes || [];
                              const updatedPins = isPinned
                                ? currentPins.filter((id) => id !== node.id)
                                : [...currentPins, node.id];
                              setInspectFile({ ...inspectFile, pinnedNodes: updatedPins });
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              isPinned
                                ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800'
                                : 'bg-cyan-900 text-cyan-200 hover:bg-cyan-800 border border-cyan-700'
                            }`}
                          >
                            {isPinned ? 'Unpin' : 'Pin Block'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono mb-1">CONTENT DATA PAYLOAD (PREVIEW)</div>
                <p className="text-slate-200 text-xs leading-relaxed font-mono">
                  {inspectFile.contentPreview}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {inspectFile.downloadData ? (
                <a
                  href={inspectFile.downloadData}
                  download={inspectFile.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Payload</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    const blob = new Blob([inspectFile.contentPreview], { type: inspectFile.mimeType || 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = inspectFile.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/80 hover:bg-indigo-600 text-white shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Payload</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onObserveFile(inspectFile.id);
                    setInspectFile(null);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold"
                >
                  Observe Wavefunction
                </button>
                <button
                  onClick={() => setInspectFile(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New File Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateFile} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Encode File to Quantum Hybrid System</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. quantum_telemetry_2026.qdat"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newFileCategory}
                    onChange={(e) => setNewFileCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="climate-telemetry">Climate Telemetry</option>
                    <option value="quantum-code">Quantum Algorithm Code</option>
                    <option value="carbon-registry">Carbon Registry Ledger</option>
                    <option value="peace-treaty">Earth Peace Treaty</option>
                    <option value="encrypted-state">Encrypted State Matrix</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Storage Tier</label>
                  <select
                    value={newFileTier}
                    onChange={(e) => {
                      const tier = e.target.value as StorageTier;
                      setNewFileTier(tier);
                      if (tier === 'QRAM Superposition') setNewFileState('Superposition |ψ⟩');
                      else if (tier === 'Entangled Nodes') setNewFileState('Entangled |Φ⁺⟩');
                      else setNewFileState('Stabilizer Protected');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="QRAM Superposition">Tier 0: QRAM Superposition</option>
                    <option value="Entangled Nodes">Tier 1: Entangled Nodes</option>
                    <option value="Post-Quantum Cryo-NVMe">Tier 2: Post-Quantum Cryo-NVMe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Quantum State Representation</label>
                <select
                  value={newFileState}
                  onChange={(e) => setNewFileState(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="Superposition |ψ⟩">Superposition |ψ⟩ (Alpha|0⟩ + Beta|1⟩)</option>
                  <option value="Entangled |Φ⁺⟩">Entangled |Φ⁺⟩ (Bell Pair across Nodes)</option>
                  <option value="Stabilizer Protected">Stabilizer Protected (Surface Code 17-Qubit)</option>
                  <option value="Collapsed (Classical)">Collapsed (Classical Bit Matrix)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Payload Content / Telemetry Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter scientific data, climate telemetry, or cryptographic state notes..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold"
              >
                Encode &amp; Allocate Qubits
              </button>
            </div>
          </form>
        </div>
      )}

      {/* IPFS Quantum File Upload Modal */}
      <QuantumIpfsUploadModal
        isOpen={isIpfsUploadModalOpen}
        onClose={() => setIsIpfsUploadModalOpen(false)}
        nodes={nodes}
        onAddFile={onAddFile}
      />
    </div>
  );
};
