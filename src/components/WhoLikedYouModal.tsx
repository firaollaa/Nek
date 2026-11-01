import React from 'react';
import { Sparkles, Lock, Heart, ShieldCheck, X, Crown, MapPin, GraduationCap } from 'lucide-react';
import { StudentProfile, SubscriptionTier } from '../types';

interface WhoLikedYouModalProps {
  likedByProfiles: StudentProfile[];
  subscriptionTier: SubscriptionTier;
  onUnlockGold: () => void;
  onInstantMatch: (profile: StudentProfile) => void;
  onClose: () => void;
}

export const WhoLikedYouModal: React.FC<WhoLikedYouModalProps> = ({
  likedByProfiles,
  subscriptionTier,
  onUnlockGold,
  onInstantMatch,
  onClose,
}) => {
  const isUnlocked = subscriptionTier !== 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Who Liked You at ASTU</span>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {likedByProfiles.length} STUDENTS
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Students who swiped right on your campus profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Banner if locked */}
          {!isUnlocked && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Crown className="w-4 h-4" />
                  <span>Gold Perk: See Who Liked You</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Upgrade to ASTU Spark Gold to unblur all {likedByProfiles.length} profiles and match instantly without waiting!
                </p>
              </div>

              <button
                type="button"
                onClick={onUnlockGold}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shrink-0 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Unlock (99 ETB)
              </button>
            </div>
          )}

          {/* Grid of Profiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {likedByProfiles.map((student) => (
              <div
                key={student.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group"
              >
                <img
                  src={student.photos[0]}
                  alt={student.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    !isUnlocked ? 'blur-md brightness-75 scale-105' : 'group-hover:scale-105'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Lock Overlay for Free Tier */}
                {!isUnlocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-1.5 shadow">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-white">Liked You!</span>
                    <span className="text-[9px] text-slate-400 truncate max-w-full">
                      {student.major}
                    </span>
                  </div>
                ) : (
                  /* Unlocked VIP Card */
                  <div className="absolute bottom-0 inset-x-0 p-3 z-10">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{student.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-rose-300 truncate">{student.major}</p>
                    <p className="text-[9px] text-slate-400 truncate">{student.locationName}</p>

                    <button
                      type="button"
                      onClick={() => onInstantMatch(student)}
                      className="mt-2 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow active:scale-95 transition-all"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      <span>Match Back</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
