import React from 'react';
import AgentChat from './components/AgentChat';

function App() {
  return (
    <div className="flex h-screen w-full bg-transparent text-github-text overflow-hidden font-sans items-center justify-center relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-github-orange/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="w-full h-full md:h-[90vh] md:w-[800px] md:rounded-2xl md:border md:border-github-orange/30 md:shadow-[0_0_50px_-12px_rgba(255,140,66,0.15)] bg-github-dark/95 backdrop-blur-xl flex flex-col overflow-hidden relative z-10 transition-all duration-500 hover:border-github-orange/50 hover:shadow-[0_0_60px_-10px_rgba(255,140,66,0.25)]">
        <div className="p-4 border-b border-github-border flex items-center justify-between bg-github-dark/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-github-green animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-github-green animate-ping opacity-20"></div>
            </div>
            <span className="font-semibold text-github-text tracking-wide">
              Agent CV <span className="text-github-orange">Assistant</span>
            </span>
          </div>
          <div className="text-xs text-github-muted font-mono bg-github-orange/10 px-2 py-0.5 rounded-full border border-github-orange/20">v1.0.0</div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AgentChat />
        </div>
      </div>
    </div>
  );
}

export default App;
