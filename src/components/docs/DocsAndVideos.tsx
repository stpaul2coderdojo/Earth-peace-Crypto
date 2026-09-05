import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  BookOpen, 
  Video, 
  Layers, 
  ShieldCheck, 
  Trees, 
  Cpu, 
  Globe2, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Sparkles,
  ChevronRight,
  FileText,
  FileCode2,
  Atom,
  HardDrive
} from 'lucide-react';

interface VideoModule {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  category: string;
  thumbnail: string;
  description: string;
  topics: string[];
  chapters: { time: string; sec: number; title: string; desc: string }[];
  keyTakeaway: string;
  codeSnippet?: string;
}

const VIDEO_MODULES: VideoModule[] = [
  {
    id: 'vid-1',
    title: 'QHFS Architecture & 3-Tier Quantum Memory',
    duration: '12:45',
    durationSec: 765,
    category: 'Architecture & Physics',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    description: 'Deep architectural walkthrough of the 3-tier quantum memory hierarchy bridging coherent sub-nanosecond QRAM caches, entangled Bell-pair nodes, and permanent NIST Level 5 Cryo-NVMe vaults.',
    topics: ['QRAM Superposition |ψ⟩', 'Decoherence Dynamics (T₂*)', 'Surface Code Stabilizer QEC', 'Bell Pairs |Φ⁺⟩', 'Cryo-NVMe Vaults'],
    chapters: [
      { time: '00:00', sec: 0, title: 'The Coherence Horizon Challenge', desc: 'Why classical file systems fail when attempting to store quantum superposition without active decoherence suppression.' },
      { time: '02:15', sec: 135, title: 'Tier 0: QRAM Superposition Cache', desc: 'Sub-nanosecond coherent retrieval of state vectors and rotating fluxonium qubit memories.' },
      { time: '05:40', sec: 340, title: 'Surface-Code QEC Refresh', desc: 'Real-time syndrome measurements on 17-qubit rotated surface codes stabilizing wavefunctions against phase damping.' },
      { time: '08:50', sec: 530, title: 'Tier 1: Entangled Node Clusters', desc: 'Continuous Bell-state tomography and quantum teleportation channels with 99.84% verified fidelity.' },
      { time: '10:30', sec: 630, title: 'Tier 2: Post-Quantum Cryo-NVMe Vault', desc: 'Permanent classical storage in Svalbard hardened against Shor\'s and Grover\'s quantum attacks via Kyber-1024.' }
    ],
    keyTakeaway: 'QHFS breaks the physical memory wall by decoupling fast quantum coherent cache operations from long-term post-quantum lattice-verified storage.',
    codeSnippet: `// Tier 0 QRAM Allocation
const qramState = new QuantumStateVector({
  dimension: 16,
  amplitudes: [0.7071, 0, 0, 0.7071],
  coherenceLifetime: 85.4e-6, // 85.4 μs
  qecStabilizer: 'surface-code-rotated-17'
});`
  },
  {
    id: 'vid-2',
    title: 'IPFS Storage & Planetary Node Pinning Guide',
    duration: '09:30',
    durationSec: 570,
    category: 'Distributed Storage',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    description: 'Practical tutorial covering drag-and-drop file upload, Quantum Content Identifier (QCID) generation, Merkle DAG block fragmentation, and geo-pinning across global quantum stations.',
    topics: ['QCID Generation (bafy...)', 'Merkle DAG Chunking', 'Bitswap Replication', 'Multi-Node Pinning', 'Payload Verification'],
    chapters: [
      { time: '00:00', sec: 0, title: 'Content Addressing vs Location URLs', desc: 'Why location-based URLs break and how content-addressed hashes guarantee tamper-evident integrity.' },
      { time: '02:00', sec: 120, title: 'Calculating Quantum CIDs', desc: 'How QCIDs combine classical payload SHA-256 digests with quantum state amplitudes and Dilithium signatures.' },
      { time: '04:30', sec: 270, title: 'Planetary Node Pinning', desc: 'Selecting Geneva, Svalbard, Tokyo, and Atacama nodes to guarantee high availability and fault tolerance.' },
      { time: '07:10', sec: 430, title: 'Quantum Bitswap Replication', desc: 'Peer-to-peer block exchange combining high-bandwidth laser optical links with Bell teleportation protocols.' }
    ],
    keyTakeaway: 'Every file on QHFS is addressed purely by its quantum-cryptographic fingerprint, guaranteeing immutable provenance across the entire planetary mesh.',
    codeSnippet: `// IPFS QCID Content Addressing
const qcid = computeQCID({
  payloadBytes: fileBuffer,
  quantumAmplitudes: stateVector,
  latticeScheme: 'CRYSTALS-Dilithium-5'
}); // -> "bafy2bzaceq3k7a9f..."`
  },
  {
    id: 'vid-3',
    title: 'Earth Peace Quantum Cryptography & BB84 QKD',
    duration: '14:10',
    durationSec: 850,
    category: 'Post-Quantum Cryptography',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    description: 'Detailed analysis of the quantum threat landscape and live demonstration of the BB84 single-photon optical simulation, basis matching (+/×), and NIST Level 5 lattice shield.',
    topics: ['Shor\'s Algorithm Threat', 'BB84 Photon Polarization', 'Quantum Bit Error Rate (QBER)', 'CRYSTALS-Kyber-1024', 'Earth Peace Consensus'],
    chapters: [
      { time: '00:00', sec: 0, title: 'The Post-Quantum Threat Model', desc: 'How fault-tolerant quantum computers will render RSA, Diffie-Hellman, and elliptic curves completely obsolete.' },
      { time: '03:20', sec: 200, title: 'BB84 Optical Simulation', desc: 'Alice transmitting polarized photons across rectilinear (+) and diagonal (×) bases to Bob\'s single-photon detector.' },
      { time: '06:30', sec: 390, title: 'Basis Sifting & QBER Calculation', desc: 'Discarding incompatible measurements and detecting Eve\'s interception when QBER rises above the 11.0% threshold.' },
      { time: '10:00', sec: 600, title: 'NIST Level 5 Lattice Cryptography', desc: 'Mathematical foundations of Learning With Errors (LWE) in CRYSTALS-Kyber-1024 and Dilithium-5.' }
    ],
    keyTakeaway: 'Combining optical BB84 quantum key distribution with mathematical post-quantum lattice cryptography yields unconditional forward secrecy for international peace.',
    codeSnippet: `// BB84 Sifting Condition
const siftedKey = aliceBits.filter((bit, i) => {
  return aliceBases[i] === bobBases[i]; // basis match
});
const qber = calculateQBER(aliceTestBits, bobTestBits);`
  },
  {
    id: 'vid-4',
    title: 'Carbon Credit Tokenomics & Quantum Cloud Functions',
    duration: '11:20',
    durationSec: 680,
    category: 'Tokenomics & Cloud Computing',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Explore the dual-token economic structure of EPQC and CQB, real-world Verra/Gold Standard carbon certificate retirement, and serverless quantum algorithm execution.',
    topics: ['EPQC Utility Token', 'CQB 1:1 tCO2e Peg', 'AMM Pool (x · y = k)', 'Permanent Carbon Retirement', 'Serverless QCF Execution'],
    chapters: [
      { time: '00:00', sec: 0, title: 'Planetary Climate Restoration', desc: 'Coupling advanced quantum computation with tangible, verified planetary carbon removal.' },
      { time: '02:30', sec: 150, title: 'Dual-Token Architecture', desc: 'EPQC as network gas and consensus fuel; CQB as the carbon-backed stable asset pegged 1:1 to metric tons.' },
      { time: '05:10', sec: 310, title: 'Automated Market Maker (AMM) Swaps', desc: 'Trading EPQC and CQB on-chain with low slippage and automated validator fee distribution.' },
      { time: '07:45', sec: 465, title: 'Serverless Quantum Cloud Functions', desc: 'Executing Grover database search, QAOA microgrid partition, and VQE chemical catalysts on QPU.' }
    ],
    keyTakeaway: 'The Earth Peace economic engine aligns high-performance quantum computing with tangible carbon sequestration verified by immutable post-quantum receipts.',
    codeSnippet: `// AMM Constant Product Formula
const amountOut = (reserveCQB * amountIn * 0.997) / 
                  (reserveEPQC + amountIn * 0.997);`
  }
];

export const DocsAndVideos: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'docs' | 'readme'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoModule>(VIDEO_MODULES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Simulated video playback ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= selectedVideo.durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedVideo]);

  const handleSelectVideo = (video: VideoModule) => {
    setSelectedVideo(video);
    setCurrentTimeSec(0);
    setIsPlaying(false);
  };

  const handleSeek = (sec: number) => {
    setCurrentTimeSec(sec);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active chapter
  const currentChapter = [...selectedVideo.chapters]
    .reverse()
    .find((ch) => currentTimeSec >= ch.sec) || selectedVideo.chapters[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300">
              OFFICIAL GITHUB DOCUMENTATION &amp; VIDEO SUITE
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-emerald-400 font-mono">NIST Level 5 Compliant</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Architecture, Readme &amp; Explainer Videos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Explore the peer-reviewed quantum information foundations, IPFS-style planetary node pinning, Earth Peace post-quantum cryptography, and carbon credit tokenomics with interactive video walkthroughs.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('videos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'videos'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Explainer Videos (4)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'docs'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture &amp; Specs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('readme')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'readme'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>GitHub README</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXPLAINER VIDEOS */}
      {activeSubTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Cinema Player (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
              {/* Simulated Screen / Visualizer */}
              <div className="relative aspect-video bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
                {/* Background Ambient Glow & Graphic */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm scale-105 transition-all duration-700"
                  style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

                {/* Animated Quantum State Visualization Canvas Overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                      QHFS MASTERCLASS • EPISODE {selectedVideo.id.replace('vid-', '0')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md">
                    {selectedVideo.category}
                  </span>
                </div>

                {/* Center Animated State Simulation & Title */}
                <div className="relative z-10 my-auto text-center space-y-3 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono">
                    <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Current Chapter: {currentChapter.title}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono line-clamp-2">
                    {currentChapter.desc}
                  </p>

                  {/* Play / Pause Big Center Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-950/50 hover:scale-105 transition-all mx-auto"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                  </div>
                </div>

                {/* Video Bottom Scrub Bar & Controls */}
                <div className="relative z-10 space-y-2 pt-4">
                  {/* Progress Bar with Chapter Ticks */}
                  <div className="relative group">
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(1, clickX / rect.width));
                        handleSeek(pct * selectedVideo.durationSec);
                      }}
                      className="w-full h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden relative"
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTimeSec / selectedVideo.durationSec) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Playback Control Buttons */}
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-slate-200 hover:text-white"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setCurrentTimeSec(0)}
                        className="text-slate-400 hover:text-slate-200"
                        title="Restart Video"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <div className="font-mono text-[11px] text-slate-400">
                        <span className="text-cyan-400 font-bold">{formatTime(currentTimeSec)}</span>
                        <span> / </span>
                        <span>{selectedVideo.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Speed Control */}
                      <button
                        onClick={() => {
                          const speeds = [1, 1.25, 1.5, 2];
                          const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                          setPlaybackSpeed(speeds[nextIdx]);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-cyan-300"
                      >
                        {playbackSpeed}x SPEED
                      </button>

                      {/* Mute Toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Notes & Key Takeaway */}
              <div className="p-5 border-t border-slate-800 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-100">{selectedVideo.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Scientific Key Takeaway</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {selectedVideo.keyTakeaway}
                  </p>
                </div>

                {selectedVideo.codeSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>CORE SCIENTIFIC CODE UNIT:</span>
                      <button
                        onClick={() => handleCopy(selectedVideo.codeSnippet || '', 'code')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px]"
                      >
                        {copiedSection === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedSection === 'code' ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                      {selectedVideo.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Playlist & Chapters (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Playlist Module Selector */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Video Explainer Catalog</span>
                <span className="text-cyan-400">4 Modules</span>
              </h4>

              <div className="space-y-2">
                {VIDEO_MODULES.map((video, idx) => {
                  const isSelected = selectedVideo.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border-cyan-600/80 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="w-16 h-12 rounded-lg bg-slate-900 relative flex-shrink-0 overflow-hidden border border-slate-700">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className={`w-4 h-4 ${isSelected ? 'text-cyan-400 fill-current' : 'text-white'}`} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 0{idx + 1}</span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {video.duration}
                          </span>
                        </div>
                        <h5 className="text-xs font-medium text-slate-200 truncate mt-0.5">
                          {video.title}
                        </h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chapters for Selected Video */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Timestamped Chapters</span>
                <span className="text-slate-500">{selectedVideo.chapters.length} segments</span>
              </h4>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {selectedVideo.chapters.map((ch, idx) => {
                  const isActive = currentChapter.time === ch.time;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSeek(ch.sec)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-200'
                          : 'bg-slate-950/40 hover:bg-slate-800 border border-transparent text-slate-400'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-slate-200 truncate">
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {ch.desc}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700 whitespace-nowrap">
                        {ch.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ARCHITECTURE & TECHNICAL SPECIFICATIONS */}
      {activeSubTab === 'docs' && (
        <div className="space-y-6">
          {/* Architecture Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Atom className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-100">Quantum Random Access Memory (QRAM)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                QRAM addresses N = 2^n memory cells in quantum superposition using a binary tree of quantum switches. This enables quantum search, machine learning, and matrix inversion algorithms to query data in logarithmic O(n) depth.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
                <div>QRAM Superposition Query:</div>
                <div className="text-slate-400">|j⟩|0⟩ → |j⟩|D_j⟩ where D_j is the j-th data block</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-100">IPFS Quantum Content Identifier (QCID)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Content addressing removes reliance on centralized domain hosts. Every file is decomposed into Merkle DAG blocks verified by SHA-256 and post-quantum lattice stamps, pinned across the planetary node mesh.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
                <div>QCID Formulation:</div>
                <div className="text-slate-400">bafy2bzace + Kyber1024_KEM(RawBytes) + Bell_Fidelity_Tag</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-100">Post-Quantum Lattice Shield (Kyber &amp; Dilithium)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Guaranteed immunity against Shor's quantum period-finding attacks. Hardened with NIST Level 5 CRYSTALS-Kyber-1024 for key encapsulation and CRYSTALS-Dilithium-5 for digital signatures.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 space-y-1">
                <div>Security Level: NIST Level 5</div>
                <div className="text-slate-400">Module-LWE over polynomial ring R_q = Z_q[X]/(X^256 + 1)</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Trees className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-100">1:1 Carbon Pegged Tokenomics (CQB &amp; EPQC)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The CQB stablecoin is strictly backed by 1 metric ton of certified CO2 sequestered. Retiring CQB permanently removes carbon credits from circulation and writes a post-quantum cryptographic certificate to QHFS.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 space-y-1">
                <div>Automated Market Maker Pool:</div>
                <div className="text-slate-400">x · y = k (EPQC Reserves × CQB Reserves = Constant)</div>
              </div>
            </div>
          </div>

          {/* Planetary Stations Table */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Planetary Quantum Station Topology</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Station Node</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Qubits</th>
                    <th className="py-2.5 px-3">Avg QBER</th>
                    <th className="py-2.5 px-3">Storage Specialty</th>
                    <th className="py-2.5 px-3">Consensus Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-geneva</td>
                    <td className="py-2.5 px-3 font-sans">Geneva, Switzerland (CERN)</td>
                    <td className="py-2.5 px-3">128 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.82%</td>
                    <td className="py-2.5 px-3 font-sans">QRAM Superposition Primary Cache</td>
                    <td className="py-2.5 px-3 font-sans">Global Time Synchronization</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-svalbard</td>
                    <td className="py-2.5 px-3 font-sans">Svalbard, Norway (Arctic Vault)</td>
                    <td className="py-2.5 px-3">64 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.65%</td>
                    <td className="py-2.5 px-3 font-sans">Post-Quantum Cryo-NVMe Permanent Vault</td>
                    <td className="py-2.5 px-3 font-sans">Immutable Treaty &amp; Proof Anchor</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-tokyo</td>
                    <td className="py-2.5 px-3 font-sans">Tokyo, Japan (RIKEN QPU)</td>
                    <td className="py-2.5 px-3">96 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.91%</td>
                    <td className="py-2.5 px-3 font-sans">Rotated Surface Code Stabilizers</td>
                    <td className="py-2.5 px-3 font-sans">QEC Error Correction Engine</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-atacama</td>
                    <td className="py-2.5 px-3 font-sans">Atacama, Chile (ALMA Observatory)</td>
                    <td className="py-2.5 px-3">72 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.74%</td>
                    <td className="py-2.5 px-3 font-sans">Satellite Optical QKD Channel</td>
                    <td className="py-2.5 px-3 font-sans">Free-Space Trans-Pacific Uplink</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-boulder</td>
                    <td className="py-2.5 px-3 font-sans">Boulder, USA (NIST Laboratory)</td>
                    <td className="py-2.5 px-3">112 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.78%</td>
                    <td className="py-2.5 px-3 font-sans">Atomic Clock &amp; Entropy Beacon</td>
                    <td className="py-2.5 px-3 font-sans">Certified Randomness Source</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">node-singapore</td>
                    <td className="py-2.5 px-3 font-sans">Singapore (Quantum Hub)</td>
                    <td className="py-2.5 px-3">80 Qubits</td>
                    <td className="py-2.5 px-3 text-emerald-400">0.86%</td>
                    <td className="py-2.5 px-3 font-sans">Asia-Pacific High-Density Mesh Hub</td>
                    <td className="py-2.5 px-3 font-sans">Low-Latency Trading &amp; Routing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: GITHUB README PREVIEW & EXPORT */}
      {activeSubTab === 'readme' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <span>README.md (Ready for GitHub)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full documentation markdown file with badges, video links, architecture diagrams, and scientific foundations.
              </p>
            </div>

            <button
              onClick={() => handleCopy(`# Quantum Hybrid File System (QHFS) & Earth Peace Quantum Network\n...`, 'readme')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow"
            >
              {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'readme' ? 'Copied to Clipboard!' : 'Copy README.md'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4 max-h-[600px] overflow-y-auto leading-relaxed">
            <div className="text-cyan-400 font-bold"># Quantum Hybrid File System (QHFS) &amp; Earth Peace Quantum Network</div>
            <p className="text-slate-400">
              A state-of-the-art Quantum-Classical Hybrid File System (QHFS) integrated with Earth Peace Quantum Cryptography (EPQC), Planetary IPFS Node Storage, Carbon Credit Tokenomics (CQB), and Serverless Quantum Cloud Functions (QCF).
            </p>

            <div className="border-t border-slate-800 pt-2 text-indigo-300 font-bold">
              ## 📺 Explainer Videos &amp; Walkthroughs
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Module 1: QHFS Architecture &amp; 3-Tier Quantum Memory</strong> (12:45) - QRAM Superposition, Bell Pairs, Surface Code QEC, Cryo-NVMe</li>
              <li><strong>Module 2: IPFS Storage &amp; Planetary Node Pinning</strong> (09:30) - QCID Content Addressing, Merkle DAG Chunks, Bitswap Replication</li>
              <li><strong>Module 3: Earth Peace Quantum Cryptography &amp; BB84</strong> (14:10) - CRYSTALS-Kyber-1024, Dilithium-5, Photon Polarization, QBER &lt; 1%</li>
              <li><strong>Module 4: Carbon Credit Tokenomics &amp; Quantum Cloud</strong> (11:20) - EPQC Utility Token, CQB 1:1 tCO2e Stablecoin, Grover &amp; QAOA QCF</li>
            </ul>

            <div className="border-t border-slate-800 pt-2 text-indigo-300 font-bold">
              ## 🏛️ System Architecture
            </div>
            <p className="text-slate-400">
              Tier 0 (QRAM Coherent Cache) ↔ Tier 1 (Entangled Nodes Bell Pairs) ↔ Tier 2 (Post-Quantum Cryo-NVMe Vault)
            </p>

            <div className="border-t border-slate-800 pt-2 text-indigo-300 font-bold">
              ## 🚀 Getting Started
            </div>
            <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-cyan-300">
              {`git clone https://github.com/your-org/quantum-hybrid-file-system.git
cd quantum-hybrid-file-system
npm install
npm run dev`}
            </pre>

            <div className="border-t border-slate-800 pt-2 text-indigo-300 font-bold">
              ## 📜 Scientific Foundations &amp; Code Units
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Unit 1: Quantum Random Access Memory (QRAM) - Giovannetti, Lloyd, Maccone (PRL)</li>
              <li>Unit 2: Surface Code Quantum Error Correction (QEC) - Fowler et al. (PRA)</li>
              <li>Unit 3: BB84 Quantum Key Distribution - Bennett &amp; Brassard (IEEE)</li>
              <li>Unit 4: NIST Post-Quantum Cryptography Standard - FIPS 203 &amp; FIPS 204</li>
              <li>Unit 5: Content-Addressed Quantum Merkle DAGs - InterPlanetary File System (IPFS)</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
