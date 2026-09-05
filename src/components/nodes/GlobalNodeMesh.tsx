import React, { useState, useRef } from 'react';
import { PeaceNode, QFile, StorageTier } from '../../types';
import { 
  Globe2, 
  Share2, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Cpu,
  Radio,
  ExternalLink,
  UploadCloud,
  HardDrive,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText,
  Lock,
  Grid,
  ListFilter,
  Eye,
  X
} from 'lucide-react';
import { QuantumIpfsUploadModal } from '../upload/QuantumIpfsUploadModal';

interface GlobalNodeMeshProps {
  nodes: PeaceNode[];
  files: QFile[];
  onAddFile: (file: QFile) => void;
  onTogglePinFile: (fileId: string, nodeId: string) => void;
}

export const GlobalNodeMesh: React.FC<GlobalNodeMeshProps> = ({ 
  nodes, 
  files, 
  onAddFile, 
  onTogglePinFile 
}) => {
  const [selectedNode, setSelectedNode] = useState<PeaceNode>(nodes[0]);
  const [activeSubTab, setActiveSubTab] = useState<'pinned-files' | 'matrix' | 'telemetry'>('pinned-files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [replicateFileTarget, setReplicateFileTarget] = useState<{ file: QFile; targetNodeId: string } | null>(null);
  const [isReplicating, setIsReplicating] = useState(false);
  const [copiedCid, setCopiedCid] = useState<string | null>(null);
  const [inspectingFile, setInspectingFile] = useState<QFile | null>(null);

  // Quick drag & drop over node dropzone
  const [isNodeDragOver, setIsNodeDragOver] = useState(false);
  const nodeFileInputRef = useRef<HTMLInputElement>(null);

  // Files stored on the selected node
  const pinnedFiles = files.filter(
    (f) => f.pinnedNodes?.includes(selectedNode.id) || selectedNode.pinnedFileIds?.includes(f.id)
  );

  // Storage usage calculation for selected node
  const totalPinnedBytes = pinnedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const totalPinnedGb = (totalPinnedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const storageCap = selectedNode.storageCapacityGb || 512;
  const storagePercent = Math.min(100, Math.round(((selectedNode.storageUsedGb || Number(totalPinnedGb) || 10) / storageCap) * 100));

  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopiedCid(cid);
    setTimeout(() => setCopiedCid(null), 2000);
  };

  const handleDownloadFile = (file: QFile) => {
    const element = document.createElement('a');
    let fileUrl = file.downloadData;
    if (!fileUrl) {
      const blob = new Blob([
        `Quantum Content Identifier (QCID): ${file.qcid}\n` +
        `File Name: ${file.name}\n` +
        `Storage Tier: ${file.tier}\n` +
        `Quantum State: ${file.quantumState}\n` +
        `Merkle Root: ${file.merkleProof}\n` +
        `Kyber-1024 Lattice Hash: ${file.latticeHash}\n` +
        `Pinned On Nodes: ${file.pinnedNodes?.join(', ') || 'Geneva'}\n\n` +
        `=== CONTENT PAYLOAD ===\n${file.contentPreview}`
      ], { type: 'text/plain;charset=utf-8' });
      fileUrl = URL.createObjectURL(blob);
    }
    element.href = fileUrl;
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReplicate = async () => {
    if (!replicateFileTarget) return;
    setIsReplicating(true);
    await new Promise((r) => setTimeout(r, 800));
    onTogglePinFile(replicateFileTarget.file.id, replicateFileTarget.targetNodeId);
    setIsReplicating(false);
    setReplicateFileTarget(null);
  };

  // Node dropzone handlers
  const handleNodeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNodeDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      processQuickUpload(dropped);
    }
  };

  const processQuickUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const newQFile: QFile = {
        id: `qhfs-${Date.now().toString(36)}`,
        name: file.name,
        sizeBytes: file.size,
        tier: 'Entangled Nodes',
        quantumState: 'Entangled |Φ⁺⟩',
        qubitsRequired: 8,
        coherenceTimeRemainingMs: 120000,
        maxCoherenceTimeMs: 120000,
        merkleProof: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        latticeHash: `kyber1024-secp-${Math.random().toString(36).substring(2, 10)}`,
        category: file.name.includes('qasm') ? 'quantum-code' : file.name.includes('treaty') ? 'peace-treaty' : 'climate-telemetry',
        contentPreview: text.slice(0, 250) || `Uploaded raw file (${file.size} bytes) to node ${selectedNode.name}.`,
        isObserved: true,
        lastObserved: 'Just now',
        qcid: `bafyq${Math.abs(file.size * 99173).toString(36)}x739qmesh${Date.now().toString(36)}`.substring(0, 52),
        pinnedNodes: [selectedNode.id, 'node-geneva'].filter((v, i, a) => a.indexOf(v) === i),
        mimeType: file.type || 'application/octet-stream',
        uploadedAt: `${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC`,
        downloadData: text ? `data:${file.type || 'text/plain'};charset=utf-8,${encodeURIComponent(text)}` : undefined,
      };
      onAddFile(newQFile);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Upload Trigger */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Planetary Quantum Node Mesh &amp; IPFS Storage Network
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              IPFS-QFS v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Decentralized content-addressed quantum storage. Files are sliced into Bell-state Merkle-DAG chunks pinned across 7 sovereign planetary quorum nodes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all w-full sm:w-auto"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File to Nodes (IPFS)</span>
          </button>
        </div>
      </div>

      {/* Network Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">ACTIVE NODES</span>
          <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {nodes.length} / {nodes.length} Online
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">IPFS PINNED FILES</span>
          <span className="text-base font-bold text-cyan-300 mt-0.5 block">
            {files.length} Content CIDs
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">TOTAL NETWORK PIN REPLICAS</span>
          <span className="text-base font-bold text-indigo-300 mt-0.5 block">
            {files.reduce((acc, f) => acc + (f.pinnedNodes?.length || 1), 0)} Node Pins
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">BELL PAIR FIDELITY</span>
          <span className="text-base font-bold text-emerald-300 mt-0.5 block">
            99.84% (QBER: 0.82%)
          </span>
        </div>
      </div>

      {/* World Map Projection Canvas / Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Legend */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Click any planetary node to inspect IPFS storage, pinned files, and QPU state
          </span>
          <span className="hidden sm:inline text-slate-500">
            Laser QKD Entanglement Channels Active
          </span>
        </div>

        {/* SVG Entanglement Lines between nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="entangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {nodes.map((node) =>
            node.entangledWith.map((targetId) => {
              const targetNode = nodes.find((n) => n.id === targetId);
              if (!targetNode) return null;
              return (
                <line
                  key={`${node.id}-${targetNode.id}`}
                  x1={`${node.coordinates.x}%`}
                  y1={`${node.coordinates.y}%`}
                  x2={`${targetNode.coordinates.x}%`}
                  y2={`${targetNode.coordinates.y}%`}
                  stroke="url(#entangleGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              );
            })
          )}
        </svg>

        {/* Node Points on Map */}
        <div className="relative z-10 w-full h-full min-h-[300px]">
          {nodes.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const nodeFileCount = files.filter((f) => f.pinnedNodes?.includes(node.id)).length;

            return (
              <div
                key={node.id}
                style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                onClick={() => setSelectedNode(node)}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping wave */}
                  <span className={`animate-ping absolute inline-flex h-9 w-9 rounded-full ${
                    isSelected ? 'bg-cyan-400 opacity-60' : 'bg-emerald-400 opacity-25'
                  }`} />

                  {/* Core Node Icon */}
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500 border-white text-slate-950 scale-125 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-950 border-emerald-500 text-emerald-400 hover:scale-110'
                  }`}>
                    <Radio className="w-3.5 h-3.5" />
                  </div>

                  {/* Pin Count Badge */}
                  <div className="absolute -top-2 -right-2 px-1 py-0.2 rounded-full bg-slate-900 border border-cyan-500/70 text-[9px] font-mono text-cyan-300 shadow">
                    📌{nodeFileCount}
                  </div>

                  {/* Hover Tag */}
                  <div className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap pointer-events-none transition-opacity ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-700 opacity-100 shadow-lg'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 opacity-0 group-hover:opacity-100'
                  }`}>
                    <span className="font-bold">{node.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({nodeFileCount} pinned)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Bottom Bar */}
        <div className="relative z-10 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Storage Node:</span>
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {selectedNode.name} ({selectedNode.location})
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Storage: {selectedNode.storageUsedGb} GB / {selectedNode.storageCapacityGb} GB</span>
            <span>•</span>
            <span className="text-emerald-400">{pinnedFiles.length} Pinned Files</span>
          </div>
        </div>
      </div>

      {/* Nodes Selector Carousel / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {nodes.map((node) => {
          const isSelected = selectedNode.id === node.id;
          const count = files.filter((f) => f.pinnedNodes?.includes(node.id)).length;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNode(node)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/60'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="font-medium">{node.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                📌 {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details & IPFS Storage Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Node Sub-Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {selectedNode.name}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedNode.country}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              IPFS Peer ID: /ipfs/qnode/{selectedNode.id} • Ping: {selectedNode.lastPing}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveSubTab('pinned-files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'pinned-files'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Pinned Files ({pinnedFiles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'matrix'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>IPFS Network Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('telemetry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'telemetry'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>QPU Telemetry</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PINNED FILES ON THIS NODE */}
        {activeSubTab === 'pinned-files' && (
          <div className="space-y-6">
            {/* Storage Capacity Gauge & Quick Node Upload Trigger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Storage Capacity Gauge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Node Storage Allocation (IPFS Blocks &amp; QRAM)
                  </span>
                  <span className="text-cyan-300 font-bold">
                    {selectedNode.storageUsedGb} GB / {selectedNode.storageCapacityGb} GB ({storagePercent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500 block">QPU QUBITS:</span>
                    <span className="text-slate-200 font-bold">{selectedNode.qubits} Qubits</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">QBER (ACCURACY):</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.qber}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">BITSWAP BW:</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.bandwidthMbps || 850} Mbps</span>
                  </div>
                </div>
              </div>

              {/* Quick Dropzone for this specific node */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsNodeDragOver(true);
                }}
                onDragLeave={() => setIsNodeDragOver(false)}
                onDrop={handleNodeDrop}
                onClick={() => nodeFileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isNodeDragOver
                    ? 'border-cyan-400 bg-cyan-950/40'
                    : 'border-slate-700 bg-slate-950/70 hover:border-cyan-500/70 hover:bg-slate-900'
                }`}
              >
                <input
                  type="file"
                  ref={nodeFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processQuickUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <UploadCloud className="w-6 h-6 text-cyan-400 mb-1.5" />
                <div className="text-xs font-bold text-slate-200">
                  Upload Directly to {selectedNode.name.split(' ')[0]}
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Drag file here or click to pin to this node
                </p>
              </div>
            </div>

            {/* Pinned Files List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Files Stored &amp; Pinned on this Node ({pinnedFiles.length}):
                </span>
                <span className="text-slate-500">
                  Bitswap Content Addressable Routing
                </span>
              </div>

              {pinnedFiles.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <HardDrive className="w-8 h-8 mx-auto text-slate-600" />
                  <div className="text-sm font-semibold text-slate-300">No Files Pinned on {selectedNode.name}</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Upload a file or pin existing files from other quantum nodes across the planetary mesh.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700 text-xs font-mono hover:bg-cyan-900"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload File to this Node
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {pinnedFiles.map((file) => {
                    const isDirectlyPinned = file.pinnedNodes?.includes(selectedNode.id);
                    const replicationCount = file.pinnedNodes?.length || 1;
                    const chunkForThisNode = file.chunks?.find((c) => c.storedOnNodeId === selectedNode.id);

                    return (
                      <div
                        key={file.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-100 flex items-center gap-2 font-mono">
                                <span>{file.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                  {file.tier}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {(file.sizeBytes / 1024).toFixed(1)} KB • State: {file.quantumState} • Category: {file.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                              📌 Pinned ({replicationCount} Nodes)
                            </span>
                            <button
                              type="button"
                              onClick={() => setInspectingFile(file)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs"
                              title="Inspect File Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(file)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs"
                              title="Download / Retrieve payload"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onTogglePinFile(file.id, selectedNode.id)}
                              className="text-[11px] font-mono px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-900/80 transition-colors"
                              title="Unpin from this node"
                            >
                              Unpin
                            </button>
                          </div>
                        </div>

                        {/* QCID & Chunk details */}
                        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-slate-500 text-[11px]">QCID:</span>
                            <span className="text-cyan-300 text-[11px] truncate max-w-xs sm:max-w-md">
                              {file.qcid}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCid(file.qcid)}
                              className="text-slate-400 hover:text-white p-0.5"
                              title="Copy CID"
                            >
                              {copiedCid === file.qcid ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Replicate via Bitswap trigger */}
                          <div className="flex items-center gap-2 text-[11px]">
                            <button
                              type="button"
                              onClick={() =>
                                setReplicateFileTarget({
                                  file,
                                  targetNodeId:
                                    nodes.find((n) => !file.pinnedNodes?.includes(n.id))?.id || nodes[1].id,
                                })
                              }
                              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-medium"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Replicate to Peer Node...</span>
                            </button>
                          </div>
                        </div>

                        {/* Merkle chunks indicator */}
                        {file.chunks && file.chunks.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-slate-400">
                            <span className="text-slate-500">Merkle-DAG Chunks:</span>
                            {file.chunks.map((chk, idx) => {
                              const isThisNode = chk.storedOnNodeId === selectedNode.id;
                              const nodeObj = nodes.find((n) => n.id === chk.storedOnNodeId);
                              return (
                                <span
                                  key={chk.id}
                                  className={`px-1.5 py-0.5 rounded border ${
                                    isThisNode
                                      ? 'bg-cyan-950 text-cyan-200 border-cyan-700 font-bold'
                                      : 'bg-slate-900 text-slate-400 border-slate-800'
                                  }`}
                                  title={`Chunk #${idx} (${(chk.sizeBytes / 1024).toFixed(1)} KB) on ${nodeObj?.name || chk.storedOnNodeId}`}
                                >
                                  Block #{idx} ({nodeObj?.name?.split(' ')[0] || 'Node'})
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: NETWORK IPFS DISTRIBUTION MATRIX */}
        {activeSubTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <p className="text-slate-400">
                Cross-planetary IPFS Pinning Topology. Toggle pins directly to replicate or evict files across nodes.
              </p>
              <span className="text-cyan-400 font-bold">
                {files.length} Files × {nodes.length} Nodes
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                    <th className="p-3">File / QCID</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Size</th>
                    {nodes.map((node) => (
                      <th key={node.id} className="p-3 text-center">
                        <div className="font-bold text-slate-200">{node.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-500 font-normal">{node.country.slice(0, 3).toUpperCase()}</div>
                      </th>
                    ))}
                    <th className="p-3 text-right">Pins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {files.map((file) => {
                    const pinCount = file.pinnedNodes?.length || 1;
                    return (
                      <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-200 truncate max-w-xs" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-[10px] text-cyan-400 truncate max-w-xs font-mono">
                            {file.qcid.substring(0, 22)}...
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {file.tier.split(' ')[0]}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {(file.sizeBytes / 1024).toFixed(0)} KB
                        </td>

                        {nodes.map((node) => {
                          const isPinned = file.pinnedNodes?.includes(node.id);
                          return (
                            <td key={node.id} className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => onTogglePinFile(file.id, node.id)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                                  isPinned
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 hover:bg-emerald-900'
                                    : 'bg-slate-900 text-slate-600 border border-slate-800 hover:border-slate-600 hover:text-slate-400'
                                }`}
                                title={isPinned ? `Pinned on ${node.name} (click to unpin)` : `Not pinned (click to pin to ${node.name})`}
                              >
                                {isPinned ? '📌' : '·'}
                              </button>
                            </td>
                          );
                        })}

                        <td className="p-3 text-right font-bold text-cyan-300">
                          {pinCount} / {nodes.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: QPU TELEMETRY */}
        {activeSubTab === 'telemetry' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[11px]">QUANTUM PROCESSOR</span>
              <div className="text-lg font-bold text-cyan-400">{selectedNode.qubits} Qubits</div>
              <p className="text-[11px] text-slate-400">
                Superconducting Transmon Array operating at 14.8 mK dilution refrigerator temperature.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[11px]">ENTANGLEMENT FIDELITY</span>
              <div className="text-lg font-bold text-emerald-400">{selectedNode.qber}% QBER</div>
              <p className="text-[11px] text-slate-400">
                Quantum Bit Error Rate well beneath the 11% Shor-Preskill threshold.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[11px]">ENTANGLED PEERS</span>
              <div className="text-lg font-bold text-indigo-300">{selectedNode.entangledWith.length} Nodes</div>
              <p className="text-[11px] text-slate-400">
                Active Bell-pair laser communication links with {selectedNode.entangledWith.join(', ')}.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[11px]">DILITHIUM-5 LATTICE PROOF</span>
              <div className="text-[11px] text-indigo-400 truncate">{selectedNode.signatureProof}</div>
              <p className="text-[11px] text-slate-400">
                Post-quantum digital signature anchoring Earth Peace non-aggression consensus.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Replicate File via Bitswap Modal */}
      {replicateFileTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                Quantum Bitswap Replicate
              </h3>
              <button
                type="button"
                onClick={() => setReplicateFileTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PAYLOAD:</span>
                <span className="font-bold text-slate-200">{replicateFileTarget.file.name}</span>
                <span className="text-cyan-400 block text-[10px] truncate mt-1">
                  QCID: {replicateFileTarget.file.qcid}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Select Target Planetary Node:</label>
                <select
                  value={replicateFileTarget.targetNodeId}
                  onChange={(e) =>
                    setReplicateFileTarget({
                      ...replicateFileTarget,
                      targetNodeId: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.location}) — QBER: {n.qber}%
                    </option>
                  ))}
                </select>
              </div>

              {isReplicating && (
                <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      Entangling Merkle chunks via Bell-state teleportation...
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={isReplicating}
                onClick={() => setReplicateFileTarget(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReplicating}
                onClick={handleReplicate}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md"
              >
                {isReplicating ? 'Teleporting...' : 'Confirm Replicate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect File Drawer */}
      {inspectingFile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                IPFS File Inspector
              </h3>
              <button
                type="button"
                onClick={() => setInspectingFile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">FILE NAME:</span>
                <span className="text-base font-bold text-slate-100">{inspectingFile.name}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">QUANTUM CID (QCID):</span>
                <div className="text-cyan-300 text-[11px] break-all select-all">
                  {inspectingFile.qcid}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">STORAGE TIER:</span>
                  <span className="text-slate-200 font-bold">{inspectingFile.tier}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SIZE:</span>
                  <span className="text-slate-200 font-bold">{(inspectingFile.sizeBytes / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">STORED ON NODES ({inspectingFile.pinnedNodes?.length || 1}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingFile.pinnedNodes?.map((nid) => {
                    const n = nodes.find((node) => node.id === nid);
                    return (
                      <span
                        key={nid}
                        className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-800 text-[10px]"
                      >
                        📌 {n?.name || nid}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">CONTENT PREVIEW:</span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {inspectingFile.contentPreview}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDownloadFile(inspectingFile)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Payload</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectingFile(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global IPFS Upload Modal */}
      <QuantumIpfsUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        nodes={nodes}
        onAddFile={onAddFile}
        initialSelectedNodeId={selectedNode.id}
      />
    </div>
  );
};
