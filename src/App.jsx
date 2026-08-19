import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  BriefcaseBusiness,
  CircleHelp,
  Clock3,
  Compass,
  Headphones,
  Heart,
  Hotel,
  Languages,
  LocateFixed,
  LockKeyhole,
  Map,
  MapPin,
  MessageCircle,
  Mic,
  Navigation,
  Phone,
  Plane,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Volume2,
  WalletCards,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { demoPackage, experiences, hotels } from "./demoData";
import hero from "./assets/meghalaya-hero.jpg";

const quickStarts = [
  {
    emoji: "👨‍👩‍👧‍👧",
    label: "Family adventure",
    value: "We want a memorable family adventure in North East India",
  },
  {
    emoji: "🌿",
    label: "Relaxing escape",
    value: "We want a relaxed premium holiday surrounded by nature",
  },
  {
    emoji: "✨",
    label: "Surprise us",
    value: "Surprise us with an amazing experience that children will remember",
  },
];
const languages = [
  { code: "en-IN", name: "English", native: "English" },
  { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
  { code: "mr-IN", name: "Marathi", native: "मराठी" },
  { code: "bn-IN", name: "Bengali", native: "বাংলা" },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்" },
];

const emptyProfile = {
  destination: "",
  departure_city: "",
  travel_dates: "",
  duration: "",
  budget: "",
  travelers: "",
  interests: [],
  hotel_style: "",
  pace: "",
};

function fallbackOptions(profile = emptyProfile, ready = false) {
  if (!profile.departure_city)
    return [
      { emoji: "🏙️", label: "Mumbai", value: "We will depart from Mumbai" },
      { emoji: "✈️", label: "Delhi", value: "We will depart from Delhi" },
      {
        emoji: "🌆",
        label: "Bengaluru",
        value: "We will depart from Bengaluru",
      },
      { emoji: "🌉", label: "Kolkata", value: "We will depart from Kolkata" },
    ];
  if (!profile.travel_dates)
    return [
      {
        emoji: "🍂",
        label: "October",
        value: "We would like to travel in October 2026",
      },
      {
        emoji: "🌤️",
        label: "November",
        value: "We would like to travel in November 2026",
      },
      {
        emoji: "❄️",
        label: "December",
        value: "We would like to travel in December 2026",
      },
      { emoji: "🗓️", label: "Flexible", value: "Our dates are flexible" },
    ];
  if (!profile.duration)
    return [
      {
        emoji: "⚡",
        label: "5 days",
        value: "We have 5 days for this holiday",
      },
      {
        emoji: "✨",
        label: "7 days",
        value: "We have 7 days for this holiday",
      },
      {
        emoji: "🌿",
        label: "9 days",
        value: "We have 9 days for this holiday",
      },
    ];
  if (!profile.budget)
    return [
      {
        emoji: "💚",
        label: "Up to ₹2L",
        value: "Our total budget is up to ₹2 lakh",
      },
      {
        emoji: "⭐",
        label: "₹2–3 lakh",
        value: "Our total budget is between ₹2 and ₹3 lakh",
      },
      {
        emoji: "💎",
        label: "₹3–5 lakh",
        value: "Our total budget is between ₹3 and ₹5 lakh",
      },
    ];
  if (!ready && !profile.pace)
    return [
      {
        emoji: "🌿",
        label: "Relaxed",
        value: "We prefer a relaxed pace with free time",
      },
      { emoji: "⚖️", label: "Balanced", value: "We prefer a balanced pace" },
      { emoji: "⚡", label: "Active", value: "We prefer an active itinerary" },
    ];
  if (!ready && !profile.interests?.length)
    return [
      {
        emoji: "🌄",
        label: "Nature & scenery",
        value: "We care most about nature, scenery and wildlife",
      },
      {
        emoji: "🥘",
        label: "Culture & food",
        value: "We care most about local culture and food",
      },
      {
        emoji: "🧗",
        label: "Family adventure",
        value: "We want family-friendly adventure and iconic sights",
      },
    ];
  if (!ready && !profile.hotel_style)
    return [
      {
        emoji: "🛏️",
        label: "Comfortable 3★",
        value: "We prefer comfortable three-star hotels",
      },
      {
        emoji: "⭐",
        label: "Premium 4★",
        value: "We prefer premium four-star hotels",
      },
      {
        emoji: "💎",
        label: "Luxury 5★",
        value: "We prefer luxury five-star hotels",
      },
    ];
  return [
    {
      emoji: "✨",
      label: "Looks perfect",
      value: "This direction looks perfect. Please create the package.",
    },
    {
      emoji: "🌿",
      label: "More relaxed",
      value: "Please make the pace more relaxed",
    },
    {
      emoji: "🧗",
      label: "More adventure",
      value: "Please add more family-friendly adventure",
    },
  ];
}

function Logo({ dark = false }) {
  return (
    <div className={`logo ${dark ? "logo-dark" : ""}`}>
      <span className="logo-mark">tlc</span>
      <span className="logo-copy">
        TRAVELOS<small>INTELLIGENT CONCIERGE</small>
      </span>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("welcome");
  const [pkg, setPkg] = useState(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showConcierge, setShowConcierge] = useState(false);
  const [toast, setToast] = useState("");

  const openDemo = () => {
    setPkg(demoPackage);
    setProfile({
      ...emptyProfile,
      destination: "Meghalaya",
      travel_dates: "12–18 October 2026",
      duration: "7 days",
      budget: "₹3 lakh",
      travelers: "2 adults · 2 children (9 & 13)",
      interests: ["Nature", "Culture", "Soft adventure"],
      hotel_style: "Premium 4★",
      pace: "Balanced",
    });
    setScreen("dashboard");
  };
  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2600);
  };

  if (screen === "welcome")
    return (
      <Welcome
        onStart={() => setScreen("chat")}
        onDemo={openDemo}
        onEmployee={() => setScreen("employee-login")}
      />
    );
  if (screen === "employee-login")
    return (
      <EmployeeLogin
        onBack={() => setScreen("welcome")}
        onEnter={() => setScreen("employee-dashboard")}
      />
    );
  if (screen === "employee-dashboard")
    return (
      <Specialist
        pkg={pkg}
        profile={profile}
        onExit={() => setScreen("welcome")}
        notify={notify}
        toast={toast}
      />
    );
  if (screen === "chat")
    return (
      <Chat
        onBack={() => setScreen("welcome")}
        onComplete={(newPkg, newProfile) => {
          setPkg(newPkg);
          setProfile(newProfile);
          setScreen("dashboard");
        }}
        onDemo={openDemo}
      />
    );
  return (
    <Dashboard
      pkg={pkg}
      profile={profile}
      tab={activeTab}
      setTab={setActiveTab}
      showConcierge={showConcierge}
      setShowConcierge={setShowConcierge}
      onBack={() => setScreen("chat")}
      onExit={() => setScreen("welcome")}
      notify={notify}
      toast={toast}
    />
  );
}

function Welcome({ onStart, onDemo, onEmployee }) {
  return (
    <main className="welcome">
      <nav className="landing-nav">
        <Logo dark />
        <div className="nav-actions">
          <span className="online">
            <i /> AI concierge online
          </span>
          <button className="team-login-link" onClick={onEmployee}>
            <LockKeyhole size={14} /> TLC team login
          </button>
          <button className="ghost" onClick={onDemo}>
            View traveler demo
          </button>
        </div>
      </nav>
      <section className="welcome-grid">
        <div className="welcome-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> A HOLIDAY DESIGNED AROUND YOU
          </div>
          <h1>
            Tell us the feeling.
            <br />
            <em>We’ll shape the journey.</em>
          </h1>
          <p>
            Meet Aira, your personal travel concierge. Speak naturally or type a
            message—she’ll understand who you’re travelling with, what you love,
            and curate the details.
          </p>
          <div className="start-actions">
            <button className="primary large" onClick={onStart}>
              <MessageCircle size={19} /> Start a conversation{" "}
              <ArrowRight size={18} />
            </button>
            <button className="voice-orb" onClick={onStart}>
              <Mic size={22} />
            </button>
            <span>or speak to Aira</span>
          </div>
          <div className="trust-row">
            <span>
              <CheckCircle2 /> Personalised by AI
            </span>
            <span>
              <ShieldCheck /> Human-verified
            </span>
            <span>
              <Clock3 /> Available 24×7
            </span>
          </div>
        </div>
        <div className="welcome-visual">
          <div className="photo-frame">
            <img src={hero} />
            <div className="photo-shade" />
            <div className="photo-caption">
              <span>CURATED FOR FAMILIES</span>
              <strong>Where the clouds come home</strong>
              <small>
                <MapPin size={13} /> Meghalaya, North East India
              </small>
            </div>
          </div>
          <div className="floating-card weather">
            <span>18°</span>
            <div>
              <b>Misty morning</b>
              <small>Perfect for waterfalls</small>
            </div>
          </div>
          <div className="floating-card aira">
            <div className="aira-avatar">A</div>
            <div>
              <b>Aira found 3 ideas</b>
              <small>Matched to your family</small>
            </div>
            <Sparkles size={18} />
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <span>Thoughtful travel, powered by TLC</span>
        <span>Flights · Stays · Experiences · Visa · 24×7 care</span>
      </footer>
    </main>
  );
}

function EmployeeLogin({ onBack, onEnter }) {
  const [email, setEmail] = useState("priya@tlcholidays.com");
  const [password, setPassword] = useState("tlcdemo");
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (email && password) {
      setError("");
      onEnter();
    } else setError("Enter your TLC email and password");
  };
  return (
    <main className="employee-login">
      <section className="employee-login-brand">
        <Logo />
        <div>
          <span>TLC TEAM WORKSPACE</span>
          <h1>
            Every traveler.
            <br />
            Every trip.
            <br />
            <em>One clear view.</em>
          </h1>
          <p>
            Manage assigned journeys, approve stays and experiences, respond to
            concierge requests, and keep every departure ready.
          </p>
        </div>
        <small>Internal access · TLC Holidays</small>
      </section>
      <section className="employee-login-form">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft /> Back to traveler website
        </button>
        <form onSubmit={submit}>
          <div className="employee-login-icon">
            <BriefcaseBusiness />
          </div>
          <span>EMPLOYEE SIGN IN</span>
          <h2>Welcome back, Priya</h2>
          <p>Sign in to your TLC operations workspace.</p>
          <label>
            Work email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </label>
          {error && <small className="login-error">{error}</small>}
          <button className="primary" type="submit">
            Open team workspace <ArrowRight />
          </button>
          <div className="login-demo">
            <ShieldCheck />
            <span>
              <b>Prototype access</b>
              <small>
                Demo credentials are pre-filled for this presentation.
              </small>
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}

function Chat({ onBack, onComplete, onDemo }) {
  const initial = [
    {
      role: "assistant",
      content:
        "Hello! I’m Aira, your TLC travel concierge. Tell me about the holiday you have in mind—who’s travelling, where you’d love to go, or simply how you want it to feel.",
    },
  ];
  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [completion, setCompletion] = useState(12);
  const [language, setLanguage] = useState(languages[0]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voicePhase, setVoicePhase] = useState("idle");
  const [voiceDraft, setVoiceDraft] = useState("");
  const [readyPkg, setReadyPkg] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [curating, setCurating] = useState(false);
  const [curationStage, setCurationStage] = useState(0);
  const [packageMeta, setPackageMeta] = useState(null);
  const [suggestions, setSuggestions] = useState(quickStarts);
  const bottomRef = useRef();
  const inputRef = useRef();
  const liveSessionRef = useRef(null);
  const messagesRef = useRef(initial);
  const profileRef = useRef(emptyProfile);
  const loadingRef = useRef(false);
  const voiceModeRef = useRef(false);
  const voiceAutoContinueRef = useRef(false);
  const languageRef = useRef(languages[0]);
  const voiceAudioRef = useRef(null);
  const speechRequestRef = useRef(null);
  const voiceRestartTimerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef([]);
  const liveTranscriptRef = useRef("");
  const voiceDraftRef = useRef("");
  const voiceSubmitTimerRef = useRef(null);
  const voiceFinalizeTimerRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, suggestions, voicePhase]);
  useEffect(() => {
    return () => {
      stopLiveAudio(true);
      clearTimeout(voiceSubmitTimerRef.current);
      clearTimeout(voiceFinalizeTimerRef.current);
      clearTimeout(voiceRestartTimerRef.current);
      speechRequestRef.current?.abort();
      try {
        voiceAudioRef.current?.pause?.();
        voiceAudioRef.current?.stop?.();
      } catch {}
      window.speechSynthesis?.cancel();
    };
  }, []);

  async function send(text = input) {
    const cleanText = String(text || "").trim();
    if (!cleanText || loadingRef.current) return;
    loadingRef.current = true;
    clearTimeout(voiceSubmitTimerRef.current);
    clearTimeout(voiceRestartTimerRef.current);
    setVoicePhase("thinking");
    const next = [...messagesRef.current, { role: "user", content: cleanText }];
    messagesRef.current = next;
    setMessages(next);
    setInput("");
    setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const assistantMessage = { role: "assistant", content: data.reply };
      messagesRef.current = [...messagesRef.current, assistantMessage];
      setMessages(messagesRef.current);
      const nextProfile = data.profile || profileRef.current;
      profileRef.current = nextProfile;
      setProfile(nextProfile);
      setCompletion(data.completion || 20);
      if (data.ready_to_build) {
        setSuggestions([]);
        setShowSummary(true);
      } else
        setSuggestions(
          data.quick_replies?.length >= 3
            ? data.quick_replies
            : fallbackOptions(nextProfile, false),
        );
      if (voiceModeRef.current) speakWithGemini(data.reply);
      else setVoicePhase("idle");
    } catch (e) {
      const recovery =
        "I have your brief. Let’s continue one simple step at a time. Which of these options suits you best?";
      messagesRef.current = [
        ...messagesRef.current,
        { role: "assistant", content: recovery },
      ];
      setMessages(messagesRef.current);
      setSuggestions(fallbackOptions(profileRef.current));
      if (voiceModeRef.current) speakWithGemini(recovery);
      else setVoicePhase("idle");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  function preferredSystemVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const languagePrefix = languageRef.current.code.slice(0, 2).toLowerCase();
    return (
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(languagePrefix) &&
          /samantha|ava premium|serena|sonia|neerja|rishi|google.*female|karen|moira/i.test(
            v.name,
          ),
      ) ||
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(languagePrefix) &&
          /female|natural|premium/i.test(v.name),
      ) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(languagePrefix)) ||
      null
    );
  }

  function finishSpeaking() {
    setVoicePhase("idle");
    if (!voiceAutoContinueRef.current) return;
    clearTimeout(voiceRestartTimerRef.current);
    voiceRestartTimerRef.current = setTimeout(() => {
      if (voiceAutoContinueRef.current && !loadingRef.current)
        beginListening(languageRef.current);
    }, 700);
  }

  function speakWithSystemVoice(text) {
    if (!("speechSynthesis" in window)) {
      finishSpeaking();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageRef.current.code;
      utterance.rate = 0.94;
      utterance.pitch = 1.02;
      utterance.volume = 1;
      utterance.voice = preferredSystemVoice();
      utterance.onend = finishSpeaking;
      utterance.onerror = finishSpeaking;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();
    } catch {
      finishSpeaking();
    }
  }

  async function speakWithGemini(text) {
    setVoicePhase("speaking");
    speechRequestRef.current?.abort();
    try {
      voiceAudioRef.current?.pause?.();
      voiceAudioRef.current?.stop?.();
    } catch {}
    window.speechSynthesis?.cancel();
    const controller = new AbortController();
    speechRequestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 2200);
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: languageRef.current.code }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Gemini voice unavailable");
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      voiceAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        finishSpeaking();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        speakWithSystemVoice(text);
      };
      await audio.play();
    } catch {
      speakWithSystemVoice(text);
    } finally {
      clearTimeout(timeout);
    }
  }

  function stageVoiceDraft(text) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) {
      setVoicePhase("idle");
      return;
    }
    voiceDraftRef.current = clean;
    setVoiceDraft(clean);
    setInput(clean);
    setVoicePhase("reviewing");
    clearTimeout(voiceSubmitTimerRef.current);
    if (clean.split(" ").length >= 4)
      voiceSubmitTimerRef.current = setTimeout(() => commitVoiceDraft(), 2600);
  }

  function commitVoiceDraft() {
    clearTimeout(voiceSubmitTimerRef.current);
    const text = voiceDraftRef.current.trim();
    if (!text) return;
    setVoiceDraft("");
    voiceDraftRef.current = "";
    send(text);
  }

  function continueVoiceDraft() {
    clearTimeout(voiceSubmitTimerRef.current);
    const seed = voiceDraftRef.current;
    setVoiceDraft("");
    beginListening(languageRef.current, seed);
  }

  function cancelVoiceDraft() {
    clearTimeout(voiceSubmitTimerRef.current);
    voiceDraftRef.current = "";
    setVoiceDraft("");
    setInput("");
    setVoicePhase("idle");
  }

  function endVoiceMode() {
    voiceAutoContinueRef.current = false;
    voiceModeRef.current = false;
    setVoiceMode(false);
    clearTimeout(voiceRestartTimerRef.current);
    speechRequestRef.current?.abort();
    stopLiveAudio(true);
    window.speechSynthesis?.cancel();
    setVoicePhase("idle");
  }

  async function confirmAndCurate() {
    voiceAutoContinueRef.current = false;
    clearTimeout(voiceRestartTimerRef.current);
    stopLiveAudio(true);
    window.speechSynthesis?.cancel();
    setShowSummary(false);
    setCurating(true);
    setCurationStage(0);
    const stageTimer = setInterval(
      () => setCurationStage((stage) => Math.min(stage + 1, 3)),
      1700,
    );
    try {
      const response = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileRef.current,
          messages: messagesRef.current,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.package?.days?.length)
        throw new Error(data.error || "The package could not be created");
      setReadyPkg(data.package);
      setPackageMeta({
        provider: data.provider,
        researchedAt: data.researched_at,
        warning: data.warning,
      });
      setCurationStage(4);
      const note = {
        role: "assistant",
        content: `Your complete ${data.package.destination} holiday is ready. I’ve populated the route, day-by-day plan, budget, weather guidance, local support and practical travel information. Your TLC specialist only needs to confirm your hotel and optional experiences.`,
      };
      messagesRef.current = [...messagesRef.current, note];
      setMessages(messagesRef.current);
    } catch {
      setShowSummary(true);
      const note = {
        role: "assistant",
        content:
          "I could not complete the live research just now. Your confirmed brief is safe—please try creating the package again.",
      };
      messagesRef.current = [...messagesRef.current, note];
      setMessages(messagesRef.current);
    } finally {
      clearInterval(stageTimer);
      setCurating(false);
    }
  }

  function editSummary() {
    setShowSummary(false);
    setSuggestions([
      {
        emoji: "📅",
        label: "Change dates",
        value: "I want to change my travel dates",
      },
      {
        emoji: "💰",
        label: "Change budget",
        value: "I want to change my budget",
      },
      { emoji: "🌿", label: "Change pace", value: "I want to change the pace" },
      {
        emoji: "🏨",
        label: "Change hotels",
        value: "I want to change my hotel preference",
      },
    ]);
    inputRef.current?.focus();
  }

  function beginBrowserListening(selectedLanguage = language, seed = "") {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Voice input is best experienced in Chrome or Edge. You can continue by typing naturally below.",
        },
      ]);
      return;
    }
    window.speechSynthesis?.cancel();
    const recognition = new Recognition();
    recognition.lang = selectedLanguage.code;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => {
      setListening(true);
      setVoicePhase("listening");
    };
    recognition.onresult = (e) => {
      const text = `${seed ? `${seed.trim()} ` : ""}${Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("")}`;
      voiceDraftRef.current = text;
      setInput(text);
    };
    recognition.onend = () => {
      setListening(false);
      stageVoiceDraft(voiceDraftRef.current);
    };
    recognition.onerror = () => {
      setListening(false);
      setVoicePhase("idle");
    };
    recognition.start();
  }

  function stopLiveAudio(closeSession = false) {
    for (const node of audioNodesRef.current) {
      try {
        node.disconnect();
      } catch {}
    }
    audioNodesRef.current = [];
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed")
      audioContextRef.current.close();
    audioContextRef.current = null;
    if (liveSessionRef.current) {
      try {
        liveSessionRef.current.sendRealtimeInput({ audioStreamEnd: true });
      } catch {}
      if (closeSession) {
        try {
          liveSessionRef.current.close();
        } catch {}
        liveSessionRef.current = null;
      }
    }
    setListening(false);
  }

  function pcmToBase64(samples) {
    const pcm = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++)
      pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 0x7fff;
    const bytes = new Uint8Array(pcm.buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  }

  async function beginListening(selectedLanguage = language, seed = "") {
    voiceAudioRef.current?.pause();
    window.speechSynthesis?.cancel();
    clearTimeout(voiceSubmitTimerRef.current);
    clearTimeout(voiceFinalizeTimerRef.current);
    liveTranscriptRef.current = seed ? `${seed.trim()} ` : "";
    setInput(seed);
    setVoicePhase("connecting");
    setListening(true);
    try {
      const tokenResponse = await fetch("/api/gemini-live-token");
      const credentials = await tokenResponse.json();
      if (!tokenResponse.ok)
        throw new Error(credentials.error || "Could not start Gemini Live");
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: credentials.token,
        httpOptions: { apiVersion: "v1alpha" },
      });
      let session;
      session = await ai.live.connect({
        model: credentials.model,
        config: {
          responseModalities: ["AUDIO"],
          inputAudioTranscription: {},
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: false,
              startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
              endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
              prefixPaddingMs: 80,
              silenceDurationMs: 1800,
            },
          },
          systemInstruction: `You are listening to a TLC Holidays traveler speaking in ${selectedLanguage.name}. Listen naturally and acknowledge briefly. Respond in ${selectedLanguage.name}.`,
        },
        callbacks: {
          onmessage: (message) => {
            const transcript = message.serverContent?.inputTranscription?.text;
            if (transcript) {
              liveTranscriptRef.current += transcript;
              setInput(liveTranscriptRef.current.trim());
            }
            if (message.serverContent?.turnComplete) {
              clearTimeout(voiceFinalizeTimerRef.current);
              voiceFinalizeTimerRef.current = setTimeout(() => {
                const finalText = liveTranscriptRef.current.trim();
                stopLiveAudio(true);
                stageVoiceDraft(finalText);
              }, 450);
            }
          },
          onerror: () => {
            stopLiveAudio(true);
            beginBrowserListening(selectedLanguage);
          },
          onclose: () => setListening(false),
        },
      });
      liveSessionRef.current = session;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;
      const context = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = context;
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);
      const silent = context.createGain();
      silent.gain.value = 0;
      processor.onaudioprocess = (event) => {
        if (!liveSessionRef.current) return;
        const data = pcmToBase64(event.inputBuffer.getChannelData(0));
        session.sendRealtimeInput({
          audio: { data, mimeType: `audio/pcm;rate=${context.sampleRate}` },
        });
      };
      source.connect(processor);
      processor.connect(silent);
      silent.connect(context.destination);
      audioNodesRef.current = [source, processor, silent];
      setVoicePhase("listening");
    } catch (error) {
      stopLiveAudio(true);
      beginBrowserListening(selectedLanguage, seed);
    }
  }

  function startVoice() {
    if (!voiceMode) {
      setLanguageOpen(true);
      return;
    }
    if (listening) {
      stopLiveAudio(false);
      return;
    }
    voiceAutoContinueRef.current = true;
    beginListening(language);
  }

  const facts = [
    ["Travel party", profile.travelers, Users],
    ["Destination", profile.destination, MapPin],
    ["Dates", profile.travel_dates, CalendarDays],
    ["Duration", profile.duration, Clock3],
    ["Budget", profile.budget, WalletCards],
    ["Travel style", profile.pace || profile.hotel_style, Compass],
  ];
  const phaseCopy = {
    connecting: "Connecting securely…",
    listening: "Listening — take your time",
    reviewing: "Confirming what we heard",
    thinking: "Curating your next step…",
    speaking: "Aira is speaking",
  };
  const visibleSuggestions = suggestions.length
    ? suggestions
    : !loading && !showSummary && !curating && !readyPkg
      ? fallbackOptions(profile, false)
      : [];
  const summaryFacts = [
    ["Travelers", profile.travelers, Users],
    ["Destination", profile.destination, MapPin],
    ["Departure", profile.departure_city, Plane],
    ["Dates", profile.travel_dates, CalendarDays],
    ["Duration", profile.duration, Clock3],
    ["Budget", profile.budget, WalletCards],
    ["Pace", profile.pace, Compass],
    ["Hotels", profile.hotel_style, Hotel],
    ["Interests", profile.interests?.join(" · "), Sparkles],
  ];
  return (
    <main className="chat-shell">
      <header className="chat-header">
        <button className="icon-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
        <Logo dark />
        <div className="header-right">
          <button className="lang-button" onClick={() => setLanguageOpen(true)}>
            <Languages size={17} />
            {language.native}
            <ChevronDown size={14} />
          </button>
          <button className="ghost" onClick={onDemo}>
            Skip to demo
          </button>
        </div>
      </header>
      <div className="chat-layout">
        <section className="conversation">
          <div className="conversation-heading">
            <div>
              <span
                className={`status-dot ${voicePhase !== "idle" ? "active" : ""}`}
              />{" "}
              Aira is online{" "}
              <span className="gemini-badge">
                <Sparkles size={10} /> Gemini Live
              </span>
            </div>
            <small>
              {phaseCopy[voicePhase] ||
                "Tap an answer or speak naturally — no forms."}
            </small>
          </div>
          {voiceMode && (
            <div className="voice-session">
              <span className="voice-session-orb">
                <Mic />
              </span>
              <span>
                <b>Hands-free conversation</b>
                <small>
                  Aira replies aloud, then listens for your next answer in{" "}
                  {language.name}.
                </small>
              </span>
              <button onClick={endVoiceMode}>End voice</button>
            </div>
          )}
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.role}`}>
                {m.role === "assistant" && <div className="bot-avatar">A</div>}
                <div className="bubble">
                  {m.content}
                  {m.role === "assistant" && (
                    <button
                      className="listen-again"
                      onClick={() => speakWithGemini(m.content)}
                    >
                      <Volume2 /> Listen
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!loading && !!visibleSuggestions.length && (
              <div className="smart-replies">
                <div className="smart-replies-label">
                  <Sparkles /> ANSWER IN ONE TAP
                </div>
                <div className="smart-replies-grid">
                  {visibleSuggestions.map((q, i) => (
                    <button
                      key={`${q.label}-${i}`}
                      onClick={() => send(q.value || q.label)}
                    >
                      <i>{q.emoji || "✨"}</i>
                      <span>{q.label}</span>
                      <ArrowRight />
                    </button>
                  ))}
                  <button
                    className="type-own"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <i>⌨️</i>
                    <span>Type my own answer</span>
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div className="message-row assistant">
                <div className="bot-avatar">A</div>
                <div className="bubble thinking-bubble">
                  <span className="thinking-orbit">
                    <Sparkles />
                  </span>
                  <div>
                    <b>Aira is curating</b>
                    <small>
                      Understanding your preferences and preparing the best next
                      choices…
                    </small>
                  </div>
                </div>
              </div>
            )}
            {showSummary && (
              <section className="request-summary">
                <header>
                  <div>
                    <CheckCircle2 />
                    <span>
                      <small>YOUR CONFIRMED TRAVEL BRIEF</small>
                      <h2>Have I understood everything correctly?</h2>
                    </span>
                  </div>
                  <p>
                    I’ll use this exact brief to research and build your holiday
                    in real time.
                  </p>
                </header>
                <div className="summary-facts">
                  {summaryFacts.map(([label, value, Icon]) => (
                    <div key={label}>
                      <Icon />
                      <span>
                        <small>{label}</small>
                        <b>{value || "Needs confirmation"}</b>
                      </span>
                      {value && <Check />}
                    </div>
                  ))}
                </div>
                <div className="summary-actions">
                  <button onClick={editSummary}>Edit my request</button>
                  <button className="primary" onClick={confirmAndCurate}>
                    <WandSparkles /> Confirm & curate my holiday
                  </button>
                </div>
              </section>
            )}
            {curating && (
              <section className="curation-progress">
                <div className="curation-orbit">
                  <WandSparkles />
                </div>
                <span>BUILDING YOUR HOLIDAY LIVE</span>
                <h2>Aira is researching and connecting every detail</h2>
                <div>
                  {[
                    "Checking the best route and signature attractions",
                    "Building a realistic day-by-day flow",
                    "Estimating costs, weather and local transport",
                    "Adding nearby hospitals, police and practical advice",
                  ].map((step, index) => (
                    <p
                      className={index <= curationStage ? "done" : ""}
                      key={step}
                    >
                      <i>
                        {index < curationStage ? (
                          <Check />
                        ) : index === curationStage ? (
                          <Sparkles />
                        ) : (
                          index + 1
                        )}
                      </i>
                      {step}
                    </p>
                  ))}
                </div>
                <small>
                  This can take a few moments. Your dashboard will use this
                  package—not a demo itinerary.
                </small>
              </section>
            )}
            {readyPkg && (
              <div className="package-ready dynamic">
                <div className="ready-icon">
                  <WandSparkles />
                </div>
                <div>
                  <small>
                    {packageMeta?.provider === "gemini-grounded"
                      ? "LIVE RESEARCH COMPLETE"
                      : "CURATED PACKAGE READY"}
                  </small>
                  <b>{readyPkg.title}</b>
                  <span>
                    {readyPkg.duration} · {readyPkg.price} ·{" "}
                    {readyPkg.days.length} days populated
                  </span>
                </div>
                <button
                  className="primary"
                  onClick={() => onComplete(readyPkg, profile)}
                >
                  Take me to my package <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="composer-wrap">
            {(voicePhase === "connecting" || voicePhase === "listening") && (
              <div className="listening-bar">
                <span className="waves">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <b>
                    {voicePhase === "connecting"
                      ? "Preparing private voice session…"
                      : `Listening in ${language.name}`}
                  </b>
                  <small>
                    {voicePhase === "listening"
                      ? "Pause naturally — Aira waits for you to finish."
                      : ""}
                  </small>
                </span>
                {voicePhase === "listening" && (
                  <button onClick={() => stopLiveAudio(false)}>I’m done</button>
                )}
              </div>
            )}
            {voicePhase === "reviewing" && (
              <div className="voice-review">
                <div className="voice-review-head">
                  <CheckCircle2 />
                  <span>
                    <b>Here’s what I heard</b>
                    <small>
                      {voiceDraft.split(" ").length < 4
                        ? "Keep speaking or send when ready."
                        : "Sending shortly — continue if you weren’t finished."}
                    </small>
                  </span>
                  <button onClick={cancelVoiceDraft}>
                    <X />
                  </button>
                </div>
                <p>“{voiceDraft}”</p>
                <div>
                  <button onClick={continueVoiceDraft}>
                    <Mic /> Continue speaking
                  </button>
                  <button className="confirm-voice" onClick={commitVoiceDraft}>
                    Use this <ArrowRight />
                  </button>
                </div>
              </div>
            )}
            <div className="composer">
              <button
                aria-label={
                  listening ? "Finish speaking" : "Start voice conversation"
                }
                className={`mic-button ${listening ? "active" : ""}`}
                onClick={startVoice}
              >
                <Mic />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={
                  visibleSuggestions.length
                    ? "Or type something different…"
                    : "Tell Aira what you have in mind…"
                }
                rows="1"
              />
              <button
                aria-label="Send message"
                className="send-button"
                onClick={() => send()}
                disabled={!input.trim() || loading}
              >
                <Send />
              </button>
            </div>
            <small>
              AI can make mistakes. Your TLC specialist verifies availability
              and important details.
            </small>
          </div>
        </section>
        <aside className="trip-brief">
          <div className="brief-head">
            <span>LIVE TRIP BRIEF</span>
            <b>{completion}% understood</b>
          </div>
          <div className="progress">
            <i style={{ width: `${completion}%` }} />
          </div>
          <h2>
            Your holiday,
            <br />
            <em>taking shape.</em>
          </h2>
          <p>
            Aira quietly organises the details as you talk. You’ll never fill a
            long form.
          </p>
          <div className="facts">
            {facts.map(([label, value, Icon]) => (
              <div className={`fact ${value ? "filled" : ""}`} key={label}>
                <div>
                  <Icon size={17} />
                </div>
                <span>
                  <small>{label}</small>
                  <b>{value || "Not discussed yet"}</b>
                </span>
                {value && <Check size={15} />}
              </div>
            ))}
          </div>
          {!!profile.interests?.length && (
            <div className="interest-chips">
              {profile.interests.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          )}
          <div className="privacy-note">
            <ShieldCheck />
            <span>
              <b>Your conversation is private</b>
              <small>Used only to design and service your trip.</small>
            </span>
          </div>
        </aside>
      </div>
      {languageOpen && (
        <div className="modal-backdrop" onClick={() => setLanguageOpen(false)}>
          <div className="language-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setLanguageOpen(false)}>
              <X />
            </button>
            <div className="modal-icon">
              <Mic />
            </div>
            <h2>Which language shall we speak?</h2>
            <p>
              Aira will listen in your language, reply aloud, and keep the
              conversation moving naturally.
            </p>
            <div className="language-grid">
              {languages.map((l) => (
                <button
                  className={l.code === language.code ? "selected" : ""}
                  key={l.code}
                  onClick={() => {
                    languageRef.current = l;
                    voiceModeRef.current = true;
                    voiceAutoContinueRef.current = true;
                    setLanguage(l);
                    setVoiceMode(true);
                    setLanguageOpen(false);
                    window.speechSynthesis?.getVoices();
                    setTimeout(() => beginListening(l), 120);
                  }}
                >
                  <b>{l.native}</b>
                  <span>{l.name}</span>
                  {l.code === language.code && <Check />}
                </button>
              ))}
            </div>
            <small>Your Gemini key stays securely on the server.</small>
          </div>
        </div>
      )}
    </main>
  );
}

function Dashboard({
  pkg,
  profile,
  tab,
  setTab,
  showConcierge,
  setShowConcierge,
  onBack,
  onExit,
  notify,
  toast,
}) {
  const tabs = [
    "Overview",
    "Itinerary",
    "Stay & experiences",
    "Safety hub",
    "Documents",
  ];
  const isMeghalaya = /meghalaya|north\s*east|shillong|cherrapunji/i.test(pkg.destination || "");
  const heroBackground = isMeghalaya
    ? `url(${hero})`
    : "radial-gradient(circle at 78% 22%, rgba(220,233,155,.32), transparent 28%), linear-gradient(120deg, #0c3028, #245e4f 58%, #769887)";
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [section, setSection] = useState("My trip");
  const tripAlerts = [
    { title: "Curated package ready", text: `${pkg.days.length} days across ${pkg.destination} are now available in your dashboard.` },
    { title: "Your selection is needed", text: "Choose a preferred hotel and any optional experiences for specialist confirmation." },
  ];
  return (
    <main className="app-shell">
      <aside className="side-nav">
        <Logo />
        <div className="portal-identity">
          TRAVELER
          <br />
          PORTAL
        </div>
        <nav>
          <button
            className={section === "My trip" ? "active" : ""}
            onClick={() => setSection("My trip")}
          >
            <Map />
            <span>My trip</span>
          </button>
          <button
            className={section === "Messages" ? "active" : ""}
            onClick={() => setSection("Messages")}
          >
            <MessageCircle />
            <span>Messages</span>
            <i>2</i>
          </button>
          <button
            className={section === "Payments" ? "active" : ""}
            onClick={() => setSection("Payments")}
          >
            <WalletCards />
            <span>Payments</span>
          </button>
          <button
            className={section === "Travelers" ? "active" : ""}
            onClick={() => setSection("Travelers")}
          >
            <Users />
            <span>Travelers</span>
          </button>
        </nav>
        <div className="side-bottom">
          <button onClick={onExit}>
            <ArrowLeft />
            <span>Exit portal</span>
          </button>
          <div className="avatar">AS</div>
        </div>
      </aside>
      <section className="main-app">
        <header className="app-header">
          <div>
            <button onClick={onBack} className="back-link">
              <ArrowLeft size={15} /> Trip studio
            </button>
            <span className="trip-id">
              {section === "My trip"
                ? "TRIP · TLC-2847"
                : section.toUpperCase()}
            </span>
          </div>
          <div className="app-actions">
            <button
              className="icon-btn"
              onClick={() => setAlertsOpen(!alertsOpen)}
            >
              <Bell />
              <i />
            </button>
            <button
              className="specialist-pill"
              onClick={() => setShowConcierge(true)}
            >
              <div>PS</div>
              <span>
                <small>Your specialist</small>
                <b>Priya Shah</b>
              </span>
              <MessageCircle size={17} />
            </button>
          </div>
        </header>
        {alertsOpen && (
          <div className="notification-pop">
            <b>Smart updates</b>
          {tripAlerts.map((a) => (
              <div key={a.title}>
                <span>✓</span>
                <p>
                  <b>{a.title}</b>
                  <small>{a.text}</small>
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="dashboard-scroll">
          {section === "My trip" ? (
            <>
          <section className="trip-hero" style={{ backgroundImage: heroBackground }}>
                <div className="hero-overlay" />
                <div className="trip-hero-content">
                  <span className="confirmed">
                    <CheckCircle2 /> PERSONALISED ITINERARY CURATED
                  </span>
                  <h1>{pkg.title}</h1>
                  <p>{pkg.subtitle}</p>
                  <div className="hero-meta">
                    <span>
                      <CalendarDays />{" "}
                      {pkg.travel_dates || profile.travel_dates}
                    </span>
                    <span>
                      <Clock3 /> {pkg.duration || profile.duration}
                    </span>
                    <span>
                      <Users /> {pkg.travelers || profile.travelers}
                    </span>
                    <span>
                      <MapPin /> From{" "}
                      {pkg.departure_city || profile.departure_city}
                    </span>
                  </div>
                </div>
                <div className="trip-countdown">
                  <small>COMPLETE ITINERARY</small>
                  <div>
                    <b>{pkg.days.length}</b>
                    <span>days</span>
                  </div>
                  <p>Hotels & experiences awaiting selection</p>
                </div>
              </section>
              <div className="dashboard-tabs">
                {tabs.map((t) => (
                  <button
                    className={tab === t ? "active" : ""}
                    onClick={() => setTab(t)}
                    key={t}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tab === "Overview" && (
                <Overview pkg={pkg} setTab={setTab} notify={notify} />
              )}
              {tab === "Itinerary" && <Itinerary pkg={pkg} notify={notify} />}
              {tab === "Stay & experiences" && (
                <StayExperience pkg={pkg} notify={notify} />
              )}
              {tab === "Safety hub" && <Safety pkg={pkg} notify={notify} />}
              {tab === "Documents" && <Documents notify={notify} />}
            </>
          ) : (
            <PortalSection
              section={section}
              profile={profile}
              pkg={pkg}
              notify={notify}
              openConcierge={() => setShowConcierge(true)}
            />
          )}
        </div>
      </section>
      <div className="concierge-fab-wrap">
        <button
          className="sos"
          onClick={() => notify("SOS hold initiated — release to cancel")}
        >
          SOS
        </button>
        <button
          className="concierge-fab"
          onClick={() => setShowConcierge(true)}
        >
          <Headphones />
          <span>
            <b>Need anything?</b>
            <small>Your concierge is here 24×7</small>
          </span>
        </button>
      </div>
      {showConcierge && (
        <ConciergeDrawer
          pkg={pkg}
          onClose={() => setShowConcierge(false)}
          notify={notify}
        />
      )}{" "}
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </main>
  );
}

function Overview({ pkg, setTab, notify }) {
  const route = pkg.route?.length
    ? pkg.route.slice(0, 5)
    : pkg.days
        .map((day) => day.place)
        .filter((place, index, list) => place && place !== list[index - 1])
        .slice(0, 5)
        .map((place) => ({ place, nights: "", drive: "" }));
  const firstDay = pkg.days[0];
  const costs = pkg.cost_breakdown || [];
  const weather = pkg.weather || {};
  return (
    <div className="overview-grid">
      <div className="overview-main">
        <div className="section-title">
          <div>
            <span>AT A GLANCE</span>
            <h2>Your journey, beautifully organised</h2>
          </div>
          <button onClick={() => setTab("Itinerary")}>
            View full itinerary <ArrowRight />
          </button>
        </div>
        <div className="route-card">
          <div className="route-line">
            {route.map((stop, index) => (
              <div className="route-segment" key={`${stop.place}-${index}`}>
                <div className="route-stop">
                  <i />
                  <b>{stop.place}</b>
                  <small>
                    {stop.nights || (index === 0 ? "Arrive" : "Explore")}
                  </small>
                </div>
                {index < route.length - 1 && (
                  <div className="route-path">
                    <span>{route[index + 1]?.drive || "Scenic transfer"}</span>
                    <i />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="route-foot">
            <span>
              <Navigation /> {firstDay.transfer}
            </span>
            <span>
              <MapPin /> {route.length} route stops
            </span>
            <span>
              <ShieldCheck /> Route researched live
            </span>
          </div>
        </div>
        <div className="section-title compact">
          <div>
            <span>YOUR FIRST DAY</span>
            <h2>Day 1 · {firstDay.title}</h2>
          </div>
          <button onClick={() => setTab("Itinerary")}>
            All {pkg.days.length} days <ArrowRight />
          </button>
        </div>
        <div className="day-preview">
          <div className="day-time">
            <b>AM</b>
          </div>
          <div className="timeline-dot plane">
            <Plane />
          </div>
          <div>
            <b>{firstDay.morning}</b>
            <p>{firstDay.description}</p>
            <span className="tag">
              <Check /> Curated
            </span>
          </div>
        </div>
        <div className="day-preview">
          <div className="day-time">
            <b>PM</b>
          </div>
          <div className="timeline-dot">
            <MapPin />
          </div>
          <div>
            <b>{firstDay.afternoon}</b>
            <p>{firstDay.evening}</p>
            <span className="tag">
              <Hotel /> Stay area: {firstDay.stay_area}
            </span>
          </div>
        </div>
      </div>
      <aside className="overview-side">
        <div className="care-card">
          <div className="care-head">
            <div className="avatar-photo">PS</div>
            <div>
              <span>YOUR TLC SPECIALIST</span>
              <b>Priya Shah</b>
              <small>
                <i /> Online · Replies in ~2 min
              </small>
            </div>
          </div>
          <p>
            “I’ll now confirm the best-matched hotels and optional experiences
            from Aira’s curated shortlist.”
          </p>
          <div>
            <button onClick={() => notify("Message sent to Priya")}>
              <MessageCircle /> Message
            </button>
            <button onClick={() => notify("Callback requested")}>
              <Phone /> Call
            </button>
          </div>
        </div>
        <div className="cost-card">
          <span>CURATED TRIP ESTIMATE</span>
          <h3>
            {pkg.price}
            <small>for this request</small>
          </h3>
          {costs.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <b>{item.amount}</b>
            </div>
          ))}
          <button
            className="primary"
            onClick={() => notify("Proposal link copied")}
          >
            Review package <ArrowRight />
          </button>
          <small>Final price after hotel and experience selection.</small>
        </div>
        <div className="weather-card">
          <div>
            <span>{weather.label || "TRAVEL WEATHER"}</span>
            <b>{weather.summary}</b>
          </div>
          <strong>{weather.high}</strong>
          <p>
            <span>{weather.low} low</span>
            <i />
            <span>{weather.high} high</span>
          </p>
        </div>
      </aside>
    </div>
  );
}

function Itinerary({ pkg, notify }) {
  const days = pkg.days.filter((d) => d && (d.title || d.description));
  const [expanded, setExpanded] = useState(0);
  const [showMap, setShowMap] = useState(false);
  return (
    <div className="content-page">
      <div className="section-title">
        <div>
          <span>YOUR DAY-BY-DAY STORY</span>
          <h2>{days.length} days, fully populated</h2>
          <p>
            Hotels and optional tours remain selectable; the route and daily
            flow are complete.
          </p>
        </div>
        <button onClick={() => setShowMap(true)}>
          <Map /> View route map
        </button>
      </div>
      <div className="itinerary-list">
        {days.map((d, i) => (
          <article
            key={`${d.day}-${i}`}
            className={`itinerary-day ${expanded === i ? "expanded" : ""}`}
          >
            <div className="day-number">
              <small>DAY</small>
              <b>{String(d.day || i + 1).padStart(2, "0")}</b>
              <i />
            </div>
            <div className="day-content">
              <span>
                <MapPin /> {d.place}
              </span>
              <h3>{d.title}</h3>
              <p>{d.description}</p>
              <div className="mini-tags">
                <span>☀️ {d.morning}</span>
                <span>🌙 {d.evening}</span>
              </div>
              {expanded === i && (
                <div className="day-details dynamic-day">
                  <div>
                    <Clock3 />{" "}
                    <span>
                      <b>Afternoon</b>
                      <small>{d.afternoon}</small>
                    </span>
                  </div>
                  <div>
                    <Navigation />{" "}
                    <span>
                      <b>Transfer</b>
                      <small>{d.transfer}</small>
                    </span>
                  </div>
                  <div>
                    <Hotel />{" "}
                    <span>
                      <b>Stay area</b>
                      <small>{d.stay_area}</small>
                    </span>
                  </div>
                  <div>
                    <Sparkles />{" "}
                    <span>
                      <b>Meals</b>
                      <small>{d.meals}</small>
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      notify(`Change request opened for Day ${i + 1}`)
                    }
                  >
                    Request a change
                  </button>
                </div>
              )}
            </div>
            <button
              aria-label={`Toggle day ${i + 1}`}
              onClick={() => setExpanded(expanded === i ? -1 : i)}
            >
              <ChevronDown />
            </button>
          </article>
        ))}
      </div>
      {showMap && (
        <div className="modal-backdrop" onClick={() => setShowMap(false)}>
          <div className="route-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setShowMap(false)}>
              <X />
            </button>
            <span>YOUR CURATED ROUTE</span>
            <h2>{pkg.title}</h2>
            <div className="map-canvas">
              <div className="map-road" />
              {(pkg.route || []).slice(0, 4).map((stop, index) => (
                <div
                  className={`map-pin p${index + 1}`}
                  key={`${stop.place}-${index}`}
                >
                  <i>{index + 1}</i>
                  <b>{stop.place}</b>
                </div>
              ))}
            </div>
            <div className="map-summary">
              <span>
                <Navigation /> Planned transfers
              </span>
              <span>
                <MapPin /> {(pkg.route || []).length} route stops
              </span>
              <span>
                <Clock3 /> {pkg.duration}
              </span>
            </div>
            <button
              className="primary"
              onClick={() => {
                setShowMap(false);
                notify("Offline route saved to your trip");
              }}
            >
              Save offline route <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StayExperience({ pkg, notify }) {
  const hotelChoices = pkg.hotel_options?.length ? pkg.hotel_options : hotels;
  const tourChoices = pkg.experience_options?.length
    ? pkg.experience_options
    : experiences;
  const [selectedHotel, setSelectedHotel] = useState(-1);
  const [chosen, setChosen] = useState(tourChoices.map(() => false));
  return (
    <div className="content-page">
      <div className="selection-notice">
        <Sparkles />
        <span>
          <b>Your itinerary is complete</b>
          <p>
            These are the only decisions left. Your TLC specialist will verify
            availability and final contracted rates.
          </p>
        </span>
      </div>
      <div className="section-title">
        <div>
          <span>DESTINATION-MATCHED SHORTLIST</span>
          <h2>Select your preferred stay</h2>
          <p>
            Curated for {pkg.destination}, your route and{" "}
            {pkg.hotel_style || "requested comfort"}.
          </p>
        </div>
        <span className="verified">
          <ShieldCheck /> Specialist verification pending
        </span>
      </div>
      <div className="hotel-grid">
        {hotelChoices.map((h, i) => (
          <article
            className={`hotel-card ${selectedHotel === i ? "selected" : ""}`}
            key={h.name}
            onClick={() => setSelectedHotel(i)}
          >
            <div className="hotel-image">
              <img src={hotels[i % hotels.length].image} />
              <span>{h.tag}</span>
              {selectedHotel === i && (
                <i>
                  <Check />
                </i>
              )}
            </div>
            <div>
              <small>
                {h.place} · {h.type}
              </small>
              <h3>{h.name}</h3>
              <p>
                <Star fill="currentColor" /> {h.rating} rating
              </p>
              <b>{h.price}</b>
            </div>
          </article>
        ))}
      </div>
      <div className="section-title experience-head">
        <div>
          <span>OPTIONAL EXPERIENCES</span>
          <h2>Choose the tours you would enjoy</h2>
        </div>
        <button
          onClick={() => notify("Selections sent to your TLC specialist")}
        >
          Send selections
        </button>
      </div>
      <div className="experience-list">
        {tourChoices.map((x, i) => (
          <button
            key={x.title}
            className={chosen[i] ? "selected" : ""}
            onClick={() =>
              setChosen((s) => s.map((v, j) => (i === j ? !v : v)))
            }
          >
            <i>{x.icon || "✨"}</i>
            <span>
              <b>{x.title}</b>
              <small>{x.meta}</small>
            </span>
            <strong>{x.price}</strong>
            <em>{chosen[i] ? <Check /> : <Plus />}</em>
          </button>
        ))}
      </div>
    </div>
  );
}

function Safety({ pkg, notify }) {
  const safety = pkg.safety || {};
  const hospital = safety.hospitals?.[0];
  const police = safety.police?.[0];
  return (
    <div className="content-page safety-page">
      <div className="safety-hero">
        <ShieldCheck />
        <div>
          <span>DESTINATION SAFETY BRIEF</span>
          <h2>Support information for {pkg.destination}</h2>
          <p>
            Researched for your curated route. Your TLC specialist reconfirms
            contacts before departure.
          </p>
        </div>
        <b>
          <i /> PREPARED
        </b>
      </div>
      <div className="safety-grid">
        <div className="emergency-card">
          <span>EMERGENCY CONTACTS</span>
          <h3>Help along your route</h3>
          {hospital && (
            <div>
              <i className="hospital">+</i>
              <p>
                <b>{hospital.name}</b>
                <small>
                  {hospital.location} · {hospital.phone}
                </small>
              </p>
              <button
                onClick={() => notify(`${hospital.name}: ${hospital.phone}`)}
              >
                <Phone />
              </button>
            </div>
          )}
          {police && (
            <div>
              <i className="police">★</i>
              <p>
                <b>{police.name}</b>
                <small>
                  {police.location} · {police.phone}
                </small>
              </p>
              <button onClick={() => notify(`${police.name}: ${police.phone}`)}>
                <Phone />
              </button>
            </div>
          )}
          <div>
            <i>☎</i>
            <p>
              <b>India emergency helpline</b>
              <small>Police · Fire · Ambulance</small>
            </p>
            <button
              className="call112"
              onClick={() => notify("Emergency call to 112 initiated")}
            >
              Call 112
            </button>
          </div>
          <small>
            Always verify local numbers and operating status before travel.
          </small>
        </div>
        <div className="local-card">
          <span>LOCAL KNOW-HOW</span>
          <h3>What travelers should know</h3>
          <div>
            <b>🚕 Expected taxi rates</b>
            <p>{(safety.taxi_rates || []).join("\n")}</p>
          </div>
          <div>
            <b>⚠ Common tourist issues</b>
            <p>{(safety.common_issues || []).join("\n")}</p>
          </div>
          <div>
            <b>💡 Aira’s advice</b>
            <p>{(safety.advice || []).join("\n")}</p>
          </div>
          {pkg.sources?.length > 0 && (
            <div>
              <b>🔎 Research sources</b>
              <p>
                {pkg.sources.slice(0, 4).map((source) => (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    key={source.url}
                  >
                    {source.title}
                  </a>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Documents({ notify }) {
  const base = [
    ["Flight tickets", "PDF · 1.8 MB", "Ready offline"],
    ["Hotel vouchers", "3 confirmations", "Specialist verifying"],
    ["Traveler IDs", "4 documents", "Secure"],
    ["Travel insurance", "Family policy", "Recommended"],
  ];
  const [docs, setDocs] = useState(base);
  const [selected, setSelected] = useState(null);
  const input = useRef();
  const upload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocs((d) => [
        [file.name, `${(file.size / 1024).toFixed(0)} KB`, "Uploaded securely"],
        ...d,
      ]);
      notify(`${file.name} added to travel wallet`);
    }
  };
  return (
    <div className="content-page">
      <div className="section-title">
        <div>
          <span>ONE SECURE PLACE</span>
          <h2>Your travel wallet</h2>
          <p>Important files are ready even when connectivity isn’t.</p>
        </div>
        <button onClick={() => input.current?.click()}>
          <Plus /> Add document
        </button>
        <input ref={input} type="file" hidden onChange={upload} />
      </div>
      <div className="documents-grid">
        {docs.map((d, i) => (
          <article key={`${d[0]}-${i}`}>
            <div className={`doc-icon d${i % 4}`}>
              {i % 4 === 0 ? (
                <Plane />
              ) : i % 4 === 1 ? (
                <Hotel />
              ) : i % 4 === 2 ? (
                <Users />
              ) : (
                <ShieldCheck />
              )}
            </div>
            <h3>{d[0]}</h3>
            <p>{d[1]}</p>
            <span>
              <i />
              {d[2]}
            </span>
            <button onClick={() => setSelected(d)}>
              View <ArrowRight />
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="document-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setSelected(null)}>
              <X />
            </button>
            <div className="doc-preview">
              <ShieldCheck />
            </div>
            <span>SECURE TRAVEL DOCUMENT</span>
            <h2>{selected[0]}</h2>
            <p>
              {selected[1]} · {selected[2]}
            </p>
            <div>
              <CheckCircle2 /> Available offline and encrypted for this trip.
            </div>
            <button
              className="primary"
              onClick={() =>
                notify(`${selected[0]} downloaded for offline use`)
              }
            >
              Download for offline use
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalSection({ section, profile, pkg, notify, openConcierge }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState([]);
  const [paid, setPaid] = useState(false);
  const [contact, setContact] = useState("Priya");
  const send = () => {
    if (message.trim()) {
      setSent((s) => [...s, message.trim()]);
      setMessage("");
      notify("Message delivered to Priya");
    }
  };
  if (section === "Messages")
    return (
      <div className="portal-page">
        <div className="portal-title">
          <span>YOUR TLC TEAM</span>
          <h1>Messages</h1>
          <p>One conversation for every detail of your journey.</p>
        </div>
        <div className="messages-page">
          <aside>
            <b>Trip conversations</b>
            <button
              className={contact === "Priya" ? "active" : ""}
              onClick={() => setContact("Priya")}
            >
              <div>PS</div>
              <span>
                <b>Priya Shah</b>
                <small>That pace should work beautifully…</small>
              </span>
              <i>2</i>
            </button>
            <button
              className={contact === "Aira" ? "active" : ""}
              onClick={() => setContact("Aira")}
            >
              <div>A</div>
              <span>
                <b>Aira concierge</b>
                <small>Your journey brief is ready</small>
              </span>
            </button>
          </aside>
          <section>
            <header>
              <div className="avatar-photo">
                {contact === "Priya" ? "PS" : "A"}
              </div>
              <span>
                <b>{contact === "Priya" ? "Priya Shah" : "Aira concierge"}</b>
                <small>
                  <i /> Online now
                </small>
              </span>
              <button
                onClick={() =>
                  contact === "Priya"
                    ? notify("Callback requested from Priya")
                    : openConcierge()
                }
              >
                {contact === "Priya" ? <Phone /> : <Sparkles />}
              </button>
            </header>
            <div className="portal-chat">
              <div className="portal-bubble incoming">
                {contact === "Priya"
                  ? "I’ve reviewed the itinerary and kept Day 6 flexible for the family. Would you prefer kayaking or a relaxed Shillong afternoon?"
                  : "Your journey brief is ready. I can help with weather, packing, routes, or any change you have in mind."}
              </div>
              {contact === "Priya" && (
                <div className="portal-bubble outgoing">
                  A relaxed afternoon sounds better for us.
                </div>
              )}
              {sent.map((x, i) => (
                <div className="portal-bubble outgoing" key={i}>
                  {x}
                </div>
              ))}
            </div>
            <div className="portal-composer">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder={`Message ${contact}…`}
              />
              <button onClick={send}>
                <Send />
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  if (section === "Payments")
    return (
      <div className="portal-page">
        <div className="portal-title">
          <span>PACKAGE ESTIMATE</span>
          <h1>Your payment plan</h1>
          <p>
            Payment milestones appear after your hotel and experience selections
            are confirmed.
          </p>
        </div>
        <div className="payment-layout">
          <section className="payment-card">
            <div className="payment-total">
              <span>CURATED ESTIMATE</span>
              <h2>{pkg.price}</h2>
              <small>
                Based on your confirmed request · Final quote pending selections
              </small>
            </div>
            {(pkg.cost_breakdown || []).map((item, i) => (
              <div className="payment-row" key={item.label}>
                <i>{i + 1}</i>
                <span>
                  <b>{item.label}</b>
                  <small>Included in current estimate</small>
                </span>
                <strong>{item.amount}</strong>
              </div>
            ))}
          </section>
          <aside className="payment-safe">
            <ShieldCheck />
            <h3>No payment due yet</h3>
            <p>
              Your TLC specialist will issue the final proposal after stays and
              optional tours are selected.
            </p>
            <span>UPI · Cards · Net banking</span>
          </aside>
        </div>
      </div>
    );
  const travelers = [["Your travel party", profile.travelers || "Traveler details captured", "Conversation brief confirmed"]];
  return (
    <div className="portal-page">
      <div className="portal-title">
        <span>TRAVELER 360</span>
        <h1>Your family</h1>
        <p>Preferences travel with you, so you never repeat them.</p>
      </div>
      <div className="traveler-grid">
        {travelers.map((t, i) => (
          <article key={t[0]}>
            <div className="traveler-avatar">
              {t[0]
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </div>
            <span>
              <h3>{t[0]}</h3>
              <p>{t[1]}</p>
              <small>
                <CheckCircle2 /> {t[2]}
              </small>
            </span>
            <button onClick={() => notify(`${t[0]}'s preferences opened`)}>
              Edit
            </button>
          </article>
        ))}
      </div>
      <div className="family-preferences">
        <div>
          <Sparkles />
          <span>
            <b>Aira remembers your family</b>
            <p>
              {profile.hotel_style || "Premium family stays"} · Vegetarian meals
              · {profile.pace || "Balanced pace"} · Adjoining rooms preferred
            </p>
          </span>
        </div>
        <button onClick={openConcierge}>
          Update with concierge <ArrowRight />
        </button>
      </div>
    </div>
  );
}

function ConciergeDrawer({ pkg, onClose, notify }) {
  const [text, setText] = useState("");
  const send = () => {
    if (text) {
      notify("Request sent to your concierge");
      setText("");
    }
  };
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="concierge-drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <div className="bot-avatar">A</div>
          <div>
            <b>TLC Concierge</b>
            <small>
              <i /> Priya & Aira are online
            </small>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <div className="drawer-chat">
          <div className="concierge-welcome">
            <Sparkles />
            <h3>How can we make your journey easier?</h3>
            <p>
              Ask a question or make a request. Your trip context is already
              known.
            </p>
          </div>
          <div className="request-grid">
            {[
              "Change tomorrow’s pickup",
              "Find a nearby pharmacy",
              "Meal preference",
              "Talk to Priya",
            ].map((x) => (
              <button key={x} onClick={() => setText(x)}>
                {x}
                <ArrowRight />
              </button>
            ))}
          </div>
          <div className="drawer-bubble">
            I have your complete {pkg.destination} itinerary here. What can I arrange for you?
          </div>
        </div>
        <div className="drawer-composer">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type a request…"
          />
          <button onClick={send}>
            <Send />
          </button>
        </div>
        <button
          className="emergency-link"
          onClick={() =>
            notify(
              "Emergency support connected — call 112 for immediate danger",
            )
          }
        >
          <Phone /> Emergency help
        </button>
      </aside>
    </div>
  );
}

function Specialist({ pkg, profile, onExit, notify, toast }) {
  const activePkg = pkg || demoPackage;
  const hotelChoices = activePkg.hotel_options?.length ? activePkg.hotel_options : hotels;
  const experienceChoices = activePkg.experience_options?.length ? activePkg.experience_options : experiences;
  const [selected, setSelected] = useState(hotelChoices.map(() => false));
  const [tasks, setTasks] = useState(3);
  const action = (name) => notify(`${name} workspace opened`);
  return (
    <main className="specialist-shell">
      <aside className="specialist-nav">
        <Logo />
        <div className="team-identity">
          <BriefcaseBusiness /> TLC TEAM OS<small>EMPLOYEE WORKSPACE</small>
        </div>
        <nav>
          <span>WORKSPACE</span>
          <button onClick={() => action("Today")}>
            <Zap /> Today <i>8</i>
          </button>
          <button className="active" onClick={() => action("Trips")}>
            <Users /> Trips <i>12</i>
          </button>
          <button onClick={() => action("Requests")}>
            <MessageCircle /> Requests <i>{tasks}</i>
          </button>
          <button onClick={() => action("Calendar")}>
            <CalendarDays /> Calendar
          </button>
          <span>INSIGHTS</span>
          <button onClick={() => action("Aira intelligence")}>
            <Sparkles /> Aira intelligence
          </button>
          <button onClick={() => action("Knowledge")}>
            <Search /> Knowledge
          </button>
        </nav>
        <div>
          <button onClick={onExit}>
            <ArrowLeft /> Sign out of Team OS
          </button>
          <div className="staff">
            <div>PS</div>
            <span>
              <b>Priya Shah</b>
              <small>Travel specialist · Employee</small>
            </span>
          </div>
        </div>
      </aside>
      <section className="specialist-main">
        <header>
          <div>
            <span>EMPLOYEE WORKSPACE · TRIPS / TLC-2847</span>
            <h2>{activePkg.title}</h2>
          </div>
          <div>
            <span className="opportunity">
              <i /> 92% ready
            </span>
            <button
              className="primary"
              onClick={() =>
                notify("Proposal sent to traveler and activity logged")
              }
            >
              Send proposal <Send />
            </button>
          </div>
        </header>
        <div className="specialist-grid">
          <div className="workspace">
            <div className="client-strip">
              <div className="avatar big">AS</div>
              <div>
                <b>Confirmed traveler request</b>
                <span>
                  {profile.travelers || "2 adults · 2 daughters, 9 & 13"} ·{" "}
                  {profile.travel_dates || "12–18 Oct 2026"}
                </span>
              </div>
              <div>
                <small>BUDGET</small>
                <b>{profile.budget || "₹3,00,000"}</b>
              </div>
              <div>
                <small>PACE</small>
                <b>{profile.pace || "Balanced"}</b>
              </div>
              <button onClick={() => notify("Traveler conversation opened")}>
                <MessageCircle /> Open conversation
              </button>
            </div>
            <div className="ai-brief">
              <div>
                <Sparkles />
              </div>
              <span>
                <small>AIRA’S TRIP INTELLIGENCE</small>
                <b>“{activePkg.summary || `${profile.pace || "Balanced"} journey focused on ${profile.interests?.join(", ") || "the traveler’s priorities"}.`}”</b>
                <p>{activePkg.destination} · {activePkg.duration} · {activePkg.days?.length || 0} itinerary days are complete. Only the preferred stays and optional experiences require selection and availability confirmation.</p>
              </span>
              <button onClick={() => notify("Full AI traveler brief opened")}>
                View full brief
              </button>
            </div>
            <div className="builder-head">
              <div>
                <span>PACKAGE BUILDER</span>
                <h3>Stay selection</h3>
              </div>
              <b>{selected.filter(Boolean).length} of {hotelChoices.length} properties selected</b>
            </div>
            <div className="specialist-hotels">
              {hotelChoices.map((h, i) => (
                <article className={selected[i] ? "selected" : ""} key={h.name}>
                  <img src={h.image || hotels[i % hotels.length].image} />
                  <div>
                    <span>{h.place}</span>
                    <h4>{h.name}</h4>
                    <p>
                      <Star fill="currentColor" /> {h.rating} · estimated rate{" "}
                      <b>{h.price}</b>
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSelected((s) => s.map((v, j) => (j === i ? !v : v)))
                    }
                  >
                    {selected[i] ? (
                      <>
                        <Check /> Selected
                      </>
                    ) : (
                      <>
                        <Plus /> Add
                      </>
                    )}
                  </button>
                </article>
              ))}
            </div>
            <div className="builder-head">
              <div>
                <span>OPERATIONS</span>
                <h3>Experiences & transfers</h3>
              </div>
              <button
                onClick={() => notify("All experiences opened for editing")}
              >
                Manage all <ArrowRight />
              </button>
            </div>
            <div className="ops-rows">
              {experienceChoices.slice(0, 4).map((x) => (
                <div key={x.title}>
                  <i>{x.icon}</i>
                  <span>
                    <b>{x.title}</b>
                    <small>{x.meta}</small>
                  </span>
                  <em>Selection pending</em>
                  <b>{x.price}</b>
                  <button onClick={() => notify(`${x.title} options opened`)}>
                    •••
                  </button>
                </div>
              ))}
            </div>
          </div>
          <aside className="specialist-aside">
            <div className="panel">
              <header>
                <span>CONCIERGE INBOX</span>
                <b>{tasks} open</b>
              </header>
              <div className="request urgent">
                <i>!</i>
                <div>
                  <small>2 min ago · In trip</small>
                  <b>Need a pharmacy nearby</b>
                  <p>Amit Sharma · Shillong</p>
                </div>
                <button
                  onClick={() => {
                    setTasks((t) => Math.max(0, t - 1));
                    notify("Response composer opened for Amit");
                  }}
                >
                  Respond
                </button>
              </div>
              <div className="request">
                <i>☂</i>
                <div>
                  <small>18 min ago · Proactive</small>
                  <b>Rain plan suggested</b>
                  <p>Aira · Cherrapunji</p>
                </div>
                <button
                  onClick={() => notify("Rain plan reviewed and approved")}
                >
                  Review
                </button>
              </div>
              <div className="request">
                <i>🍽</i>
                <div>
                  <small>1 hour ago · Preference</small>
                  <b>Less spicy meal</b>
                  <p>Confirmed by hotel</p>
                </div>
                <CheckCircle2 />
              </div>
              <button
                className="view-all"
                onClick={() => notify("Complete concierge inbox opened")}
              >
                View all requests <ArrowRight />
              </button>
            </div>
            <div className="panel readiness">
              <header>
                <span>TRIP READINESS</span>
                <strong>78%</strong>
              </header>
              {[
                ["Hotels", true],
                ["Vehicle & driver", true],
                ["Experiences", false],
                ["Traveler documents", false],
                ["Final payment", false],
              ].map((x) => (
                <div key={x[0]}>
                  <span>
                    <i className={x[1] ? "done" : ""}>
                      {x[1] ? <Check /> : ""}
                    </i>
                    {x[0]}
                  </span>
                  <b>{x[1] ? "Ready" : "Pending"}</b>
                </div>
              ))}
              <button onClick={() => notify("Traveler reminder scheduled")}>
                <Bell /> Send smart reminder
              </button>
            </div>
            <div className="panel push-panel">
              <span>
                <Bell />
              </span>
              <div>
                <b>Push to traveler</b>
                <p>Send an update exactly when it matters.</p>
              </div>
              <button
                onClick={() => notify("Push notification composer opened")}
              >
                <ArrowRight />
              </button>
            </div>
          </aside>
        </div>
      </section>
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </main>
  );
}

export default App;
