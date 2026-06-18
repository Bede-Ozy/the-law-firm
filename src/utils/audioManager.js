// Web Audio API Procedural Synthesizer for Courtroom Soundscapes
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambienceGain = null;
    this.sfxGain = null;
    this.ambienceNode = null;
    this.isMuted = false;
    this.sfxVolume = 0.5;
    this.ambienceVolume = 0.3;
    this.ambienceStarted = false;
  }

  // Safe AudioContext Initialization (triggered on user interaction)
  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Node tree: Source -> SFX/Ambience Gain -> Master Gain -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio API is not supported or failed to initialize", e);
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = volume;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  setAmbienceVolume(volume) {
    this.ambienceVolume = volume;
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  // Generate continuous Brown Noise (low-frequency rumbling)
  createBrownNoiseNode() {
    if (!this.ctx) return null;
    const bufferSize = 10 * this.ctx.sampleRate; // 10 seconds of noise
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise formula (integrate white noise)
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      // Amplify slightly
      output[i] *= 3.5;
    }

    const whiteNoiseSource = this.ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;
    return whiteNoiseSource;
  }

  // Start continuous deep courtroom ambient background hum
  startAmbience() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.ambienceStarted) return;

    try {
      const brownNoise = this.createBrownNoiseNode();
      if (!brownNoise) return;

      // Filter to isolate deep sub-frequency hums and remove high frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      filter.Q.setValueAtTime(1, this.ctx.currentTime);

      // Slow LFO to modulate filter frequency to create a dynamic "room breathing" effect
      const lfo = this.ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow: 12 seconds per cycle

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, this.ctx.currentTime); // sweep filter between 90Hz and 150Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      brownNoise.connect(filter);
      filter.connect(this.ambienceGain);
      brownNoise.start();

      this.ambienceNode = {
        source: brownNoise,
        lfo: lfo,
        filter: filter
      };
      this.ambienceStarted = true;
    } catch (e) {
      console.error("Failed to start ambience", e);
    }
  }

  stopAmbience() {
    if (!this.ambienceNode) return;
    try {
      this.ambienceNode.source.stop();
      this.ambienceNode.lfo.stop();
    } catch (e) {}
    this.ambienceNode = null;
    this.ambienceStarted = false;
  }

  // 1. Typewriter Click
  playClick() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // White noise transient
      const bufferSize = 0.03 * this.ctx.sampleRate; // 30ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter for sharp metallic typewriter key striking wood
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000 + Math.random() * 800, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      // Extremely rapid exponential decay
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
    } catch (e) {}
  }

  // 2. Paper Rustle
  playRustle() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.35;
      const bufferSize = duration * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate noise with micro-amplitude envelopes to simulate pages turning
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const amplitudeMod = 0.5 + 0.5 * Math.sin(t * 80) * Math.sin(t * 12);
        data[i] = (Math.random() * 2 - 1) * amplitudeMod;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
    } catch (e) {}
  }

  // 3. Success Chime (Crystal Bell Arpeggio)
  playSuccess() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Chime chord: C6 (1046.50Hz), E6 (1318.51Hz), G6 (1567.98Hz), C7 (2093.00Hz)
      const frequencies = [1046.50, 1318.51, 1567.98, 2093.00];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08); // Slight delay for elegant arpeggio

        // Elegant chime envelope
        oscGain.gain.setValueAtTime(0, now + idx * 0.08);
        oscGain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.01);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch (e) {}
  }

  // 4. Error Tone (Resonant Courtroom Buzzer for "Objection Sustained")
  playError() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Dual detuned oscillators for gritty analog feel
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(110, now); // Low A2

      osc2.type = "square";
      osc2.frequency.setValueAtTime(112.5, now); // Detuned

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {}
  }

  // 5. Stamp Sound (High impact stamp force + desk cabinet resonant echo)
  playStamp() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // 1. High frequency strike transient (friction of ink and paper stamp)
      const noise = this.ctx.createBufferSource();
      const noiseBuffer = this.ctx.createBuffer(1, 0.06 * this.ctx.sampleRate, this.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }
      noise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1200, now);
      noiseFilter.Q.setValueAtTime(2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);

      // 2. Low-frequency mahogany desk cabinet thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(95, now);
      // Sweep pitch down slightly
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      subGain.gain.setValueAtTime(0.8, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);
      subOsc.start(now);
      subOsc.stop(now + 0.35);
    } catch (e) {}
  }

  // 6. Cinematic Verdict Boom (Gavel strike with huge sub-bass tail)
  playBoom() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 3.2;

      // Low pitch-swept oscillator
      const sub = this.ctx.createOscillator();
      const square = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      sub.type = "sine";
      sub.frequency.setValueAtTime(75, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 1.2); // sweep down to deep sub bass

      // Mix a low-frequency square wave filtered heavily to add vintage cinematic rumble
      square.type = "triangle";
      square.frequency.setValueAtTime(37.5, now);
      square.frequency.exponentialRampToValueAtTime(15, now + 1.2);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(90, now);
      filter.Q.setValueAtTime(1.5, now);

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.9, now + 0.02); // rapid blow strike
      subGain.gain.exponentialRampToValueAtTime(0.1, now + 0.8);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      sub.connect(filter);
      square.connect(filter);
      filter.connect(subGain);
      subGain.connect(this.sfxGain);

      sub.start(now);
      square.start(now);
      sub.stop(now + duration + 0.1);
      square.stop(now + duration + 0.1);
    } catch (e) {}
  }

  // 7. Victory Piano Theme
  playVictory() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Procedural majestic piano arpeggio:
      // Ab Major9 -> Bb Major9 -> C Major/Sus
      const notes = [
        { f: 207.65, d: 0.0 }, // Ab3
        { f: 311.13, d: 0.15 }, // Eb4
        { f: 415.30, d: 0.30 }, // Ab4
        { f: 523.25, d: 0.45 }, // C5
        { f: 622.25, d: 0.60 }, // Eb5

        { f: 233.08, d: 1.0 }, // Bb3
        { f: 349.23, d: 1.15 }, // F4
        { f: 466.16, d: 1.30 }, // Bb4
        { f: 587.33, d: 1.45 }, // D5
        { f: 698.46, d: 1.60 }, // F5

        { f: 261.63, d: 2.0 }, // C3
        { f: 392.00, d: 2.15 }, // G4
        { f: 523.25, d: 2.30 }, // C5
        { f: 659.25, d: 2.45 }, // E5
        { f: 783.99, d: 2.60 }, // G5
        { f: 1046.50, d: 2.80 }, // C6
      ];

      notes.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "triangle"; // softer and warmer than saw, ideal for soft electric piano
        osc.frequency.setValueAtTime(note.f, now + note.d);

        // Filter sweeps to emulate piano string dampening
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, now + note.d);
        filter.frequency.exponentialRampToValueAtTime(350, now + note.d + 1.5);

        oscGain.gain.setValueAtTime(0, now + note.d);
        oscGain.gain.linearRampToValueAtTime(0.22, now + note.d + 0.03); // realistic hammer hit speed
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + note.d + 2.5); // long sustain decay

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.start(now + note.d);
        osc.stop(now + note.d + 2.6);
      });
    } catch (e) {}
  }
}

export const soundManager = new AudioManager();
