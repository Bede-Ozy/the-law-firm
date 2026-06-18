import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, ShieldAlert, Award, FileText, CheckCircle2, Lock, 
  HelpCircle, Volume2, VolumeX, RefreshCw, ChevronRight, CornerDownLeft
} from "lucide-react";
import { useGameStore, EXHIBIT_DATA } from "../store/useGameStore";
import { soundManager } from "../utils/audioManager";
import TypewriterText from "./TypewriterText";

// Import custom avatars
import clientAvatar from "../assets/client_avatar.png";
import lawyerMale from "../assets/lawyer_male.png";
import lawyerFemale from "../assets/lawyer_female.png";

export const GamePage = () => {
  const navigate = useNavigate();
  const {
    currentExhibitId,
    completedExhibits,
    answers,
    caseStatus,
    judgeMessage,
    errorCount,
    isMuted,
    volumeAmbience,
    volumeSFX,
    isAmbiencePlaying,
    submitAnswer,
    setCurrentExhibit,
    toggleMute,
    setVolumeAmbience,
    setVolumeSFX,
    toggleAmbience,
    resetGame,
    initAudio,
    playerName,
    playerGender
  } = useGameStore();

  const [inputVal, setInputVal] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(null); // 'SUCCESS' or 'ERROR'
  const [objectionCount, setObjectionCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const lawyerAvatar = playerGender === "FEMALE" ? lawyerFemale : lawyerMale;

  const dialogueSteps = [
    {
      speaker: "client",
      text: `Counsel ${playerName || ""}, thank goodness you've agreed to hear this matter.\n\nA close associate of mine has become entangled in an investigation, and I fear the authorities may be pursuing the wrong person.\n\nThe case has been moving quickly, and from everything I've heard so far, the conclusions seem to be arriving much faster than the facts.`,
    },
    {
      speaker: "lawyer",
      text: "Take a moment and start from the beginning. What exactly is under investigation, and why has it attracted the Court's attention?",
    },
    {
      speaker: "client",
      text: "The authorities are calling it \"The Anonymous Transmission.\" That's all anyone seems willing to say with certainty.\n\nFragments of information have been recovered, but the records are incomplete. Nobody appears able to agree on where the transmission originated, who created it, or even what it actually is.",
    },
    {
      speaker: "lawyer",
      text: "And despite all of that uncertainty, someone has already been accused?",
    },
    {
      speaker: "client",
      text: "That's what troubles me. Investigators believe the recovered fragments point toward a particular individual, and that assumption appears to have driven the entire case.\n\nBut every time I hear a new detail, I become less convinced they truly understand what they're dealing with.",
    },
    {
      speaker: "lawyer",
      text: "Then the accusation may be built upon conclusions rather than evidence. What materials has the Court provided for examination?",
    },
    {
      speaker: "client",
      text: "A docket of exhibits. Each exhibit contains information recovered during the investigation.\n\nThe Court believes the truth can be reconstructed from those records, but no one has yet managed to piece everything together.",
    },
    {
      speaker: "lawyer",
      text: "Then our task is straightforward, even if it is not simple. Before responsibility can be assigned, the facts themselves must be established.\n\nWe must determine the nature of the transmission, identify its creator, reconstruct its proper title, and examine the accusation against the suspect.\n\nOnly after those matters have been resolved can questions of origin and custody be addressed with any confidence.",
    },
    {
      speaker: "client",
      text: "That's precisely why I came to you.\n\nIf anyone can make sense of this case, it will be the person willing to follow the evidence wherever it leads rather than where assumptions would prefer it to go.",
    },
    {
      speaker: "lawyer",
      text: "Very well.\n\nLet us see whether the evidence supports the accusation—or whether the accusation has been standing on borrowed ground from the very beginning.",
    },
    {
      speaker: "client",
      text: "The exhibits are ready, Counsel. Proceedings are about to begin.",
    },
    {
      speaker: "lawyer",
      text: "Then let's begin.",
    }
  ];

  // Sync state input field when switching tabs
  useEffect(() => {
    setInputVal(answers[currentExhibitId] || "");
  }, [currentExhibitId, answers]);

  // Navigate to verdict page once the case is CLOSED (all solved)
  useEffect(() => {
    if (caseStatus === "CLOSED") {
      // Delay navigation so the user sees the final exhibit success stamp
      const timer = setTimeout(() => {
        navigate("/verdict");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [caseStatus, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const res = submitAnswer(currentExhibitId, inputVal);
    if (res.success) {
      setShowStatusModal("SUCCESS");
      setTimeout(() => setShowStatusModal(null), 3000);
    } else {
      setShowStatusModal("ERROR");
      setObjectionCount((prev) => prev + 1);
      setTimeout(() => setShowStatusModal(null), 3000);
    }
  };

  const progressPercentage = Math.round((completedExhibits.length / 6) * 100);

  return (
    <div className="relative min-h-screen bg-court-bg text-white p-4 md:p-8 select-none scanlines flex flex-col justify-between">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-court-border/20 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundManager.playRustle();
              navigate("/chambers");
            }}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-court-gold hover:text-white transition-colors"
          >
            <ChevronRight size={14} className="rotate-180 text-court-gold" />
            <span>Chambers</span>
          </button>
          <div className="h-4 w-px bg-court-border/20" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-court-cyan animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-court-cyan uppercase">Proceedings Active</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="text-left md:text-right">
            <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Docket Directory</div>
            <div className="font-serif font-bold text-court-gold tracking-wide">CASE FILE NO. 001: ANONYMOUS TRANSMISSION</div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      {showIntro ? (
        /* Dialogue Briefing Room */
        <div className="flex-grow flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl glass-panel-heavy rounded-lg p-6 md:p-8 border border-court-gold/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Spotlight reflection */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-court-gold/25 to-transparent" />
            
            {/* Section Title */}
            <div className="flex items-center justify-between border-b border-court-border/10 pb-4 mb-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-court-gold tracking-wider uppercase">Introductory Briefing</h3>
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Client Consultation Room</span>
              </div>
              <div className="text-right font-mono text-xs text-court-cyan">
                Docket 001-B
              </div>
            </div>

            {/* Conversation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
              
              {/* Client Avatar (Left) */}
              <div className="md:col-span-3 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: dialogueSteps[currentStep].speaker === "client" ? 1.05 : 0.95,
                  }}
                  className={`w-24 h-24 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                    dialogueSteps[currentStep].speaker === "client"
                      ? "border-court-gold shadow-[0_0_15px_rgba(245,215,110,0.4)] animate-pulse"
                      : "border-transparent opacity-40 grayscale"
                  }`}
                >
                  <img src={clientAvatar} alt="Abigail" className="w-full h-full object-cover select-none" />
                </motion.div>
                <span className={`text-[10px] font-mono mt-2 uppercase tracking-wider text-center ${
                  dialogueSteps[currentStep].speaker === "client" ? "text-court-gold font-bold" : "text-gray-500"
                }`}>
                  Abigail
                </span>
                <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase">Client</span>
              </div>

              {/* Speech Bubble (Center) */}
              <div className="md:col-span-6 flex flex-col justify-center min-h-[140px] px-5 py-4 bg-court-panel border border-court-border/10 rounded-lg relative shadow-inner">
                {/* Speech Bubble arrow */}
                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-b border-l border-court-border/10 bg-[#021246] ${
                  dialogueSteps[currentStep].speaker === "client" ? "-left-1.5" : "-right-1.5 border-r border-t border-b-0 border-l-0"
                }`} />

                <div className="text-[8px] font-mono text-court-gold/75 uppercase tracking-widest mb-2">
                  {dialogueSteps[currentStep].speaker === "client" ? "Abigail" : `${playerName || "Counsel"}`}
                </div>
                <div className="text-xs font-sans leading-relaxed text-gray-200 min-h-[80px]">
                  <TypewriterText 
                    text={dialogueSteps[currentStep].text} 
                    key={currentStep} 
                    speed={25}
                  />
                </div>
              </div>

              {/* Lawyer Avatar (Right) */}
              <div className="md:col-span-3 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: dialogueSteps[currentStep].speaker === "lawyer" ? 1.05 : 0.95,
                  }}
                  className={`w-24 h-24 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                    dialogueSteps[currentStep].speaker === "lawyer"
                      ? "border-court-blue shadow-[0_0_15px_rgba(34,111,248,0.4)] animate-pulse"
                      : "border-transparent opacity-40 grayscale"
                  }`}
                >
                  <img src={lawyerAvatar} alt="Counsel" className="w-full h-full object-cover select-none" />
                </motion.div>
                <span className={`text-[10px] font-mono mt-2 uppercase tracking-wider text-center ${
                  dialogueSteps[currentStep].speaker === "lawyer" ? "text-court-cyan font-bold" : "text-gray-500"
                }`}>
                  {playerName || "Counsel"}
                </span>
                <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase">{playerGender === "FEMALE" ? "Female" : "Male"} Counsel</span>
              </div>

            </div>

            {/* Action buttons */}
            <div className="border-t border-court-border/10 pt-5 flex flex-col items-center">
              {currentStep < dialogueSteps.length - 1 ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentStep(prev => prev + 1);
                  }}
                  className="px-6 py-2.5 bg-court-panel border border-court-gold/50 text-court-gold hover:border-court-gold hover:bg-court-gold hover:text-court-bg font-serif font-bold text-xs tracking-widest rounded uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue Briefing</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-6 text-center"
                >
                  {/* Objective box */}
                  <div className="p-5 bg-court-bg/60 border border-court-border/20 rounded-md max-w-xl mx-auto text-left space-y-4">
                    <div className="text-[10px] font-mono text-court-gold uppercase tracking-widest font-bold border-b border-court-border/10 pb-1">
                      Case Objectives
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed font-sans space-y-3">
                      <p>The Court has provided six exhibits.</p>
                      <p>Your duty is to establish:</p>
                      <ul className="list-disc pl-5 space-y-1 text-court-gold/90">
                        <li>The classification of the anonymous transmission</li>
                        <li>The identity of its creator</li>
                        <li>The title of the work</li>
                        <li>Whether the accused is guilty</li>
                        <li>The origin of the transmission</li>
                        <li>The current custodian of the evidence</li>
                      </ul>
                      <p className="border-t border-court-border/10 pt-3 text-[10px] font-mono uppercase tracking-wider text-gray-500">
                        Remember:<br />
                        Assumptions are not evidence.<br />
                        Proceed only on facts established before the Court.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playRustle();
                      setShowIntro(false);
                    }}
                    className="px-10 py-3.5 bg-court-panel border border-court-gold text-court-gold hover:bg-court-gold hover:text-court-bg font-serif font-bold text-xs tracking-widest rounded uppercase transition-all shadow-[0_4px_15px_rgba(245,215,110,0.1)] hover:shadow-[0_4px_25px_rgba(245,215,110,0.25)] cursor-pointer"
                  >
                    Begin Proceedings
                  </button>
                </motion.div>
              )}
            </div>

          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow">
        
        {/* Left Column: Exhibit Tabs (2 cols on large, full on small) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="font-mono text-xs text-gray-500 uppercase tracking-widest px-2">Exhibits Panel</div>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {Object.keys(EXHIBIT_DATA).map((key) => {
              const data = EXHIBIT_DATA[key];
              const isCompleted = completedExhibits.includes(key);
              const isCurrent = currentExhibitId === key;
              
              // Locked logic: first index is unlocked, then only unlocked if previous is completed
              const index = Object.keys(EXHIBIT_DATA).indexOf(key);
              const isUnlocked = index === 0 || completedExhibits.includes(Object.keys(EXHIBIT_DATA)[index - 1]);

              return (
                <button
                  key={key}
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && setCurrentExhibit(key)}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded text-left border font-serif transition-all shrink-0 md:shrink ${
                    isCurrent 
                      ? "bg-court-blue/15 border-court-gold text-white shadow-[0_0_15px_rgba(245,215,110,0.15)]"
                      : isCompleted
                      ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300/90 hover:bg-emerald-950/30"
                      : isUnlocked
                      ? "bg-court-panel border-court-border/20 text-gray-300 hover:border-court-gold/40 hover:bg-court-blue/5"
                      : "bg-court-bg border-court-border/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs opacity-75">{key}.</span>
                    <span className="text-sm font-semibold truncate max-w-[120px] lg:max-w-none">{data.title.split(" — ")[1]}</span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-emerald-400 fill-emerald-950/80" />
                    ) : !isUnlocked ? (
                      <Lock size={14} className="text-gray-600" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-court-gold animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Workspace & Console (6 cols on large, full on small) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* A. Top: Judge Panel */}
          <div className="glass-panel border-court-gold/30 rounded-lg p-5 flex gap-4 items-start relative overflow-hidden">
            {/* Spotlight reflection */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-court-gold/25 to-transparent" />
            
            {/* Judge Portrait Silhouette */}
            <div className="hidden sm:flex flex-col items-center shrink-0">
              <div className="w-16 h-16 rounded-full border border-court-gold/30 bg-court-bg/80 flex items-center justify-center text-court-gold/80 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <Scale size={32} className="stroke-[1.2]" />
              </div>
              <span className="text-[9px] font-mono text-court-gold uppercase mt-1 tracking-wider">The Judge</span>
            </div>

            {/* Typewriter message bubble */}
            <div className="flex-grow flex flex-col gap-1 min-h-[70px]">
              <div className="text-[10px] font-mono text-court-gold uppercase tracking-wider mb-1">Judicial Ruling / Instruction</div>
              <TypewriterText text={judgeMessage} key={judgeMessage} />
            </div>
          </div>

          {/* B. Center: Clues / Exhibit Workspace */}
          <div className="glass-panel-heavy rounded-lg border border-court-border/15 p-6 md:p-8 min-h-[300px] flex flex-col justify-between relative">
            
            {/* Clue Panel Inner Header */}
            <div className="flex items-center justify-between border-b border-court-border/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-court-gold" />
                <span className="font-serif font-bold text-lg tracking-wide">{EXHIBIT_DATA[currentExhibitId].title}</span>
              </div>
              <span className="font-mono text-xs text-court-cyan/80 bg-court-cyan/5 border border-court-cyan/25 px-2 py-0.5 rounded">
                Dossier Sheet
              </span>
            </div>

            {/* Clue Details Per Exhibit */}
            <div className="flex-grow mb-6">
              {currentExhibitId === "A" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    Review the encrypted records retrieved from the transmission buffer. Pleading counsel must classify the physical nature of the artifact:
                  </p>
                  <div className="p-5 bg-court-bg/50 border border-court-border/10 rounded font-serif italic text-court-gold/90 space-y-3 shadow-inner">
                    <p className="flex items-start gap-2.5 text-base">
                      <span className="font-mono text-xs text-court-gold/50 not-italic shrink-0 mt-1">Item 01:</span>
                      “It contains many voices, yet speaks with only one.”
                    </p>
                    <p className="flex items-start gap-2.5 text-base">
                      <span className="font-mono text-xs text-court-gold/50 not-italic shrink-0 mt-1">Item 02:</span>
                      “It travels through time, yet never takes a step.”
                    </p>
                    <p className="flex items-start gap-2.5 text-base">
                      <span className="font-mono text-xs text-court-gold/50 not-italic shrink-0 mt-1">Item 03:</span>
                      “It may be opened, but it is not a door.”
                    </p>
                  </div>
                  <p className="font-sans text-xs text-gray-400 italic">
                    Hint: Enter the common English singular noun representing this classification (4 letters).
                  </p>
                </div>
              )}

              {currentExhibitId === "B" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    Examine this biographical intercept from the National Archives to establish the identity of the author:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-court-bg/40 p-4 border border-court-border/10 rounded font-mono text-xs text-gray-300">
                    <div className="space-y-2">
                      <div><span className="text-court-gold">Nationality:</span> Nigerian</div>
                      <div><span className="text-court-gold">Academic Origin:</span> Professor of Law</div>
                      <div><span className="text-court-gold">Institution:</span> Babcock University</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-court-gold">Thematic Focus:</span> Hidden Truths, Women, Family History</div>
                      <div><span className="text-court-gold">Dossier Initials:</span> C.O.O.</div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Provide the author's full name. Spelling must match official records exactly (e.g. FirstName LastName1-LastName2).
                  </p>
                </div>
              )}

              {currentExhibitId === "C" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    Deduce the literary work's exact title based on these architectural structural records:
                  </p>
                  <div className="p-4 bg-court-bg/60 border border-court-border/10 rounded flex flex-col items-center justify-center gap-4">
                    <div className="flex gap-1.5 font-mono text-sm tracking-widest text-court-gold uppercase">
                      <span className="px-2 py-1 bg-court-panel border border-court-border/20 rounded">[THE]</span>
                      <span className="px-2 py-1 bg-court-panel/20 border border-dashed border-court-border/15 rounded text-gray-500">[_ _ _]</span>
                      <span className="px-2 py-1 bg-court-panel border border-court-border/20 rounded">[OF]</span>
                      <span className="px-2 py-1 bg-court-panel border border-court-border/20 rounded">[THE]</span>
                      <span className="px-2 py-1 bg-court-panel/20 border border-dashed border-court-border/15 rounded text-gray-500">[_ _ _ _ _]</span>
                    </div>
                    <div className="w-full text-xs font-serif italic text-gray-300 space-y-1.5 max-w-md border-t border-court-border/10 pt-3">
                      <div>• Total Title Structure: Six words.</div>
                      <div>• Bounds: Starts with 'THE', finishes with 'HOUSE'.</div>
                      <div>• Thematic note: The central subject is neither a king nor a father.</div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400">
                    Submit the full reconstructed title in English.
                  </p>
                </div>
              )}

              {currentExhibitId === "D" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    Review the transcript extract from the interrogation record of the prime suspect:
                  </p>
                  <div className="p-4 bg-court-bg/50 border border-court-border/10 rounded font-mono text-xs text-gray-300 space-y-3 max-h-[160px] overflow-y-auto">
                    <div>
                      <span className="text-court-gold font-bold">COUNSEL:</span> Did you handle the book artifact at the secondary campus site?
                    </div>
                    <div>
                      <span className="text-court-cyan font-bold">ACCUSED:</span> Absolutely not. I only read self-development logs. I struggle to recall basic plot structures of fantasy books, like Harry Potter. I have never accessed any literary fiction under docket custody.
                    </div>
                    <div className="text-gray-500 italic border-t border-court-border/10 pt-2">
                      Verification Report: Accused's digital history indicates heavy logs on corporate development articles and zero hits on legal fantasy files.
                    </div>
                  </div>
                  <p className="font-sans text-sm text-court-gold font-semibold">
                    Question: Is the accused guilty?
                  </p>
                  <p className="font-sans text-xs text-gray-400">
                    Input your verdict: YES / NO (or INNOCENT / GUILTY).
                  </p>
                </div>
              )}

              {currentExhibitId === "E" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    A network transmission link analysis was conducted on communications logs. Identify the sender:
                  </p>
                  <div className="p-4 bg-court-bg/40 border border-court-border/10 rounded font-mono text-xs text-gray-300 space-y-2">
                    <div>• <span className="text-court-gold">Location context:</span> Based in Abuja capital district.</div>
                    <div>• <span className="text-court-gold">Sports details:</span> Fanatical Chelsea FC supporter.</div>
                    <div>• <span className="text-court-gold">Association:</span> Co-worker in same school system.</div>
                    <div>• <span className="text-court-gold">Mutual reference node:</span> Abigail.</div>
                    <div>• <span className="text-court-gold">Observed behavior:</span> Deep interest in tracking books.</div>
                  </div>
                  <p className="font-sans text-xs text-gray-400">
                    Input the sender's name (4 letters).
                  </p>
                </div>
              )}

              {currentExhibitId === "F" && (
                <div className="space-y-4">
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">
                    Locate where the physical book is being held in escrow. Determine the identity of the custodian:
                  </p>
                  <div className="p-4 bg-court-bg/50 border border-court-border/10 rounded font-serif italic text-court-gold/90 space-y-2">
                    <div>• “The book is in safe custody.”</div>
                    <div>• “The custodian lives in the same household as the accused.”</div>
                    <div>• “The custodian is younger than the accused.”</div>
                  </div>
                  <p className="font-sans text-xs text-gray-400">
                    Input the custodian's name (6 letters).
                  </p>
                </div>
              )}
            </div>

            {/* C. Bottom: Input Pleadings Console */}
            <form onSubmit={handleSubmit} className="border-t border-court-border/10 pt-5 mt-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    disabled={completedExhibits.includes(currentExhibitId)}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={
                      completedExhibits.includes(currentExhibitId)
                        ? "Evidence Admitted and Locked"
                        : "Enter pleading response..."
                    }
                    className="w-full bg-court-bg/80 border border-court-border/20 focus:border-court-gold rounded px-4 py-3 text-sm font-mono tracking-wider focus:outline-none uppercase text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner transition-colors"
                  />
                  {!completedExhibits.includes(currentExhibitId) && (
                    <div className="absolute right-3 top-3.5 text-gray-500">
                      <CornerDownLeft size={16} />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputVal.trim() || completedExhibits.includes(currentExhibitId)}
                  className="px-6 py-3 bg-court-panel border border-court-gold text-court-gold hover:bg-court-gold hover:text-court-bg disabled:border-court-border/10 disabled:text-gray-600 disabled:bg-transparent rounded font-serif font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Scale size={16} />
                  <span>Submit Evidence</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Case Progress & Audio settings (3 cols on large, full on small) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* A. Progress Gauge Card */}
          <div className="glass-panel rounded-lg p-5 flex flex-col items-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest self-start mb-4">Case Completion</div>
            
            {/* SVG Circular Progress */}
            <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-court-bg"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress bar */}
                <motion.circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-court-gold"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={301.6} // 2 * pi * r
                  strokeDashoffset={301.6 - (301.6 * progressPercentage) / 100}
                  strokeLinecap="round"
                  transition={{ duration: 1 }}
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-mono font-bold text-white">{progressPercentage}%</span>
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Admitted</span>
              </div>
            </div>
            
            <div className="text-center font-mono text-[10px] text-gray-400 tracking-wider">
              {completedExhibits.length} / 6 Facts Verified
            </div>
          </div>

          {/* B. Fact Ledger Recap Card */}
          <div className="glass-panel rounded-lg p-5 flex-grow flex flex-col min-h-[220px]">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Fact Ledger</div>
            
            <div className="space-y-3 overflow-y-auto flex-grow max-h-[260px] pr-1">
              {Object.keys(EXHIBIT_DATA).map((key) => {
                const isDone = completedExhibits.includes(key);
                const data = EXHIBIT_DATA[key];
                return (
                  <div 
                    key={key} 
                    className={`flex items-start gap-2 text-xs border-b border-court-border/5 pb-2 transition-opacity ${
                      isDone ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <HelpCircle size={13} className="text-gray-500 mt-0.5 shrink-0" />
                    )}
                    <div className="font-sans">
                      <span className="font-mono text-court-gold/80 font-semibold uppercase mr-1">{key}:</span>
                      {isDone ? (
                        <span>
                          {key === "A" && `Classification: ${answers.A}`}
                          {key === "B" && `Author: ${answers.B}`}
                          {key === "C" && `Title: ${answers.C}`}
                          {key === "D" && `Accused: ${answers.D === "NO" || answers.D === "INNOCENT" || answers.D === "NOT GUILTY" ? "Innocent" : answers.D}`}
                          {key === "E" && `Sender: ${answers.E}`}
                          {key === "F" && `Custodian: ${answers.F}`}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Awaiting pleading...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Audio Console Card */}
          <div className="glass-panel rounded-lg p-5">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 flex justify-between items-center">
              <span>Acoustic Control</span>
              <button 
                onClick={() => {
                  initAudio();
                  toggleMute();
                }}
                className="text-court-gold hover:text-white"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Ambience Loop Toggle */}
              <div className="flex items-center justify-between">
                <span>Ambient Hum:</span>
                <button
                  onClick={() => {
                    initAudio();
                    toggleAmbience();
                  }}
                  className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
                    isAmbiencePlaying 
                      ? "border-court-cyan/40 text-court-cyan bg-court-cyan/5" 
                      : "border-court-border/20 text-gray-400 bg-transparent hover:border-court-gold/40 hover:text-white"
                  }`}
                >
                  {isAmbiencePlaying ? "Active" : "Off"}
                </button>
              </div>

              {/* Ambience volume slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Hum Vol</span>
                  <span>{Math.round(volumeAmbience * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumeAmbience}
                  onChange={(e) => {
                    initAudio();
                    setVolumeAmbience(parseFloat(e.target.value));
                  }}
                  className="w-full accent-court-gold bg-court-bg rounded h-1 cursor-pointer"
                />
              </div>

              {/* SFX volume slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>SFX Vol</span>
                  <span>{Math.round(volumeSFX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumeSFX}
                  onChange={(e) => {
                    initAudio();
                    setVolumeSFX(parseFloat(e.target.value));
                  }}
                  className="w-full accent-court-gold bg-court-bg rounded h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reset Case file progress */}
          <div className="text-center">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to wipe the docket and restart Case File No. 001?")) {
                  resetGame();
                  setInputVal("");
                  setShowIntro(true);
                  setCurrentStep(0);
                }
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors"
            >
              Reset Case Progress
            </button>
          </div>
        </div>

      </div>
      )}

      {/* 3. Modal Overlays for Submit States */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-court-bg/80 backdrop-blur-sm p-4"
          >
            {showStatusModal === "SUCCESS" ? (
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-emerald-950/90 border-2 border-emerald-500 p-8 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.3)] max-w-sm text-center relative overflow-hidden"
              >
                {/* Visual success stamp layout */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl" />
                
                <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg">
                  <CheckCircle2 size={36} />
                </div>
                
                <div className="font-serif text-2xl font-bold text-emerald-400 mb-2 uppercase tracking-wide">
                  Evidence Admitted
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  The pleading matches standard docket registers. Submission entered into official court records.
                </p>
                <div className="inline-block mt-6 px-4 py-1.5 stamp-admitted text-sm uppercase">
                  ADMITTED
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-rose-950/90 border-2 border-rose-500 p-8 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-sm text-center relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-xl" />
                
                <div className="w-16 h-16 rounded-full bg-rose-900/60 border border-rose-400 flex items-center justify-center mx-auto mb-4 text-rose-400 shadow-lg animate-bounce">
                  <ShieldAlert size={36} />
                </div>
                
                <div className="font-serif text-2xl font-bold text-rose-400 mb-2 uppercase tracking-wide">
                  Objection Sustained
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  The Judge has sustained an objection. Pleading is insufficient. Review your evidence and clues, Counsel.
                </p>
                <div className="inline-block mt-6 px-4 py-1.5 border-2 border-rose-500 text-rose-500 rounded text-xs uppercase tracking-widest font-mono font-bold bg-rose-950/40">
                  OBJECTION
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="text-center text-[9px] font-mono tracking-widest text-gray-600 uppercase border-t border-court-border/10 pt-4 mt-6">
        CHAMBER CLERK • SECURITY CLEARANCE LEVEL 01
      </div>
    </div>
  );
};
export default GamePage;
