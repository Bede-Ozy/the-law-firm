import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, FolderLock, Shield, ArrowLeft } from "lucide-react";
import { soundManager } from "../utils/audioManager";
import { useGameStore } from "../store/useGameStore";

export const ChambersPage = () => {
  const navigate = useNavigate();
  const { caseStatus, resetGame } = useGameStore();

  const handleBeginCase = () => {
    soundManager.playRustle();
    navigate("/case/001");
  };

  const cases = [
    {
      id: "001",
      number: "No. 001",
      title: "The Anonymous Transmission",
      status: caseStatus, // 'OPEN' or 'CLOSED'
      description: "An encrypted packet of pages has been intercepted at the partner's desk. You are assigned to audit the files and establish identity.",
      unlocked: true,
    },
    {
      id: "002",
      number: "No. 002",
      title: "The Gilded Ledger",
      status: "LOCKED",
      description: "A mysterious double-ledger containing transactions from an offshore account. Audit access pending senior partner approval.",
      unlocked: false,
    },
    {
      id: "003",
      number: "No. 003",
      title: "The Blood-Stained Ledger",
      status: "LOCKED",
      description: "Physical evidence logs recovered from a safehouse. Case file sealed by executive order.",
      unlocked: false,
    }
  ];

  return (
    <div className="relative min-h-screen bg-court-bg text-white p-6 md:p-12 select-none scanlines flex flex-col justify-between">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-court-border/20 pb-6 mb-8">
        <button
          onClick={() => {
            soundManager.playRustle();
            navigate("/");
          }}
          className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-court-gold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Chambers</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Docket Directory</div>
          <div className="font-serif text-lg font-bold text-court-gold">CHAMBERS OF COUNSEL</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center my-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-3">
            Select Case Docket
          </h2>
          <p className="text-sm font-sans text-gray-400 max-w-xl mx-auto leading-relaxed">
            Review your active briefs. Select an open filing to begin examining evidence and preparing pleadings.
          </p>
        </motion.div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cases.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
              className={`relative glass-panel rounded-lg overflow-hidden border flex flex-col justify-between transition-all ${
                c.unlocked 
                  ? "border-court-gold/25 hover:border-court-gold/70 shadow-[0_4px_30px_rgba(245,215,110,0.05)] hover:shadow-[0_4px_35px_rgba(245,215,110,0.12)] cursor-pointer" 
                  : "border-court-border/10 opacity-60"
              }`}
              onClick={c.unlocked ? handleBeginCase : undefined}
            >
              {/* Folder Ribbon Seal for Active Unlocked Case */}
              {c.unlocked && c.status === "OPEN" && (
                <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                  <div className="absolute transform rotate-45 bg-court-gold/80 text-court-bg text-[10px] font-mono uppercase tracking-widest font-bold text-center py-1 w-36 -right-9 top-6 shadow-md border-y border-court-gold">
                    Active
                  </div>
                </div>
              )}

              {c.unlocked && c.status === "CLOSED" && (
                <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                  <div className="absolute transform rotate-45 bg-emerald-600 text-white text-[9px] font-mono uppercase tracking-widest font-bold text-center py-1 w-36 -right-9 top-6 shadow-md">
                    Admitted
                  </div>
                </div>
              )}

              {/* Dossier Card Body */}
              <div className="p-6 md:p-8">
                {/* Dossier Icon */}
                <div className="mb-6 flex justify-between items-start">
                  {c.unlocked ? (
                    <Folder size={40} className="text-court-gold stroke-[1.5]" />
                  ) : (
                    <FolderLock size={40} className="text-gray-500 stroke-[1.5]" />
                  )}
                  
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                    c.status === "OPEN" 
                      ? "border-court-gold/40 text-court-gold bg-court-gold/5" 
                      : c.status === "CLOSED"
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                      : "border-gray-500/20 text-gray-500 bg-gray-500/5"
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Case Numbers & Meta */}
                <div className="font-mono text-xs text-court-cyan/80 uppercase tracking-widest mb-1">
                  Case File {c.number}
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4 text-white leading-tight">
                  {c.title}
                </h3>

                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-6">
                  {c.description}
                </p>
              </div>

              {/* Dossier Card Action Footer */}
              <div className="p-6 border-t border-court-border/10 bg-court-bg/50">
                {c.unlocked ? (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBeginCase();
                      }}
                      className="w-full py-2.5 px-4 rounded font-serif text-sm tracking-wider font-bold text-court-gold border border-court-gold/50 bg-court-panel hover:bg-court-gold hover:text-court-bg transition-all text-center uppercase"
                    >
                      {c.status === "CLOSED" ? "Reopen Pleadings" : "Begin Proceedings"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <Shield size={14} />
                    <span>Clearance Level Pending</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Option to clear case file progress */}
        {caseStatus === "CLOSED" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to wipe the docket and restart Case File No. 001?")) {
                  resetGame();
                }
              }}
              className="text-xs font-mono uppercase tracking-widest text-red-400/70 hover:text-red-400 border-b border-dashed border-red-400/30 hover:border-red-400 transition-all"
            >
              Reset Case File 001
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] font-mono tracking-widest text-gray-600 uppercase border-t border-court-border/10 pt-6 mt-8">
        HIGH COURT OF IMAGINATIVE JURISDICTION
      </div>
    </div>
  );
};
export default ChambersPage;
