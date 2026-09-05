export type StorageTier = 'QRAM Superposition' | 'Entangled Nodes' | 'Post-Quantum Cryo-NVMe';

export interface QChunk {
  id: string;
  index: number;
  hash: string;
  sizeBytes: number;
  storedOnNodeId: string;
  tier: StorageTier;
}

export interface QFile {
  id: string;
  name: string;
  sizeBytes: number;
  tier: StorageTier;
  quantumState: 'Superposition |ψ⟩' | 'Entangled |Φ⁺⟩' | 'Collapsed (Classical)' | 'Stabilizer Protected';
  qubitsRequired: number;
  coherenceTimeRemainingMs: number;
  maxCoherenceTimeMs: number;
  merkleProof: string;
  latticeHash: string;
  category: 'climate-telemetry' | 'quantum-code' | 'carbon-registry' | 'peace-treaty' | 'encrypted-state';
  contentPreview: string;
  entangledPairId?: string;
  lastObserved?: string;
  isObserved: boolean;
  // IPFS & Planetary Node Pinning
  qcid: string; // Quantum Content Identifier (QCID: bafyq...)
  pinnedNodes: string[]; // List of PeaceNode IDs storing this file
  chunks?: QChunk[];
  mimeType?: string;
  uploadedAt?: string;
  downloadData?: string; // Data URL or text representation for client retrieval/download
}

export interface PeaceNode {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: { x: number; y: number }; // percentage on world map
  qubits: number;
  qber: number; // Quantum bit error rate (e.g. 0.8%)
  status: 'Entangled & Active' | 'Synchronizing' | 'Standby';
  lastPing: string;
  entangledWith: string[];
  signatureProof: string;
  storageUsedGb: number;
  storageCapacityGb: number;
  pinnedFileIds: string[];
  bandwidthMbps: number;
}

export interface PhotonTransmission {
  id: number;
  aliceBit: 0 | 1;
  aliceBasis: '+' | '×';
  bobBasis: '+' | '×';
  bobBit: 0 | 1;
  basisMatch: boolean;
  intercepted: boolean;
  error: boolean;
}

export interface CarbonProject {
  id: string;
  name: string;
  type: 'Rainforest Canopy' | 'Oceanic Blue Carbon' | 'Direct Air Mineralization' | 'Quantum Agroforestry';
  region: string;
  verifiedTons: number;
  availableTons: number;
  priceUsd: number;
  sequestrationRate: string;
  qposAttestation: string;
  sensorFidelity: number;
  coordinates: string;
}

export interface RetirementCertificate {
  certificateId: string;
  projectName: string;
  tonsRetired: number;
  retiredBy: string;
  timestamp: string;
  quantumHashProof: string;
  merkleRoot: string;
  co2OffsetDescription: string;
}

export interface QuantumGate {
  id: string;
  type: 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CX' | 'RZ' | 'SWAP';
  target: number;
  control?: number;
  angle?: number;
}

export interface QCloudFunction {
  id: string;
  name: string;
  description: string;
  trigger: 'HTTP Webhook' | 'QHFS File Write' | 'Carbon Credit Mint' | 'Planetary Heartbeat';
  qubits: number;
  gates: QuantumGate[];
  runtimeEnv: 'Qiskit / Micro-QPU' | 'Cirq Hybrid' | 'Native Quantum Statevector';
  runsCount: number;
  avgLatencyMs: number;
  lastRunStatus: 'Success' | 'Decoherence Abort' | 'Ready';
  lastRunAt?: string;
}

export interface ExecutionResult {
  numQubits: number;
  dim: number;
  stateVector: Array<{
    basis: string;
    re: number;
    im: number;
    amplitude: string;
    probability: number;
  }>;
  counts: Record<string, number>;
  shots: number;
  entropy: number;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'gaia' | 'system';
  text: string;
  timestamp: string;
  mode?: string;
  model?: string;
}
