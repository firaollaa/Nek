import React from 'react';
import { 
  Flame, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Crown, 
  User, 
  SlidersHorizontal,
  Lock,
  Sparkles
} from 'lucide-react';
import { StudentProfile, SubscriptionTier } from '../types';

interface NavbarProps {
  activeTab: 'swipe' | 'chat' | 'likes';
  onSelectTab: (tab: 'swipe' | 'chat' | 'likes') => void;
  currentUser: StudentProfile | null;
  subscriptionTier: SubscriptionTier;
  unreadCount: number;
  likedCount: number;
  onOpenPrivacy: () => void;
  onOpenSubscription: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  subscriptionTier,
  unreadCount,
  likedCount,
  onOpenPrivacy,
  onOpenSubscription,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand & University Tag */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('swipe')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  ASTU <span className="text-rose-500">Spark</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider">
                  Campus
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Adama Science &amp; Technology University
              </div>
            </div>
          </button>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Swipe Tab */}
          <button
            type="button"
            onClick={() => onSelectTab('swipe')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'swipe'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Explore</span>
          </button>

          {/* Likes Tab */}
          <button
            type="button"
            onClick={() => onSelectTab('likes')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold relative transition-all ${
              activeTab === 'likes'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Likes</span>
            {likedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                {likedCount}
              </span>
            )}
          </button>

          {/* Chat Tab */}
          <button
            type="button"
            onClick={() => onSelectTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold relative transition-all ${
              activeTab === 'chat'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Subscription Gold / Upgrade Button */}
          {subscriptionTier === 'free' ? (
            <button
              type="button"
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Gold (99 ETB)</span>
              <span className="md:hidden">Gold</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>ASTU VIP</span>
            </button>
          )}

          {/* Privacy Settings Trigger */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Privacy & Safety Controls"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          {/* User Profile Avatar */}
          {currentUser && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="relative rounded-full p-0.5 border-2 border-slate-700 hover:border-rose-500 transition-colors"
              title="Edit Profile"
            >
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
