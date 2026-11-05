import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Database, Globe2, Layers3, Play, RotateCcw, Server, Terminal } from 'lucide-react';

const INITIAL = [42, 78, 29, 92, 54, 18, 66, 36, 85, 47, 61, 24];
export default function SystemsLab() {
  const [tab, setTab] = useState<'request' | 'sort'>('request');
  const [cache, setCache] = useState(true);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [bars, setBars] = useState(INITIAL);
  const [pair, setPair] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [logs, setLogs] = useState(['Ready when you are.']);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stop = () => { clearTimeout(timer.current); setRunning(false); setStep(-1); setPair(-1); };
  useEffect(() => () => clearTimeout(timer.current), []);
  const reset = () => { stop(); setBars(INITIAL); setComparisons(0); setLogs(['Ready when you are.']); };
  const run = () => {
    if (running) return;
    setRunning(true);
    if (tab === 'request') {
      const sequence = cache
        ? ['GET /api/projects → request received', 'API → validate request', 'CACHE HIT → return stored response', '200 OK → response delivered']
        : ['GET /api/projects → request received', 'API → validate request', 'CACHE BYPASS → query database', 'DATABASE → records returned', '200 OK → response delivered'];
      setLogs([]); let index = 0;
      const advance = () => { const message = sequence[index]; setStep(index === sequence.length - 1 ? 0 : index); setLogs(prev => [...prev, message]); index++; if (index < sequence.length) timer.current = setTimeout(advance, 700); else setRunning(false); };
      advance();
    } else {
      const values = [...INITIAL]; let i = 0, j = 0, count = 0;
      setBars(values); setComparisons(0); setLogs(['bubbleSort(values)', 'Comparing adjacent elements…']);
      const advance = () => {
        if (i >= values.length - 1) { setRunning(false); setPair(-1); setLogs(['Array sorted in ascending order.', `${count} comparisons · ${values.length} elements`, 'Time: O(n²) · Extra space: O(1)']); return; }
        setPair(j); count++; setComparisons(count);
        if (values[j] > values[j + 1]) [values[j], values[j + 1]] = [values[j + 1], values[j]];
        setBars([...values]); j++;
        if (j >= values.length - i - 1) { j = 0; i++; }
        timer.current = setTimeout(advance, 85);
      }; advance();
    }
  };
  const nodes = [{ icon: Globe2, title: 'Client', sub: 'Your browser' }, { icon: Server, title: 'API', sub: 'Request handler' }, { icon: Layers3, title: 'Cache', sub: cache ? 'Enabled' : 'Bypassed' }, { icon: Database, title: 'Database', sub: 'Source of truth' }];
  return <div className="lab-workbench">
    <div className="lab-toolbar"><div className="lab-tabs" aria-label="Experiment">{[['request', 'Request lifecycle'], ['sort', 'Sorting algorithm']].map(([id, label]) => <button aria-pressed={tab === id} key={id} onClick={() => { reset(); setTab(id as typeof tab); }}>{label}</button>)}</div><span className="mono lab-version">Interactive experiments</span></div>
    <div className="lab-main"><div className="lab-visual">
      <div className="lab-visual-heading"><span className="mono">{tab === 'request' ? 'Follow the data' : 'Sort step by step'}</span><span className="mono">{tab === 'request' ? 'Request flow' : `${comparisons} comparisons`}</span></div>
      {tab === 'request' ? <div className="request-flow">{nodes.map(({ icon: Icon, title, sub }, index) => <div className="flow-item" key={title}><div className={`flow-node ${step === index && !(cache && index === 3) ? 'active' : ''} ${cache && index === 3 ? 'bypassed' : ''}`}><Icon size={18} strokeWidth={1.5} /><strong>{title}</strong><span>{sub}</span></div>{index < 3 && <ArrowRight className={step > index ? 'lit' : ''} size={18} />}</div>)}</div> : <div className="sorting-bars" aria-label={`Array: ${bars.join(', ')}`}>{bars.map((height, i) => <div key={i} className={pair >= 0 && (i === pair || i === pair + 1) ? 'comparing' : ''} style={{ height: `${height}%` }}><span>{height}</span></div>)}</div>}
      <div className="lab-explanation">{tab === 'request' ? 'What changes when a request can skip the database? Toggle the cache and follow the path.' : 'A simple idea, made visible. Watch adjacent values swap until every element finds its place.'}</div>
    </div><div className="lab-console"><div className="console-heading"><Terminal size={18} /><span>console</span><span className="console-dots">•••</span></div><div className="console-lines" role="status" aria-live="polite">{logs.map((log, i) => <p key={i}><span>{i + 1}</span>{log}</p>)}</div><span className="console-footnote">{tab === 'request' ? 'Illustrative request flow · simulated timing' : 'Live bubble sort · actual comparisons'}</span></div></div>
    <div className="lab-bottom"><div>{tab === 'request' ? <label className="cache-toggle"><input type="checkbox" checked={cache} disabled={running} onChange={e => { setCache(e.target.checked); setStep(-1); setLogs(['Cache configuration updated. Ready to run.']); }} /><span className="toggle-track" />Enable cache</label> : <span className="mono">Bubble sort · 12 elements</span>}</div><div className="lab-actions"><button onClick={reset} className="lab-reset" aria-label="Reset experiment"><RotateCcw size={18} /></button><button className="studio-button primary small" onClick={run} disabled={running}><Play size={18} fill="currentColor" />{running ? 'Running…' : 'Run experiment'}</button></div></div>
  </div>;
}
