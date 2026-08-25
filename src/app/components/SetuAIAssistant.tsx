import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  PhoneCall,
  FilePlus,
  Compass,
  ArrowRight,
  Shield,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { EMERGENCY_HELPLINES } from "../data/mockData";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  textBn?: string;
  quickActions?: { label: string; action: () => void }[];
  suggestedComplaint?: {
    category: string;
    priority: "low" | "medium" | "high" | "urgent";
    title: string;
    description: string;
  };
  time: string;
}

const FAQ_PROMPTS = [
  { en: "Draft a road damage complaint", bn: "ভাঙা রাস্তার অভিযোগ তৈরি করুন" },
  { en: "How to correct NID date of birth?", bn: "জাতীয় পরিচয়পত্রের জন্মতারিখ সংশোধন কীভাবে করব?" },
  { en: "Calculate e-Passport 10-year fee", bn: "১০ বছর মেয়াদী ই-পাসপোর্টের ফি কত?" },
  { en: "Emergency helpline directory", bn: "জরুরি হটলাইন নম্বরসমূহ" },
  { en: "Land mutation (নামজারি) checklist", bn: "ই-নামজারি করার প্রয়োজনীয় কাগজপত্র" },
];

export function SetuAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "bot",
      text: "Hello! I am Setu AI (নাগরিক সহকারী), your official civic intelligence assistant for Bangladesh. How can I assist you today?",
      textBn: "আসসালামু আলাইকুম! আমি 'সেতু এআই' (নাগরিক সহকারী)। জাতীয় ই-সেবা, অভিযোগ গঠন, পাসপোর্ট বা জমির নামজারি সংক্রান্ত যে কোনো তথ্যে আমি আপনাকে সাহায্য করতে পারি।",
      quickActions: [
        { label: "Draft Complaint 📝", action: () => handleSend("Draft a complaint for severe waterlogging in my neighborhood") },
        { label: "E-Passport Info 🛂", action: () => handleSend("What are the fees and requirements for e-Passport?") },
        { label: "Emergency 999 🚨", action: () => handleSend("Show emergency helpline numbers") },
      ],
      time: "Just now",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAIResponse = (userText: string): Message => {
    const textLower = userText.toLowerCase();
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // 1. Complaint drafting
    if (
      textLower.includes("draft") ||
      textLower.includes("complaint") ||
      textLower.includes("road") ||
      textLower.includes("waterlog") ||
      textLower.includes("garbage") ||
      textLower.includes("light") ||
      textLower.includes("পানির সমস্যা") ||
      textLower.includes("রাস্তা")
    ) {
      let cat = "Roads & Infrastructure";
      let priority: "low" | "medium" | "high" | "urgent" = "high";
      let title = "Severe Road Hazard and Potholes on Main Thoroughfare";
      let desc =
        "The municipal road surface has degraded with large potholes (approx 1.5m wide), disrupting traffic flow and causing risk to commuters, pedestrians, and ambulances. Urgent asphalt resurfacing and grading is required before monsoon aggravates the crater depth.";

      if (textLower.includes("waterlog") || textLower.includes("drain")) {
        cat = "Drainage & Waterlogging";
        title = "Severe Street Inundation and Blocked Storm Drain";
        desc =
          "Excessive water stagnation up to knee-deep occurs even after light rainfall due to choked underground culverts and blocked catchment basins. This is generating hygiene hazards, mosquito proliferation, and paralyzing school commutes.";
      } else if (textLower.includes("garbage") || textLower.includes("waste")) {
        cat = "Waste Management";
        title = "Uncollected Solid Waste and Illegal Dumping Overflow";
        desc =
          "Secondary transfer station / waste collection bin has been overflowing without routine clearance for over 5 days. Foul odor and stray animals are creating environmental and public health hazards in the residential vicinity.";
      } else if (textLower.includes("light") || textLower.includes("electric")) {
        cat = "Electricity & Lighting";
        priority = "medium";
        title = "Defective Municipal Street Lighting on Residential Lane";
        desc =
          "Over 4 consecutive municipal LED street poles have malfunctioned, leaving the whole sector in total darkness at night. This severely compromises safety and increases vulnerability to theft.";
      }

      return {
        id: `m-${Date.now()}`,
        sender: "bot",
        text: `I have drafted a well-structured civic complaint for you tailored for City Corporation & Ministry review. You can review the details and click "File Complaint Now" to proceed directly with prefilled information.`,
        textBn: `আমি সিটি কর্পোরেশন ও সংশ্লিষ্ট কর্তৃপক্ষের জন্য একটি সুনির্দিষ্ট অভিযোগ খসড়া তৈরি করেছি। আপনি নিচে দেখে সরাসরি 'অভিযোগ দাখিল করুন' বাটনে ক্লিক করতে পারেন।`,
        suggestedComplaint: {
          category: cat,
          priority,
          title,
          description: desc,
        },
        quickActions: [
          {
            label: "Open Complaint Form 🚀",
            action: () => {
              setIsOpen(false);
              navigate("/complaints/new");
            },
          },
        ],
        time: timeStr,
      };
    }

    // 2. NID
    if (textLower.includes("nid") || textLower.includes("national id") || textLower.includes("পরিচয়পত্র")) {
      return {
        id: `m-${Date.now()}`,
        sender: "bot",
        text: `**National ID (NID) Service Guide**\n\n- **Official Portal:** [services.nidw.gov.bd](https://services.nidw.gov.bd/)\n- **Correction Fee:** Normal: ৳230 (VAT included), Urgent: ৳345\n- **Required Documents:** SSC/Equivalent Certificate, Birth Registration (Digital BDRIS), Utility Bill / Nationality Certificate.\n- **Reissue for Lost Card:** ৳575 with General Diary (GD) copy.`,
        textBn: `**জাতীয় পরিচয়পত্র (NID) সহায়িকা**\n\n- **অফিসিয়াল পোর্টাল:** services.nidw.gov.bd\n- **সংশোধন ফি:** সাধারণ ৳২৩০, জরুরি ৳৩৪৫\n- **প্রয়োজনীয় কাগজপত্র:** এসএসসি সনদ, ডিজিটাল জন্ম সনদ ও জাতীয়তা সনদ।\n- **হারানো কার্ড রি-ইস্যু:** জিডি কপিসহ ফি ৳৫৭৫।`,
        quickActions: [
          {
            label: "View E-Services 🌐",
            action: () => {
              setIsOpen(false);
              navigate("/services");
            },
          },
        ],
        time: timeStr,
      };
    }

    // 3. Passport
    if (textLower.includes("passport") || textLower.includes("পাসপোর্ট")) {
      return {
        id: `m-${Date.now()}`,
        sender: "bot",
        text: `**e-Passport Bangladesh Fee & Validity Structure**\n\n- **48 Pages (5 Years):** Regular ৳4,025 | Express ৳6,325 | Super Express ৳8,625\n- **48 Pages (10 Years):** Regular ৳5,750 | Express ৳8,050 | Super Express ৳10,350\n- **64 Pages (10 Years):** Regular ৳8,050 | Express ৳10,350 | Super Express ৳13,800\n- **Official Portal:** [epassport.gov.bd](https://www.epassport.gov.bd/)`,
        textBn: `**ই-পাসপোর্ট ফি ও মেয়াদ কাঠামো**\n\n- **৪৮ পৃষ্ঠা (৫ বছর):** সাধারণ ৪,০২৫৳ | জরুরি ৬,৩২৫৳\n- **৪৮ পৃষ্ঠা (১০ বছর):** সাধারণ ৫,৭৫০৳ | জরুরি ৮,০৫০৳\n- **৬৪ পৃষ্ঠা (১০ বছর):** সাধারণ ৮,০৫০৳ | জরুরি ১০,৩৫০৳\n- **আবেদন পোর্টাল:** epassport.gov.bd`,
        quickActions: [
          {
            label: "Use Passport Calculator 🧮",
            action: () => {
              setIsOpen(false);
              navigate("/services");
            },
          },
        ],
        time: timeStr,
      };
    }

    // 4. Emergency Helplines
    if (textLower.includes("emergency") || textLower.includes("help") || textLower.includes("hotline") || textLower.includes("999") || textLower.includes("জরুরি")) {
      const helplineList = EMERGENCY_HELPLINES.slice(0, 5)
        .map((h) => `• **${h.number}** — ${h.nameEn} (${h.category})`)
        .join("\n");
      return {
        id: `m-${Date.now()}`,
        sender: "bot",
        text: `**National 24/7 Emergency Helplines (Toll Free):**\n\n${helplineList}\n\nAll hotlines operate round the clock throughout Bangladesh.`,
        textBn: `**জরুরি সেবা নম্বরসমূহ (টোল ফ্রি):**\n\n• **৯৯৯** — জাতীয় জরুরি সেবা (পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স)\n• **৩৩৩** — জাতীয় তথ্য ও সেবা কেন্দ্র\n• **১০৯** — নারী ও শিশু নির্যাতন প্রতিরোধ\n• **১০৬** — দুর্নীতি দমন কমিশন (দুদক)\n• **১৬১২২** — ভূমি সেবা হটলাইন`,
        time: timeStr,
      };
    }

    // 5. Land Mutation / E-Namjari
    if (textLower.includes("land") || textLower.includes("mutation") || textLower.includes("namjari") || textLower.includes("জমি") || textLower.includes("নামজারি")) {
      return {
        id: `m-${Date.now()}`,
        sender: "bot",
        text: `**E-Namjari (ই-নামজারি) Land Mutation Guide**\n\n- **Portal:** [mutation.land.gov.bd](https://mutation.land.gov.bd/)\n- **Standard Govt Fee:** ৳1,170 (Court fee ৳20 + Notice fee ৳50 + Record correction ৳1,000 + DCR fee ৳100)\n- **Timeline:** Standard maximum 28 working days\n- **Documents Required:** Sale Deed (দলিল), Previous Khatian, Land Tax receipt (দাখিলা), NID, and Passport size photo.`,
        textBn: `**ই-নামজারি নির্দেশিকা**\n\n- **পোর্টাল:** mutation.land.gov.bd\n- **মোট সরকারি ফি:** ৳১,১৭০\n- **প্রয়োজনীয় সময়:** সর্বোচ্চ ২৮ কার্যদিবস\n- **প্রয়োজনীয় দলিল:** মূল দলিল, পূর্বের খতিয়ান, হালনাগাদ ভূমি উন্নয়ন করের দাখিলা ও জাতীয় পরিচয়পত্র।`,
        time: timeStr,
      };
    }

    // Default Fallback
    return {
      id: `m-${Date.now()}`,
      sender: "bot",
      text: `I'm happy to help you with **Nagorik Setu** services! You can ask me to draft complaints, explain e-service requirements, check official fee rates, or connect to national hotlines.`,
      textBn: `আমি আপনাকে নাগরিক সেতু ও বাংলাদেশ সরকারের যে কোনো ডিজিটাল সেবার নিয়মাবলী, ফি এবং অভিযোগ দাখিলে সহায়তা করতে পারি।`,
      quickActions: [
        { label: "File a Complaint 📋", action: () => navigate("/complaints/new") },
        { label: "Browse Services 🏛️", action: () => navigate("/services") },
        { label: "View Polls 📊", action: () => navigate("/polls") },
      ],
      time: timeStr,
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAIResponse(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const copyComplaintDraft = (draft: NonNullable<Message["suggestedComplaint"]>) => {
    const text = `TITLE: ${draft.title}\nCATEGORY: ${draft.category}\nPRIORITY: ${draft.priority.toUpperCase()}\n\nDESCRIPTION:\n${draft.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Complaint draft copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Widget Launcher */}
      {!isOpen && (
        <button
          id="setu-ai-launcher"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0f172a] text-white shadow-xl hover:bg-[#1e293b] hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-500/30 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#059669] to-[#34d399] flex items-center justify-center text-white shadow-inner">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              Setu AI <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            </div>
            <div className="text-[10px] text-emerald-300" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              নাগরিক সহকারী
            </div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-[#0f172a] px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Setu AI Assistant
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Official
                  </span>
                </div>
                <div className="text-[10px] text-slate-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  নাগরিক সেবা ও অভিযোগ সহকারী
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Sparkles size={13} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#059669] text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.textBn && (
                    <p
                      className="text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 leading-relaxed font-sans"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {m.textBn}
                    </p>
                  )}

                  {/* Complaint Draft Card if provided */}
                  {m.suggestedComplaint && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        <span>Structured Civic Draft</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                          {m.suggestedComplaint.priority} Priority
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {m.suggestedComplaint.title}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {m.suggestedComplaint.description}
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => copyComplaintDraft(m.suggestedComplaint!)}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 transition-colors"
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                          {copied ? "Copied!" : "Copy Draft"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  {m.quickActions && m.quickActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={qa.action}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] ${
                      m.sender === "user" ? "text-emerald-100 text-right" : "text-slate-400"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span>Setu AI is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Recommended FAQ Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
            {FAQ_PROMPTS.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(faq.en)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {faq.en}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask Setu AI anything (e.g. passport fee, NID help)..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-slate-100 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
