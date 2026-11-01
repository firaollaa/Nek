import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  SubscriptionTier, 
  PaymentPlan, 
  PaymentMethod, 
  MatchItem, 
  PrivacySettings 
} from './types';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { Navbar } from './components/Navbar';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SwipeDeck } from './components/SwipeDeck';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ChatView } from './components/ChatView';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { WhoLikedYouModal } from './components/WhoLikedYouModal';
import { ProfileEditModal } from './components/ProfileEditModal';

const STORAGE_KEYS = {
  USER: 'astu_spark_current_user',
  TIER: 'astu_spark_subscription_tier',
  MATCHES: 'astu_spark_matches',
  SWIPES_LEFT: 'astu_spark_swipes_left',
};

export default function App() {
  // Load or initialize user profile
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Return null to allow onboarding flow on first launch, or default student
    return null;
  });

  // Available students for matching
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);

  // Active matches
  const [matches, setMatches] = useState<MatchItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Initial campus match for instant testing of chat and calls
    return [
      {
        id: 'match-01',
        profile: INITIAL_STUDENTS[0], // Selamawit Tadesse
        matchedAt: 'Today, 10:20 AM',
        lastMessage: 'Living off double macchiatos at Library 2 right now...',
        lastMessageTime: '10:30 AM',
        unreadCount: 1,
      },
    ];
  });

  // Subscription state
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem(STORAGE_KEYS.TIER) as SubscriptionTier) || 'free';
  });

  // Daily free swipes remaining (25 free swipes per day)
  const [dailySwipesRemaining, setDailySwipesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SWIPES_LEFT);
    return saved !== null ? Number(saved) : 25;
  });

  // Navigation tab: 'swipe' | 'chat' | 'likes'
  const [activeTab, setActiveTab] = useState<'swipe' | 'chat' | 'likes'>('swipe');
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>('match-01');

  // Modals
  const [inspectingProfile, setInspectingProfile] = useState<StudentProfile | null>(null);
  const [celebrationMatch, setCelebrationMatch] = useState<StudentProfile | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState<boolean>(false);
  const [whoLikedYouModalOpen, setWhoLikedYouModalOpen] = useState<boolean>(false);

  // Profiles that have liked the user (for "Who Liked You" tab)
  const [likedByProfiles] = useState<StudentProfile[]>([
    INITIAL_STUDENTS[2], // Hanan Kedir
    INITIAL_STUDENTS[4], // Bethlehem Girma
    INITIAL_STUDENTS[6], // Meron Assefa
    INITIAL_STUDENTS[3], // Kirubel Hailu
  ]);

  // Persist user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Persist subscription
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIER, subscriptionTier);
  }, [subscriptionTier]);

  // Persist matches
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  // Persist swipes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWIPES_LEFT, String(dailySwipesRemaining));
  }, [dailySwipesRemaining]);

  // Handle Swipe logic
  const handleRecordSwipe = (student: StudentProfile, direction: 'left' | 'right' | 'up') => {
    if (subscriptionTier === 'free') {
      setDailySwipesRemaining((prev) => Math.max(0, prev - 1));
    }

    // If swipe right or up (Like or Super Like), create a match celebration!
    if (direction === 'right' || direction === 'up') {
      const isAlreadyMatch = matches.some((m) => m.profile.id === student.id);
      if (!isAlreadyMatch) {
        const newMatch: MatchItem = {
          id: `match-${student.id}-${Date.now()}`,
          profile: student,
          matchedAt: 'Just now',
          lastMessage: direction === 'up' ? '⭐ Super Liked on campus!' : 'Matched on ASTU Spark!',
          lastMessageTime: 'Just now',
          unreadCount: 1,
        };

        setMatches((prev) => [newMatch, ...prev]);
        setCelebrationMatch(student);
      }
    }
  };

  const handleUpgradeSubscription = (plan: PaymentPlan, method: PaymentMethod) => {
    setSubscriptionTier(plan.tier);
    setDailySwipesRemaining(9999);
  };

  const handleUpdatePrivacy = (updated: PrivacySettings) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        privacySettings: updated,
      });
    }
  };

  const handleInstantMatchFromLikes = (student: StudentProfile) => {
    const newMatch: MatchItem = {
      id: `match-${student.id}-${Date.now()}`,
      profile: student,
      matchedAt: 'Just now',
      lastMessage: 'Instant matched from ASTU Likes!',
      lastMessageTime: 'Just now',
      unreadCount: 1,
    };
    setMatches((prev) => [newMatch, ...prev]);
    setWhoLikedYouModalOpen(false);
    setActiveTab('chat');
    setActiveChatMatchId(newMatch.id);
  };

  // If user hasn't gone through ASTU ID onboarding yet, show the full onboarding flow!
  if (!currentUser) {
    return (
      <OnboardingFlow
        onComplete={(newProfile) => {
          setCurrentUser(newProfile);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top University Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'likes') {
            setWhoLikedYouModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUser}
        subscriptionTier={subscriptionTier}
        unreadCount={matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0)}
        likedCount={likedByProfiles.length}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenSubscription={() => setSubscriptionModalOpen(true)}
        onOpenProfile={() => setProfileEditModalOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'swipe' && (
          <SwipeDeck
            students={students}
            currentUser={currentUser}
            subscriptionTier={subscriptionTier}
            dailySwipesRemaining={dailySwipesRemaining}
            onRecordSwipe={handleRecordSwipe}
            onOpenDetails={(profile) => setInspectingProfile(profile)}
            onOpenSubscriptionModal={() => setSubscriptionModalOpen(true)}
            onBoostCampusProfile={() => {
              // Simulated profile boost
            }}
          />
        )}

        {activeTab === 'chat' && (
          <div className="p-2 sm:p-4 h-[calc(100vh-4rem)]">
            <ChatView
              currentUser={currentUser}
              matches={matches}
              initialActiveMatchId={activeChatMatchId}
              onSelectMatch={(id) => setActiveChatMatchId(id)}
            />
          </div>
        )}
      </main>

      {/* Profile Details Modal */}
      {inspectingProfile && (
        <ProfileDetailsModal
          profile={inspectingProfile}
          onClose={() => setInspectingProfile(null)}
          onSwipe={(dir) => {
            handleRecordSwipe(inspectingProfile, dir);
            setInspectingProfile(null);
          }}
        />
      )}

      {/* Match Celebration Modal with Confetti */}
      {celebrationMatch && (
        <MatchCelebrationModal
          currentUser={currentUser}
          matchedStudent={celebrationMatch}
          onSendMessage={() => {
            const found = matches.find((m) => m.profile.id === celebrationMatch.id);
            if (found) {
              setActiveChatMatchId(found.id);
            }
            setCelebrationMatch(null);
            setActiveTab('chat');
          }}
          onContinueSwiping={() => setCelebrationMatch(null)}
        />
      )}

      {/* Who Liked You Modal */}
      {whoLikedYouModalOpen && (
        <WhoLikedYouModal
          likedByProfiles={likedByProfiles}
          subscriptionTier={subscriptionTier}
          onUnlockGold={() => {
            setWhoLikedYouModalOpen(false);
            setSubscriptionModalOpen(true);
          }}
          onInstantMatch={handleInstantMatchFromLikes}
          onClose={() => setWhoLikedYouModalOpen(false)}
        />
      )}

      {/* Privacy Settings Modal */}
      {privacyModalOpen && (
        <PrivacySettingsModal
          currentSettings={currentUser.privacySettings}
          onSave={handleUpdatePrivacy}
          onClose={() => setPrivacyModalOpen(false)}
        />
      )}

      {/* Subscription Modal (Ethiopian Birr / Telebirr / CBE Birr) */}
      {subscriptionModalOpen && (
        <SubscriptionModal
          currentTier={subscriptionTier}
          onUpgrade={handleUpgradeSubscription}
          onClose={() => setSubscriptionModalOpen(false)}
        />
      )}

      {/* Profile Edit Modal */}
      {profileEditModalOpen && (
        <ProfileEditModal
          currentUser={currentUser}
          onSave={(updated) => setCurrentUser(updated)}
          onClose={() => setProfileEditModalOpen(false)}
        />
      )}
    </div>
  );
}
