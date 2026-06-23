"use client";

import { useState, useEffect } from "react";
import { 
  House, 
  VideoCamera, 
  Tag, 
  Chat, 
  Plus, 
  Trash, 
  Pencil, 
  Check, 
  ArrowRight,
  Clock,
  ArrowUpRight,
  WhatsappLogo
} from "@phosphor-icons/react";

interface VideoItem {
  id: string;
  title: string;
  client: string;
  category: string;
  duration: string;
  aspect: string;
  thumbnail: string;
  embedUrl: string;
}

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  project: string;
  category: string;
}

interface PricingItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  unit: string;
  highlight: boolean;
  features: string[];
}

const formatDuration = (val: string) => {
  // Remove non-digit, non-colon characters
  const clean = val.replace(/[^\d:]/g, "").trim();
  if (!clean) return { formatted: "0:00", error: "" };

  let totalSeconds = 0;
  let error = "";

  if (clean.includes(":")) {
    const parts = clean.split(":");
    if (parts.length === 2) {
      const [m, s] = parts;
      const min = parseInt(m, 10) || 0;
      const sec = parseInt(s, 10) || 0;
      if (sec >= 60) {
        return { formatted: val, error: "Detik (angka belakang pembatas ':') tidak boleh lebih dari 59." };
      }
      totalSeconds = min * 60 + sec;
    } else if (parts.length >= 3) {
      const [h, m, s] = parts;
      const hr = parseInt(h, 10) || 0;
      const min = parseInt(m, 10) || 0;
      const sec = parseInt(s, 10) || 0;
      if (min >= 60 || sec >= 60) {
        return { formatted: val, error: "Menit/Detik tidak boleh lebih dari 59." };
      }
      totalSeconds = hr * 3600 + min * 60 + sec;
    }
  } else {
    // Only digits
    const len = clean.length;
    if (len <= 2) {
      const sec = parseInt(clean, 10) || 0;
      if (sec >= 60) {
        return { formatted: val, error: "Detik tidak boleh lebih dari 59." };
      }
      totalSeconds = sec;
    } else {
      const sec = parseInt(clean.slice(-2), 10) || 0;
      const min = parseInt(clean.slice(0, -2), 10) || 0;
      if (sec >= 60) {
        return { formatted: val, error: "Format waktu salah. Angka detik (2 digit terakhir) tidak boleh lebih dari 59 (misal: 987 tidak valid karena detik = 87)." };
      }
      totalSeconds = min * 60 + sec;
    }
  }

  if (totalSeconds > 1800) {
    return { formatted: "30:00", error: "Durasi maksimal adalah 30 menit (30:00)." };
  }

  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  const formatted = `${min}:${sec.toString().padStart(2, "0")}`;

  return { formatted, error };
};

const formatPrice = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "Rp 0";
  const num = parseInt(digits, 10);
  return "Rp " + num.toLocaleString("id-ID");
};

export default function AdminDashboard() {
  const [data, setData] = useState<{
    videos: VideoItem[];
    pricing: PricingItem[];
    testimonials: TestimonialItem[];
  }>({
    videos: [],
    pricing: [],
    testimonials: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, videos, pricing, testimonials
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Load content from API
  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to load content.");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load content files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Save changes back to API
  const handleSave = async (type: "videos" | "pricing" | "testimonials", updatedList: any[]) => {
    setSaveStatus({ ...saveStatus, [type]: "saving" });
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data: updatedList }),
      });
      if (!res.ok) throw new Error(`Failed to save ${type} changes.`);
      
      setData(prev => ({ ...prev, [type]: updatedList }));
      setSaveStatus({ ...saveStatus, [type]: "success" });
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [type]: "" })), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save changes.");
      setSaveStatus({ ...saveStatus, [type]: "error" });
    }
  };

  // CRUD handlers
  const handleStartEdit = (item: any) => {
    setFormErrors({});
    setEditingId(item.id);
    setIsAdding(false);
    setEditForm({ ...item });
  };

  const handleStartAdd = (type: string) => {
    setFormErrors({});
    setIsAdding(true);
    setEditingId(null);
    if (type === "videos") {
      setEditForm({
        id: `v${Date.now()}`,
        title: "",
        client: "",
        category: "commercial",
        duration: "0:00",
        aspect: "aspect-[16/9]",
        thumbnail: "https://picsum.photos/seed/placeholder/1280/720",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      });
    } else if (type === "pricing") {
      setEditForm({
        id: `p${Date.now()}`,
        name: "",
        desc: "",
        price: "Rp 0",
        unit: "/ video",
        highlight: false,
        features: ["Feature 1"]
      });
    } else if (type === "testimonials") {
      setEditForm({
        id: `t${Date.now()}`,
        quote: "",
        author: "",
        role: "",
        project: "",
        category: "CREATOR"
      });
    }
  };

  const handleSaveEdit = (type: "videos" | "pricing" | "testimonials") => {
    if (type === "videos") {
      const errors: { [key: string]: string } = {};

      // 1. Character limit: 100 characters
      if (editForm.title.length > 100) {
        errors.title = "Video title cannot exceed 100 characters.";
      }

      if (editForm.client.length > 100) {
        errors.client = "Client name cannot exceed 100 characters.";
      }

      // 2. Special characters limit: no strange symbols
      // We allow Unicode letters (\p{L}), numbers (\p{N}), spaces (\s), and standard punctuation (. , ' ( ) ! ? " - _ @ & / : [ ])
      const symbolRegex = /^[\p{L}\p{N}\s.,'()!?"\-_@&/:\[\]]+$/u;
      if (editForm.title && !symbolRegex.test(editForm.title)) {
        errors.title = "Video title contains unsupported special characters.";
      }
      if (editForm.client && !symbolRegex.test(editForm.client)) {
        errors.client = "Client name contains unsupported special characters.";
      }

      // 3. Duration auto-formatting & validation
      const { formatted, error: durationErr } = formatDuration(editForm.duration);
      editForm.duration = formatted;
      if (durationErr) {
        errors.duration = durationErr;
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return; // Halt saving
      }
    }

    if (type === "pricing") {
      const errors: { [key: string]: string } = {};

      // 1. Package Name: <= 70 characters, no strange symbols
      if (editForm.name.length > 70) {
        errors.name = "Package name cannot exceed 70 characters.";
      }
      const symbolRegex = /^[\p{L}\p{N}\s.,'()!?"\-_@&/:\[\]]+$/u;
      if (editForm.name && !symbolRegex.test(editForm.name)) {
        errors.name = "Package name contains unsupported special characters.";
      }

      // 2. Short Description: <= 150 characters
      if (editForm.desc.length > 150) {
        errors.desc = "Short description cannot exceed 150 characters (currently " + editForm.desc.length + " characters).";
      }

      // 3. Price formatting
      editForm.price = formatPrice(editForm.price);

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return; // Halt saving
      }
    }

    // Reset errors if successful
    setFormErrors({});

    const list = [...data[type]];
    if (isAdding) {
      list.push(editForm);
    } else {
      const idx = list.findIndex(item => item.id === editingId);
      if (idx !== -1) list[idx] = editForm;
    }
    handleSave(type, list);
    setEditingId(null);
    setIsAdding(false);
    setEditForm(null);
  };

  const handleDeleteItem = (type: "videos" | "pricing" | "testimonials", id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updated = data[type].filter(item => item.id !== id);
      handleSave(type, updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading Kyoubar CMS...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Start CMS</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button 
            onClick={fetchContent}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex text-slate-800 font-sans">
      
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6">
        <div>
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-3 mb-10">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-white font-mono font-bold text-[10px]">
              +1
            </div>
            <span className="font-extrabold tracking-tighter text-slate-900 text-base uppercase">
              Kyoubar CMS
            </span>
          </div>

          {/* Nav Tabs */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: House },
              { id: "videos", label: "Video Showcase", icon: VideoCamera },
              { id: "pricing", label: "Pricing Packages", icon: Tag },
              { id: "testimonials", label: "Testimonials", icon: Chat },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingId(null);
                    setIsAdding(false);
                    setEditForm(null);
                    setFormErrors({});
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/10"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" weight={activeTab === tab.id ? "bold" : "regular"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="px-3 pt-6 border-t border-slate-100 flex flex-col gap-1 text-[9px] font-mono text-slate-400">
          <span>MODE: LOCAL PORTFOLIO</span>
          <span>SYNC: DIRECT FILE WRITE</span>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Archive</span>
            <span className="text-xs text-slate-300 font-bold">/</span>
            <span className="text-xs text-slate-800 font-extrabold uppercase">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Local Server Active
            </span>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="flex-1 p-10 flex gap-8">
          
          {/* TAB: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="flex-1 flex flex-col gap-8">
              
              {/* BENTO STAT METRICS GRID */}
              <div className="grid grid-cols-5 gap-6">
                
                {/* 1. Videos (Green) */}
                <div className="bg-emerald-500 text-white p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm relative overflow-hidden group">
                  <div className="z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-100">Showcase Videos</span>
                    <span className="block text-4xl font-extrabold tracking-tight mt-1">{data.videos.length}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-100 uppercase z-10">Total videos live</span>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                    <VideoCamera className="w-16 h-16" weight="fill" />
                  </div>
                </div>

                {/* 2. Reviews (Purple) */}
                <div className="bg-violet-500 text-white p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm relative overflow-hidden group">
                  <div className="z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-violet-100">Reviews & Quotes</span>
                    <span className="block text-4xl font-extrabold tracking-tight mt-1">{data.testimonials.length}</span>
                  </div>
                  <span className="text-[10px] font-bold text-violet-100 uppercase z-10">Verified reviews</span>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                    <Chat className="w-16 h-16" weight="fill" />
                  </div>
                </div>

                {/* 3. Status (Orange) */}
                <div className="bg-orange-500 text-white p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm relative overflow-hidden group">
                  <div className="z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-orange-100">WhatsApp Link</span>
                    <span className="block text-xl font-extrabold tracking-tight mt-2.5">ACTIVE</span>
                  </div>
                  <span className="text-[10px] font-bold text-orange-100 uppercase z-10">Nomor: +62 822-1...</span>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                    <WhatsappLogo className="w-16 h-16" weight="fill" />
                  </div>
                </div>

                {/* 4. Packages (Blue) */}
                <div className="bg-sky-500 text-white p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm relative overflow-hidden group">
                  <div className="z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-sky-100">Service Packs</span>
                    <span className="block text-4xl font-extrabold tracking-tight mt-1">{data.pricing.length}</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-100 uppercase z-10">Active structures</span>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                    <Tag className="w-16 h-16" weight="fill" />
                  </div>
                </div>

                {/* 5. Environment (Dark Slate) */}
                <div className="bg-slate-800 text-white p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm relative overflow-hidden group">
                  <div className="z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300">Environment</span>
                    <span className="block text-[15px] font-extrabold tracking-tight mt-3">LOCAL DEV</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase z-10">Filesystem Mode</span>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
                    <House className="w-16 h-16" weight="fill" />
                  </div>
                </div>

              </div>

              {/* CENTRAL PLOT: ANALYTICS & LOGS */}
              <div className="grid grid-cols-12 gap-8 items-stretch flex-1">
                
                {/* Visual Chart (col-span-8) */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-xs font-extrabold tracking-wide uppercase text-slate-800">Inquiry Analytics</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Weekly request load mapping</p>
                  </div>

                  {/* Mock SVG Bar Chart (Matching Visual Reference) */}
                  <div className="my-6 h-56 flex items-end justify-between gap-2.5 pt-6 px-4">
                    {[
                      { week: "W1", value: "h-2/6 bg-violet-200" },
                      { week: "W2", value: "h-3/6 bg-violet-300" },
                      { week: "W3", value: "h-4/6 bg-violet-400" },
                      { week: "W4", value: "h-5/6 bg-violet-500" },
                      { week: "W5", value: "h-3/6 bg-violet-300" },
                      { week: "W6", value: "h-6/6 bg-violet-600" },
                      { week: "W7", value: "h-4/6 bg-violet-500" },
                      { week: "W8", value: "h-5/6 bg-[#ff3b00] shadow-[0_0_15px_rgba(255,59,0,0.3)] animate-pulse" },
                    ].map((bar, bIdx) => (
                      <div key={bIdx} className="flex-1 flex flex-col items-center gap-3 group">
                        <div className={`w-full ${bar.value} rounded-t-md hover:opacity-95 transition-all duration-300 cursor-pointer`}></div>
                        <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider">{bar.week}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Activity/Inquiries (col-span-4) */}
                <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-xs font-extrabold tracking-wide uppercase text-slate-800">Recent Booking Drafts</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Direct inquiries via WA</p>
                  </div>

                  <div className="space-y-4 my-6">
                    {[
                      { name: "Ahmad Rizki", service: "Short-Form", time: "10 mins ago", status: "New", color: "bg-[#ff3b00]/10 text-[#ff3b00]" },
                      { name: "Sam Kolder Studio", service: "Commercial", time: "2 hours ago", status: "Replied", color: "bg-emerald-50 text-emerald-600" },
                      { name: "Nike Run Team", service: "Reels / TikTok", time: "1 day ago", status: "Replied", color: "bg-emerald-50 text-emerald-600" },
                    ].map((log, lIdx) => (
                      <div key={lIdx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-extrabold text-[10px]">
                            {log.name.split(" ").map(w=>w[0]).join("")}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800">{log.name}</span>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{log.service}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${log.color}`}>
                            {log.status}
                          </span>
                          <span className="block text-[8px] font-mono text-slate-400 mt-1 uppercase flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {log.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="#contact" 
                    className="w-full py-2.5 border border-slate-200 hover:border-[#ff3b00] hover:text-[#ff3b00] text-slate-600 transition-all duration-300 text-[10px] font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2 rounded-xl"
                  >
                    <span>View Client Inbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          )}

          {/* TABS: VIDEOS, PRICING, TESTIMONIALS */}
          {activeTab !== "dashboard" && (
            <div className="flex-1 grid grid-cols-12 gap-8 items-start">
              
              {/* List / Data View (col-span-8) */}
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-800">{activeTab} Items</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Configure and manage variables</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {saveStatus[activeTab] === "saving" && (
                      <span className="text-[10px] font-mono font-bold text-violet-500 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping"></span>
                        Saving changes...
                      </span>
                    )}
                    {saveStatus[activeTab] === "success" && (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600" weight="bold" />
                        Saved Successfully
                      </span>
                    )}
                    <button
                      onClick={() => handleStartAdd(activeTab)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 hover:scale-[1.02] active:scale-95 transition-all text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-violet-500/10"
                    >
                      <Plus className="w-3.5 h-3.5" weight="bold" />
                      <span>Add New Entry</span>
                    </button>
                  </div>
                </div>

                {/* LIST OF VIDEOS */}
                {activeTab === "videos" && (
                  <div className="space-y-4">
                    {data.videos.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs uppercase font-bold">No videos defined. Click &ldquo;Add New&rdquo; above.</div>
                    ) : (
                      data.videos.map((video) => (
                        <div key={video.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 flex items-center justify-between gap-4 transition-colors duration-200">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-10 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover grayscale" />
                            </div>
                            <div>
                              <span className="block text-xs font-extrabold text-slate-800 uppercase">{video.title}</span>
                              <span className="block text-[9px] text-[#ff3b00] font-bold uppercase tracking-widest mt-1">
                                {video.client} · {video.category} · {video.duration}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(video)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("videos", video.id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* LIST OF PRICING */}
                {activeTab === "pricing" && (
                  <div className="space-y-4">
                    {data.pricing.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs uppercase font-bold">No pricing packages. Click &ldquo;Add New&rdquo; above.</div>
                    ) : (
                      data.pricing.map((pkg) => (
                        <div key={pkg.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 flex items-center justify-between gap-4 transition-colors duration-200">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-mono font-bold text-xs uppercase flex-shrink-0">
                              {pkg.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-slate-800 uppercase">{pkg.name}</span>
                                {pkg.highlight && (
                                  <span className="bg-orange-100 text-orange-600 text-[8px] font-bold px-2 py-0.5 tracking-wider rounded-full uppercase">Popular</span>
                                )}
                              </div>
                              <span className="block text-[9px] text-[#ff3b00] font-bold uppercase tracking-widest mt-1">
                                {pkg.price} {pkg.unit}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(pkg)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("pricing", pkg.id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* LIST OF TESTIMONIALS */}
                {activeTab === "testimonials" && (
                  <div className="space-y-4">
                    {data.testimonials.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs uppercase font-bold">No reviews. Click &ldquo;Add New&rdquo; above.</div>
                    ) : (
                      data.testimonials.map((testi) => (
                        <div key={testi.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 flex items-center justify-between gap-4 transition-colors duration-200">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-[10px] flex-shrink-0">
                              {testi.author.split(" ").map(w=>w[0]).join("")}
                            </div>
                            <div>
                              <span className="block text-xs font-extrabold text-slate-800 uppercase">{testi.author}</span>
                              <span className="block text-[9px] text-[#ff3b00] font-bold uppercase tracking-widest mt-1">
                                {testi.role} · {testi.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(testi)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("testimonials", testi.id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>

              {/* Edit / Creation Form (col-span-4) */}
              <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div>
                  <h3 className="text-xs font-extrabold tracking-wide uppercase text-slate-800">
                    {isAdding ? "Add New Entry" : editingId ? "Edit Item Properties" : "Information Panel"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    {isAdding || editingId ? "Form input editor" : "Select an entry on the left to modify it"}
                  </p>
                </div>

                {/* FORM CONTRAST & RENDER CONTROL */}
                {(isAdding || editingId) && editForm ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(activeTab as any);
                    }}
                    className="space-y-4 my-6"
                  >
                    
                    {/* VIDEO FORM FIELDS */}
                    {activeTab === "videos" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Video Title *</label>
                          <input 
                            type="text" required value={editForm.title}
                            onChange={e => {
                              setEditForm({ ...editForm, title: e.target.value });
                              if (formErrors.title) {
                                setFormErrors(prev => ({ ...prev, title: "" }));
                              }
                            }}
                            className={`w-full text-xs font-bold text-slate-800 border ${formErrors.title ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-lg p-2.5 outline-none focus:border-violet-500`}
                          />
                          {formErrors.title && (
                            <span className="block text-[10px] text-red-500 font-medium mt-1">{formErrors.title}</span>
                          )}
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Client Name *</label>
                          <input 
                            type="text" required value={editForm.client}
                            onChange={e => {
                              setEditForm({ ...editForm, client: e.target.value });
                              if (formErrors.client) {
                                setFormErrors(prev => ({ ...prev, client: "" }));
                              }
                            }}
                            className={`w-full text-xs font-bold text-slate-800 border ${formErrors.client ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-lg p-2.5 outline-none focus:border-violet-500`}
                          />
                          {formErrors.client && (
                            <span className="block text-[10px] text-red-500 font-medium mt-1">{formErrors.client}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Category</label>
                            <select 
                              value={editForm.category}
                              onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50/50"
                            >
                              <option value="commercial">Commercial</option>
                              <option value="long-form">Long-Form</option>
                              <option value="reels">Reels & Shorts</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Duration *</label>
                            <input 
                              type="text" required value={editForm.duration}
                              placeholder="e.g., 3 -> 0:03, 123 -> 1:23"
                              onChange={e => {
                                setEditForm({ ...editForm, duration: e.target.value });
                                if (formErrors.duration) {
                                  setFormErrors(prev => ({ ...prev, duration: "" }));
                                }
                              }}
                              onBlur={e => {
                                const { formatted, error } = formatDuration(e.target.value);
                                setEditForm({ ...editForm, duration: formatted });
                                if (error) {
                                  setFormErrors(prev => ({ ...prev, duration: error }));
                                } else {
                                  setFormErrors(prev => ({ ...prev, duration: "" }));
                                }
                              }}
                              className={`w-full text-xs font-bold text-slate-800 border ${formErrors.duration ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-lg p-2.5 outline-none focus:border-violet-500`}
                            />
                            {formErrors.duration && (
                              <span className="block text-[10px] text-red-500 font-medium mt-1">{formErrors.duration}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Aspect Ratio</label>
                          <select 
                            value={editForm.aspect}
                            onChange={e => setEditForm({ ...editForm, aspect: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50/50"
                          >
                            <option value="aspect-[16/9]">Landscape (16:9)</option>
                            <option value="aspect-[9/16]">Vertical Reels (9:16)</option>
                            <option value="aspect-[4/5]">Portrait Video (4:5)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Thumbnail URL</label>
                          <input 
                            type="text" required value={editForm.thumbnail}
                            onChange={e => setEditForm({ ...editForm, thumbnail: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Embed Link (YouTube/Vimeo)</label>
                          <input 
                            type="text" required value={editForm.embedUrl}
                            onChange={e => setEditForm({ ...editForm, embedUrl: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                          />
                        </div>
                      </div>
                    )}

                    {/* PRICING FORM FIELDS */}
                    {activeTab === "pricing" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Package Name *</label>
                          <input 
                            type="text" required value={editForm.name}
                            onChange={e => {
                              setEditForm({ ...editForm, name: e.target.value });
                              if (formErrors.name) {
                                setFormErrors(prev => ({ ...prev, name: "" }));
                              }
                            }}
                            className={`w-full text-xs font-bold text-slate-800 border ${formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-lg p-2.5 outline-none focus:border-violet-500`}
                          />
                          {formErrors.name && (
                            <span className="block text-[10px] text-red-500 font-medium mt-1">{formErrors.name}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase">Short Description *</label>
                            <span className={`text-[8px] font-mono font-bold ${editForm.desc.length > 150 ? 'text-red-500' : 'text-slate-400'}`}>
                              {editForm.desc.length}/150 Chars
                            </span>
                          </div>
                          <textarea 
                            required rows={3} value={editForm.desc}
                            onChange={e => {
                              setEditForm({ ...editForm, desc: e.target.value });
                              if (formErrors.desc) {
                                setFormErrors(prev => ({ ...prev, desc: "" }));
                              }
                            }}
                            className={`w-full text-xs font-bold text-slate-800 border ${formErrors.desc ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-lg p-2.5 outline-none focus:border-violet-500 resize-none`}
                          />
                          {formErrors.desc && (
                            <span className="block text-[10px] text-red-500 font-medium mt-1">{formErrors.desc}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Price *</label>
                            <input 
                              type="text" required value={editForm.price}
                              onChange={e => {
                                setEditForm({ ...editForm, price: e.target.value });
                              }}
                              onBlur={e => {
                                setEditForm({ ...editForm, price: formatPrice(e.target.value) });
                              }}
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Price Unit *</label>
                            <select 
                              value={editForm.unit}
                              onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50/50"
                            >
                              <option value="/ video">/ video</option>
                              <option value="/ project">/ project</option>
                              <option value="/ month">/ month</option>
                              <option value="/ reel">/ reel</option>
                              <option value="/ package">/ package</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-1">
                          <input 
                            type="checkbox" id="edit-highlight" checked={editForm.highlight}
                            onChange={e => setEditForm({ ...editForm, highlight: e.target.checked })}
                            className="w-4 h-4 text-violet-600 border-slate-200 rounded focus:ring-violet-500 cursor-pointer"
                          />
                          <label htmlFor="edit-highlight" className="text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer">Highlight/Popular Plan</label>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Features (Comma separated)</label>
                          <textarea 
                            rows={3} 
                            value={editForm.features.join(", ")}
                            onChange={e => setEditForm({ ...editForm, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50 resize-none"
                            placeholder="Dynamic titles, SFX mixing, 2 revisions"
                          />
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS FORM FIELDS */}
                    {activeTab === "testimonials" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Client Author Name *</label>
                          <input 
                            type="text" required value={editForm.author}
                            onChange={e => setEditForm({ ...editForm, author: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Client Role / Title *</label>
                          <input 
                            type="text" required value={editForm.role}
                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Project Details *</label>
                            <input 
                              type="text" required value={editForm.project}
                              onChange={e => setEditForm({ ...editForm, project: e.target.value })}
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Category Label</label>
                            <input 
                              type="text" required value={editForm.category}
                              onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">Quote Body *</label>
                          <textarea 
                            required rows={5} value={editForm.quote}
                            onChange={e => setEditForm({ ...editForm, quote: e.target.value })}
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 bg-slate-50/50 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="submit"
                        className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 hover:scale-[1.01] active:scale-95 transition-all text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" weight="bold" />
                        <span>Apply Changes</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setIsAdding(false);
                          setEditForm(null);
                        }}
                        className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 gap-3">
                    <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase">No Active Selection</span>
                      <span className="block text-[9px] font-bold uppercase tracking-wide mt-1">Select an item to edit or click add new</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
