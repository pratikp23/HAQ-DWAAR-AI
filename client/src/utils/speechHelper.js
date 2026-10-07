/**
 * HAQ DWAAR AI — Ultra-Reliable Speech Helper Utility
 * 
 * Fixes all known Chrome/Windows SpeechSynthesis and SpeechRecognition bugs:
 * 1. Garbage Collection bug: stores utterance on instance
 * 2. Autoplay/Pause bug: explicitly calls resume() before speaking
 * 3. Voices loading: handles asynchronous onvoiceschanged
 * 4. Failsafe watchdog timer: guarantees onEnd is ALWAYS called, never freezes
 * 5. Audio chime on start: gives immediate audio feedback via Web Audio API
 */

class SpeechHelper {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.keepListeningActive = false;
    this.silenceTimer = null;
    this.silenceDuration = 2500;
    this.accumulatedTranscript = "";
    this.currentUtterance = null; // Prevent Chrome GC bug
    this.watchdogTimer = null;
    this.voicesLoaded = false;
    this.audioCtx = null;

    if (typeof window !== "undefined") {
      // Preload voices
      if (this.synth) {
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => {
            this.voicesLoaded = true;
          };
        }
      }

      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = "hi-IN";
          this.recognition.maxAlternatives = 1;
          this._setupRecognitionEvents();
        } catch (e) {
          console.warn("SpeechRecognition init error:", e);
        }
      }
    }
  }

  /**
   * Play a clean friendly chime tone using Web Audio API
   * Guarantees user hears audio feedback immediately on button click
   */
  playChime(type = "start") {
    try {
      if (typeof window === "undefined") return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!this.audioCtx || this.audioCtx.state === "closed") {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      if (type === "start") {
        // High friendly chime (C5 -> E5 -> G5)
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "click") {
        // Soft click tone
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // AudioContext blocked or not supported, ignore silently
    }
  }

  _setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript + " ";
        } else {
          interim += item[0].transcript + " ";
        }
      }

      if (final) {
        this.accumulatedTranscript += final;
      }

      const currentLiveText = (this.accumulatedTranscript + interim).trim();

      if (this.onInterimCallback && currentLiveText) {
        this.onInterimCallback(currentLiveText);
      }

      if (currentLiveText) {
        this._resetSilenceTimer();
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        if (this.keepListeningActive) return;
      }
      console.warn("Speech recognition notice:", event.error);
      if (event.error !== "no-speech" && this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.keepListeningActive) {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (_) {
          setTimeout(() => {
            if (this.keepListeningActive && !this.isListening) {
              try {
                this.recognition.start();
                this.isListening = true;
              } catch (_) {}
            }
          }, 350);
        }
      }
    };
  }

  _resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    this.silenceTimer = setTimeout(() => {
      if (this.accumulatedTranscript.trim()) {
        this.finalizeSentence();
      }
    }, this.silenceDuration);
  }

  finalizeSentence() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const completedText = this.accumulatedTranscript.trim();
    this.stopListening();

    if (completedText && this.onResultCallback) {
      this.onResultCallback(completedText);
    }
  }

  getHindiVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    return voices.find(v => v.lang.includes("hi") || v.lang.includes("HI"))
      || voices.find(v => v.lang.includes("en-IN"))
      || voices[0]
      || null;
  }

  /**
   * Speak a text string out loud with absolute failsafe guarantees
   */
  speak(text, onStart = () => {}, onEnd = () => {}) {
    if (!this.synth) {
      onEnd();
      return;
    }

    // Cancel speech and stop listening
    this.stopSpeaking();
    this.stopListening();

    // Play instant sound feedback
    this.playChime("start");

    // Clear previous watchdog
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }

    // Chrome resume trick
    if (this.synth.paused) {
      this.synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voice = this.getHindiVoice();
    if (voice) {
      utterance.voice = voice;
    }

    let hasEnded = false;
    const safeEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (this.watchdogTimer) {
          clearTimeout(this.watchdogTimer);
          this.watchdogTimer = null;
        }
        this.currentUtterance = null;
        onEnd();
      }
    };

    utterance.onstart = () => {
      onStart();
    };

    utterance.onend = () => {
      safeEnd();
    };

    utterance.onerror = (err) => {
      console.warn("SpeechSynthesis utterance error:", err);
      safeEnd();
    };

    // Store utterance on instance to prevent Chrome GC bug
    this.currentUtterance = utterance;

    // Watchdog Failsafe: If speech synthesis gets stuck, release UI after estimated time
    // Approx 10 chars per second + 3.5s buffer
    const estimatedDurationMs = Math.max(3500, (text.length / 8) * 1000 + 2500);
    this.watchdogTimer = setTimeout(() => {
      console.log("Speech watchdog timer triggered to prevent UI freeze.");
      safeEnd();
    }, estimatedDurationMs);

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("synth.speak failed:", e);
      safeEnd();
    }
  }

  stopSpeaking() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
    this.currentUtterance = null;
  }

  startListening(onFinalResult, onInterimResult = null, onError = null) {
    if (!this.recognition) {
      if (onError) onError("Microphone recognition not supported in this browser.");
      return;
    }

    this.stopSpeaking();
    this.playChime("click");

    this.accumulatedTranscript = "";
    this.onResultCallback = onFinalResult;
    this.onInterimCallback = onInterimResult;
    this.onErrorCallback = onError;
    this.keepListeningActive = true;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (_) {
      this.isListening = true;
    }
  }

  stopListening() {
    this.keepListeningActive = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechHelper();
