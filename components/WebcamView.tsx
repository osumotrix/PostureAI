import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, AlertCircle, VideoOff, RotateCw } from 'lucide-react';
import { WebcamStatus } from '../types';

interface WebcamViewProps {
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
  autoMode: boolean;
}

const WebcamView: React.FC<WebcamViewProps> = ({ onCapture, isAnalyzing, autoMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<WebcamStatus>(WebcamStatus.IDLE);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCamera = useCallback(async () => {
    setStatus(WebcamStatus.IDLE);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus(WebcamStatus.active);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatus(WebcamStatus.PERMISSION_DENIED);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Handle Auto Mode Timer
  useEffect(() => {
    let interval: any;
    if (autoMode && status === WebcamStatus.active && !isAnalyzing) {
      interval = setInterval(() => {
        capture();
      }, 10000); // Auto capture every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoMode, status, isAnalyzing]);


  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Match canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(dataUrl);
    }
  }, [onCapture]);

  if (status === WebcamStatus.PERMISSION_DENIED) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
        <VideoOff className="h-12 w-12 mb-4 text-red-400" />
        <h3 className="text-lg font-semibold text-gray-900">Camera Access Denied</h3>
        <p className="text-sm mt-2 max-w-xs">Please allow camera access in your browser settings to use the posture analyzer.</p>
        <button 
          onClick={startCamera}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          Retry Permission
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-black rounded-2xl shadow-lg aspect-video group">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${status === WebcamStatus.active ? 'opacity-100' : 'opacity-0'}`}
        onLoadedMetadata={() => {
           if (videoRef.current) videoRef.current.play();
        }}
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading / Analyzing Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white">
           <RotateCw className="h-10 w-10 animate-spin mb-3 text-teal-400" />
           <p className="font-medium tracking-wide">Analyzing Posture...</p>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white/80 text-xs">
          <p className="flex items-center gap-1"><Camera className="h-3 w-3" /> {autoMode ? 'Auto-analyzing every 10s' : 'Manual Capture'}</p>
        </div>
        
        {!autoMode && (
            <button 
            onClick={capture}
            disabled={isAnalyzing || status !== WebcamStatus.active}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
            <Camera className="h-5 w-5" />
            Check Now
            </button>
        )}
      </div>
    </div>
  );
};

export default WebcamView;