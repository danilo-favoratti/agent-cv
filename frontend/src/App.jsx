import React from 'react';
import AgentChat from './components/AgentChat';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Main Content Area - Looking like a sophisticated dashboard/CV */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Interactive <span className="text-blue-500">Curriculum Vitae</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Welcome to my portfolio. This interface is powered by a custom ReAct agent system.
            Use the panel on the right to inquire about my professional background, technical skills, and project history.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-900/50 transition-colors group">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-pulse"></span>
              Technical Experience
            </h2>
            <div className="h-40 bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-slate-500 overflow-hidden">
              def build_scalable_systems():<br />
              &nbsp;&nbsp;stack = ["Python", "React", "Docker"]<br />
              &nbsp;&nbsp;cloud = "AWS"<br />
              &nbsp;&nbsp;return "High Performance"<br />
              ...
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-900/50 transition-colors group">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 group-hover:animate-pulse"></span>
              Projects & Portfolios
            </h2>
            <div className="h-40 bg-slate-950/50 rounded-lg flex items-center justify-center text-slate-600">
              [Project Data Visualization Placeholder]
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
          <h3 className="text-xl font-semibold mb-4 text-slate-300">System Architecture</h3>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">FastAPI Backend</div>
            <span className="text-slate-600">→</span>
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">ReAct Agent</div>
            <span className="text-slate-600">→</span>
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">WebSocket Stream</div>
            <span className="text-slate-600">→</span>
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">React Frontend</div>
          </div>
        </div>
      </div>

      {/* Agent Chat Sidebar - Right Panel */}
      <div className="w-[400px] flex flex-col border-l border-slate-800 bg-slate-900/95 backdrop-blur shadow-2xl z-10">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-semibold text-slate-200">Assistant Active</span>
        </div>
        <AgentChat />
      </div>
    </div>
  );
}

export default App;
