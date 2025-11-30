import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- Icons ---
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32d74b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const TerminalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
);

// --- Components ---

const Header = () => (
  <header style={{ 
    padding: '2rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottom: '1px solid var(--border)' 
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%' }}></div>
      <span style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>Business Use-Case Generator</span>
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Research → Strategy</div>
  </header>
);

const Button = ({ onClick, children, primary = false, disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.875rem 1.5rem',
      borderRadius: '8px',
      border: primary ? 'none' : '1px solid var(--border)',
      background: primary ? 'white' : 'transparent',
      color: primary ? 'black' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      opacity: disabled ? 0.7 : 1,
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: primary ? '180px' : 'auto',
      justifyContent: 'center'
    }}
    onMouseEnter={(e) => { if(!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={(e) => { if(!disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    {children}
  </button>
);

const ProgressBar = ({ progress, label }) => (
  <div style={{ width: '100%', marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ 
        width: `${progress}%`, 
        height: '100%', 
        background: 'white', 
        transition: 'width 0.4s ease' 
      }}></div>
    </div>
  </div>
);

const ExecutiveSummary = ({ text }) => (
  <div className="fade-in fade-in-delay-1" style={{
    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '4px', 
      height: '100%', 
      background: 'var(--text-primary)' 
    }} />
    <h3 style={{ 
      fontSize: '0.8rem', 
      textTransform: 'uppercase', 
      letterSpacing: '0.05em', 
      color: 'var(--text-secondary)', 
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }}></span>
      Executive Summary
    </h3>
    <div style={{ 
      fontSize: '1.15rem', 
      lineHeight: '1.6', 
      color: '#e0e0e0',
      fontWeight: 400
    }}>
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ marginBottom: line.trim() ? '0.5rem' : 0 }}>
            {line.replace(/^> /, '')}
        </p>
      ))}
    </div>
  </div>
);

// --- Markdown Rendering Logic ---

// Heuristic for basic syntax highlighting
const highlightCode = (code) => {
  const tokens = [];
  const regex = /(\/\/.*$|#.*$|"[^"]*"|'[^']*'|\b(const|let|var|function|return|import|from|class|def|if|else|while|for|try|catch|print|console)\b|\b\d+\b)/gm;
  
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      tokens.push(code.slice(lastIndex, match.index));
    }
    
    const token = match[0];
    let className = "";
    
    if (token.startsWith('//') || token.startsWith('#')) className = "syntax-comment";
    else if (token.startsWith('"') || token.startsWith("'")) className = "syntax-string";
    else if (/^\d+$/.test(token)) className = "syntax-number";
    else className = "syntax-keyword";
    
    tokens.push(<span key={match.index} className={className}>{token}</span>);
    lastIndex = regex.lastIndex;
  }
  
  // Push remaining text
  if (lastIndex < code.length) {
    tokens.push(code.slice(lastIndex));
  }
  
  return tokens.length > 0 ? tokens : code;
};

const parseInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="inline-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const MarkdownRenderer = ({ content }) => {
  const lines = content.split('\n');
  const elements = [];
  let currentCodeBlock = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code Block Toggle
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock) {
        // End of block
        elements.push(
          <div key={`code-${i}`} className="code-block">
             <div className="code-block-header">{currentCodeBlock.lang}</div>
            <pre><code>{highlightCode(currentCodeBlock.content.join('\n'))}</code></pre>
          </div>
        );
        currentCodeBlock = null;
      } else {
        // Start of block
        const lang = line.trim().replace('```', '').trim() || 'text';
        currentCodeBlock = { lang, content: [] };
      }
      continue;
    }

    // Inside Code Block
    if (currentCodeBlock) {
      currentCodeBlock.content.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i}>{parseInline(line.slice(2))}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{parseInline(line.slice(3))}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{parseInline(line.slice(4))}</h3>);
      continue;
    }

    // Blockquote
     if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}>{parseInline(line.slice(2))}</blockquote>);
      continue;
    }

    // Lists
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
       elements.push(
         <div key={i} style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--success)' }}>•</span>
            <span>{parseInline(line.replace(/^[\*\-]\s/, ''))}</span>
         </div>
       );
       continue;
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '0.5rem' }} />);
      continue;
    }

    // Paragraphs
    elements.push(<p key={i}>{parseInline(line)}</p>);
  }
  
  if (currentCodeBlock) {
     elements.push(
        <div key={`code-end`} className="code-block">
          <pre><code>{currentCodeBlock.content.join('\n')}</code></pre>
        </div>
      );
  }

  return <div className="markdown-content">{elements}</div>;
};

// --- Views ---

const ProcessingView = ({ progress, currentAgent, logs }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs]);

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="pulse" style={{ 
          width: '60px', height: '60px', background: 'white', borderRadius: '50%', 
          margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' 
        }}>
          <TerminalIcon />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Analyzing Research</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Agent: <span style={{ color: 'white' }}>{currentAgent}</span> is working...</p>
      </div>

      <ProgressBar progress={progress} label="Pipeline Progress" />

      <div style={{ 
        marginTop: '2rem', 
        background: '#0f0f0f', 
        border: '1px solid #222', 
        borderRadius: '12px', 
        padding: '1.5rem',
        height: '250px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.9rem'
      }}>
        {logs.map((log, i) => (
          <div key={i} className="fade-in" style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#555', flexShrink: 0, minWidth: '85px' }}>{log.time}</span>
            <span style={{ color: '#ccc' }}>{log.text}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'transparent', flexShrink: 0, minWidth: '85px', userSelect: 'none' }}>00:00:00 AM</span>
          <div style={{ animation: 'blink 1s step-end infinite', width: '8px', height: '14px', background: 'white' }}></div>
        </div>
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('landing'); // landing, processing, results
  const [file, setFile] = useState(null);
  const [industry, setIndustry] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState("");
  const [logs, setLogs] = useState([]);
  const [resultText, setResultText] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  const fileInputRef = useRef(null);

  // Mock Result Data
  const mockMarkdown = `
# Executive Analysis Report
## Target Research: ${file?.name || "Uploaded Paper"}

### 1. Research Summary
The analyzed paper presents a novel approach to distributed consensus mechanisms using **probabilistic validation**. Key findings indicate a 40% reduction in latency compared to traditional Byzantine Fault Tolerance (BFT) systems while maintaining security guarantees in asynchronous environments.

> "The protocol achieves consensus in O(log n) rounds with high probability, making it suitable for large-scale networks."

### 2. Market Opportunities
*   **High-Frequency Trading (HFT) Infrastructure:** The reduced latency is critical for arbitrage bots and exchange matching engines.
*   **IoT Mesh Networks:** Lightweight validation is suitable for low-power edge devices needing consensus without heavy compute.
*   **Private Blockchain Solutions:** Enterprise supply chains can leverage this for faster settlement times.

### 3. Proposed Product Idea: "RapidChain SDK"
A developer-focused toolkit that allows fintech companies to implement high-speed private ledgers. 
*   **Value Prop:** "Bank-grade security at consumer-app speeds."
*   **Core Feature:** Plug-and-play consensus module for existing database clusters.

### 4. Technical Architecture

The architecture relies on a Rust-based gateway.

\`\`\`rust
// Consensus Module Initialization
fn init_consensus(peers: Vec<String>) -> Result<Consensus, Error> {
    let config = Config::default();
    let node = Node::new(config, peers);
    
    // Start probabilistic listener
    node.start_listener(8080);
    
    println!("Consensus engine started on port 8080");
    Ok(Consensus { node })
}
\`\`\`

*   **Ingestion Layer:** Rust-based API gateway.
*   **Consensus Engine:** Implementation of the paper's "Probabilistic Proof" algorithm.
*   **Storage:** Hybrid solution using RocksDB for state and IPFS for archival data.
  `;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
  setIsInitializing(true);

  // Artificial delay to show loading state (UX improvement)
  await new Promise(resolve => setTimeout(resolve, 800));

  setView('processing');
  setIsInitializing(false);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('industry', industry);

  try {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    setResultText(data.report); 
    setView('results');
    
  } catch (error) {
    console.error("Error:", error);
    // Fallback to simulation for demo purposes if backend fails
    simulateCrewPipeline();
  }
};

  const addLog = (text) => {
    setLogs(prev => [...prev, { text, time: new Date().toLocaleTimeString() }]);
  };

  const simulateCrewPipeline = () => {
    const steps = [
      { pct: 10, agent: "Ingestor", msg: "Extracting text from PDF..." },
      { pct: 25, agent: "Researcher", msg: "Summarizing key academic findings..." },
      { pct: 45, agent: "Researcher", msg: "Identifying methodology and results..." },
      { pct: 60, agent: "Strategist", msg: "Analyzing market gaps for this technology..." },
      { pct: 75, agent: "Product Owner", msg: "Drafting MVP features and roadmap..." },
      { pct: 90, agent: "Architect", msg: "Designing technical stack..." },
      { pct: 100, agent: "Manager", msg: "Compiling final report..." },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setResultText(mockMarkdown);
          setView('results');
        }, 800);
        return;
      }

      const step = steps[currentStep];
      setProgress(step.pct);
      setCurrentAgent(step.agent);
      addLog(`[${step.agent}] ${step.msg}`);
      currentStep++;
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // --- Views ---

  const LandingView = () => (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Turn Research into <br />
          <span style={{ color: '#888' }}>Business Value.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          Deploy an autonomous AI Crew to analyze papers, find market gaps, and architect solutions in seconds.
        </p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '1px dashed var(--border)',
          borderRadius: '16px',
          padding: '4rem',
          background: 'var(--card-bg)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'white';
          e.currentTarget.style.background = '#1a1a1a';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--card-bg)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleFileChange}
        />
        
        {file ? (
           <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ padding: '1rem', background: '#222', borderRadius: '50%' }}>
               <FileIcon />
             </div>
             <div style={{ textAlign: 'left' }}>
               <div style={{ fontWeight: 600 }}>{file.name}</div>
               <div style={{ fontSize: '0.85rem', color: '#888' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
             </div>
             <div style={{ marginLeft: '1rem', color: 'var(--success)' }}>
                <CheckIcon />
             </div>
           </div>
        ) : (
          <>
            <div style={{ padding: '1rem', background: '#222', borderRadius: '50%', color: '#888' }}>
              <UploadIcon />
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'white', fontWeight: 500 }}>Click to upload</span> or drag and drop PDF
            </div>
          </>
        )}
      </div>

      {file && (
        <div className="fade-in fade-in-delay-1" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#888' }}>
              TARGET INDUSTRY (OPTIONAL)
            </label>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Fintech, Healthcare, EdTech..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                padding: '0.5rem 0',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'Inter'
              }}
              onFocus={(e) => e.target.style.borderBottomColor = 'white'}
              onBlur={(e) => e.target.style.borderBottomColor = '#333'}
            />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Button primary onClick={startAnalysis} disabled={isInitializing}>
              {isInitializing ? (
                <>
                  <span className="spinner"></span>
                  Starting...
                </>
              ) : (
                "🚀 Generate Analysis & Use-Cases"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const ResultView = () => {
    // Helper to extract summary logic
    const extractSummary = (content) => {
      // Logic: Extract content between "1. Research Summary" and the next header "###"
      const match = content.match(/### 1\. Research Summary\s*([\s\S]*?)(?=###|$)/);
      if (match && match[1]) {
        return match[1].trim();
      }
      // Fallback: Return the first substantial paragraph
      const paragraphs = content.split('\n').filter(p => p.length > 50 && !p.startsWith('#'));
      return paragraphs[0] || "Summary not available.";
    };

    const summaryText = extractSummary(resultText);

    return (
      <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* Animated Success Message */}
        <div className="slide-down" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(50, 215, 75, 0.3)',
          borderRadius: '12px',
          marginBottom: '3rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             background: 'rgba(50, 215, 75, 0.1)', 
             borderRadius: '50%', 
             width: '32px',
             height: '32px'
          }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32d74b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.1rem' }}>Success</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>The analysis has been successfully generated.</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Analysis Report</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Generated by CrewAI • {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <Button onClick={() => window.location.reload()}>Analyze New Paper</Button>
             <Button primary onClick={() => alert("Downloading markdown...")}>Download Report</Button>
          </div>
        </div>

        {/* New Executive Summary Section */}
        <ExecutiveSummary text={summaryText} />

        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          padding: '3rem',
          minHeight: '600px'
        }}>
          <MarkdownRenderer content={resultText} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, position: 'relative' }}>
        {view === 'landing' && <LandingView />}
        {view === 'processing' && <ProcessingView progress={progress} currentAgent={currentAgent} logs={logs} />}
        {view === 'results' && <ResultView />}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
