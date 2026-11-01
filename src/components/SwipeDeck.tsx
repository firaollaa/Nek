import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  X, 
  Star, 
  RotateCcw, 
  Zap, 
  SlidersHorizontal, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { StudentProfile, ConnectionMode, SubscriptionTier } from '../types';
import { StudentCard } from './StudentCard';

interface SwipeDeckProps {
  students: StudentProfile[];
  currentUser: StudentProfile;
  subscriptionTier: SubscriptionTier;
  dailySwipesRemaining: number;
  onRecordSwipe: (student: StudentProfile, direction: 'left' | 'right' | 'up') => void;
  onOpenDetails: (profile: StudentProfile) => void;
  onOpenSubscriptionModal: () => void;
  onBoostCampusProfile: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  students,
  currentUser,
  subscriptionTier,
  dailySwipesRemaining,
  onRecordSwipe,
  onOpenDetails,
  onOpenSubscriptionModal,
  onBoostCampusProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<{ index: number; profile: StudentProfile; direction: string }[]>([]);
  const [modeFilter, setModeFilter] = useState<ConnectionMode>('all');
  const [radiusFilterKm, setRadiusFilterKm] = useState<number>(10);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [boostActive, setBoostActive] = useState<boolean>(false);

  // Filter students by connection goal, gender preference, radius, and optional school
  const filteredStudents = students.filter((student) => {
    // Mode filter
    if (modeFilter !== 'all' && student.mode !== modeFilter) {
      return false;
    }

    // Gender interest filter
    if (currentUser.lookingFor === 'men' && student.gender !== 'man') {
      return false;
    }
    if (currentUser.lookingFor === 'women' && student.gender !== 'woman') {
      return false;
    }

    // Radius filter
    if (student.distanceKm > radiusFilterKm) {
      return false;
    }

    // School filter (if specified)
    if (selectedSchoolFilter !== 'all' && !student.school.includes(selectedSchoolFilter)) {
      return false;
    }

    return true;
  });

  const currentStudent = filteredStudents[currentIndex];
  const nextStudent = filteredStudents[currentIndex + 1];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentStudent) return;

    // Check swipe limit for free users
    if (subscriptionTier === 'free' && dailySwipesRemaining <= 0) {
      onOpenSubscriptionModal();
      return;
    }

    setHistory((prev) => [...prev, { index: currentIndex, profile: currentStudent, direction }]);
    onRecordSwipe(currentStudent, direction);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (history.length === 0) return;

    // Check if free user has rewinds or prompt subscription
    if (subscriptionTier === 'free') {
      onOpenSubscriptionModal();
      return;
    }

    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastAction.index);
  };

  const handleBoost = () => {
    setBoostActive(true);
    onBoostCampusProfile();
    setTimeout(() => setBoostActive(false), 5000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleSwipe('right');
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowUp') handleSwipe('up');
      if (e.key === ' ' && currentStudent) {
        e.preventDefault();
        onOpenDetails(currentStudent);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStudent, currentIndex, dailySwipesRemaining, subscriptionTier]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-md mx-auto px-4 py-2 relative">
      
      {/* Top Filter & Discovery Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 z-30">
        
        {/* Mode Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setModeFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              modeFilter === 'all' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ASTU
          </button>

          <button
            type="button"
            onClick={() => {
              setModeFilter('dating');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              modeFilter === 'dating' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3 h-3" />
            <span>Dating</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setModeFilter('study');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              modeFilter === 'study' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Study</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setModeFilter('social');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              modeFilter === 'social' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3 h-3" />
            <span>Social</span>
          </button>
        </div>

        {/* Filter Drawer Toggle */}
        <button
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`p-2 rounded-xl border transition-colors ${
            showFilterDrawer 
              ? 'bg-rose-600/20 border-rose-500 text-rose-400' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Campus Radius & Advanced Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Campus Radius & School Filter Drawer */}
      {showFilterDrawer && (
        <div className="mb-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3 z-30 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Radius from ASTU Campus</span>
              </span>
              <span className="font-mono font-bold text-amber-400">{radiusFilterKm} km</span>
            </div>
            <input 
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={radiusFilterKm}
              onChange={(e) => {
                setRadiusFilterKm(parseFloat(e.target.value));
                setCurrentIndex(0);
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0.5 km (Dorm block)</span>
              <span>5 km (Adama town)</span>
              <span>25 km (Wonji/Sodere)</span>
            </div>
          </div>

          {/* School filter (Special VIP perk indicator) */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">ASTU School Filter</span>
              {subscriptionTier === 'free' && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Gold Perk</span>
                </span>
              )}
            </div>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => {
                if (subscriptionTier === 'free') {
                  onOpenSubscriptionModal();
                } else {
                  setSelectedSchoolFilter(e.target.value);
                  setCurrentIndex(0);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Schools &amp; Faculties</option>
              <option value="SoEEC">School of Electrical &amp; Computing (SoEEC)</option>
              <option value="SoMCME">School of Mechanical &amp; Materials (SoMCME)</option>
              <option value="SoCEA">School of Civil &amp; Architecture (SoCEA)</option>
              <option value="SoANS">Applied Natural Sciences (SoANS)</option>
            </select>
          </div>
        </div>
      )}

      {/* Daily Swipes Remaining indicator for Free Tier */}
      {subscriptionTier === 'free' && (
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-lg mb-2 text-[11px] text-slate-400">
          <span>Daily Free Swipes: <strong className="text-white">{dailySwipesRemaining} left</strong></span>
          <button 
            type="button" 
            onClick={onOpenSubscriptionModal} 
            className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Upgrade to Gold (99 ETB)</span>
          </button>
        </div>
      )}

      {/* Boost Active Alert */}
      {boostActive && (
        <div className="p-2 bg-purple-950/60 border border-purple-500/40 rounded-xl mb-2 text-xs text-purple-300 flex items-center gap-2 animate-pulse">
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Campus Boost Active! Your profile is prioritized across all ASTU dorms for 1 hour.</span>
        </div>
      )}

      {/* Cards Deck Stage */}
      <div className="relative flex-1 w-full min-h-[420px] max-h-[580px]">
        {currentStudent ? (
          <>
            {/* Background card preview */}
            {nextStudent && (
              <StudentCard
                profile={nextStudent}
                isFront={false}
                onSwipe={() => {}}
                onOpenDetails={() => {}}
              />
            )}

            {/* Foreground interactive card */}
            <StudentCard
              key={currentStudent.id}
              profile={currentStudent}
              isFront={true}
              onSwipe={handleSwipe}
              onOpenDetails={onOpenDetails}
            />
          </>
        ) : (
          /* Empty Deck State */
          <div className="absolute inset-0 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              You&apos;ve Explored ASTU!
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              No more student profiles found in this {radiusFilterKm} km radius. Expand your radius or reset your mode filter to connect with more students.
            </p>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  setRadiusFilterKm(25);
                  setModeFilter('all');
                  setSelectedSchoolFilter('all');
                  setCurrentIndex(0);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Expand Search to All Adama Campus</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex(0)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Review ASTU Profiles Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Buttons Toolbar */}
      <div className="flex items-center justify-center gap-3 pt-3 pb-1 z-20">
        
        {/* Rewind */}
        <button
          type="button"
          onClick={handleRewind}
          disabled={history.length === 0}
          className="w-12 h-12 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-40"
          title="Rewind last swipe"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Dislike / Pass (Red X) */}
        <button
          type="button"
          onClick={() => handleSwipe('left')}
          disabled={!currentStudent}
          className="w-14 h-14 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-xl shadow-rose-950/40 active:scale-90 transition-all hover:scale-105 disabled:opacity-40"
          title="Pass / Next"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Super Like (Star) */}
        <button
          type="button"
          onClick={() => handleSwipe('up')}
          disabled={!currentStudent}
          className="w-12 h-12 rounded-full bg-slate-900 border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-40"
          title="Super Like"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>

        {/* Like (Emerald Heart) */}
        <button
          type="button"
          onClick={() => handleSwipe('right')}
          disabled={!currentStudent}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/40 active:scale-90 transition-all hover:scale-105 disabled:opacity-40"
          title="Like / Match"
        >
          <Heart className="w-7 h-7 fill-current" />
        </button>

        {/* Campus Boost (Purple Lightning) */}
        <button
          type="button"
          onClick={handleBoost}
          className="w-12 h-12 rounded-full bg-slate-900 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 flex items-center justify-center shadow-lg active:scale-90 transition-all"
          title="Campus Boost (3x views in ASTU)"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center text-[10px] text-slate-500 pb-1 hidden sm:block">
        Use <span className="font-mono text-slate-400">←</span> / <span className="font-mono text-slate-400">→</span> keys to swipe, <span className="font-mono text-slate-400">↑</span> for Super Like, <span className="font-mono text-slate-400">Space</span> for details
      </div>
    </div>
  );
};
