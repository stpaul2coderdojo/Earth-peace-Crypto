# IPFS Storage & Planetary Node Pinning Guide

## 1. Overview of Content-Addressed Quantum Storage

Traditional cloud file systems locate files by hierarchical paths or IP addresses (location addressing). In contrast, the **Quantum Hybrid File System (QHFS)** employs **Content-Addressed Storage (CAS)** compatible with the InterPlanetary File System (IPFS) standard, enhanced with quantum state proofs.

Every file uploaded to the network is addressed by a **Quantum Content Identifier (QCID)**.

---

## 2. Quantum Content Identifier (QCID) Format

A QCID is generated using the CIDv1 multiformats standard:

```
QCID Specification:
bafy2bzace [Multicodec: raw/dag-pb] [Multihash: sha2-256 + Kyber-1024] [Checksum]
Example:
bafy2bzaceq3k7a9f82m1v0x4e6w8z2p5t9y1u3o7i4l6d8s0a2c4e6g8j0m
```

### Components:
- **Base Prefix**: `bafy` indicates CIDv1 encoded in base32 lowercase.
- **Payload Hash**: Cryptographic digest of the raw classical bytes.
- **Quantum State Vector Header**: Contains the state amplitudes $(\alpha, \beta)$, basis orientation, and qubit allocation requirement.
- **Lattice Signature**: Embedded CRYSTALS-Dilithium-5 consensus stamp.

---

## 3. Planetary Node Pinning Architecture

When a file is uploaded, the user selects which physical quantum nodes on the planetary mesh will **pin** the file. Pinned files remain durably accessible even if other nodes go offline or enter cryogenic maintenance cycles.

### Planetary Stations:
| Node ID | Location | Coordinates | Specialty |
| :--- | :--- | :--- | :--- |
| `node-geneva` | Geneva, Switzerland (CERN) | $46.2^\circ\text{N}, 6.1^\circ\text{E}$ | QRAM Primary Superposition Anchor |
| `node-svalbard` | Svalbard, Norway (Arctic Vault) | $78.2^\circ\text{N}, 15.6^\circ\text{E}$ | Cryo-NVMe Permanent Deep Freeze |
| `node-tokyo` | Tokyo, Japan (RIKEN QPU) | $35.7^\circ\text{N}, 139.7^\circ\text{E}$ | Ultra-High-Speed Surface Code QEC |
| `node-atacama` | Atacama, Chile (ALMA Plateau) | $23.0^\circ\text{S}, 67.8^\circ\text{W}$ | Free-Space Optical Satellite QKD Uplink |
| `node-boulder` | Boulder, USA (NIST Campus) | $40.0^\circ\text{N}, 105.3^\circ\text{W}$ | Atomic Clock Synchronization & Beacon |
| `node-singapore` | Singapore (Quantum Tech Hub) | $1.3^\circ\text{N}, 103.8^\circ\text{E}$ | High-Bandwidth Asia-Pacific Mesh Node |

---

## 4. Quantum Bitswap Replication Protocol

The network uses a quantum-augmented Bitswap protocol for file replication:
1. **Want-List Broadcast**: A node requiring file `bafy...` announces its want-list across entangled Bell channels.
2. **Entangled Teleportation vs Bit Transfer**:
   - For classical payloads: High-throughput laser optical classical transfer ($> 1\,\text{Gbps}$).
   - For coherent quantum states: Bell-pair consumption with classical basis transmission.
3. **Pin Confirmation**: The receiving node verifies the Merkle proof, updates its local allocation table, and broadcasts a signed pin receipt.
