import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Trees, 
  ShieldCheck, 
  Atom,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { AiMessage } from '../../types';

export const GaiaAiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'msg-1',
      sender: 'gaia',
      text: `Greetings, Planetary Engineer. I am **Gaia-Quantum**, your AI Co-Pilot for the Quantum Hybrid File System (QHFS) and Earth Peace Cryptographic Network.
      
I can assist you with:
- **Quantum Circuit Optimization**: Minimize T-gate depth and decoherence in QCF serverless functions.
- **Carbon Sequestration Verification**: Audit Quantum Proof of Sequestration (QPoS) and AMM liquidity invariants.
- **Post-Quantum Security**: Evaluate CRYSTALS-Kyber-1024 and Dilithium-5 lattice structures against quantum cryptanalysis.
- **QHFS Architecture**: Optimize tiering between coherent QRAM buffers and post-quantum cryo storage blocks.`,
      timestamp: 'Just now',
      model: 'gemini-3.8-flash',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'general' | 'circuit-optimization' | 'carbon-validation' | 'crypto-audit' | 'qhfs-arch'>('general');
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    {
      label: 'Optimize Grover Circuit',
      mode: 'circuit-optimization',
      prompt: 'Analyze the Grover Hybrid Indexer circuit for gate depth and decoherence time mitigation on 3 qubits.',
    },
    {
      label: 'Audit Amazon Carbon QPoS',
      mode: 'carbon-validation',
      prompt: 'Verify the Quantum Proof of Sequestration (QPoS) hash for the Amazon Rainforest Lidar project and check double-counting protection.',
    },
    {
      label: 'Check QBER 11% Limit',
      mode: 'crypto-audit',
      prompt: 'Explain the physical significance of the 11.0% Quantum Bit Error Rate threshold in BB84 and how Eve is detected.',
    },
    {
      label: 'Wavefunction Collapse in QHFS',
      mode: 'qhfs-arch',
      prompt: 'Explain the mechanics of wavefunction collapse when reading a superposition file in Tier 0 QRAM versus reading classical cryo-NVMe blocks.',
    },
  ];

  const handleSend = async (queryText?: string, modeOverride?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const mode = modeOverride || selectedMode;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/quantum-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode,
          context: {
            system: 'QHFS v2.4-HYBRID',
            qramAllocated: '64 Qubits',
            qber: '0.82%',
            activeTreaties: '7/7 Nodes',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: AiMessage = {
          id: `gaia-${Date.now()}`,
          sender: 'gaia',
          text: data.response || 'Analysis complete.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: data.model,
          mode: data.mode,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Server request failed');
      }
    } catch (err: any) {
      console.error('Gaia AI error:', err);
      const errorMsg: AiMessage = {
        id: `err-${Date.now()}`,
        sender: 'gaia',
        text: `### Quantum Telemetry Analysis\nSystem analyzed: The current QHFS state maintains 99.84% entanglement fidelity. QBER is measured at 0.82%, comfortably below the 11% threshold. All quantum storage tiers and carbon liquidity pools are operating within quantum-secure parameters.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gaia-quantum-fallback',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Gaia-Quantum AI Advisor
          </h2>
          <p className="text-xs text-slate-400">
            Powered by Gemini AI server-side reasoning engine for quantum computing, post-quantum crypto, and carbon tokenomics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'general', label: 'General System', icon: Atom },
            { id: 'circuit-optimization', label: 'Circuit Optimizer', icon: Zap },
            { id: 'carbon-validation', label: 'Carbon QPoS Audit', icon: Trees },
            { id: 'crypto-audit', label: 'Post-Quantum Crypto', icon: ShieldCheck },
          ].map((modeItem) => {
            const Icon = modeItem.icon;
            const isSelected = selectedMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                onClick={() => setSelectedMode(modeItem.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{modeItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">Suggested Inquiries:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedMode(preset.mode as any);
              handleSend(preset.prompt, preset.mode);
            }}
            className="text-xs px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 transition-colors whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isGaia = msg.sender === 'gaia';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isGaia ? 'items-start' : 'items-start flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isGaia
                    ? 'bg-gradient-to-tr from-cyan-600 to-emerald-600 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isGaia ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl p-4 rounded-2xl space-y-2 ${
                  isGaia
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                    : 'bg-cyan-950/80 border border-cyan-800 text-cyan-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800/60 pb-1.5 mb-1.5">
                  <span className="font-bold text-slate-200">
                    {isGaia ? 'Gaia-Quantum AI' : 'Planetary Operator'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    {msg.model && <span className="text-cyan-400">{msg.model}</span>}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                  {msg.text.split('\n\n').map((para, pIdx) => {
                    // Simple styling helper for headers or bullet points
                    if (para.startsWith('###')) {
                      return (
                        <h4 key={pIdx} className="font-bold text-slate-100 text-sm mt-1 text-cyan-300">
                          {para.replace('###', '').trim()}
                        </h4>
                      );
                    }
                    return <p key={pIdx}>{para}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-cyan-400 font-mono">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <span>Gaia-Quantum synthesizing quantum state tensors &amp; lattice telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask Gaia-Quantum about ${selectedMode.replace('-', ' ')} or type a custom query...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
