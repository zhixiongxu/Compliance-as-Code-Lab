/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Play,
  Copy,
  AlertCircle,
  Menu,
  X,
  Code2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TUTORIAL_MODULES } from './constants';
import { TutorialModule, ControlStep } from './types';

// Simple code highlighter component
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-sm overflow-hidden bg-black border border-white/5 my-4">
      <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{language}</span>
        <button 
          onClick={copyToClipboard}
          className="text-[10px] uppercase text-slate-500 hover:text-white transition-colors flex items-center gap-2"
        >
          {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-slate-400">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Terminal Simulator component
const TerminalSim = ({ command, expectedOutput, onExecute }: { command: string; expectedOutput?: string, onExecute: () => void }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [hasExecuted, setHasExecuted] = useState(false);

  const runCommand = () => {
    setIsExecuting(true);
    setOutput([]);
    
    let lines = [
      `$ ${command}`,
      "[INFO] Initializing compliance handshake...",
      "[INFO] Found 14 active policy definitions.",
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setOutput(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (expectedOutput) {
            setOutput(prev => [...prev, `[OK] ${expectedOutput}`]);
          }
          setIsExecuting(false);
          setHasExecuted(true);
          onExecute();
        }, 800);
      }
    }, 400);
  };

  return (
    <div className="bg-black border border-white/10 rounded-sm shadow-2xl overflow-hidden my-4 min-h-[220px] flex flex-col">
      <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-4">
          <span>Output Terminal</span>
          <div className="flex gap-4">
            <span>STDOUT</span>
            <span>34.2kb</span>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 font-mono text-xs text-slate-500 space-y-1 overflow-y-auto max-h-[300px]">
        {output.length === 0 && !hasExecuted && (
          <div className="text-slate-600 italic flex items-center gap-2">
            <span className="w-1 h-3 bg-emerald-500/50"></span>
            <span>_ listening for instructions</span>
          </div>
        )}
        <div className="space-y-1.5">
          {output.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-emerald-500' : line.includes('[OK]') ? 'text-emerald-400' : 'text-slate-500'}>
              {line}
            </div>
          ))}
          {isExecuting && (
            <div className="flex items-center gap-2">
              <span className="animate-pulse w-1 h-3 bg-emerald-500"></span>
              <span className="text-slate-600">_ executing mission critical policy</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 bg-black border-t border-white/5 flex justify-end px-4">
        <button 
          onClick={runCommand}
          disabled={isExecuting || hasExecuted}
          className={`px-6 py-1.5 rounded-sm text-[10px] font-bold tracking-widest transition-all ${
            hasExecuted 
              ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
              : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 active:scale-95'
          }`}
        >
          {hasExecuted ? 'INITIALIZATION_SUCCESS' : 'EXECUTE_POLICY'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedModule, setSelectedModule] = useState<TutorialModule | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progression, setProgression] = useState<Record<string, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentStep = selectedModule?.steps[currentStepIndex];
  const isLastStep = selectedModule ? currentStepIndex === selectedModule.steps.length - 1 : false;

  const handleNext = () => {
    if (selectedModule && currentStepIndex < selectedModule.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      const newIndex = currentStepIndex + 1;
      if (newIndex > (progression[selectedModule.id] || 0)) {
        setProgression({ ...progression, [selectedModule.id]: newIndex });
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetToHome = () => {
    setSelectedModule(null);
    setCurrentStepIndex(0);
    setIsSidebarOpen(false);
  };

  const selectModule = (mod: TutorialModule) => {
    setSelectedModule(mod);
    setCurrentStepIndex(0);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
          <div 
            className="flex items-center gap-6 cursor-pointer group"
            onClick={resetToHome}
          >
            <div className="text-white font-serif italic text-xl tracking-tighter">
              C-Code <span className="text-emerald-500">.</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20"></div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Compliance / Infrastructure Sentinel</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Environment Ready
            </div>
            <button 
              className="md:hidden p-2 text-slate-400"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 flex flex-col relative z-20">
        {!selectedModule ? (
          <div className="px-8 py-12 max-w-7xl mx-auto w-full flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase mb-4">Laboratory Access Granted</div>
                <h1 className="text-5xl md:text-6xl font-serif italic text-white tracking-tight">
                  Sophisticated <span className="text-slate-500 underline decoration-emerald-500/30 underline-offset-8">Integrity</span> Systems
                </h1>
                <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed mt-6">
                  Transform regulation into executable code. Our interactive modules guide you through the modern landscape of Compliance as Code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TUTORIAL_MODULES.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => selectModule(mod)}
                    className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-sm hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col h-full"
                  >
                    <div className="space-y-4 relative z-10 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${
                          mod.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                          mod.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                          'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                        }`}>
                          {mod.difficulty}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">{mod.estimatedTime}</span>
                      </div>

                      <h3 className="text-lg font-serif italic text-white group-hover:text-emerald-400 transition-colors">{mod.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{mod.description}</p>
                    </div>
                    
                    <div className="pt-8 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-all">
                      Initialize Module <ArrowRight size={14} className="text-emerald-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
            {/* Sidebar: Steps */}
            <aside className="hidden lg:flex w-72 border-r border-white/10 bg-[#080808] flex-col shrink-0">
              <div className="p-8 flex-1 overflow-y-auto">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8 border-b border-white/5 pb-2">Module Progress</h3>
                <div className="space-y-2">
                  {selectedModule.steps.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStepIndex(i)}
                      className={`w-full flex items-center gap-4 p-4 rounded-sm transition-all text-left group ${
                        currentStepIndex === i 
                          ? 'bg-white/5 border border-white/10 text-white' 
                          : i <= (progression[selectedModule.id] || 0)
                            ? 'text-slate-400 hover:bg-white/[0.03]'
                            : 'text-slate-600 cursor-not-allowed'
                      }`}
                      disabled={i > (progression[selectedModule.id] || 0) && i !== currentStepIndex}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-mono transition-colors ${
                        i < currentStepIndex || (i <= (progression[selectedModule.id] || 0) && i !== currentStepIndex)
                          ? 'border-emerald-500 bg-emerald-500 text-black' 
                          : currentStepIndex === i
                            ? 'border-emerald-500 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                            : 'border-slate-800 text-slate-600'
                      }`}>
                        {i < currentStepIndex || (i <= (progression[selectedModule.id] || 0) && i !== currentStepIndex) ? <CheckCircle2 size={12} strokeWidth={3} /> : (i + 1).toString().padStart(2, '0')}
                      </div>
                      <span className={`text-xs truncate ${currentStepIndex === i ? 'font-bold' : ''}`}>{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-8 border-t border-white/5 bg-black/20">
                 <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">Module Mastery</div>
                 <div className="text-3xl font-serif text-white italic">
                  {Math.round(((currentStepIndex + 1) / selectedModule.steps.length) * 100)}
                  <span className="text-xs text-slate-500 ml-1 italic font-sans">%</span>
                 </div>
                 <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                   <motion.div 
                    className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIndex + 1) / selectedModule.steps.length) * 100}%` }}
                   />
                 </div>
              </div>
            </aside>

            {/* Tutorial Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111,_#050505)]">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <header>
                      <div className="text-emerald-500 text-[10px] font-mono mb-4 tracking-tighter uppercase font-bold">
                        STEP {(currentStepIndex + 1).toString().padStart(2, '0')} / {selectedModule.id.toUpperCase()}
                      </div>
                      <h1 className="text-5xl font-serif text-white mb-6 italic tracking-tight">{currentStep?.title}</h1>
                      <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
                        {currentStep?.description}
                      </p>
                    </header>

                    <div className="space-y-8">
                      {currentStep?.codeSnippet && (
                        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Instructional Payload</span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-sm border border-emerald-500/20 font-bold uppercase tracking-widest">Required</span>
                          </div>
                          <CodeBlock 
                            code={currentStep.codeSnippet} 
                            language={currentStep.language || 'text'} 
                          />
                        </div>
                      )}

                      {currentStep?.command && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Terminal size={12} className="text-emerald-500" />
                            Security Console
                          </div>
                          <TerminalSim 
                            command={currentStep.command} 
                            expectedOutput={currentStep.expectedOutput}
                            onExecute={() => {
                              if (currentStepIndex >= (progression[selectedModule.id] || 0)) {
                                setProgression({ ...progression, [selectedModule.id]: currentStepIndex + 1 });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <footer className="pt-12 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest transition-all ${
                          currentStepIndex === 0 
                            ? 'text-slate-700 cursor-not-allowed' 
                            : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        <ChevronLeft size={16} />
                        PREVIOUS STAGE
                      </button>

                      <div className="flex items-center gap-4">
                        {isLastStep ? (
                          <button
                            onClick={resetToHome}
                            className="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                          >
                            Complete Training
                            <CheckCircle2 size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            className="flex items-center gap-3 px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-sm font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
                          >
                            Next Challenge
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </footer>
                  </motion.div>
                </AnimatePresence>
                
                {/* Secondary Status info */}
                <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-sm flex items-start gap-4">
                  <AlertCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Intelligence Note</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Automated integrity checks are the cornerstone of a secure CI/CD pipeline. Ensure your Rego policies are version-controlled alongside your infrastructure code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-8 bg-black border-t border-white/10 flex items-center px-8 justify-between text-[9px] text-slate-600 font-mono tracking-wider relative z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SESSION: {selectedModule ? `LAB-${selectedModule.id.toUpperCase()}` : 'IDLE_INIT'}
          </div>
          <span className="hidden sm:inline">LATENCY: 14ms</span>
          <span className="hidden md:inline">VERSION: STABLE_1.4.0</span>
        </div>
        <div className="uppercase italic tracking-[0.3em]">Sophisticated Integrity Systems</div>
      </footer>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="text-white font-serif italic text-xl tracking-tighter">C-Code <span className="text-emerald-500">.</span></div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500"><X /></button>
              </div>
              <nav className="flex flex-col gap-8">
                <button 
                  onClick={resetToHome} 
                  className="text-left text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 flex items-center gap-4"
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                  Courses
                </button>
                <button className="text-left text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 flex items-center gap-4">
                  <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                  Documentation
                </button>
                <button className="text-left text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 flex items-center gap-4">
                  <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                  Playground
                </button>
              </nav>
              
              {selectedModule && (
                <div className="mt-auto space-y-6">
                   <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-2">Steps</h3>
                   <div className="space-y-4">
                     {selectedModule.steps.map((step, i) => (
                       <button
                        key={step.id}
                        onClick={() => {
                          setCurrentStepIndex(i);
                          setIsSidebarOpen(false);
                        }}
                        className={`text-xs block ${currentStepIndex === i ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}
                       >
                         {i + 1}. {step.title}
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

