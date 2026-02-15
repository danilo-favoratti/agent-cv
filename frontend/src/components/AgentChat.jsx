import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Cpu, Database, User, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AgentChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("disconnected");
    const ws = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        const host = window.location.hostname;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // Use port 3031 for local development/IPs, but skip it for the production domain
        // (cv.favoratti.com) because WSS usually goes through a proxy on the standard port.
        const isLocal = host === 'localhost' || host === '127.0.0.1' || host.match(/^\d+\.\d+\.\d+\.\d+$/);
        const wsPort = isLocal ? ':3031' : '';

        const wsUrl = import.meta.env.VITE_API_URL || `${protocol}//${host}${wsPort}/ws`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            setStatus("connected");
            console.log("Connected to WebSocket");
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, data]);
            } catch (e) {
                console.error("Error parsing message", e);
            }
        };

        ws.current.onclose = () => {
            setStatus("disconnected");
            console.log("Disconnected from WebSocket");
        };

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || status !== "connected") return;

        // Optimistically add user message locally
        setMessages((prev) => [...prev, { type: "user_query", content: input }]);
        ws.current.send(input);
        setInput("");
    };

    const allSuggestions = [
        "What are Danilo's core technical skills?",
        "Tell me about his experience at Walmart.",
        "Does he have experience with GenAI?",
        "What awards has he won?",
        "How did he improve video processing speed at Pactto?",
        "What did he do at Sam's Club?",
        "Tell me about his work with drones at Shield.ai.",
        "What is his experience with Kotlin?",
        "Has he worked with Jetpack Compose?",
        "What side projects has he built?",
        "Tell me about 'Aurora' and 'Cupidoodle'.",
        "What are his soft skills?",
        "What do his colleagues say about him?",
        "Does he have leadership experience?",
        "What is his educational background?",
        "Has he given any public speeches?",
        "What languages does he speak?",
        "Tell me about his harmonica course.",
        "What technologies does he use for Backend?",
        "Does he know Python and FastAPI?",
        "What is his experience with AWS?",
        "How many years of experience does he have?",
        "What is his approach to unit testing?",
        "Has he worked with startups?",
        "What did he build for Harley Davidson?",
        "Tell me about his Anti-Corruption Award.",
        "Does he have experience with WebSockets?",
        "What is his 'Looking For' statement?",
        "How does he handle cross-functional collaboration?",
        "What are his personal values?"
    ];

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Randomly select 5 unique suggestions on mount
        const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 5));
    }, []);

    const handleSuggestionClick = (suggestion) => {
        if (status !== "connected") return;
        setMessages((prev) => [...prev, { type: "user_query", content: suggestion }]);
        ws.current.send(suggestion);
    };

    const renderMessage = (msg, index) => {
        switch (msg.type) {
            case "user_query":
                return (
                    <div key={index} className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg">
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                );

            case "thought":
            case "step_start": {
                const cleanContent = msg.content.replace(/^Thought:\s*/i, "");
                return (
                    <div key={index} className="flex gap-3 mb-2 animate-in fade-in duration-300 group">
                        <div className="mt-1 text-slate-500 group-hover:text-blue-400 transition-colors">
                            <Cpu size={16} />
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none text-slate-400 italic">
                            <span className="text-xs uppercase tracking-wider font-bold text-slate-600 mr-2">Thinking</span>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {cleanContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                );
            }

            case "action_call":
                return (
                    <div key={index} className="flex gap-3 mb-2 pl-4 border-l-2 border-yellow-500/30 animate-in fade-in duration-300">
                        <div className="mt-1 text-yellow-500">
                            <Terminal size={16} />
                        </div>
                        <div className="font-mono text-xs text-yellow-500/90 break-all">
                            {msg.content}
                        </div>
                    </div>
                );

            case "observation":
                return (
                    <div key={index} className="flex gap-3 mb-4 pl-4 border-l-2 border-green-500/30 animate-in fade-in duration-300">
                        <div className="mt-1 text-green-500">
                            <Database size={16} />
                        </div>
                        <div className="font-mono text-xs text-slate-500 break-words max-h-32 overflow-y-auto custom-scrollbar">
                            {msg.content}
                        </div>
                    </div>
                );

            case "final_answer": {
                // Check if the content has <UI_DATA> block
                const uiDataMatch = msg.content.match(/<UI_DATA>([\s\S]*?)<\/UI_DATA>/);
                let uiData = null;
                let textContent = msg.content;

                if (uiDataMatch) {
                    try {
                        uiData = JSON.parse(uiDataMatch[1]);
                        // Remove the UI_DATA block from the text to show the rest
                        textContent = msg.content.replace(/<UI_DATA>[\s\S]*?<\/UI_DATA>/, "").trim();
                    } catch (e) {
                        console.error("Error parsing UI Data", e);
                    }
                }

                return (
                    <div key={index} className="flex gap-3 mb-6 mt-2 animate-in zoom-in-95 duration-500">
                        <div className="mt-1 text-blue-500 bg-blue-500/10 p-1.5 rounded-lg h-fit">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="flex-1 space-y-4">
                            {/* Rich UI Component */}
                            {uiData && uiData.type === 'list' && (
                                <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                                    <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                        {uiData.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {uiData.items.map((item, i) => (
                                            <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 hover:border-blue-500/30 hover:bg-slate-800 transition-all group">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="font-semibold text-slate-200 text-sm">{item.title}</h4>
                                                    {item.icon && <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>}
                                                </div>
                                                {item.role && <p className="text-xs text-blue-400 mb-1">{item.role}</p>}
                                                {item.description && <p className="text-xs text-slate-400 mb-2 line-clamp-3">{item.description}</p>}
                                                {item.tags && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.tags.map((tag, t) => (
                                                            <span key={t} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Standard Text Content */}
                            {textContent && (
                                <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 shadow-xl backdrop-blur-sm">
                                    <div className="prose prose-invert prose-sm max-w-[700px] text-slate-200 leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {textContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case "error":
                return (
                    <div key={index} className="flex gap-3 mb-4 text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/50">
                        <AlertCircle size={16} />
                        <p className="text-xs">{msg.content}</p>
                    </div>
                );

            default:
                return (
                    <div key={index} className="text-xs text-slate-600 mb-1 font-mono">
                        [{msg.type}] {msg.content}
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                            <h3 className="text-slate-300 font-medium mb-4">Start a conversation</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="bg-slate-700/50 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30 text-slate-400 text-sm py-2 px-4 rounded-full border border-slate-700 transition-all duration-200"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => renderMessage(msg, index))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 backdrop-blur-md">
                <form onSubmit={sendMessage} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={status === "connected" ? "Ask about my experience..." : "Connecting..."}
                        disabled={status !== "connected"}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || status !== "connected"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-30"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="mt-2 flex justify-between items-center px-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
                        Agent Status: <span className={status === "connected" ? "text-green-500" : "text-red-500"}>{status}</span>
                    </span>
                    <span className="text-[10px] text-slate-700 font-mono">v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default AgentChat;
