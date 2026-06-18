import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Volume2, VolumeX, User } from "lucide-react";
import { useGameStore } from "../store/useGameStore";

export const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { 
    initAudio, 
    toggleAmbience, 
    isAmbiencePlaying,
    playerName,
    playerGender,
    setPlayerInfo
  } = useGameStore();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [nameInput, setNameInput] = useState(playerName || "");
  const [genderInput, setGenderInput] = useState(playerGender || "");

  // Canvas Particle system (Floating Gold Dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = 45;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height * 0.1;
        this.size = Math.random() * 2.2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = -(Math.random() * 0.4 + 0.15); // float upwards
        this.alpha = Math.random() * 0.5 + 0.15;
        this.decay = Math.random() * 0.002 + 0.001;
        this.hue = Math.random() * 10 + 40; // Goldish Hue
      }

      update(mousePos) {
        // Drift slowly
        this.x += this.speedX;
        this.y += this.speedY;

        // Interactive mouse push
        const dx = this.x - mousePos.x;
        const dy = this.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }

        // Decay alpha slowly
        this.alpha -= this.decay;

        // Reset if off-screen or faded
        if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
          this.y = canvas.height; // restart at the bottom
          this.alpha = Math.random() * 0.5 + 0.15;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 85%, 68%, ${this.alpha})`;
        // Add subtle shadow glow
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `rgba(245, 215, 110, 0.4)`;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle vertical volumetric spotlight beam
      const gradient = ctx.createLinearGradient(canvas.width / 2 - 200, 0, canvas.width / 2 + 200, canvas.height);
      gradient.addColorStop(0, "rgba(34, 111, 248, 0.0)");
      gradient.addColorStop(0.5, "rgba(245, 215, 110, 0.03)");
      gradient.addColorStop(1, "rgba(34, 111, 248, 0.0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 150, 0);
      ctx.lineTo(canvas.width / 2 + 150, 0);
      ctx.lineTo(canvas.width / 2 + 450, canvas.height);
      ctx.lineTo(canvas.width / 2 - 450, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Render particles
      particles.forEach((p) => {
        p.update(mouse);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mouse]);

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  const handleEnterChambers = () => {
    // Save Counsel details
    setPlayerInfo(nameInput.trim(), genderInput);
    // Initialize Web Audio context and start ambience loop on click
    initAudio();
    if (!isAmbiencePlaying) {
      toggleAmbience();
    }
    navigate("/chambers");
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-court-bg text-white overflow-hidden select-none scanlines"
      onMouseMove={handleMouseMove}
    >
      {/* Background canvas for gold particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Floating Header Audio Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => {
            initAudio();
            toggleAmbience();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-court-border bg-court-panel hover:bg-court-blue/20 hover:border-court-cyan/40 transition-all text-xs font-mono uppercase tracking-wider text-court-gold/90 hover:text-white"
        >
          {isAmbiencePlaying ? (
            <>
              <Volume2 size={14} className="text-court-cyan" />
              <span>Hum Active</span>
            </>
          ) : (
            <>
              <VolumeX size={14} className="text-gray-400" />
              <span>Hum Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Cinematic Main Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-xl px-6"
      >
        {/* Court Seal Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="mb-8 w-24 h-24 text-court-gold flex items-center justify-center rounded-full border-2 border-double border-court-gold/30 p-2 shadow-[0_0_15px_rgba(245,215,110,0.1)] bg-court-bg"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
            <path d="M 50,15 L 50,85 M 15,50 L 85,50" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
            <g transform="translate(50, 48) scale(0.65)">
              {/* Scale Icon inside seal */}
              <path d="M-20,-10 L20,-10 M0,-15 L0,25 M-20,-10 C-20,5 -10,15 0,15 C10,15 20,5 20,-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="-20" cy="-10" r="3" fill="currentColor" />
              <circle cx="20" cy="-10" r="3" fill="currentColor" />
              <circle cx="0" cy="-15" r="4" fill="currentColor" />
            </g>
            {/* Curved text path */}
            <path id="seal-text-path" d="M 20,50 A 30,30 0 1,1 80,50" fill="none" stroke="none" />
            <text fontFamily="Playfair Display" fontSize="6" fontWeight="bold" fill="currentColor" letterSpacing="1.2">
              <textPath href="#seal-text-path" startOffset="50%" textAnchor="middle">
                COURT OF IMAGINATIVE JURISDICTION
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-widest text-gold-gradient uppercase mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          The Law Firm
        </h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="font-serif italic text-lg md:text-xl text-court-gold/80 max-w-md leading-relaxed mb-12 border-b border-t border-court-border/20 py-4"
        >
          “Truth is rarely handed over. It must be established.”
        </motion.p>

        {/* Counsel Profile Input Form */}
        <div className="w-full max-w-sm mb-8 space-y-4 text-left bg-court-panel/30 border border-court-border/10 p-5 rounded-lg backdrop-blur-sm shadow-inner">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-court-gold/80 uppercase">
              <User size={12} className="text-court-gold" />
              <span>Counsel Name</span>
            </label>
            <input
              type="text"
              maxLength={22}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-court-bg/75 border border-court-border focus:border-court-gold rounded px-4 py-2.5 text-xs font-mono tracking-wider focus:outline-none text-white placeholder-gray-600 transition-all focus:ring-1 focus:ring-court-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] tracking-wider text-court-gold/80 uppercase">
              Gender Designation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["MALE", "FEMALE"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setGenderInput(gender)}
                  className={`py-2 px-1 border rounded text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    genderInput === gender
                      ? "border-court-gold text-court-gold bg-court-blue/15 shadow-[0_0_10px_rgba(245,215,110,0.15)] font-bold"
                      : "border-court-border/20 text-gray-400 bg-transparent hover:border-court-gold/30 hover:text-white"
                  }`}
                >
                  {gender.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button - Animated appearance */}
        <AnimatePresence>
          {nameInput.trim().length >= 2 && genderInput !== "" && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -15, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34, 111, 248, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnterChambers}
                className="relative px-10 py-4 font-serif text-lg tracking-widest text-court-gold border border-court-gold bg-court-panel hover:bg-court-blue/15 hover:border-court-cyan transition-all rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] group overflow-hidden cursor-pointer"
              >
                {/* Sweeping scanline reflection overlay */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[scanline_1.8s_ease-out_infinite]" />
                
                <span className="flex items-center gap-3">
                  <Scale size={18} className="text-court-gold group-hover:text-court-cyan transition-colors" />
                  ENTER CHAMBERS
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 z-10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
        ESTABLISHED 2026 • COURT OF CASES
      </div>
    </div>
  );
};
export default LandingPage;
