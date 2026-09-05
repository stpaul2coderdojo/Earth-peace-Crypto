import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google Gen AI client helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// ==========================================
// API Routes
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "Quantum Hybrid File System (QHFS) & Earth Peace Network",
    timestamp: new Date().toISOString(),
    version: "2.4.0-quantum-hybrid",
  });
});

// Planetary Telemetry API
app.get("/api/telemetry", (req, res) => {
  res.json({
    nodesOnline: 7,
    totalQubitsActive: 1284,
    globalEntanglementFidelity: 0.9984,
    averageQBER: "0.82%", // Quantum Bit Error Rate (well below 11% abort limit)
    totalCO2SequesteredTons: 428950.4,
    carbonCreditsIssued: 428950,
    carbonCreditsRetired: 187420,
    epqcPriceUsd: 14.82,
    cqbPriceUsd: 28.5,
    qramAllocatedGb: 512,
    postQuantumStorageTb: 1420.5,
    timestamp: Date.now(),
  });
});

// Quantum Circuit Simulation Engine (Server-side quantum computing simulator)
app.post("/api/execute-quantum-circuit", (req, res) => {
  try {
    const { numQubits = 3, gates = [], shots = 1024 } = req.body;
    const clampedQubits = Math.min(Math.max(Number(numQubits) || 2, 1), 6); // 1-6 qubits for responsive server compute
    const dim = 1 << clampedQubits;

    // Complex statevector representation: [re, im]
    type Complex = [number, number];
    let state: Complex[] = Array.from({ length: dim }, (_, i) => (i === 0 ? [1, 0] : [0, 0]));

    const mult = (c1: Complex, c2: Complex): Complex => [
      c1[0] * c2[0] - c1[1] * c2[1],
      c1[0] * c2[1] + c1[1] * c2[0],
    ];
    const add = (c1: Complex, c2: Complex): Complex => [c1[0] + c2[0], c1[1] + c2[1]];
    const sub = (c1: Complex, c2: Complex): Complex => [c1[0] - c2[0], c1[1] - c2[1]];
    const scale = (c: Complex, s: number): Complex => [c[0] * s, c[1] * s];

    const invSqrt2 = 1 / Math.SQRT2;

    // Apply standard quantum gates
    for (const g of gates) {
      const { type, target, control, angle = 0 } = g;
      const t = target;

      if (t < 0 || t >= clampedQubits) continue;

      const newState: Complex[] = Array.from({ length: dim }, () => [0, 0]);

      for (let i = 0; i < dim; i++) {
        const bitT = (i >> (clampedQubits - 1 - t)) & 1;
        const pairIndex = i ^ (1 << (clampedQubits - 1 - t));

        if (control !== undefined && control !== null && control >= 0 && control < clampedQubits) {
          const bitC = (i >> (clampedQubits - 1 - control)) & 1;
          if (bitC === 0) {
            newState[i] = add(newState[i], state[i]);
            continue;
          }
        }

        switch (type.toUpperCase()) {
          case "H": // Hadamard
            if (bitT === 0) {
              newState[i] = add(newState[i], scale(state[i], invSqrt2));
              newState[pairIndex] = add(newState[pairIndex], scale(state[i], invSqrt2));
            } else {
              newState[pairIndex] = add(newState[pairIndex], scale(state[i], invSqrt2));
              newState[i] = add(newState[i], scale(state[i], -invSqrt2));
            }
            break;
          case "X": // Pauli-X (NOT)
            newState[pairIndex] = add(newState[pairIndex], state[i]);
            break;
          case "Y": // Pauli-Y
            if (bitT === 0) {
              // Y|0> = i|1>
              newState[pairIndex] = add(newState[pairIndex], [-state[i][1], state[i][0]]);
            } else {
              // Y|1> = -i|0>
              newState[pairIndex] = add(newState[pairIndex], [state[i][1], -state[i][0]]);
            }
            break;
          case "Z": // Pauli-Z
            if (bitT === 0) {
              newState[i] = add(newState[i], state[i]);
            } else {
              newState[i] = add(newState[i], scale(state[i], -1));
            }
            break;
          case "S": // Phase Gate (diag(1, i))
            if (bitT === 0) {
              newState[i] = add(newState[i], state[i]);
            } else {
              newState[i] = add(newState[i], [-state[i][1], state[i][0]]);
            }
            break;
          case "T": // T gate (diag(1, e^{i pi / 4}))
            if (bitT === 0) {
              newState[i] = add(newState[i], state[i]);
            } else {
              const phase: Complex = [invSqrt2, invSqrt2];
              newState[i] = add(newState[i], mult(state[i], phase));
            }
            break;
          case "RZ": {
            const theta = Number(angle) || Math.PI / 2;
            const phase0: Complex = [Math.cos(-theta / 2), Math.sin(-theta / 2)];
            const phase1: Complex = [Math.cos(theta / 2), Math.sin(theta / 2)];
            if (bitT === 0) {
              newState[i] = add(newState[i], mult(state[i], phase0));
            } else {
              newState[i] = add(newState[i], mult(state[i], phase1));
            }
            break;
          }
          default:
            newState[i] = add(newState[i], state[i]);
            break;
        }
      }

      state = newState;
    }

    // Calculate probabilities
    const probabilities = state.map((c) => c[0] * c[0] + c[1] * c[1]);
    const totalProb = probabilities.reduce((a, b) => a + b, 0) || 1;
    const normalizedProbs = probabilities.map((p) => p / totalProb);

    // Monte Carlo sampling of shots
    const counts: Record<string, number> = {};
    for (let s = 0; s < shots; s++) {
      const rand = Math.random();
      let cum = 0;
      let outcome = 0;
      for (let i = 0; i < dim; i++) {
        cum += normalizedProbs[i];
        if (rand <= cum) {
          outcome = i;
          break;
        }
      }
      const bitStr = outcome.toString(2).padStart(clampedQubits, "0");
      counts[bitStr] = (counts[bitStr] || 0) + 1;
    }

    // Format state vector string
    const stateVectorFormatted = state.map((c, i) => {
      const bitStr = i.toString(2).padStart(clampedQubits, "0");
      const re = c[0].toFixed(4);
      const im = c[1].toFixed(4);
      const sign = c[1] >= 0 ? "+" : "-";
      return {
        basis: `|${bitStr}⟩`,
        re: c[0],
        im: c[1],
        amplitude: `${re} ${sign} ${Math.abs(c[1]).toFixed(4)}i`,
        probability: normalizedProbs[i],
      };
    });

    res.json({
      success: true,
      numQubits: clampedQubits,
      dim,
      stateVector: stateVectorFormatted,
      counts,
      shots,
      entropy: -normalizedProbs.reduce((acc, p) => (p > 1e-6 ? acc + p * Math.log2(p) : acc), 0),
    });
  } catch (error: any) {
    console.error("Circuit execution error:", error);
    res.status(500).json({ error: error.message || "Failed to execute quantum circuit" });
  }
});

// Gaia Quantum AI Assistant
app.post("/api/quantum-ai", async (req, res) => {
  const { prompt, mode = "general", context } = req.body;

  const systemInstructions = `You are Gaia-Quantum, the chief AI architect and quantum physicist for the Quantum Hybrid File System (QHFS), Earth Peace Quantum Cryptography (EPQC) network, and Carbon Credit Tokenomics ecosystem.
You possess deep technical expertise in:
1. Quantum computing (Qubit superposition, entanglement, QRAM indexing, Grover search algorithms, VQE for carbon capture catalysts, surface code error correction).
2. Quantum Hybrid File Systems (Tiering between QRAM state buffers and lattice-hardened Post-Quantum NVMe storage, Merkle-DAG verification, wavefunction collapse on observation).
3. Earth Peace Quantum Cryptography (BB84 / E91 QKD protocols, QBER threshold monitoring, CRYSTALS-Kyber key encapsulation, Dilithium signatures, planetary non-aggression verification).
4. Carbon Credit Exchange & Tokenomics (Verified Carbon Units / CQB token, AMM liquidity mechanics, Quantum Proof of Sequestration [QPoS], carbon retirement certificates).
5. Quantum Cloud Functions (Serverless quantum circuits, quantum transpilations, gate depth optimization).

Respond with structured, authoritative, scientifically rigorous, yet clear and actionable insights. Include mathematical notations where relevant (e.g. ket notation |ψ⟩, lattice dimensions, QBER formulas, or tokenomic equations).`;

  try {
    const ai = getAiClient();
    if (!ai) {
      // High-fidelity fallback response when GEMINI_API_KEY is not configured
      const fallbackAnalysis = generateFallbackQuantumResponse(prompt, mode, context);
      return res.json({
        response: fallbackAnalysis,
        model: "gaia-quantum-algorithmic-core (offline-fallback)",
        mode,
      });
    }

    const generatePromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemInstructions}\n\nTask Mode: ${mode}\nContext: ${JSON.stringify(context || {})}\nUser Query: ${prompt}`,
            },
          ],
        },
      ],
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API request timed out (fallback initiated)")), 6000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    const responseText = response.text || "Analysis complete.";
    res.json({
      response: responseText,
      model: "gemini-3.8-flash",
      mode,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Provide fallback if API call fails
    const fallbackAnalysis = generateFallbackQuantumResponse(prompt, mode, context);
    res.json({
      response: fallbackAnalysis,
      model: "gaia-quantum-algorithmic-fallback",
      error: error.message,
    });
  }
});

function generateFallbackQuantumResponse(prompt: string, mode: string, context: any): string {
  if (mode === "circuit-optimization") {
    return `### Quantum Circuit Analysis & Transpilation Recommendation
**Gate Depth Reduction & Decoherence Mitigation:**
1. **Circuit Depth Analysis**: For the active circuit, reducing T-gate depth and combining adjacent rotation gates ($R_z(\\theta_1) R_z(\\theta_2) = R_z(\\theta_1 + \\theta_2)$) reduces the physical decoherence exposure by approximately 34.2%.
2. **Entanglement Routing**: Swap CX topology to nearest-neighbor coupling grid to circumvent SWAP overhead in superconducting transmon or trapped-ion QPU nodes.
3. **Fidelity Estimation**: Projected circuit fidelity $F \\approx (1 - \\epsilon_1)^{N_1} (1 - \\epsilon_2)^{N_2} \\approx 99.41\\%$, maintaining state coherence well within the $T_1 = 120\\,\\mu\\text{s}$ envelope.`;
  }

  if (mode === "carbon-validation") {
    return `### Quantum Sequestration Telemetry & ESG Audit
**Verification Method: QPoS (Quantum Proof of Sequestration)**
- **Sensor Telemetry**: Spectral LIDAR and atmospheric quantum cascade laser absorption data confirm a net negative carbon sequestration flux of $+1.42\\,\\text{tCO}_2\\text{e} / \\text{ha} / \\text{day}$.
- **Cryptographic Attestation**: The carbon batch has been hashed with a lattice-based Dilithium-5 signature and tied to Merkle root \`0x7f2a...98e1\`.
- **Double-Counting Prevention**: The Quantum Hybrid File System maintains an immutable entanglement index; each metric ton is represented by a non-fungible qubit-state proof that collapses upon redemption/burn.`;
  }

  if (mode === "crypto-audit") {
    return `### Post-Quantum & QKD Cryptographic Assessment
**Earth Peace Security Protocol Status:**
1. **BB84 / E91 Protocol**: Current Quantum Bit Error Rate (QBER) is measured at **0.82%**, significantly beneath the theoretical eavesdropping threshold of **11.0%**. No active photon-number-splitting (PNS) attacks detected.
2. **Lattice Encapsulation**: CRYSTALS-Kyber-1024 provides 256 bits of classical and post-quantum quantum-resistant security against both Grover search and Shor's period-finding algorithms.
3. **Peace Consensus**: 7 of 7 planetary nodes have verified mutual non-aggression and environmental preservation signatures via verifiable secret sharing.`;
  }

  return `### Gaia Quantum Hybrid System Synthesis
**Core System State:**
- **QHFS Storage Tiering**: 512 GB in high-coherence QRAM (Tier 0) hosting superposition file indices with average coherence time $T_2^* = 85\\,\\mu\\text{s}$. 1,420 TB preserved on Post-Quantum Kyber-1024 NVMe storage.
- **Planetary Carbon Ledger**: Active liquidity pool \`$EPQC / $CQB\` operating with automated invariant $k = x \\cdot y$. 428,950 Verified Carbon Units anchored in quantum state registries.
- **Quantum Cloud Functions (QCF)**: Serverless quantum dispatch ready. Grover search algorithms demonstrate $\\mathcal{O}(\\sqrt{N})$ query speedup across 1.2M hybrid file descriptors.`;
}

// ==========================================
// Vite Middleware & Static Serving
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quantum Hybrid Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
