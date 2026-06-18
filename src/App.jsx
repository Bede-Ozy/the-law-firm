import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./components/LandingPage";
import ChambersPage from "./components/ChambersPage";
import GamePage from "./components/GamePage";
import VerdictPage from "./components/VerdictPage";
import { useGameStore } from "./store/useGameStore";
import "./App.css";

// Page transition animations helper wrapper
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="w-full h-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();
  const initAudio = useGameStore((state) => state.initAudio);

  // Initialize audio parameters on component mounting
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/chambers" 
          element={
            <PageWrapper>
              <ChambersPage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/case/001" 
          element={
            <PageWrapper>
              <GamePage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/verdict" 
          element={
            <PageWrapper>
              <VerdictPage />
            </PageWrapper>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
