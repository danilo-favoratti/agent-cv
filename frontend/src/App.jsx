import React from 'react';
import AgentChat from './components/AgentChat';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans items-center justify-center">
      <div className="w-full h-full md:h-[90vh] md:w-[800px] md:rounded-2xl md:border md:border-slate-800 md:shadow-2xl bg-slate-900/95 backdrop-blur flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-20"></div>
            </div>
            <span className="font-semibold text-slate-200 tracking-wide">Agent CV Assistant</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">v1.0.0</div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AgentChat />
        </div>
      </div>
    </div>
  );
}

export default App;
