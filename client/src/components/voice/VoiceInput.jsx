import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  RefreshCw,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Globe,
  Info,
  Sparkles,
  ArrowRight,
  Volume2,
} from "lucide-react";
import { getBhashiniStatus, speechToText } from "../../services/bhashiniApi";
import TrustBadge from "../firewall/TrustBadge";
import { useLanguage } from "../../context/LanguageContext";

/**
 * HAQ DWAAR AI — VoiceInput Component
 * 
 * Interactive citizen voice console providing:
 * - Live browser microphone audio capture (MediaRecorder API)
 * - Automatic duration timer with maximum 60s limit
 * - Bhashini STT abstraction with transparent Demo/Mock Mode indication
 * - Audio file upload fallback
 * - Language selection support
 * - Seamless fallback to written text on permission denial or error
 */

export default function VoiceInput({
  onTranscriptComplete,
  onCancel,
  initialLanguage = "hi",
}) {
  const { currentLanguage } = useLanguage();

  const [language, setLanguage] = useState(
    initialLanguage || (currentLanguage === "mr" ? "mr" : currentLanguage === "hi" ? "hi" : "en")
  );
  const [serviceStatus, setServiceStatus] = useState(null);
  const [recordingState, setRecordingState] = useState("idle"); // idle, recording, processing, completed, error
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [demoNotice, setDemoNotice] = useState(
    "Voice service is running in demo mode."
  );

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync with service status on mount
  useEffect(() => {
    let isMounted = true;
    getBhashiniStatus()
      .then((res) => {
        if (isMounted && res) {
          setServiceStatus(res);
          if (res.disclaimer) {
            setDemoNotice(res.disclaimer);
          }
        }
      })
      .catch(() => {
        // Fallback default
        if (isMounted) {
          setServiceStatus({
            mode: "mock",
            isConfigured: false,
            disclaimer: "Voice service is running in demo mode.",
          });
        }
      });

    return () => {
      isMounted = false;
      stopTimer();
      stopMicrophoneStream();
    };
  }, []);

  const startTimer = () => {
    setRecordingDuration(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev >= 60) {
          // Stop recording automatically at 60 seconds
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const stopMicrophoneStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Start live microphone recording
  const startRecording = async () => {
    setErrorMessage("");
    setTranscript("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Your browser does not support microphone recording. Please write your situation instead.");
      setRecordingState("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = "audio/webm";
      if (typeof MediaRecorder.isTypeSupported === "function") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg";
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stopMicrophoneStream();
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setErrorMessage("No audio was recorded. Please try speaking again.");
          setRecordingState("error");
          return;
        }
        await processAudio(audioBlob);
      };

      recorder.start(250); // Slice chunks every 250ms
      setRecordingState("recording");
      startTimer();
    } catch (err) {
      console.warn("Microphone access error:", err);
      stopTimer();
      setRecordingState("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission was denied. You can write your situation or upload an audio file instead.");
      } else {
        setErrorMessage("Unable to access microphone. Please check your system audio settings or write instead.");
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("processing");
    }
  };

  // Process audio Blob through Bhashini STT
  const processAudio = async (audioBlob) => {
    setRecordingState("processing");
    setErrorMessage("");

    try {
      const res = await speechToText({
        audioBlob,
        language,
      });

      if (res?.data?.transcript) {
        setTranscript(res.data.transcript);
        setRecordingState("completed");
        if (res.data.disclaimer) {
          setDemoNotice(res.data.disclaimer);
        }
      } else {
        throw new Error("Unable to extract transcript from audio.");
      }
    } catch (err) {
      console.error("STT error:", err);
      setRecordingState("error");
      setErrorMessage(
        err.message ||
          "Voice input is currently unavailable. You can describe your situation by typing instead."
      );
    }
  };

  // Handle uploaded audio file fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Selected audio file exceeds the 10MB limit.");
      setRecordingState("error");
      return;
    }

    setRecordingState("processing");
    setErrorMessage("");

    try {
      const res = await speechToText({
        audioBlob: file,
        language,
      });

      if (res?.data?.transcript) {
        setTranscript(res.data.transcript);
        setRecordingState("completed");
      } else {
        throw new Error("Could not transcribe uploaded audio file.");
      }
    } catch (err) {
      setRecordingState("error");
      setErrorMessage(err.message || "Failed to process audio file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmTranscript = () => {
    if (transcript.trim() && onTranscriptComplete) {
      onTranscriptComplete(transcript.trim());
    }
  };

  const handleReset = () => {
    stopTimer();
    stopMicrophoneStream();
    setRecordingState("idle");
    setRecordingDuration(0);
    setTranscript("");
    setErrorMessage("");
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-6 sm:p-7 space-y-6">
      
      {/* Top Banner / Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#ea580c]/10 flex items-center justify-center text-[#ea580c]">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              Bhashini Voice Access
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Speak naturally in your preferred language
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TrustBadge type="DEMO_MODE" label="Voice Demo Mode" size="sm" />
          
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              disabled={recordingState === "recording" || recordingState === "processing"}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voice Demo Disclaimer Card */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {demoNotice} To explore, you can tap <span className="font-bold">Start Speaking</span>, select a language, or upload an audio clip.
        </p>
      </div>

      {/* Recording Console */}
      {recordingState === "idle" && (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-4">
          <button
            type="button"
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center shadow-lg hover:shadow-orange-200 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <Mic className="w-8 h-8 group-hover:animate-pulse" />
          </button>
          
          <div className="space-y-1">
            <span className="font-extrabold text-slate-800 text-sm block">
              Tap to Speak Your Situation
            </span>
            <span className="text-xs text-slate-500 max-w-sm block">
              Example: "I am a farmer from Madhya Pradesh. I have 2 acres of land and need assistance for my crop."
            </span>
          </div>

          {/* Fallback upload option */}
          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-file-input"
            />
            <label
              htmlFor="audio-file-input"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 underline font-semibold cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Or upload audio file (.wav, .mp3, .webm)</span>
            </label>
          </div>
        </div>
      )}

      {/* Recording in progress */}
      {recordingState === "recording" && (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200 animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-slate-900 font-mono tracking-wider">
              {formatTimer(recordingDuration)} / 01:00
            </div>
            <p className="text-xs font-bold text-red-600 animate-pulse">
              Listening... Speak clearly now
            </p>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer"
          >
            <Square className="w-4 h-4 text-red-400 fill-red-400" />
            <span>Stop Recording</span>
          </button>
        </div>
      )}

      {/* Processing */}
      {recordingState === "processing" && (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[#591d8f]">
            <RefreshCw className="w-7 h-7 animate-spin text-[#591d8f]" />
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-slate-800 text-sm block">
              Transcribing Voice Recording...
            </span>
            <span className="text-xs text-slate-500 block">
              Extracting natural language speech using Bhashini abstraction
            </span>
          </div>
        </div>
      )}

      {/* Completed Transcript View */}
      {recordingState === "completed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voice Transcribed Successfully</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
            >
              Re-record
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Review or edit what was understood before analysis:
            </label>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#240b49] text-sm text-slate-900 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleConfirmTranscript}
              disabled={!transcript.trim()}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Analyze This Statement</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Voice Capture Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="font-bold text-red-700 underline text-xs cursor-pointer"
            >
              Try Again
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="font-bold text-slate-600 underline text-xs cursor-pointer"
              >
                Switch to Text Input
              </button>
            )}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
        <span>🔒 Voice recordings are not permanently stored and are processed only for benefit discovery.</span>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
          >
            Type instead
          </button>
        )}
      </div>
    </div>
  );
}
