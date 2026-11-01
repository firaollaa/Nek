import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  X, 
  Star, 
  Info, 
  BookOpen, 
  Coffee,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentCardProps {
  profile: StudentProfile;
  isFront: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onOpenDetails: (profile: StudentProfile) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  profile,
  isFront,
  onSwipe,
  onOpenDetails,
}) => {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth rotation & opacity transforms based on drag coordinates
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -100], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    } else if (info.offset.y < -threshold) {
      onSwipe('up');
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < profile.photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    } else {
      setPhotoIndex(profile.photos.length - 1);
    }
  };

  if (!isFront) {
    return (
      <div className="absolute inset-0 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden scale-[0.96] translate-y-2 pointer-events-none opacity-80 transition-all">
        <img 
          src={profile.photos[0]} 
          alt={profile.name} 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute bottom-6 left-6 right-6 text-slate-300">
          <h3 className="text-xl font-bold text-white">{profile.name}</h3>
          <p className="text-xs text-slate-300">{profile.major}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* Background Image Carousel */}
      <div className="relative w-full h-full">
        <img
          src={profile.photos[photoIndex] || profile.photos[0]}
          alt={`${profile.name} photo`}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Gradient Scrims for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

        {/* Photo Story Indicators (Dash bars at the top) */}
        <div className="absolute top-3 inset-x-3 z-20 flex gap-1.5">
          {profile.photos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all ${
                idx === photoIndex ? 'bg-white shadow' : 'bg-white/30 backdrop-blur-sm'
              }`}
            />
          ))}
        </div>

        {/* Left / Right touch zones for cycling photos */}
        <div className="absolute inset-y-12 inset-x-0 z-10 flex">
          <div 
            onClick={prevPhoto} 
            className="w-1/2 h-full flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
          >
            <span className="p-1 rounded-full bg-black/40 text-white backdrop-blur">
              <ChevronLeft className="w-5 h-5" />
            </span>
          </div>
          <div 
            onClick={nextPhoto} 
            className="w-1/2 h-full flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
          >
            <span className="p-1 rounded-full bg-black/40 text-white backdrop-blur">
              <ChevronRight className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Swipe Stamp Indicators (Like, Nope, Super Like) */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-12 left-6 z-30 pointer-events-none transform -rotate-12"
        >
          <div className="px-4 py-1.5 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl tracking-widest rounded-xl bg-emerald-950/60 backdrop-blur shadow-lg shadow-emerald-500/20">
            LIKE
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-12 right-6 z-30 pointer-events-none transform rotate-12"
        >
          <div className="px-4 py-1.5 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl tracking-widest rounded-xl bg-rose-950/60 backdrop-blur shadow-lg shadow-rose-500/20">
            NOPE
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute bottom-32 inset-x-0 flex justify-center z-30 pointer-events-none"
        >
          <div className="px-5 py-2 border-4 border-amber-400 text-amber-300 font-extrabold text-xl tracking-wider rounded-xl bg-amber-950/70 backdrop-blur shadow-lg">
            ⭐ SUPER LIKE
          </div>
        </motion.div>

        {/* Top Badges (ASTU Verified + Mode) */}
        <div className="absolute top-7 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ASTU Verified Student</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-slate-700/80 text-white text-[11px] font-medium">
            {profile.mode === 'dating' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
            {profile.mode === 'study' && <BookOpen className="w-3.5 h-3.5 text-blue-400" />}
            {profile.mode === 'social' && <Coffee className="w-3.5 h-3.5 text-amber-400" />}
            <span className="capitalize">
              {profile.mode === 'dating' ? 'Dating' : profile.mode === 'study' ? 'Study Partner' : 'Campus Social'}
            </span>
          </div>
        </div>

        {/* Profile Details Scrim Content */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-20 pointer-events-none">
          {/* Student Name & Academic Year */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {profile.name}
              </h2>
              {!profile.privacySettings?.hideGradYear && (
                <span className="text-lg font-light text-slate-300">
                  {profile.gradYear}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(profile);
              }}
              className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-all active:scale-90"
              title="View full ASTU profile"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Department & School */}
          <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium mb-1">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{profile.major}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">{profile.academicYearLabel}</span>
          </div>

          {/* Location & Radius */}
          {!profile.privacySettings?.hideLocation && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mb-2.5">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{profile.locationName}</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-300 font-mono font-medium">{profile.distanceKm} km away</span>
            </div>
          )}

          {/* Bio snippet */}
          <p className="text-xs text-slate-200 line-clamp-2 mb-3 leading-relaxed">
            {profile.bio}
          </p>

          {/* Interests tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {profile.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/90 backdrop-blur font-medium"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-slate-300">
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>

          {/* ASTU ID security notice (respecting privacy) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-300 font-mono">
            <span>
              {!profile.privacySettings?.hideStudentId 
                ? `ID: ${profile.astuId}` 
                : 'ID: UGR/*****/14 (Protected)'}
            </span>
            <span className="text-emerald-400 font-sans font-semibold">100% Campus Verified</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
