import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  Heart, 
  Star, 
  BookOpen, 
  Coffee, 
  Sparkles, 
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileDetailsModalProps {
  profile: StudentProfile | null;
  onClose: () => void;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onSwipe,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [showIdProof, setShowIdProof] = useState<boolean>(false);
  const [reported, setReported] = useState<boolean>(false);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Verified ASTU Student Profile
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-5 p-5">
          
          {/* Photo Gallery Carousel */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img 
              src={profile.photos[activePhotoIdx]} 
              alt={`${profile.name} ${activePhotoIdx + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Photo indicators */}
            <div className="absolute top-3 inset-x-3 flex gap-1.5 z-10">
              {profile.photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhotoIdx(i)}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i === activePhotoIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            {profile.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : profile.photos.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev < profile.photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-[11px] font-mono text-white">
              {activePhotoIdx + 1} / {profile.photos.length}
            </div>
          </div>

          {/* Core Info */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{profile.name}</span>
                {!profile.privacySettings?.hideGradYear && (
                  <span className="text-xl font-normal text-slate-400">
                    &apos;{String(profile.gradYear).slice(-2)}
                  </span>
                )}
              </h1>
              
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold capitalize flex items-center gap-1">
                {profile.mode === 'dating' && <Heart className="w-3.5 h-3.5" />}
                {profile.mode === 'study' && <BookOpen className="w-3.5 h-3.5" />}
                {profile.mode === 'social' && <Coffee className="w-3.5 h-3.5" />}
                <span>{profile.mode}</span>
              </span>
            </div>

            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <GraduationCap className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium text-white">{profile.major}</span>
                <span>·</span>
                <span className="text-slate-400">{profile.school}</span>
              </div>

              {!profile.privacySettings?.hideLocation && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{profile.locationName}</span>
                  <span>·</span>
                  <span className="text-amber-300 font-mono">{profile.distanceKm} km from you</span>
                </div>
              )}

              {profile.gpaHonor && (
                <div className="flex items-center gap-2 text-xs text-amber-300 pt-1">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Academic Distinction: <strong>{profile.gpaHonor}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* ASTU Campus ID Authenticity Badge & Toggle */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Campus Security & Biometrics</h4>
                  <p className="text-[11px] text-slate-400">
                    ASTU ID Card &amp; Pose Check Verified ({profile.verificationDate})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIdProof(!showIdProof)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1"
              >
                <span>{showIdProof ? 'Hide Card' : 'View ID Pass'}</span>
              </button>
            </div>

            {/* Digital ID Preview */}
            {showIdProof && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-2">
                    <span>ADAMA SCIENCE AND TECHNOLOGY UNIVERSITY</span>
                    <span>STUDENT CARD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">STUDENT ID</span>
                      <span className="font-mono text-white">
                        {!profile.privacySettings?.hideStudentId ? profile.astuId : 'UGR/*****/14'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">CLASS LEVEL</span>
                      <span className="text-slate-200">{profile.academicYearLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About / Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {profile.bio}
            </p>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interests & Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Favorite Campus Spots */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Favorite ASTU Hangouts</h3>
            <div className="space-y-1.5">
              {profile.favoriteCampusSpots.map((spot) => (
                <div 
                  key={spot} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Report Option */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setReported(true)}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{reported ? 'Reported to ASTU Proctor Desk' : 'Report Profile or Safety Concern'}</span>
            </button>
            <span className="text-slate-500">ASTU Trust Score 100%</span>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              onSwipe('left');
              onClose();
            }}
            className="w-14 h-14 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
            title="Pass"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSwipe('up');
              onClose();
            }}
            className="w-12 h-12 rounded-full bg-slate-900 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-all"
            title="Super Like"
          >
            <Star className="w-5 h-5 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSwipe('right');
              onClose();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-90 transition-all hover:scale-105"
            title="Match / Like"
          >
            <Heart className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
