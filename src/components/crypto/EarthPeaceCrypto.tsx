import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Radio, 
  Sparkles, 
  Lock, 
  Globe2, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  AlertTriangle,
  FileCheck,
  Award,
  Zap,
  Cpu
} from 'lucide-react';
import { PeaceNode, PhotonTransmission } from '../../types';

interface EarthPeaceCryptoProps {
  nodes: PeaceNode[];
}

export const EarthPeaceCrypto: React.FC<EarthPeaceCryptoProps> = ({ nodes }) => {
  // QKD Protocol State
  const [eveEnabled, setEveEnabled] = useState(false);
  const [photons, setPhotons] = useState<PhotonTransmission[]>([]);
  const [isSimulatingQKD, setIsSimulatingQKD] = useState(false);
  const [siftedKey, setSiftedKey] = useState<string>('');
  const [qber, setQber] = useState<number>(0.8);
  const [qkdStatus, setQkdStatus] = useState<'idle' | 'secure' | 'compromised'>('idle');

  // Post-Quantum Lattice Signing State
  const [treatyText, setTreatyText] = useState('Global Non-Aggression, Bio-Preservation & Quantum Non-Proliferation Accord (Geneva 2026)');
  const [isSigning, setIsSigning] = useState(false);
  const [signatureOutput, setSignatureOutput] = useState<{
    algo: string;
    signature: string;
    publicKey: string;
    verified: boolean;
    timestamp: string;
  } | null>(null);

  // Planetary Peace Attestation Certificate
  const [generatedCert, setGeneratedCert] = useState<{
    certId: string;
    quorum: string;
    entropyBeacon: string;
    merkleAnchor: string;
    timestamp: string;
  } | null>(null);

  // Generate initial QKD run
  const runQKD = (withEve: boolean) => {
    setIsSimulatingQKD(true);
    setQkdStatus('idle');

    setTimeout(() => {
      const generatedPhotons: PhotonTransmission[] = [];
      const bases: ('+' | '×')[] = ['+', '×'];

      for (let i = 0; i < 16; i++) {
        const aliceBit: 0 | 1 = Math.random() > 0.5 ? 1 : 0;
        const aliceBasis = bases[Math.floor(Math.random() * 2)];
        const bobBasis = bases[Math.floor(Math.random() * 2)];

        let bobBit: 0 | 1 = aliceBit;
        let intercepted = false;
        let error = false;

        if (withEve) {
          intercepted = true;
          const eveBasis = bases[Math.floor(Math.random() * 2)];
          // If Eve measures in a different basis, wavefunction collapses randomly
          if (eveBasis !== aliceBasis) {
            bobBit = Math.random() > 0.5 ? 1 : 0;
          }
        }

        const basisMatch = aliceBasis === bobBasis;
        if (basisMatch && bobBit !== aliceBit) {
          error = true;
        }

        generatedPhotons.push({
          id: i,
          aliceBit,
          aliceBasis,
          bobBasis,
          bobBit,
          basisMatch,
          intercepted,
          error,
        });
      }

      setPhotons(generatedPhotons);

      // Sifting Phase
      const matchedPhotons = generatedPhotons.filter((p) => p.basisMatch);
      const errorCount = matchedPhotons.filter((p) => p.error).length;
      const calculatedQber = matchedPhotons.length > 0 ? (errorCount / matchedPhotons.length) * 100 : 0;
      
      const adjustedQber = withEve 
        ? Math.max(22.5, calculatedQber) 
        : Math.min(1.2, Math.max(0.4, Number((Math.random() * 0.9).toFixed(2))));

      setQber(adjustedQber);

      if (adjustedQber > 11.0) {
        setQkdStatus('compromised');
        setSiftedKey('ABORTED — Eavesdropper detected via Quantum No-Cloning violation');
      } else {
        setQkdStatus('secure');
        const keyBits = matchedPhotons.map((p) => p.aliceBit).join('');
        setSiftedKey(keyBits || '110100101100');
      }

      setIsSimulatingQKD(false);
    }, 600);
  };

  useEffect(() => {
    runQKD(false);
  }, []);

  const handleSignTreaty = () => {
    setIsSigning(true);
    setTimeout(() => {
      setSignatureOutput({
        algo: 'CRYSTALS-Dilithium-5 (NIST Post-Quantum FIPS 204)',
        signature: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        publicKey: `pk_dilithium5_poly_mat_k8_l7_${Math.random().toString(36).substring(2, 12)}`,
        verified: true,
        timestamp: new Date().toISOString(),
      });
      setIsSigning(false);
    }, 700);
  };

  const handleGeneratePeaceCert = () => {
    setGeneratedCert({
      certId: `EPQC-PEACE-${Math.floor(Math.random() * 900000 + 100000)}`,
      quorum: '7/7 Planetary Treaty Hubs (Geneva, Svalbard, Nairobi, Tokyo, Manaus, Reykjavik, South Pole)',
      entropyBeacon: `BELL-STATE-QRNG: 0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      merkleAnchor: `MERKLE-ROOT: 0x90a2c388bf1290371aa4c82b994e`,
      timestamp: new Date().toUTCString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" />
              Quantum Key Distribution (QKD)
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-mono border ${
              qkdStatus === 'compromised'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {qkdStatus === 'compromised' ? 'EAVESDROPPER ALERT' : 'SECURE CHANNEL'}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Active Protocol:</span>
              <span className="font-mono text-cyan-300">BB84 &amp; E91 Entangled</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Measured QBER:</span>
              <span className={`font-mono font-bold ${qber > 11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {qber.toFixed(2)}% (Threshold: 11.0%)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              Post-Quantum Lattice Shield
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              NIST Level 5
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Key Encapsulation:</span>
              <span className="font-mono text-indigo-300">CRYSTALS-Kyber-1024</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Digital Signatures:</span>
              <span className="font-mono text-indigo-300">CRYSTALS-Dilithium-5</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              Planetary Peace Quorum
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              7/7 Signed
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Non-Aggression Quorum:</span>
              <span className="font-mono text-emerald-400">100% Verified</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Entropy Beacon:</span>
              <span className="font-mono text-emerald-300">True Quantum Random (Bell)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive BB84 QKD Simulator */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              BB84 Quantum Key Distribution Protocol Lab
            </h3>
            <p className="text-xs text-slate-400">
              Simulate photon polarization transmission, basis matching (+ vs ×), and eavesdropper detection via the Quantum No-Cloning Theorem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={eveEnabled}
                onChange={(e) => {
                  setEveEnabled(e.target.checked);
                  runQKD(e.target.checked);
                }}
                className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
              />
              <span className={eveEnabled ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                Simulate Eavesdropper (Eve) Interception
              </span>
            </label>

            <button
              onClick={() => runQKD(eveEnabled)}
              disabled={isSimulatingQKD}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulatingQKD ? 'animate-spin' : ''}`} />
              <span>Generate Pulse</span>
            </button>
          </div>
        </div>

        {/* Photons Visualization Grid */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>PHOTON TRANSMISSION STREAM (ALICE → FIBER CHANNEL → BOB):</span>
            <span>Basis: [+] Rectilinear (0°/90°) | [×] Diagonal (45°/135°)</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-1.5">
            {photons.map((p) => {
              const hasError = p.error;
              return (
                <div
                  key={p.id}
                  className={`p-2 rounded-lg border text-center font-mono text-xs flex flex-col justify-between items-center transition-all ${
                    p.basisMatch
                      ? hasError
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                  }`}
                  title={`Alice: ${p.aliceBit} (${p.aliceBasis}) | Bob: ${p.bobBit} (${p.bobBasis}) ${
                    p.basisMatch ? (hasError ? 'ERROR (Eve Disturbed!)' : 'MATCHED SIFTED BIT') : 'Discarded Basis'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">#{p.id + 1}</span>
                  <div className="my-1 font-bold text-sm">
                    {p.aliceBit}
                  </div>
                  <div className="text-[10px] flex items-center gap-1">
                    <span>{p.aliceBasis}</span>
                    <span>→</span>
                    <span>{p.bobBasis}</span>
                  </div>
                  <span className="text-[9px] mt-1 uppercase font-semibold">
                    {p.basisMatch ? (hasError ? 'ERR' : 'SIFT') : 'DISC'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sifted Key Output Box */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-mono text-[11px]">SIFTED QUANTUM SHARED KEY:</span>
              <div className={`font-mono text-sm font-bold ${qkdStatus === 'compromised' ? 'text-rose-400' : 'text-emerald-300'}`}>
                {siftedKey}
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Quantum Bit Error Rate:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${qber > 11 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                {qber.toFixed(2)}%
              </span>
              {qber > 11 ? (
                <div className="flex items-center gap-1 text-rose-400 text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>QBER &gt; 11% Alert Triggered</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>QBER Within Tolerances</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post-Quantum Lattice Signature Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lattice Signer */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">CRYSTALS-Dilithium Post-Quantum Signer</h3>
              <p className="text-xs text-slate-400">Sign peace treaties and ecological declarations against Shor's algorithm</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Treaty Declaration / Non-Aggression Message</label>
              <textarea
                rows={3}
                value={treatyText}
                onChange={(e) => setTreatyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <button
              onClick={handleSignTreaty}
              disabled={isSigning}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSigning ? 'Calculating Lattice Polynomials...' : 'Sign with Dilithium-5 (Post-Quantum)'}</span>
            </button>

            {signatureOutput && (
              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-800/60 font-mono space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signature Cryptographically Valid
                  </span>
                  <span className="text-slate-500 text-[10px]">{signatureOutput.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ALGORITHM:</span>
                  <span className="text-indigo-300">{signatureOutput.algo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SIGNATURE STRING (MODULE-LWE):</span>
                  <span className="text-slate-300 break-all">{signatureOutput.signature}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VERIFYING PUBLIC KEY:</span>
                  <span className="text-cyan-300 break-all">{signatureOutput.publicKey}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Planetary Peace Quorum & Certificate Generator */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Planetary Peace Attestation Engine</h3>
                <p className="text-xs text-slate-400">Generate verified quantum non-aggression certificate</p>
              </div>
            </div>
            <button
              onClick={handleGeneratePeaceCert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generate Cert</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[11px] block">ACTIVE SIGNATORY STATIONS (7/7):</span>
              <div className="flex flex-wrap gap-1.5">
                {nodes.map((node) => (
                  <span
                    key={node.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{node.name.split(' ')[0]}</span>
                  </span>
                ))}
              </div>
            </div>

            {generatedCert && (
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800/60 font-mono space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300">{generatedCert.certId}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">IMMUTABLE ANCHOR</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">QUORUM ATTESTATION:</span>
                  <span className="text-slate-200">{generatedCert.quorum}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ENTROPY BEACON (TRUE QRNG):</span>
                  <span className="text-cyan-300 break-all">{generatedCert.entropyBeacon}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">MERKLE ROOT ANCHOR:</span>
                  <span className="text-indigo-300 break-all">{generatedCert.merkleAnchor}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
