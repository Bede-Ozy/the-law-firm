import React, { useState, useEffect, useRef } from "react";
import { soundManager } from "../utils/audioManager";

export const TypewriterText = ({
  text = "",
  speed = 30, // base delay in ms per character
  delay = 100, // delay before starting to type
  onComplete = () => {}
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(text);
  const timeoutId = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset state whenever text changes
    textRef.current = text;
    setDisplayedText("");
    indexRef.current = 0;
    if (timeoutId.current) clearTimeout(timeoutId.current);

    const typeChar = () => {
      const currentIdx = indexRef.current;
      const fullText = textRef.current;

      if (currentIdx >= fullText.length) {
        onComplete();
        return;
      }

      const char = fullText[currentIdx];
      setDisplayedText((prev) => prev + char);
      indexRef.current = currentIdx + 1;

      // Determine typing speed for next character
      let nextDelay = speed;

      // Natural pause on punctuation
      if (char === "." || char === "?" || char === "!") {
        nextDelay = speed * 15; // long pause (e.g. ~450ms)
      } else if (char === "," || char === ";" || char === ":") {
        nextDelay = speed * 8;  // medium pause (e.g. ~240ms)
      } else if (char === " ") {
        nextDelay = speed * 1.5; // slight break on spaces
      }

      // Play click sound if it is a printable non-space character
      if (char !== " ") {
        // Add subtle random variance to sound rate so clicks don't sound robotic
        if (Math.random() > 0.15) {
          soundManager.playClick();
        }
      }

      timeoutId.current = setTimeout(typeChar, nextDelay);
    };

    timeoutId.current = setTimeout(typeChar, delay);

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [text, speed, delay]);

  return (
    <span className="font-mono text-white leading-relaxed whitespace-pre-wrap">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-2.5 h-5 ml-1 bg-court-gold animate-typewriter-cursor border-l-2"></span>
      )}
    </span>
  );
};
export default TypewriterText;
