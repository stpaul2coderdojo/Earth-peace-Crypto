/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QHFSExplorer } from './components/qhfs/QHFSExplorer';
import { EarthPeaceCrypto } from './components/crypto/EarthPeaceCrypto';
import { CarbonCreditExchange } from './components/carbon/CarbonCreditExchange';
import { QuantumCloudFunctions } from './components/cloudfunctions/QuantumCloudFunctions';
import { GlobalNodeMesh } from './components/nodes/GlobalNodeMesh';
import { GaiaAiCopilot } from './components/copilot/GaiaAiCopilot';
import { DocsAndVideos } from './components/docs/DocsAndVideos';
import { 
  INITIAL_FILES, 
  PEACE_NODES, 
  CARBON_PROJECTS, 
  PREBUILT_FUNCTIONS 
} from './data/quantumSystemData';
import { QFile, CarbonProject, RetirementCertificate } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('qhfs');

  // Core domain states
  const [files, setFiles] = useState<QFile[]>(INITIAL_FILES);
  const [nodes, setNodes] = useState(PEACE_NODES);
  const [projects, setProjects] = useState(CARBON_PROJECTS);
  const [functions, setFunctions] = useState(PREBUILT_FUNCTIONS);

  // User balances
  const [epqcBalance, setEpqcBalance] = useState<number>(1420.5);
  const [cqbBalance, setCqbBalance] = useState<number>(450.0);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    coherenceAvg: '85.4 μs',
    totalQubits: 1284,
    qber: '0.82%',
    co2Sequestered: 428950,
  });

  // Active Decoherence Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.tier === 'Post-Quantum Cryo-NVMe' || file.isObserved) {
            return file;
          }
          // Decrease coherence slightly
          const newCoherence = Math.max(0, file.coherenceTimeRemainingMs - 1200);
          return {
            ...file,
            coherenceTimeRemainingMs: newCoherence,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handlers for QHFS operations
  const handleAddFile = (newFile: QFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleObserveFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const isCollapsed = !f.isObserved;
          return {
            ...f,
            isObserved: isCollapsed,
            quantumState: isCollapsed ? 'Collapsed (Classical)' : 'Superposition |ψ⟩',
            lastObserved: 'Just now',
          };
        }
        return f;
      })
    );
  };

  const handleRefreshQEC = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            coherenceTimeRemainingMs: f.maxCoherenceTimeMs,
            quantumState: 'Stabilizer Protected',
          };
        }
        return f;
      })
    );
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        pinnedFileIds: (n.pinnedFileIds || []).filter((fId) => fId !== id),
      }))
    );
  };

  const handleTogglePinFile = (fileId: string, nodeId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const currentPins = f.pinnedNodes || [];
          const isPinned = currentPins.includes(nodeId);
          const nextPins = isPinned
            ? currentPins.filter((id) => id !== nodeId)
            : [...currentPins, nodeId];
          return { ...f, pinnedNodes: nextPins };
        }
        return f;
      })
    );

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const currentFileIds = n.pinnedFileIds || [];
          const hasFile = currentFileIds.includes(fileId);
          const nextFileIds = hasFile
            ? currentFileIds.filter((id) => id !== fileId)
            : [...currentFileIds, fileId];
          return { ...n, pinnedFileIds: nextFileIds };
        }
        return n;
      })
    );
  };

  // Handlers for Carbon & Tokenomics
  const handleSwap = (fromToken: 'EPQC' | 'CQB', fromAmount: number, toAmount: number) => {
    if (fromToken === 'EPQC') {
      setEpqcBalance((prev) => prev - fromAmount);
      setCqbBalance((prev) => prev + toAmount);
    } else {
      setCqbBalance((prev) => prev - fromAmount);
      setEpqcBalance((prev) => prev + toAmount);
    }
  };

  const handleRetireCredits = (
    tons: number,
    project: CarbonProject,
    cert: RetirementCertificate
  ) => {
    setCqbBalance((prev) => Math.max(0, prev - tons));
    setTelemetry((prev) => ({
      ...prev,
      co2Sequestered: prev.co2Sequestered + tons,
    }));
    // Also record an immutable proof file in the QHFS post-quantum tier!
    const retirementProofFile: QFile = {
      id: `qhfs-offset-${Date.now().toString(36)}`,
      name: `offset_cert_${cert.certificateId.toLowerCase()}.qproof`,
      qcid: `bafy2bzacecarbonoffset${Date.now().toString(36)}`,
      pinnedNodes: ['node-geneva', 'node-svalbard'],
      sizeBytes: 42000,
      tier: 'Post-Quantum Cryo-NVMe',
      quantumState: 'Stabilizer Protected',
      qubitsRequired: 4,
      coherenceTimeRemainingMs: 3600000,
      maxCoherenceTimeMs: 3600000,
      merkleProof: cert.merkleRoot,
      latticeHash: cert.quantumHashProof,
      category: 'carbon-registry',
      contentPreview: `Permanent retirement of ${tons} tCO2e issued in honor of ${cert.retiredBy}. Project: ${project.name}.`,
      isObserved: true,
      lastObserved: 'Just now',
    };
    setFiles((prev) => [retirementProofFile, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header & Telemetry Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        epqcBalance={epqcBalance}
        cqbBalance={cqbBalance}
        telemetry={telemetry}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'qhfs' && (
          <QHFSExplorer
            files={files}
            nodes={nodes}
            onAddFile={handleAddFile}
            onObserveFile={handleObserveFile}
            onRefreshQEC={handleRefreshQEC}
            onDeleteFile={handleDeleteFile}
            onTogglePinFile={handleTogglePinFile}
          />
        )}

        {activeTab === 'crypto' && (
          <EarthPeaceCrypto nodes={nodes} />
        )}

        {activeTab === 'carbon' && (
          <CarbonCreditExchange
            projects={projects}
            epqcBalance={epqcBalance}
            cqbBalance={cqbBalance}
            onSwap={handleSwap}
            onRetireCredits={handleRetireCredits}
          />
        )}

        {activeTab === 'qcf' && (
          <QuantumCloudFunctions functions={functions} />
        )}

        {activeTab === 'mesh' && (
          <GlobalNodeMesh
            nodes={nodes}
            files={files}
            onAddFile={handleAddFile}
            onTogglePinFile={handleTogglePinFile}
          />
        )}

        {activeTab === 'docs' && (
          <DocsAndVideos />
        )}

        {activeTab === 'gaia' && (
          <GaiaAiCopilot />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-slate-400 font-semibold">QHFS &amp; Earth Peace Quantum Network</span>
            <span className="mx-2 text-slate-700">•</span>
            <span>Post-Quantum Lattice Shield (Kyber-1024 / Dilithium-5)</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>BB84 QKD: 0.82% QBER</span>
            <span>•</span>
            <span className="text-emerald-400">CQB Carbon Peg: 1:1 tCO₂e</span>
            <span>•</span>
            <span className="text-cyan-400">QCF QPU: 1024-Shot Statevector</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
