import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/useGameStore";
import { soundManager } from "../utils/audioManager";
import TypewriterText from "./TypewriterText";
import bookCover from "../assets/book_cover.png";

export const VerdictPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { errorCount, resetGame, isMuted, toggleMute, playerName } = useGameStore();
  
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLines, setTypedLines] = useState([]);
  const [isStampTriggered, setIsStampTriggered] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  const isPerfectRun = errorCount === 0;

  // Cinematic script lines
  const script = [
    { text: "Counsel, step forward...", delay: 800 },
    { text: "All exhibits have been examined. Testimonies reviewed. Evidence weighed.", delay: 800 },
    { text: "The Court now delivers its final ruling.", delay: 800 },
    { text: "The anonymous literary artifact is hereby identified as:", delay: 800 },
    { text: "THE SON OF THE HOUSE", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
    { text: "The origin of transmission has been established.", delay: 800 },
    { text: "BEDE", isHighlight: true, sound: "success", delay: 1200 },
    { text: "The Court hereby authorizes immediate retrieval of Exhibit A.", delay: 800 },
    { text: "Custody lies with Officer Jayken.", delay: 1200 },
    
    // Conditional Easter Egg Line
    ...(isPerfectRun ? [
      { text: "A rare outcome. Perfect submission record.", isHighlight: true, delay: 1000 },
      { text: "The Court extends its commendation. Not all cases begin this cleanly.", isHighlight: true, delay: 1200 }
    ] : []),

    { text: "This case is hereby closed.", delay: 800 },
    { text: "Case File No. 001 is concluded.", delay: 800 },
    { text: "Counsel has demonstrated satisfactory investigative ability.", delay: 800 },
    { text: "The Court acknowledges this as your first brief. Proceed with confidence.", delay: 1000 },
    { text: `Congratulations on your first case, Counsel ${playerName || "Counsel"}!`, isHighlight: true, delay: 1200 },
    { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
  ];

  // Advance typewriter lines sequentially
  useEffect(() => {
    if (lineIndex < script.length) {
      const currentLine = script[lineIndex];
      
      // Play custom sounds on key lines
      if (currentLine.sound === "boom") {
        soundManager.playBoom();
      } else if (currentLine.sound === "success") {
        soundManager.playSuccess();
      }
    } else {
      // Script finished: stamp closed, play boom, start victory music and confetti
      triggerFinalClimax();
    }
  }, [lineIndex]);

  const triggerFinalClimax = () => {
    // 1. Play massive gavel boom and physical stamp noise
    soundManager.playBoom();
    soundManager.playStamp();
    
    // 2. Shake the screen
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 500);

    // 3. Render the closed stamp
    setIsStampTriggered(true);

    // 4. Start victory music arpeggio
    setTimeout(() => {
      soundManager.playVictory();
    }, 1000);

    // 5. Open Certificate & Award Panel after a delay
    setTimeout(() => {
      setShowCertificate(true);
      startConfetti();
    }, 2500);
  };

  const handleLineComplete = () => {
    const currentLine = script[lineIndex];
    setTypedLines((prev) => [...prev, currentLine]);
    
    setTimeout(() => {
      setLineIndex((prev) => prev + 1);
    }, currentLine.delay);
  };

  // Canvas Confetti System
  const startConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId;
    let confetti = [];
    const colors = ["#ffe082", "#f5d76e", "#cca028", "#226ff8", "#00c6ff"];

    class Confetto {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) {
      confetti.push(new Confetto());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => {
        c.update();
        c.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  const handleRestart = () => {
    resetGame();
    navigate("/chambers");
  };

  return (
    <div className={`relative min-h-screen bg-court-bg text-white p-4 md:p-8 select-none scanlines flex flex-col justify-between overflow-x-hidden ${
      shakeScreen ? "animate-[shake_0.4s_ease-in-out_infinite]" : ""
    }`}>
      {/* Canvas for confetti */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* CSS keyframe for screen shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-4px, 4px) rotate(-0.5deg); }
          40% { transform: translate(4px, -2px) rotate(0.5deg); }
          60% { transform: translate(-2px, -4px) rotate(-0.2deg); }
          80% { transform: translate(2px, 2px) rotate(0.2deg); }
        }
      `}</style>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-court-border/20 pb-4 mb-6">
        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
          Judicial Ruling Room
        </div>
        
        <button 
          onClick={toggleMute}
          className="text-court-gold hover:text-white"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Central Screen Area */}
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center relative my-6">
        
        <AnimatePresence mode="wait">
          {!showCertificate ? (
            /* PHASE 1: Typewriter Transcript Verdict */
            <motion.div
              key="transcript"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="glass-panel-heavy rounded-lg p-6 md:p-10 border border-court-gold/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Gold ribbon header */}
              <div className="flex justify-between items-center border-b border-court-border/10 pb-4 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-court-gold tracking-wider uppercase">High Court of Cases</h3>
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Official Ruling Transcript</span>
                </div>
                <div className="text-right font-mono text-xs text-court-cyan">
                  Docket 001-A
                </div>
              </div>

              {/* Typed list scroll */}
              <div className="space-y-4 font-mono text-sm leading-relaxed max-h-[420px] overflow-y-auto pr-2">
                {typedLines.map((line, idx) => (
                  <div key={idx} className="pb-1.5 border-b border-court-border/5">
                    {line.isBig ? (
                      <span className={`block font-serif text-2xl font-bold py-2 tracking-widest text-center ${
                        line.isHighlight ? "text-gold-gradient" : "text-white"
                      }`}>
                        {line.text}
                      </span>
                    ) : (
                      <span className={line.isHighlight ? "text-court-gold font-semibold" : "text-gray-300"}>
                        {line.text}
                      </span>
                    )}
                  </div>
                ))}

                {lineIndex < script.length && (
                  <div className="pt-2">
                    {script[lineIndex].isBig ? (
                      <div className="text-center py-2">
                        <TypewriterText
                          text={script[lineIndex].text}
                          speed={45}
                          onComplete={handleLineComplete}
                        />
                      </div>
                    ) : (
                      <TypewriterText
                        text={script[lineIndex].text}
                        speed={25}
                        onComplete={handleLineComplete}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Physical "CASE CLOSED" Red Gavel Stamp Overlay */}
              <AnimatePresence>
                {isStampTriggered && (
                  <motion.div
                    initial={{ scale: 3, opacity: 0, rotate: -35 }}
                    animate={{ scale: 1, opacity: 1, rotate: -8 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <div className="stamp-closed text-3xl md:text-5xl font-bold px-10 py-5 rounded border-8 border-dashed shadow-[0_0_30px_rgba(239,68,68,0.25)] select-none">
                      CASE CLOSED
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* PHASE 2: Reward / Admitted Certificate Screen */
            <motion.div
              key="certificate"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Book Cover Frame (5 cols) */}
              <div className="md:col-span-5 flex justify-center">
                <motion.div 
                  whileHover={{ rotateY: 15, rotateX: 5, z: 50, shadowBlur: 30 }}
                  className="relative w-64 h-[380px] rounded-lg overflow-hidden shadow-[0_15px_45px_0_rgba(0,0,0,0.6)] border border-court-gold/30 bg-court-panel group cursor-grab active:cursor-grabbing preserve-3d"
                >
                  <img
                    src={bookCover}
                    alt="The Son of the House"
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Glowing hover overlay reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              {/* Certificate Sheet (7 cols) */}
              <div className="md:col-span-7">
                <div className="glass-panel-heavy rounded-lg p-6 md:p-8 border border-court-gold/40 relative text-center">
                  
                  {/* Decorative Gold Borders */}
                  <div className="absolute inset-2 border border-double border-court-gold/20 rounded pointer-events-none" />

                  <div className="w-12 h-12 rounded-full border border-court-gold bg-court-bg flex items-center justify-center mx-auto mb-4 text-court-gold">
                    <Award size={24} />
                  </div>

                  <span className="font-mono text-[9px] text-court-gold uppercase tracking-widest block mb-1">
                    Certificate of Qualification
                  </span>
                  
                  <h3 className="font-serif text-2xl font-semibold text-gold-gradient uppercase mb-2 tracking-wide">
                    Admitted to the Bar of Cases
                  </h3>
                  
                  <span className="font-mono text-[10px] text-court-cyan uppercase tracking-wider block mb-6">
                    Congratulations on your first case, {playerName || "Counsel"}!
                  </span>

                  <p className="font-sans text-xs text-gray-400 leading-relaxed mb-6 px-4">
                    This document certifies that the named Counsel has successfully resolved the encrypted case files of the Anonymous Transmission, recovered the literary work <span className="text-white">THE SON OF THE HOUSE</span>, and identified the transmission source.
                  </p>

                  {/* Name field */}
                  <div className="border-b-2 border-double border-court-gold/30 py-3 mx-6 mb-8 text-center">
                    <span className="font-serif text-3xl font-bold tracking-widest text-white italic">
                      {playerName || "Mary Sherlock"}
                    </span>
                  </div>

                  {/* Seals & Signatures */}
                  <div className="flex justify-between items-center px-6 text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-6">
                    <div className="text-left">
                      <div>L.J. BEDE</div>
                      <div className="border-t border-gray-600/40 mt-1 pt-1">Presiding Judge</div>
                    </div>
                    <div className="w-12 h-12 border border-court-gold/30 rounded-full flex items-center justify-center text-court-gold/40">
                      SEAL
                    </div>
                    <div className="text-right">
                      <div>JAYKEN COURT</div>
                      <div className="border-t border-gray-600/40 mt-1 pt-1">Court Archivist</div>
                    </div>
                  </div>

                  <div className="inline-block px-4 py-1.5 border border-emerald-500 text-emerald-400 rounded text-[10px] tracking-widest font-mono font-bold bg-emerald-950/20 uppercase mb-2">
                    Evidence Recovered Successfully
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-court-border/10 pt-4 mt-6">
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-court-panel border border-court-gold/40 text-court-gold hover:border-court-gold hover:bg-court-gold hover:text-court-bg font-serif font-bold text-xs tracking-wider rounded uppercase transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              <span>Reset Case Brief</span>
            </button>
            
            <button
              onClick={() => navigate("/chambers")}
              className="px-6 py-2.5 bg-court-blue text-white hover:bg-court-cyan hover:text-court-bg font-serif font-bold text-xs tracking-wider rounded uppercase transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(34,111,248,0.3)]"
            >
              <span>Return to Chambers</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}
        <div className="text-[9px] font-mono tracking-widest text-gray-600 uppercase mt-2 sm:mt-0">
          ESTABLISHED COURT RECORD • NO. 001-C
        </div>
      </div>

    </div>
  );
};
export default VerdictPage;
