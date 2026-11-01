export type Gender = 'man' | 'woman' | 'non-binary';
export type LookingFor = 'men' | 'women' | 'everyone';
export type ConnectionMode = 'all' | 'dating' | 'study' | 'social';

export interface PrivacySettings {
  hideGradYear: boolean;
  hideLocation: boolean;
  hideStudentId: boolean;
  incognitoMode: boolean;
  ghostMode: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  astuId: string; // e.g. UGR/19482/14
  school: string; // e.g. School of Electrical Engineering & Computing
  major: string; // e.g. Software Engineering
  gradYear: number; // e.g. 2026
  academicYearLabel: string; // e.g. 4th Year Senior
  gender: Gender;
  lookingFor: LookingFor;
  mode: 'dating' | 'study' | 'social';
  bio: string;
  interests: string[];
  favoriteCampusSpots: string[];
  photos: string[]; // Minimum 3 required
  isVerified: boolean;
  verificationBadge: string;
  verificationDate: string;
  locationName: string; // e.g. Dorm Block 52 · Main Campus
  distanceKm: number;
  gpaHonor?: string; // e.g. "Dean's List 3.82"
  privacySettings: PrivacySettings;
  isOnline: boolean;
  lastActive: string;
}

export interface IdCardScanData {
  studentName: string;
  studentIdNumber: string;
  school: string;
  department: string;
  academicYear: string;
  expiryDate: string;
  cardImage: string;
  status: 'idle' | 'scanning' | 'verified' | 'failed';
}

export interface PhotoVerificationData {
  photos: string[]; // Exactly or at least 3
  liveSelfie: string | null;
  challengePose: string; // e.g., "ASTU Thumbs-Up 👍" or "Campus Peace Sign ✌️"
  poseVerified: boolean;
  manualReviewStatus: 'pending' | 'verified';
}

export type SubscriptionTier = 'free' | 'spark_gold' | 'spark_platinum';
export type PaymentMethod = 'telebirr' | 'cbe_birr' | 'awash_birr' | 'chapa';

export interface PaymentPlan {
  id: string;
  tier: SubscriptionTier;
  title: string;
  priceETB: number;
  durationLabel: string;
  popular?: boolean;
  features: string[];
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  studyInvite?: {
    location: string;
    date: string;
    time: string;
    topic: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface MatchItem {
  id: string;
  profile: StudentProfile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface CallSession {
  isActive: boolean;
  mode: 'audio' | 'video';
  profile: StudentProfile | null;
  status: 'ringing' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
}
