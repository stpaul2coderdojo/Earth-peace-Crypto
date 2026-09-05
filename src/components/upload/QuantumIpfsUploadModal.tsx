import React, { useState, useRef } from 'react';
import { QFile, PeaceNode, StorageTier, QChunk } from '../../types';
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  HardDrive, 
  Share2, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Radio,
  FileCode,
  FileSpreadsheet,
  Globe2
} from 'lucide-react';

interface QuantumIpfsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: PeaceNode[];
  onAddFile: (file: QFile) => void;
  initialSelectedNodeId?: string;
}

export const QuantumIpfsUploadModal: React.FC<QuantumIpfsUploadModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onAddFile,
  initialSelectedNodeId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    content: string;
    dataUrl?: string;
  } | null>(null);

  const [category, setCategory] = useState<QFile['category']>('climate-telemetry');
  const [tier, setTier] = useState<StorageTier>('Entangled Nodes');
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>(
    initialSelectedNodeId
      ? [initialSelectedNodeId, 'node-geneva'].filter((v, i, a) => a.indexOf(v) === i)
      : ['node-geneva', 'node-svalbard', 'node-tokyo']
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [copiedCid, setCopiedCid] = useState(false);

  if (!isOpen) return null;

  // Generate deterministic-looking CID based on file name and size
  const generatedCid = uploadedFile
    ? `bafyq${Math.abs(
        uploadedFile.name.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)
      ).toString(36)}${Math.abs(uploadedFile.size * 73939).toString(36)}x739qmesh${Date.now().toString(36)}`.substring(0, 54)
    : 'bafyq...';

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBrowserFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processBrowserFile(e.target.files[0]);
    }
  };

  const processBrowserFile = (file: File) => {
    const reader = new FileReader();

    // If small text/code/json, read as text
    if (file.type.startsWith('text/') || file.type.includes('json') || file.type.includes('qasm') || file.name.endsWith('.qdat') || file.name.endsWith('.epqc') || file.size < 500000) {
      reader.onload = () => {
        const textContent = typeof reader.result === 'string' ? reader.result : '';
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          content: textContent.slice(0, 300) || `Uploaded raw file (${file.size} bytes).`,
          dataUrl: textContent.length > 0 ? `data:${file.type || 'text/plain'};charset=utf-8,${encodeURIComponent(textContent)}` : undefined,
        });
      };
      reader.readAsText(file);
    } else {
      // Read data URL
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          content: `Binary/Media payload (${(file.size / 1024).toFixed(1)} KB) partitioned into quantum lattice blocks.`,
          dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
        });
      };
      reader.readAsDataURL(file);
    }

    // Auto-detect category
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('carbon') || lowerName.includes('co2') || lowerName.includes('lidar')) {
      setCategory('climate-telemetry');
    } else if (lowerName.includes('treaty') || lowerName.includes('peace') || lowerName.includes('accord')) {
      setCategory('peace-treaty');
    } else if (lowerName.includes('qasm') || lowerName.includes('circuit') || lowerName.includes('quantum') || lowerName.includes('algo')) {
      setCategory('quantum-code');
    } else if (lowerName.includes('token') || lowerName.includes('ledger') || lowerName.includes('credit')) {
      setCategory('carbon-registry');
    } else {
      setCategory('encrypted-state');
    }
  };

  const loadSampleDataset = (sampleType: 'lidar' | 'treaty' | 'circuit') => {
    if (sampleType === 'lidar') {
      setUploadedFile({
        name: 'amazon_canopy_biomass_lidar_2026.geojson',
        size: 2450000,
        type: 'application/geo+json',
        content: '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"biome":"Amazonia","carbonDensity":142.4,"deltaPpm":-412.3}}]}',
        dataUrl: 'data:application/json;charset=utf-8,' + encodeURIComponent('{"type":"FeatureCollection","biome":"Amazonia","carbonDensity":142.4}'),
      });
      setCategory('climate-telemetry');
      setTier('Entangled Nodes');
      setSelectedNodeIds(['node-saopaulo', 'node-geneva', 'node-nairobi']);
    } else if (sampleType === 'treaty') {
      setUploadedFile({
        name: 'nordic_arctic_peace_demilitarization.epqc',
        size: 890000,
        type: 'application/x-quantum-treaty',
        content: 'Earth Peace Accord: Svalbard Cryo-Node non-aggression cryptographic covenant validated via 7-node Bell state quorum.',
        dataUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent('Earth Peace Accord: Svalbard Cryo-Node Covenant.'),
      });
      setCategory('peace-treaty');
      setTier('Entangled Nodes');
      setSelectedNodeIds(['node-svalbard', 'node-geneva', 'node-reykjavik']);
    } else {
      setUploadedFile({
        name: 'vqe_carbon_sequestration_hamiltonian.qasm',
        size: 14200,
        type: 'text/x-qasm',
        content: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[4] q;\nh q[0];\ncx q[0], q[1];\nrz(0.785) q[2];\nmeasure q -> c;',
        dataUrl: 'data:text/x-qasm;charset=utf-8,' + encodeURIComponent('OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[4] q;\nh q[0];\ncx q[0], q[1];'),
      });
      setCategory('quantum-code');
      setTier('QRAM Superposition');
      setSelectedNodeIds(['node-tokyo', 'node-geneva']);
    }
  };

  const toggleNodeSelection = (nodeId: string) => {
    if (selectedNodeIds.includes(nodeId)) {
      if (selectedNodeIds.length === 1) return; // keep at least 1
      setSelectedNodeIds(selectedNodeIds.filter((id) => id !== nodeId));
    } else {
      setSelectedNodeIds([...selectedNodeIds, nodeId]);
    }
  };

  const selectAllNodes = () => {
    setSelectedNodeIds(nodes.map((n) => n.id));
  };

  const handleCopyCid = () => {
    navigator.clipboard.writeText(generatedCid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 2000);
  };

  const handleUploadSubmit = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProcessStep('Computing Quantum Multihash & Merkle-DAG chunks...');
    await new Promise((r) => setTimeout(r, 450));

    setProcessStep('Encrypting with CRYSTALS-Kyber-1024 post-quantum lattice...');
    await new Promise((r) => setTimeout(r, 450));

    setProcessStep(`Broadcasting Bell-state chunks via Bitswap to ${selectedNodeIds.length} planetary nodes...`);
    await new Promise((r) => setTimeout(r, 550));

    // Create Merkle chunks distributed across selected nodes
    const chunkCount = Math.max(1, Math.min(selectedNodeIds.length, 4));
    const chunkSize = Math.ceil(uploadedFile.size / chunkCount);
    const chunks: QChunk[] = Array.from({ length: chunkCount }, (_, idx) => ({
      id: `chk-${Date.now().toString(36)}-${idx}`,
      index: idx,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${idx}`,
      sizeBytes: Math.min(chunkSize, uploadedFile.size - idx * chunkSize),
      storedOnNodeId: selectedNodeIds[idx % selectedNodeIds.length],
      tier,
    }));

    const qubitsReq = tier === 'QRAM Superposition' ? 16 : tier === 'Entangled Nodes' ? 8 : 4;

    const newQFile: QFile = {
      id: `qhfs-${Date.now().toString(36)}`,
      name: uploadedFile.name,
      sizeBytes: uploadedFile.size,
      tier,
      quantumState:
        tier === 'QRAM Superposition'
          ? 'Superposition |ψ⟩'
          : tier === 'Entangled Nodes'
          ? 'Entangled |Φ⁺⟩'
          : 'Stabilizer Protected',
      qubitsRequired: qubitsReq,
      coherenceTimeRemainingMs: tier === 'Post-Quantum Cryo-NVMe' ? 3600000 : 120000,
      maxCoherenceTimeMs: tier === 'Post-Quantum Cryo-NVMe' ? 3600000 : 120000,
      merkleProof: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      latticeHash: `kyber1024-secp-${Math.random().toString(36).substring(2, 12)}`,
      category,
      contentPreview: uploadedFile.content,
      isObserved: tier === 'Post-Quantum Cryo-NVMe',
      lastObserved: tier === 'Post-Quantum Cryo-NVMe' ? 'Just now' : undefined,
      qcid: generatedCid,
      pinnedNodes: selectedNodeIds,
      chunks,
      mimeType: uploadedFile.type,
      uploadedAt: `${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC`,
      downloadData: uploadedFile.dataUrl,
    };

    onAddFile(newQFile);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Quantum IPFS File Sharding &amp; Node Storage
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  QCID v2.4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload and partition files into content-addressed Merkle chunks pinned across planetary quantum nodes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone (Satisfies Drag-and-drop & Manual Selection) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01]'
              : uploadedFile
              ? 'border-emerald-500/60 bg-emerald-950/20 hover:border-emerald-400'
              : 'border-slate-700 bg-slate-950 hover:border-cyan-600/70 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!uploadedFile ? (
            <div className="space-y-2 pointer-events-none">
              <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 animate-bounce" />
              <div className="text-xs font-semibold text-slate-200">
                Drag &amp; drop any file here, or <span className="text-cyan-400 underline">browse device files</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Supports GeoJSON, OPENQASM, PDFs, text, keys, binary datasets, and carbon sensor telemetry.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                    <span>{uploadedFile.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                    {uploadedFile.type} • Preview: &quot;{uploadedFile.content.slice(0, 50)}...&quot;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono px-2 py-1 rounded bg-rose-950/60 border border-rose-900"
              >
                Change File
              </button>
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-[11px] text-slate-400 font-mono">Quick Samples:</span>
          <button
            type="button"
            onClick={() => loadSampleDataset('lidar')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] border border-slate-700"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
            Amazon Lidar GeoJSON
          </button>
          <button
            type="button"
            onClick={() => loadSampleDataset('treaty')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] border border-slate-700"
          >
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Arctic Peace Treaty Annex
          </button>
          <button
            type="button"
            onClick={() => loadSampleDataset('circuit')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] border border-slate-700"
          >
            <FileCode className="w-3 h-3 text-cyan-400" />
            VQE Circuit OPENQASM
          </button>
        </div>

        {/* Computed IPFS QCID Banner */}
        {uploadedFile && (
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 overflow-hidden">
              <Network className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-400">Content Identifier (QCID):</span>
              <span className="text-cyan-300 font-bold truncate max-w-xs sm:max-w-sm">
                {generatedCid}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCid}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] hover:bg-cyan-900"
            >
              {copiedCid ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCid ? 'Copied' : 'Copy CID'}</span>
            </button>
          </div>
        )}

        {/* Tier & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>Target Storage Tier</span>
              <span className="text-[10px] font-mono text-cyan-400 font-normal">
                {tier === 'QRAM Superposition' ? '16 Qubits' : tier === 'Entangled Nodes' ? '8 Qubits' : '4 Qubits'}
              </span>
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as StorageTier)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="Entangled Nodes">Tier 1: Entangled Nodes (Bell Pairs |Φ⁺⟩)</option>
              <option value="QRAM Superposition">Tier 0: QRAM Superposition (Coherent RAM)</option>
              <option value="Post-Quantum Cryo-NVMe">Tier 2: Post-Quantum Cryo-NVMe (Kyber-1024)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Domain Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="climate-telemetry">Climate Telemetry &amp; Lidar</option>
              <option value="peace-treaty">Earth Peace Accord &amp; Bio-Archive</option>
              <option value="quantum-code">Quantum Code / OPENQASM</option>
              <option value="carbon-registry">Carbon Credit Tokenomics</option>
              <option value="encrypted-state">Encrypted State Matrix</option>
            </select>
          </div>
        </div>

        {/* IPFS Node Pinning Selection (Where file is stored on nodes) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              Pin &amp; Store File on Planetary Nodes ({selectedNodeIds.length}/{nodes.length} Selected):
            </span>
            <button
              type="button"
              onClick={selectAllNodes}
              className="text-[11px] font-mono text-cyan-400 hover:underline"
            >
              Pin to All 7 Nodes (Full Quorum)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {nodes.map((node) => {
              const isSelected = selectedNodeIds.includes(node.id);
              return (
                <div
                  key={node.id}
                  onClick={() => toggleNodeSelection(node.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/70 text-slate-100 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="font-bold flex items-center gap-1 text-[11px] truncate">
                      <Radio className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{node.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      QBER: {node.qber}% • {node.qubits}Q • {node.storageUsedGb} GB used
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Processing State Bar */}
        {isProcessing && (
          <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-700 text-xs text-cyan-200 space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{processStep}</span>
              </span>
              <span className="text-emerald-400">Quantum Bitswap Active</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-3/4 animate-pulse" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Decentralized IPFS Merkle-DAG • Dilithium-5 Attested
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!uploadedFile || isProcessing || selectedNodeIds.length === 0}
              onClick={handleUploadSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-40"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isProcessing ? 'Sharding to Nodes...' : 'Upload & Pin to Nodes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
