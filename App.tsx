import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import WebcamView from './components/WebcamView';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AnalysisState, PostureAnalysis } from './types';
import { analyzePostureImage } from './services/geminiService';
import { BrainCircuit } from 'lucide-react';

// Simple sound generator for analysis completion
const playAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Simple pleasant "ping"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    lastRun: null,
    data: null,
    error: null,
  });

  const [autoMode, setAutoMode] = useState(false);

  const handleCapture = useCallback(async (imageData: string) => {
    if (analysisState.isAnalyzing) return;

    setAnalysisState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const result = await analyzePostureImage(imageData);
      
      // Play sound on successful analysis
      playAlertSound();

      setAnalysisState({
        isAnalyzing: false,
        lastRun: new Date(),
        data: result,
        error: null,
      });
    } catch (err: any) {
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || "Failed to analyze image. Please try again.",
      }));
    }
  }, [analysisState.isAnalyzing]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Controls Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
             <h2 className="text-lg font-semibold text-gray-900">Workspace Monitor</h2>
             <p className="text-sm text-gray-500">Ensure your camera captures your head and shoulders for best results.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <span className={`text-sm font-medium ${autoMode ? 'text-teal-700' : 'text-gray-500'}`}>
              Continuous Analysis
            </span>
            <button
              onClick={() => setAutoMode(!autoMode)}
              type="button"
              role="switch"
              aria-checked={autoMode}
              className={`${
                autoMode ? 'bg-teal-600' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  autoMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-14rem)] min-h-[600px]">
          
          {/* Left Column: Webcam Input */}
          <div className="lg:col-span-7 flex flex-col gap-6">
             <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black aspect-video">
                <WebcamView 
                  onCapture={handleCapture} 
                  isAnalyzing={analysisState.isAnalyzing}
                  autoMode={autoMode}
                />
             </div>
             
             {/* Mini Instructions / Tips */}
             <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">How Gemini Works</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      We take a secure snapshot from your camera and send it to Google's Gemini 3.0 Pro model. 
                      It analyzes skeletal points and ergonomics in real-time to provide medical-grade feedback. 
                      No video is stored on servers.
                    </p>
                  </div>
                </div>
             </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-5 h-full">
            <AnalysisDashboard state={analysisState} />
          </div>
          
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-gray-400">
            Disclaimer: This application is for informational purposes only and does not constitute medical advice. 
            Consult a healthcare professional for persistent pain or posture issues.
            <br />
            Powered by Google Gemini 3.0 Pro.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;