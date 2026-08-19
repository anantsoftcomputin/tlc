import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown,
  BriefcaseBusiness, CircleHelp, Clock3, Compass, Headphones, Heart, Hotel, Languages, LocateFixed, LockKeyhole,
  Map, MapPin, MessageCircle, Mic, Navigation, Phone, Plane, Plus, Search, Send,
  ShieldCheck, Sparkles, Star, Users, Volume2, WalletCards, WandSparkles, X, Zap
} from 'lucide-react';
import { alerts, demoPackage, experiences, hotels } from './demoData';
import hero from './assets/meghalaya-hero.jpg';

const quickStarts = [
  { emoji: '👨‍👩‍👧‍👧', label: 'Family adventure', value: 'We want a memorable family adventure in North East India' },
  { emoji: '🌿', label: 'Relaxing escape', value: 'We want a relaxed premium holiday surrounded by nature' },
  { emoji: '✨', label: 'Surprise us', value: 'Surprise us with an amazing experience that children will remember' }
];
const languages = [
  { code: 'en-IN', name: 'English', native: 'English' }, { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' }, { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' }, { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' }
];

const emptyProfile = { destination: '', departure_city: '', travel_dates: '', duration: '', budget: '', travelers: '', interests: [], hotel_style: '', pace: '' };

function Logo({ dark = false }) {
  return <div className={`logo ${dark ? 'logo-dark' : ''}`}><span className="logo-mark">tlc</span><span className="logo-copy">TRAVELOS<small>INTELLIGENT CONCIERGE</small></span></div>;
}

function App() {
  const [screen, setScreen] = useState('welcome');
  const [pkg, setPkg] = useState(demoPackage);
  const [profile, setProfile] = useState(emptyProfile);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showConcierge, setShowConcierge] = useState(false);
  const [toast, setToast] = useState('');

  const openDemo = () => { setPkg(demoPackage); setProfile({ ...emptyProfile, destination: 'Meghalaya', travel_dates: '12–18 October 2026', duration: '7 days', budget: '₹3 lakh', travelers: '2 adults · 2 children (9 & 13)', interests: ['Nature','Culture','Soft adventure'], hotel_style: 'Premium 4★', pace: 'Balanced' }); setScreen('dashboard'); };
  const notify = text => { setToast(text); setTimeout(() => setToast(''), 2600); };

  if (screen === 'welcome') return <Welcome onStart={() => setScreen('chat')} onDemo={openDemo} onEmployee={() => setScreen('employee-login')} />;
  if (screen === 'employee-login') return <EmployeeLogin onBack={() => setScreen('welcome')} onEnter={() => setScreen('employee-dashboard')} />;
  if (screen === 'employee-dashboard') return <Specialist pkg={pkg} profile={profile} onExit={() => setScreen('welcome')} notify={notify} toast={toast}/>;
  if (screen === 'chat') return <Chat onBack={() => setScreen('welcome')} onComplete={(newPkg, newProfile) => { setPkg(newPkg?.days?.length ? newPkg : demoPackage); setProfile(newProfile); setScreen('dashboard'); }} onDemo={openDemo} />;
  return <Dashboard pkg={pkg} profile={profile} tab={activeTab} setTab={setActiveTab} showConcierge={showConcierge} setShowConcierge={setShowConcierge} onBack={() => setScreen('chat')} onExit={() => setScreen('welcome')} notify={notify} toast={toast} />;
}

function Welcome({ onStart, onDemo, onEmployee }) {
  return <main className="welcome">
    <nav className="landing-nav"><Logo dark/><div className="nav-actions"><span className="online"><i/> AI concierge online</span><button className="team-login-link" onClick={onEmployee}><LockKeyhole size={14}/> TLC team login</button><button className="ghost" onClick={onDemo}>View traveler demo</button></div></nav>
    <section className="welcome-grid">
      <div className="welcome-copy">
        <div className="eyebrow"><Sparkles size={14}/> A HOLIDAY DESIGNED AROUND YOU</div>
        <h1>Tell us the feeling.<br/><em>We’ll shape the journey.</em></h1>
        <p>Meet Aira, your personal travel concierge. Speak naturally or type a message—she’ll understand who you’re travelling with, what you love, and curate the details.</p>
        <div className="start-actions"><button className="primary large" onClick={onStart}><MessageCircle size={19}/> Start a conversation <ArrowRight size={18}/></button><button className="voice-orb" onClick={onStart}><Mic size={22}/></button><span>or speak to Aira</span></div>
        <div className="trust-row"><span><CheckCircle2/> Personalised by AI</span><span><ShieldCheck/> Human-verified</span><span><Clock3/> Available 24×7</span></div>
      </div>
      <div className="welcome-visual">
        <div className="photo-frame"><img src={hero}/><div className="photo-shade"/><div className="photo-caption"><span>CURATED FOR FAMILIES</span><strong>Where the clouds come home</strong><small><MapPin size={13}/> Meghalaya, North East India</small></div></div>
        <div className="floating-card weather"><span>18°</span><div><b>Misty morning</b><small>Perfect for waterfalls</small></div></div>
        <div className="floating-card aira"><div className="aira-avatar">A</div><div><b>Aira found 3 ideas</b><small>Matched to your family</small></div><Sparkles size={18}/></div>
      </div>
    </section>
    <footer className="landing-footer"><span>Thoughtful travel, powered by TLC</span><span>Flights · Stays · Experiences · Visa · 24×7 care</span></footer>
  </main>;
}

function EmployeeLogin({ onBack, onEnter }) {
  const [email,setEmail]=useState('priya@tlcholidays.com');
  const [password,setPassword]=useState('tlcdemo');
  const [error,setError]=useState('');
  const submit=e=>{e.preventDefault();if(email&&password){setError('');onEnter()}else setError('Enter your TLC email and password')};
  return <main className="employee-login"><section className="employee-login-brand"><Logo/><div><span>TLC TEAM WORKSPACE</span><h1>Every traveler.<br/>Every trip.<br/><em>One clear view.</em></h1><p>Manage assigned journeys, approve stays and experiences, respond to concierge requests, and keep every departure ready.</p></div><small>Internal access · TLC Holidays</small></section><section className="employee-login-form"><button className="back-link" onClick={onBack}><ArrowLeft/> Back to traveler website</button><form onSubmit={submit}><div className="employee-login-icon"><BriefcaseBusiness/></div><span>EMPLOYEE SIGN IN</span><h2>Welcome back, Priya</h2><p>Sign in to your TLC operations workspace.</p><label>Work email<input value={email} onChange={e=>setEmail(e.target.value)} type="email"/></label><label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password"/></label>{error&&<small className="login-error">{error}</small>}<button className="primary" type="submit">Open team workspace <ArrowRight/></button><div className="login-demo"><ShieldCheck/><span><b>Prototype access</b><small>Demo credentials are pre-filled for this presentation.</small></span></div></form></section></main>;
}

function Chat({ onBack, onComplete, onDemo }) {
  const initial = [{ role: 'assistant', content: 'Hello! I’m Aira, your TLC travel concierge. Tell me about the holiday you have in mind—who’s travelling, where you’d love to go, or simply how you want it to feel.' }];
  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [completion, setCompletion] = useState(12);
  const [language, setLanguage] = useState(languages[0]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [readyPkg, setReadyPkg] = useState(null);
  const [suggestions, setSuggestions] = useState(quickStarts);
  const bottomRef = useRef();
  const inputRef = useRef();
  const liveSessionRef = useRef(null);
  const voiceModeRef = useRef(false);
  const languageRef = useRef(languages[0]);
  const voiceAudioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef([]);
  const liveTranscriptRef = useRef('');
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);
  useEffect(() => {
    return () => {
      stopLiveAudio(true);
      voiceAudioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  async function send(text = input) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: 'user', content: text.trim() }];
    setMessages(next); setInput(''); setSuggestions([]); setLoading(true);
    try {
      const res = await fetch('/api/concierge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
      setProfile(data.profile || emptyProfile); setCompletion(data.completion || 20);
      setSuggestions(data.quick_replies || []);
      if (data.ready_to_build) setReadyPkg(data.package);
      if (voiceModeRef.current) speakWithGemini(data.reply);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'I have your brief. For this demo, could you also share your departure city, preferred month, trip duration, and approximate total budget?' }]);
    } finally { setLoading(false); }
  }

  async function speakWithGemini(text) {
    voiceAudioRef.current?.pause();
    window.speechSynthesis?.cancel();
    try {
      const response = await fetch('/api/speech', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: languageRef.current.code })
      });
      if (!response.ok) throw new Error('Gemini voice unavailable');
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      voiceAudioRef.current = audio;
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch {
      if (!('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageRef.current.code;
      utterance.rate = 0.98;
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => /samantha|karen|moira|ava|female/i.test(v.name) && v.lang.startsWith(languageRef.current.code.slice(0, 2))) || null;
      window.speechSynthesis.speak(utterance);
    }
  }

  function beginBrowserListening(selectedLanguage = language) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setMessages(m => [...m, { role:'assistant', content:'Voice input is best experienced in Chrome or Edge. You can continue by typing naturally below.' }]); return; }
    window.speechSynthesis?.cancel();
    const recognition = new Recognition(); recognition.lang = selectedLanguage.code; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = e => { const text = Array.from(e.results).map(r => r[0].transcript).join(''); setInput(text); if (e.results[e.results.length - 1].isFinal) setTimeout(() => send(text), 250); };
    recognition.onend = () => setListening(false); recognition.onerror = () => setListening(false); recognition.start();
  }

  function stopLiveAudio(closeSession = false) {
    for (const node of audioNodesRef.current) { try { node.disconnect(); } catch {} }
    audioNodesRef.current = [];
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
    audioContextRef.current = null;
    if (liveSessionRef.current) {
      try { liveSessionRef.current.sendRealtimeInput({ audioStreamEnd: true }); } catch {}
      if (closeSession) { try { liveSessionRef.current.close(); } catch {} liveSessionRef.current = null; }
    }
    setListening(false);
  }

  function pcmToBase64(samples) {
    const pcm = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 0x7fff;
    const bytes = new Uint8Array(pcm.buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  }

  async function beginListening(selectedLanguage = language) {
    voiceAudioRef.current?.pause();
    window.speechSynthesis?.cancel();
    liveTranscriptRef.current = '';
    setInput('');
    setListening(true);
    try {
      const tokenResponse = await fetch('/api/gemini-live-token');
      const credentials = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(credentials.error || 'Could not start Gemini Live');
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: credentials.token, httpOptions: { apiVersion: 'v1alpha' } });
      let session;
      session = await ai.live.connect({
        model: credentials.model,
        config: {
          responseModalities: ['AUDIO'],
          inputAudioTranscription: {},
          systemInstruction: `You are listening to a TLC Holidays traveler speaking in ${selectedLanguage.name}. Listen naturally and acknowledge briefly. Respond in ${selectedLanguage.name}.`
        },
        callbacks: {
          onmessage: message => {
            const transcript = message.serverContent?.inputTranscription?.text;
            if (transcript) {
              liveTranscriptRef.current += transcript;
              setInput(liveTranscriptRef.current.trim());
            }
            if (message.serverContent?.turnComplete) {
              const finalText = liveTranscriptRef.current.trim();
              stopLiveAudio(true);
              if (finalText) send(finalText);
            }
          },
          onerror: () => {
            stopLiveAudio(true);
            beginBrowserListening(selectedLanguage);
          },
          onclose: () => setListening(false)
        }
      });
      liveSessionRef.current = session;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      mediaStreamRef.current = stream;
      const context = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = context;
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);
      const silent = context.createGain(); silent.gain.value = 0;
      processor.onaudioprocess = event => {
        if (!liveSessionRef.current) return;
        const data = pcmToBase64(event.inputBuffer.getChannelData(0));
        session.sendRealtimeInput({ audio: { data, mimeType: `audio/pcm;rate=${context.sampleRate}` } });
      };
      source.connect(processor); processor.connect(silent); silent.connect(context.destination);
      audioNodesRef.current = [source, processor, silent];
    } catch (error) {
      stopLiveAudio(true);
      beginBrowserListening(selectedLanguage);
    }
  }

  function startVoice() {
    if (!voiceMode) { setLanguageOpen(true); return; }
    if (listening) { stopLiveAudio(false); return; }
    beginListening(language);
  }

  const facts = [
    ['Travel party', profile.travelers, Users], ['Destination', profile.destination, MapPin], ['Dates', profile.travel_dates, CalendarDays],
    ['Duration', profile.duration, Clock3], ['Budget', profile.budget, WalletCards], ['Travel style', profile.pace || profile.hotel_style, Compass]
  ];
  return <main className="chat-shell">
    <header className="chat-header"><button className="icon-btn" onClick={onBack}><ArrowLeft/></button><Logo dark/><div className="header-right"><button className="lang-button" onClick={() => setLanguageOpen(true)}><Languages size={17}/>{language.native}<ChevronDown size={14}/></button><button className="ghost" onClick={onDemo}>Skip to demo</button></div></header>
    <div className="chat-layout">
      <section className="conversation">
        <div className="conversation-heading"><div><span className="status-dot"/> Aira is online <span className="gemini-badge"><Sparkles size={10}/> Gemini powered</span></div><small>Tap an answer or tell Aira naturally.</small></div>
        <div className="messages">
          {messages.map((m,i) => <div key={i} className={`message-row ${m.role}`}>
            {m.role === 'assistant' && <div className="bot-avatar">A</div>}
            <div className="bubble">{m.content}{m.role === 'assistant' && <span className="delivered"><Volume2 size={12}/> Aira</span>}</div>
          </div>)}
          {!loading && !!suggestions.length && <div className="smart-replies"><div className="smart-replies-label"><Sparkles size={12}/> QUICK ANSWERS · NO TYPING NEEDED</div><div className="smart-replies-grid">{suggestions.map((q,i) => <button key={`${q.label}-${i}`} onClick={() => send(q.value || q.label)}><i>{q.emoji || '✨'}</i><span>{q.label}</span><ArrowRight size={14}/></button>)}<button className="type-own" onClick={() => inputRef.current?.focus()}><i>⌨️</i><span>I’ll type my own</span></button></div></div>}
          {loading && <div className="message-row assistant"><div className="bot-avatar">A</div><div className="bubble typing"><i/><i/><i/></div></div>}
          {readyPkg && <div className="package-ready"><div className="ready-icon"><WandSparkles/></div><div><b>Your journey is ready</b><span>{readyPkg.title} · {readyPkg.price}</span></div><button className="primary" onClick={() => onComplete(readyPkg, profile)}>Reveal my trip <ArrowRight size={16}/></button></div>}
          <div ref={bottomRef}/>
        </div>
        <div className="composer-wrap">
          {listening && <div className="listening-bar"><span className="waves"><i/><i/><i/><i/><i/></span>Gemini Live is listening in {language.name}… <button onClick={() => stopLiveAudio(false)}>Tap to finish</button></div>}
          <div className="composer"><button className={`mic-button ${listening ? 'active' : ''}`} onClick={startVoice}><Mic/></button><textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }}} placeholder={suggestions.length ? 'Or type something different…' : 'Tell Aira what you have in mind…'} rows="1"/><button className="send-button" onClick={() => send()} disabled={!input.trim() || loading}><Send/></button></div>
          <small>AI can make mistakes. Your TLC specialist verifies availability and important details.</small>
        </div>
      </section>
      <aside className="trip-brief">
        <div className="brief-head"><span>LIVE TRIP BRIEF</span><b>{completion}% understood</b></div><div className="progress"><i style={{width:`${completion}%`}}/></div>
        <h2>Your holiday,<br/><em>taking shape.</em></h2><p>Aira quietly organises the details as you talk. You’ll never fill a long form.</p>
        <div className="facts">{facts.map(([label,value,Icon]) => <div className={`fact ${value ? 'filled' : ''}`} key={label}><div><Icon size={17}/></div><span><small>{label}</small><b>{value || 'Not discussed yet'}</b></span>{value && <Check size={15}/>}</div>)}</div>
        {!!profile.interests?.length && <div className="interest-chips">{profile.interests.map(x => <span key={x}>{x}</span>)}</div>}
        <div className="privacy-note"><ShieldCheck/><span><b>Your conversation is private</b><small>Used only to design and service your trip.</small></span></div>
      </aside>
    </div>
    {languageOpen && <div className="modal-backdrop" onClick={() => setLanguageOpen(false)}><div className="language-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setLanguageOpen(false)}><X/></button><div className="modal-icon"><Mic/></div><h2>Which language shall we speak?</h2><p>Aira will listen in your language and speak Gemini’s response back naturally.</p><div className="language-grid">{languages.map(l => <button className={l.code === language.code ? 'selected' : ''} key={l.code} onClick={() => { languageRef.current = l; voiceModeRef.current = true; setLanguage(l); setVoiceMode(true); setLanguageOpen(false); setTimeout(() => beginListening(l), 120); }}><b>{l.native}</b><span>{l.name}</span>{l.code === language.code && <Check/>}</button>)}</div><small>Your Gemini key stays securely on the server.</small></div></div>}
  </main>;
}

function Dashboard({ pkg, profile, tab, setTab, showConcierge, setShowConcierge, onBack, onExit, notify, toast }) {
  const tabs = ['Overview','Itinerary','Stay & experiences','Safety hub','Documents'];
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [section, setSection] = useState('My trip');
  return <main className="app-shell">
    <aside className="side-nav"><Logo/><div className="portal-identity">TRAVELER<br/>PORTAL</div><nav><button className={section==='My trip'?'active':''} onClick={()=>setSection('My trip')}><Map/><span>My trip</span></button><button className={section==='Messages'?'active':''} onClick={()=>setSection('Messages')}><MessageCircle/><span>Messages</span><i>2</i></button><button className={section==='Payments'?'active':''} onClick={()=>setSection('Payments')}><WalletCards/><span>Payments</span></button><button className={section==='Travelers'?'active':''} onClick={()=>setSection('Travelers')}><Users/><span>Travelers</span></button></nav><div className="side-bottom"><button onClick={onExit}><ArrowLeft/><span>Exit portal</span></button><div className="avatar">AS</div></div></aside>
    <section className="main-app">
      <header className="app-header"><div><button onClick={onBack} className="back-link"><ArrowLeft size={15}/> Trip studio</button><span className="trip-id">{section==='My trip'?'TRIP · TLC-2847':section.toUpperCase()}</span></div><div className="app-actions"><button className="icon-btn" onClick={()=>setAlertsOpen(!alertsOpen)}><Bell/><i/></button><button className="specialist-pill" onClick={()=>setShowConcierge(true)}><div>PS</div><span><small>Your specialist</small><b>Priya Shah</b></span><MessageCircle size={17}/></button></div></header>
      {alertsOpen && <div className="notification-pop"><b>Smart updates</b>{alerts.slice(0,2).map(a=><div key={a.title}><span>✓</span><p><b>{a.title}</b><small>{a.text}</small></p></div>)}</div>}
      <div className="dashboard-scroll">
        {section === 'My trip' ? <>
          <section className="trip-hero" style={{backgroundImage:`url(${hero})`}}><div className="hero-overlay"/><div className="trip-hero-content"><span className="confirmed"><CheckCircle2/> DESIGN IN PROGRESS</span><h1>{pkg?.title || demoPackage.title}</h1><p>{pkg?.subtitle || demoPackage.subtitle}</p><div className="hero-meta"><span><CalendarDays/> {profile.travel_dates || '12–18 October 2026'}</span><span><Clock3/> {profile.duration || `${Array.isArray(pkg?.days) && pkg.days.length ? pkg.days.length : demoPackage.days.length} days`}</span><span><Users/> {profile.travelers || '2 adults · 2 children'}</span></div></div><div className="trip-countdown"><small>YOUR JOURNEY BEGINS IN</small><div><b>54</b><span>days</span></div><p>Everything is on track</p></div></section>
          <div className="dashboard-tabs">{tabs.map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>
          {tab === 'Overview' && <Overview pkg={pkg || demoPackage} setTab={setTab} notify={notify}/>}
          {tab === 'Itinerary' && <Itinerary pkg={pkg} notify={notify}/>}
          {tab === 'Stay & experiences' && <StayExperience notify={notify}/>}
          {tab === 'Safety hub' && <Safety notify={notify}/>}
          {tab === 'Documents' && <Documents notify={notify}/>}
        </> : <PortalSection section={section} profile={profile} notify={notify} openConcierge={()=>setShowConcierge(true)}/>}
      </div>
    </section>
    <div className="concierge-fab-wrap"><button className="sos" onClick={()=>notify('SOS hold initiated — release to cancel')}>SOS</button><button className="concierge-fab" onClick={()=>setShowConcierge(true)}><Headphones/><span><b>Need anything?</b><small>Your concierge is here 24×7</small></span></button></div>
    {showConcierge && <ConciergeDrawer onClose={()=>setShowConcierge(false)} notify={notify}/>} {toast && <div className="toast"><CheckCircle2/>{toast}</div>}
  </main>;
}

function Overview({ pkg, setTab, notify }) {
  return <div className="overview-grid"><div className="overview-main"><div className="section-title"><div><span>AT A GLANCE</span><h2>Your journey, beautifully organised</h2></div><button onClick={()=>setTab('Itinerary')}>View full itinerary <ArrowRight/></button></div>
    <div className="route-card"><div className="route-line"><div className="route-stop"><i/><b>Guwahati</b><small>Arrive</small></div><div className="route-path"><span>2h 45m</span><i/></div><div className="route-stop"><i/><b>Shillong</b><small>3 nights</small></div><div className="route-path"><span>2h 10m</span><i/></div><div className="route-stop"><i/><b>Cherrapunji</b><small>2 nights</small></div><div className="route-path"><span>2h 30m</span><i/></div><div className="route-stop"><i/><b>Guwahati</b><small>Depart</small></div></div><div className="route-foot"><span><Navigation/> Private vehicle throughout</span><span><MapPin/> 4 regions · ~430 km</span><span><ShieldCheck/> Route monitored live</span></div></div>
    <div className="section-title compact"><div><span>NEXT UP</span><h2>Day 1 · Into the clouds</h2></div><button onClick={()=>setTab('Itinerary')}>All 7 days <ArrowRight/></button></div>
    <div className="day-preview"><div className="day-time"><b>11:40</b><span>AM</span></div><div className="timeline-dot plane"><Plane/></div><div><b>Welcome at Guwahati Airport</b><p>Your TLC host meets you at arrivals. Your private SUV is stocked with water and snacks.</p><span className="tag"><Check/> Confirmed</span></div></div>
    <div className="day-preview"><div className="day-time"><b>03:15</b><span>PM</span></div><div className="timeline-dot"><Hotel/></div><div><b>Check in & settle down</b><p>A family suite with valley views is reserved at The Heritage Club.</p><span className="tag"><Check/> Confirmed</span></div></div>
  </div><aside className="overview-side"><div className="care-card"><div className="care-head"><div className="avatar-photo">PS</div><div><span>YOUR TLC SPECIALIST</span><b>Priya Shah</b><small><i/> Online · Replies in ~2 min</small></div></div><p>“I’ve designed the pace to give the girls time to explore without making any day feel rushed.”</p><div><button onClick={()=>notify('Message sent to Priya')}><MessageCircle/> Message</button><button onClick={()=>notify('Callback requested')}><Phone/> Call</button></div></div>
    <div className="cost-card"><span>TRIP ESTIMATE</span><h3>{pkg.price}<small>for your family</small></h3><div><span>Stay & breakfast</span><b>₹86,400</b></div><div><span>Private transfers</span><b>₹62,000</b></div><div><span>Experiences</span><b>₹54,600</b></div><div><span>Taxes & care</span><b>₹21,000</b></div><hr/><div><span>Flights estimate</span><b>₹60,000</b></div><button className="primary" onClick={()=>notify('Proposal link copied')}>Review proposal <ArrowRight/></button><small>Final price after your specialist confirms choices.</small></div>
    <div className="weather-card"><div><span>OCTOBER WEATHER</span><b>Fresh air, fewer showers</b></div><strong>18°</strong><p><span>12° low</span><i/><span>22° high</span></p></div>
  </aside></div>;
}

function Itinerary({ pkg, notify }) {
  const days = Array.isArray(pkg?.days) && pkg.days.length ? pkg.days.filter(d => d && (d.title || d.description)) : demoPackage.days;
  const [expanded, setExpanded] = useState(0);
  const [showMap, setShowMap] = useState(false);
  return <div className="content-page"><div className="section-title"><div><span>YOUR DAY-BY-DAY STORY</span><h2>{days.length} days, with room to breathe</h2><p>Every detail can still be changed with your TLC specialist.</p></div><button onClick={()=>setShowMap(true)}><Map/> View route map</button></div><div className="itinerary-list">{days.map((d,i)=><article key={`${d.day}-${i}`} className={`itinerary-day ${expanded===i?'expanded':''}`}><div className="day-number"><small>DAY</small><b>{String(d.day || i+1).padStart(2,'0')}</b><i/></div><div className="day-content"><span><MapPin/> {d.place || 'North East India'}</span><h3>{d.title || `Day ${i+1}`}</h3><p>{d.description || 'Your TLC specialist is curating the details for this day.'}</p><div className="mini-tags"><span>{i%2?'🌿 Nature':'🚙 Private transfer'}</span><span>{i===3?'🥾 Moderate trek':'✨ Family-picked'}</span></div>{expanded===i&&<div className="day-details"><div><Clock3/> <span><b>Flexible timing</b><small>Final timing appears after hotel confirmation</small></span></div><div><ShieldCheck/> <span><b>TLC monitored</b><small>Driver and local host details shared before travel</small></span></div><button onClick={()=>notify(`Change request opened for Day ${i+1}`)}>Request a change</button></div>}</div><button aria-label={`Toggle day ${i+1}`} onClick={()=>setExpanded(expanded===i?-1:i)}><ChevronDown/></button></article>)}</div>
    {showMap&&<div className="modal-backdrop" onClick={()=>setShowMap(false)}><div className="route-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setShowMap(false)}><X/></button><span>YOUR ROUTE</span><h2>Across the clouds of Meghalaya</h2><div className="map-canvas"><div className="map-road"/><div className="map-pin p1"><i>1</i><b>Guwahati</b></div><div className="map-pin p2"><i>2</i><b>Shillong</b></div><div className="map-pin p3"><i>3</i><b>Cherrapunji</b></div><div className="map-pin p4"><i>4</i><b>Dawki</b></div></div><div className="map-summary"><span><Navigation/> Private SUV</span><span><MapPin/> Approx. 430 km</span><span><Clock3/> Comfortable drives</span></div><button className="primary" onClick={()=>{setShowMap(false);notify('Offline route saved to your trip')}}>Save offline route <ArrowRight/></button></div></div>}
  </div>
}

function StayExperience({ notify }) { const [selectedHotel,setSelectedHotel]=useState(1); const [chosen,setChosen]=useState(experiences.map(x=>x.selected)); return <div className="content-page"><div className="section-title"><div><span>CURATED BY TLC</span><h2>Choose your stay</h2><p>Only trusted partners that fit your family and route.</p></div><span className="verified"><ShieldCheck/> Rates verified today</span></div><div className="hotel-grid">{hotels.map((h,i)=><article className={`hotel-card ${selectedHotel===i?'selected':''}`} key={h.name} onClick={()=>setSelectedHotel(i)}><div className="hotel-image"><img src={h.image}/><span>{h.tag}</span>{selectedHotel===i&&<i><Check/></i>}</div><div><small>{h.place} · {h.type}</small><h3>{h.name}</h3><p><Star fill="currentColor"/> {h.rating} guest rating</p><b>{h.price}</b></div></article>)}</div><div className="section-title experience-head"><div><span>MAKE IT YOURS</span><h2>Handpicked experiences</h2></div><button onClick={()=>notify('Experience preferences saved')}>Save choices</button></div><div className="experience-list">{experiences.map((x,i)=><button key={x.title} className={chosen[i]?'selected':''} onClick={()=>setChosen(s=>s.map((v,j)=>i===j?!v:v))}><i>{x.icon}</i><span><b>{x.title}</b><small>{x.meta}</small></span><strong>{x.price}</strong><em>{chosen[i]?<Check/>:<Plus/>}</em></button>)}</div></div> }

function Safety({ notify }) { return <div className="content-page safety-page"><div className="safety-hero"><ShieldCheck/><div><span>TLC SAFETY NET</span><h2>You’re never travelling alone</h2><p>Your route, weather and local advisories are monitored throughout the trip.</p></div><b><i/> ALL CLEAR</b></div><div className="safety-grid"><div className="emergency-card"><span>EMERGENCY CONTACTS</span><h3>Help near your stay</h3><div><i className="hospital">+</i><p><b>NEIGRIHMS Hospital</b><small>Mawdiangdiang · 7.2 km · 18 min</small></p><button onClick={()=>notify('Directions to NEIGRIHMS opened')}><Navigation/></button></div><div><i className="police">★</i><p><b>Laitumkhrah Police Station</b><small>Shillong · 2.4 km · 8 min</small></p><button onClick={()=>notify('Police station contact ready: 0364-2222277')}><Phone/></button></div><div><i>☎</i><p><b>India emergency helpline</b><small>Police · Fire · Ambulance</small></p><button className="call112" onClick={()=>notify('Emergency call to 112 initiated')}>Call 112</button></div><small>Locations and contacts shown are illustrative for this prototype. Always verify before travel.</small></div><div className="local-card"><span>LOCAL KNOW-HOW</span><h3>What travelers should know</h3><div><b>🚕 Typical taxi costs</b><p>Shillong local half-day: ₹1,800–2,400<br/>Shillong–Cherrapunji SUV: ₹3,500–4,500</p></div><div><b>⚠ Common friction points</b><p>Patchy mobile signal after Cherrapunji, sudden rain, and limited card acceptance in villages.</p></div><div><b>💡 Aira’s advice</b><p>Carry ₹3,000–5,000 cash, download offline maps, and keep a light rain layer in the day bag.</p></div></div></div></div> }

function Documents({ notify }) { const base=[['Flight tickets','PDF · 1.8 MB','Ready offline'],['Hotel vouchers','3 confirmations','Specialist verifying'],['Traveler IDs','4 documents','Secure'],['Travel insurance','Family policy','Recommended']]; const [docs,setDocs]=useState(base); const [selected,setSelected]=useState(null); const input=useRef(); const upload=e=>{const file=e.target.files?.[0];if(file){setDocs(d=>[[file.name,`${(file.size/1024).toFixed(0)} KB`,'Uploaded securely'],...d]);notify(`${file.name} added to travel wallet`)}}; return <div className="content-page"><div className="section-title"><div><span>ONE SECURE PLACE</span><h2>Your travel wallet</h2><p>Important files are ready even when connectivity isn’t.</p></div><button onClick={()=>input.current?.click()}><Plus/> Add document</button><input ref={input} type="file" hidden onChange={upload}/></div><div className="documents-grid">{docs.map((d,i)=><article key={`${d[0]}-${i}`}><div className={`doc-icon d${i%4}`}>{i%4===0?<Plane/>:i%4===1?<Hotel/>:i%4===2?<Users/>:<ShieldCheck/>}</div><h3>{d[0]}</h3><p>{d[1]}</p><span><i/>{d[2]}</span><button onClick={()=>setSelected(d)}>View <ArrowRight/></button></article>)}</div>{selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="document-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setSelected(null)}><X/></button><div className="doc-preview"><ShieldCheck/></div><span>SECURE TRAVEL DOCUMENT</span><h2>{selected[0]}</h2><p>{selected[1]} · {selected[2]}</p><div><CheckCircle2/> Available offline and encrypted for this trip.</div><button className="primary" onClick={()=>notify(`${selected[0]} downloaded for offline use`)}>Download for offline use</button></div></div>}</div> }

function PortalSection({ section, profile, notify, openConcierge }) {
  const [message,setMessage]=useState('');
  const [sent,setSent]=useState([]);
  const [paid,setPaid]=useState(false);
  const [contact,setContact]=useState('Priya');
  const send=()=>{if(message.trim()){setSent(s=>[...s,message.trim()]);setMessage('');notify('Message delivered to Priya')}};
  if(section==='Messages') return <div className="portal-page"><div className="portal-title"><span>YOUR TLC TEAM</span><h1>Messages</h1><p>One conversation for every detail of your journey.</p></div><div className="messages-page"><aside><b>Trip conversations</b><button className={contact==='Priya'?'active':''} onClick={()=>setContact('Priya')}><div>PS</div><span><b>Priya Shah</b><small>That pace should work beautifully…</small></span><i>2</i></button><button className={contact==='Aira'?'active':''} onClick={()=>setContact('Aira')}><div>A</div><span><b>Aira concierge</b><small>Your journey brief is ready</small></span></button></aside><section><header><div className="avatar-photo">{contact==='Priya'?'PS':'A'}</div><span><b>{contact==='Priya'?'Priya Shah':'Aira concierge'}</b><small><i/> Online now</small></span><button onClick={()=>contact==='Priya'?notify('Callback requested from Priya'):openConcierge()}>{contact==='Priya'?<Phone/>:<Sparkles/>}</button></header><div className="portal-chat"><div className="portal-bubble incoming">{contact==='Priya'?'I’ve reviewed the itinerary and kept Day 6 flexible for the family. Would you prefer kayaking or a relaxed Shillong afternoon?':'Your journey brief is ready. I can help with weather, packing, routes, or any change you have in mind.'}</div>{contact==='Priya'&&<div className="portal-bubble outgoing">A relaxed afternoon sounds better for us.</div>}{sent.map((x,i)=><div className="portal-bubble outgoing" key={i}>{x}</div>)}</div><div className="portal-composer"><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder={`Message ${contact}…`}/><button onClick={send}><Send/></button></div></section></div></div>;
  if(section==='Payments') return <div className="portal-page"><div className="portal-title"><span>SECURE PAYMENTS</span><h1>Your payment plan</h1><p>Clear milestones with receipts stored automatically.</p></div><div className="payment-layout"><section className="payment-card"><div className="payment-total"><span>TRIP TOTAL</span><h2>₹2,84,000</h2><small>Including taxes · Flights estimated separately</small></div>{[['Booking token','₹50,000','Paid'],['Second milestone','₹1,00,000','Paid'],['Final balance','₹1,34,000',paid?'Paid':'Due 15 Sep']].map((p,i)=><div className="payment-row" key={p[0]}><i className={p[2]==='Paid'||paid&&i===2?'done':''}>{p[2]==='Paid'||paid&&i===2?<Check/>:i+1}</i><span><b>{p[0]}</b><small>{p[2]}</small></span><strong>{p[1]}</strong>{i<2||paid?<button onClick={()=>notify(`${p[0]} receipt downloaded`)}>Receipt</button>:<button className="pay-now" onClick={()=>{setPaid(true);notify('Payment successful — receipt generated')}}>Pay now</button>}</div>)}</section><aside className="payment-safe"><ShieldCheck/><h3>Payments protected</h3><p>Secure checkout, instant receipts and complete audit trail.</p><span>UPI · Cards · Net banking</span></aside></div></div>;
  const travelers=[['Amit Sharma','Primary traveler · Adult','Passport verified'],['Neha Sharma','Adult · Vegetarian','Passport verified'],['Riya Sharma','Daughter · 13 years','ID details added'],['Arjunia Sharma','Daughter · 9 years','ID details added']];
  return <div className="portal-page"><div className="portal-title"><span>TRAVELER 360</span><h1>Your family</h1><p>Preferences travel with you, so you never repeat them.</p></div><div className="traveler-grid">{travelers.map((t,i)=><article key={t[0]}><div className="traveler-avatar">{t[0].split(' ').map(x=>x[0]).join('')}</div><span><h3>{t[0]}</h3><p>{t[1]}</p><small><CheckCircle2/> {t[2]}</small></span><button onClick={()=>notify(`${t[0]}'s preferences opened`)}>Edit</button></article>)}</div><div className="family-preferences"><div><Sparkles/><span><b>Aira remembers your family</b><p>{profile.hotel_style||'Premium family stays'} · Vegetarian meals · {profile.pace||'Balanced pace'} · Adjoining rooms preferred</p></span></div><button onClick={openConcierge}>Update with concierge <ArrowRight/></button></div></div>;
}

function ConciergeDrawer({ onClose, notify }) { const [text,setText]=useState(''); const send=()=>{if(text){notify('Request sent to your concierge');setText('')}}; return <div className="drawer-backdrop" onClick={onClose}><aside className="concierge-drawer" onClick={e=>e.stopPropagation()}><header><div className="bot-avatar">A</div><div><b>TLC Concierge</b><small><i/> Priya & Aira are online</small></div><button onClick={onClose}><X/></button></header><div className="drawer-chat"><div className="concierge-welcome"><Sparkles/><h3>How can we make your journey easier?</h3><p>Ask a question or make a request. Your trip context is already known.</p></div><div className="request-grid">{['Change tomorrow’s pickup','Find a nearby pharmacy','Meal preference','Talk to Priya'].map(x=><button key={x} onClick={()=>setText(x)}>{x}<ArrowRight/></button>)}</div><div className="drawer-bubble">Hello Amit! I can see your Meghalaya trip. What can I arrange for you?</div></div><div className="drawer-composer"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Type a request…"/><button onClick={send}><Send/></button></div><button className="emergency-link" onClick={()=>notify('Emergency support connected — call 112 for immediate danger')}><Phone/> Emergency help</button></aside></div> }

function Specialist({ pkg, profile, onExit, notify, toast }) { const [selected,setSelected]=useState([false,true,false]); const [tasks,setTasks]=useState(3); const action=name=>notify(`${name} workspace opened`); return <main className="specialist-shell"><aside className="specialist-nav"><Logo/><div className="team-identity"><BriefcaseBusiness/> TLC TEAM OS<small>EMPLOYEE WORKSPACE</small></div><nav><span>WORKSPACE</span><button onClick={()=>action('Today')}><Zap/> Today <i>8</i></button><button className="active" onClick={()=>action('Trips')}><Users/> Trips <i>12</i></button><button onClick={()=>action('Requests')}><MessageCircle/> Requests <i>{tasks}</i></button><button onClick={()=>action('Calendar')}><CalendarDays/> Calendar</button><span>INSIGHTS</span><button onClick={()=>action('Aira intelligence')}><Sparkles/> Aira intelligence</button><button onClick={()=>action('Knowledge')}><Search/> Knowledge</button></nav><div><button onClick={onExit}><ArrowLeft/> Sign out of Team OS</button><div className="staff"><div>PS</div><span><b>Priya Shah</b><small>Travel specialist · Employee</small></span></div></div></aside><section className="specialist-main"><header><div><span>EMPLOYEE WORKSPACE · TRIPS / TLC-2847</span><h2>{pkg?.title||demoPackage.title}</h2></div><div><span className="opportunity"><i/> 92% ready</span><button className="primary" onClick={()=>notify('Proposal sent to traveler and activity logged')}>Send proposal <Send/></button></div></header><div className="specialist-grid"><div className="workspace"><div className="client-strip"><div className="avatar big">AS</div><div><b>Amit Sharma & family</b><span>{profile.travelers||'2 adults · 2 daughters, 9 & 13'} · {profile.travel_dates||'12–18 Oct 2026'}</span></div><div><small>BUDGET</small><b>{profile.budget||'₹3,00,000'}</b></div><div><small>PACE</small><b>{profile.pace||'Balanced'}</b></div><button onClick={()=>notify('Traveler conversation opened')}><MessageCircle/> Open conversation</button></div><div className="ai-brief"><div><Sparkles/></div><span><small>AIRA’S TRIP INTELLIGENCE</small><b>“Family wants memorable nature experiences without a hectic pace.”</b><p>Strong fit: Meghalaya. The younger daughter may need a shorter Nongriat trek option. Keep one flexible afternoon and prioritise adjoining rooms.</p></span><button onClick={()=>notify('Full AI traveler brief opened')}>View full brief</button></div><div className="builder-head"><div><span>PACKAGE BUILDER</span><h3>Stay selection</h3></div><b>{selected.filter(Boolean).length} of 3 properties selected</b></div><div className="specialist-hotels">{hotels.map((h,i)=><article className={selected[i]?'selected':''} key={h.name}><img src={h.image}/><div><span>{h.place}</span><h4>{h.name}</h4><p><Star fill="currentColor"/> {h.rating} · TLC net rate <b>{h.price}</b></p></div><button onClick={()=>setSelected(s=>s.map((v,j)=>j===i?!v:v))}>{selected[i]?<><Check/> Selected</>:<><Plus/> Add</>}</button></article>)}</div><div className="builder-head"><div><span>OPERATIONS</span><h3>Experiences & transfers</h3></div><button onClick={()=>notify('All experiences opened for editing')}>Manage all <ArrowRight/></button></div><div className="ops-rows">{experiences.slice(0,3).map((x,i)=><div key={x.title}><i>{x.icon}</i><span><b>{x.title}</b><small>{x.meta}</small></span><em className={i<2?'confirmed':''}>{i<2?'Confirmed':'Hold requested'}</em><b>{x.price}</b><button onClick={()=>notify(`${x.title} options opened`)}>•••</button></div>)}</div></div><aside className="specialist-aside"><div className="panel"><header><span>CONCIERGE INBOX</span><b>{tasks} open</b></header><div className="request urgent"><i>!</i><div><small>2 min ago · In trip</small><b>Need a pharmacy nearby</b><p>Amit Sharma · Shillong</p></div><button onClick={()=>{setTasks(t=>Math.max(0,t-1));notify('Response composer opened for Amit')}}>Respond</button></div><div className="request"><i>☂</i><div><small>18 min ago · Proactive</small><b>Rain plan suggested</b><p>Aira · Cherrapunji</p></div><button onClick={()=>notify('Rain plan reviewed and approved')}>Review</button></div><div className="request"><i>🍽</i><div><small>1 hour ago · Preference</small><b>Less spicy meal</b><p>Confirmed by hotel</p></div><CheckCircle2/></div><button className="view-all" onClick={()=>notify('Complete concierge inbox opened')}>View all requests <ArrowRight/></button></div><div className="panel readiness"><header><span>TRIP READINESS</span><strong>78%</strong></header>{[['Hotels',true],['Vehicle & driver',true],['Experiences',false],['Traveler documents',false],['Final payment',false]].map(x=><div key={x[0]}><span><i className={x[1]?'done':''}>{x[1]?<Check/>:''}</i>{x[0]}</span><b>{x[1]?'Ready':'Pending'}</b></div>)}<button onClick={()=>notify('Traveler reminder scheduled')}><Bell/> Send smart reminder</button></div><div className="panel push-panel"><span><Bell/></span><div><b>Push to traveler</b><p>Send an update exactly when it matters.</p></div><button onClick={()=>notify('Push notification composer opened')}><ArrowRight/></button></div></aside></div></section>{toast&&<div className="toast"><CheckCircle2/>{toast}</div>}</main> }

export default App;
