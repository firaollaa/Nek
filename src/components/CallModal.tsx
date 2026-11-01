import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  Maximize2 
} from 'lucide-react';
import { StudentProfile } from '../types';

interface CallModalProps {
  match: StudentProfile;
  mode: 'audio' | 'video';
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ match, mode, onClose }) => {
  const [status, setStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera for video calls
  useEffect(() => {
    let active = true;

    if (mode === 'video') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (active && userVideoRef.current) {
            streamRef.current = stream;
            userVideoRef.current.srcObject = stream;
            setHasCameraAccess(true);
          }
        })
        .catch(() => {
          setHasCameraAccess(false);
        });
    }

    // Auto connect after 2.5 seconds ringing
    const ringTimeout = setTimeout(() => {
      setStatus('connected');
    }, 2500);

    return () => {
      active = false;
      clearTimeout(ringTimeout);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  // Duration timer when connected
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setStatus('ended');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg aspect-[9/16] sm:aspect-[4/5] max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono">{status === 'connected' ? formatTime(durationSeconds) : 'Ringing...'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[11px] text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ASTU End-to-End Encrypted</span>
          </div>
        </div>

        {/* Video or Audio Stage */}
        <div className="relative flex-1 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          
          {mode === 'video' ? (
            /* Video Layout */
            <div className="relative w-full h-full">
              {/* Remote Student Video */}
              <div className="w-full h-full relative">
                <img
                  src={match.photos[0]}
                  alt={match.name}
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

                <div className="absolute bottom-24 left-4 z-20">
                  <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                    <span>{match.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-rose-300">{match.major} · ASTU</p>
                </div>
              </div>

              {/* Local User Picture-in-Picture Preview */}
              <div className="absolute top-16 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-xl z-20">
                {hasCameraAccess && !isVideoOff ? (
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-800 text-slate-400">
                    <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                    <span className="text-[10px]">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[9px] text-white font-medium bg-black/60 px-1 rounded">
                  You
                </div>
              </div>
            </div>
          ) : (
            /* Audio Call Layout */
            <div className="text-center p-6 space-y-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500 shadow-2xl shadow-rose-500/20 mx-auto">
                  <img
                    src={match.photos[0]}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {status === 'ringing' && (
                  <div className="absolute inset-0 rounded-full border-4 border-rose-500/50 animate-ping pointer-events-none" />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-1.5">
                  <span>{match.name}</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </h3>
                <p className="text-xs text-rose-400 mt-0.5">{match.major} · ASTU</p>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {status === 'ringing' ? 'Connecting ASTU Campus Audio...' : 'Audio Connected · HD Quality'}
                </p>
              </div>

              {/* Soundwave Animation when connected */}
              {status === 'connected' && (
                <div className="flex items-center justify-center gap-1.5 pt-4">
                  {[20, 45, 75, 30, 90, 60, 40, 85, 50, 35, 70, 25].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rose-500 rounded-full animate-pulse"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Call Controls Footer */}
        <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-4 z-30">
          
          {/* Mute Mic */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle (if in video mode) */}
          {mode === 'video' && (
            <button
              type="button"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoOff ? 'bg-rose-500/20 text-rose-400 border border-rose-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* End Call Button (Red Phone Off) */}
          <button
            type="button"
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
