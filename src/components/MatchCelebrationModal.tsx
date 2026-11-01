import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, BookOpen, Sparkles, X, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface MatchCelebrationModalProps {
  currentUser: StudentProfile;
  matchedStudent: StudentProfile;
  onSendMessage: () => void;
  onContinueSwiping: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  currentUser,
  matchedStudent,
  onSendMessage,
  onContinueSwiping,
}) => {
  useEffect(() => {
    // Fire festive campus confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f43f5e', '#fb7185', '#fbbf24', '#10b981'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#f43f5e', '#38bdf8', '#fbbf24'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-rose-950/50">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onContinueSwiping}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top spark badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ASTU Campus Connection</span>
        </div>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 tracking-tight">
          It&apos;s a Match!
        </h2>
        
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          You and <strong className="text-white">{matchedStudent.name}</strong> both connected!
        </p>

        {/* Both Avatars Side by Side */}
        <div className="my-6 flex items-center justify-center gap-3">
          {/* Current User */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-rose-500 overflow-hidden shadow-xl shadow-rose-500/20">
              <img 
                src={currentUser.photos[0]} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 p-1 bg-slate-950 rounded-full border border-slate-700 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Heart Center Pulse */}
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 animate-bounce">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          {/* Matched Student */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400 overflow-hidden shadow-xl shadow-emerald-500/20">
              <img 
                src={matchedStudent.photos[0]} 
                alt={matchedStudent.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 p-1 bg-slate-950 rounded-full border border-slate-700 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Academic Match Highlights */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-5">
          <div className="text-white font-semibold flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>{matchedStudent.major} ({matchedStudent.academicYearLabel})</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {matchedStudent.favoriteCampusSpots[0] || 'ASTU Central Library'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onSendMessage}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Direct Message</span>
          </button>

          <button
            type="button"
            onClick={onContinueSwiping}
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Keep Browsing ASTU
          </button>
        </div>
      </div>
    </div>
  );
};
