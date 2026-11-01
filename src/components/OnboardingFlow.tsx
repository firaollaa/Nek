import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  X,
  MapPin,
  GraduationCap,
  Heart,
  Users,
  BookOpen,
  Coffee,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { StudentProfile, Gender, LookingFor } from '../types';
import { ASTU_SCHOOLS, ASTU_CAMPUS_SPOTS, POPULAR_INTERESTS, GRADUATION_YEARS } from '../data/astuDepartments';

interface OnboardingFlowProps {
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: ASTU ID Card Scanning State
  const [idCardImage, setIdCardImage] = useState<string>('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [idVerified, setIdVerified] = useState<boolean>(false);
  const [extractedIdData, setExtractedIdData] = useState({
    name: 'Firaol Esayas',
    astuId: 'UGR/19324/14',
    school: 'School of Electrical Engineering & Computing (SoEEC)',
    department: 'Software Engineering',
    academicYear: '4th Year · Senior',
    validUntil: '2026/2027',
  });

  // Step 2: 3 Required Photos State
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  ]);
  const [uploadError, setUploadError] = useState<string>('');

  // Step 3: Manual / Pose Photo Verification State
  const [poseChallenge] = useState<string>('ASTU Thumbs Up 👍 & Smile');
  const [liveVerificationPhoto, setLiveVerificationPhoto] = useState<string | null>(null);
  const [isVerifyingPose, setIsVerifyingPose] = useState<boolean>(false);
  const [poseVerificationSuccess, setPoseVerificationSuccess] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Step 4: Academic & Preferences State
  const [name, setName] = useState<string>('Firaol Esayas');
  const [astuId, setAstuId] = useState<string>('UGR/19324/14');
  const [school, setSchool] = useState<string>('School of Electrical Engineering & Computing (SoEEC)');
  const [major, setMajor] = useState<string>('Software Engineering');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [gender, setGender] = useState<Gender>('man');
  const [lookingFor, setLookingFor] = useState<LookingFor>('women');
  const [mode, setMode] = useState<'dating' | 'study' | 'social'>('dating');
  const [bio, setBio] = useState<string>('4th Year Software Engineering at ASTU. Passionate about algorithms, campus hackathons, and good coffee at Bole lounge. Looking for genuine campus connection & good talks!');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Competitive Coding',
    'Macchiato & Coffee Talks',
    'AI & Machine Learning',
    'Campus Football',
  ]);
  const [selectedCampusSpots, setSelectedCampusSpots] = useState<string[]>([
    'Library 2 Quiet Zone (3rd Floor)',
    'Bole Lounge & Cafe Macchiato',
  ]);
  const [radiusKm, setRadiusKm] = useState<number>(3);

  // Trigger simulated ID scan on step 1
  const runIdScan = () => {
    setIsScanning(true);
    setIdVerified(false);
    setTimeout(() => {
      setIsScanning(false);
      setIdVerified(true);
    }, 2200);
  };

  // Start real camera if available or fallback
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      // Fallback if camera permission is denied or running in restricted iframe
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCaptureLiveSelfie = () => {
    setIsVerifyingPose(true);
    stopCamera();
    
    // Simulate photo snap and facial verification against the 3 pictures
    setTimeout(() => {
      setLiveVerificationPhoto(photos[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80');
      setIsVerifyingPose(false);
      setPoseVerificationSuccess(true);
    }, 1800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newPhotos = [...photos];
        newPhotos[index] = result;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const toggleCampusSpot = (spot: string) => {
    if (selectedCampusSpots.includes(spot)) {
      setSelectedCampusSpots(selectedCampusSpots.filter((s) => s !== spot));
    } else {
      if (selectedCampusSpots.length < 4) {
        setSelectedCampusSpots([...selectedCampusSpots, spot]);
      }
    }
  };

  const handleFinishOnboarding = () => {
    const profile: StudentProfile = {
      id: 'current-user-astu',
      name: name || extractedIdData.name,
      astuId: astuId || extractedIdData.astuId,
      school,
      major,
      gradYear,
      academicYearLabel: `${2030 - gradYear >= 1 && 2030 - gradYear <= 5 ? 2030 - gradYear : 4}th Year Student`,
      gender,
      lookingFor,
      mode,
      bio,
      interests: selectedInterests,
      favoriteCampusSpots: selectedCampusSpots,
      photos,
      isVerified: true,
      verificationBadge: 'ASTU Student ID + Pose Biometric Verified',
      verificationDate: 'Verified Nov 2026',
      locationName: 'Dorm Block 52 · Main Campus',
      distanceKm: radiusKm,
      privacySettings: {
        hideGradYear: false,
        hideLocation: false,
        hideStudentId: false,
        incognitoMode: false,
        ghostMode: false,
      },
      isOnline: true,
      lastActive: 'Active now',
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* University Top Banner */}
      <div className="w-full max-w-xl mx-auto mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Exclusive to Adama Science and Technology University (ASTU)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          ASTU <span className="text-rose-500">Spark</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Campus Dating, Study Partnerships & Authentic Social Connections
        </p>

        {/* Multi-step progress bar */}
        <div className="grid grid-cols-4 gap-2 mt-5 max-w-md mx-auto">
          {[
            { num: 1, label: 'ASTU ID' },
            { num: 2, label: '3 Photos' },
            { num: 3, label: 'Live Pose' },
            { num: 4, label: 'Profile' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/50' 
                    : step > s.num 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* STEP 1: ASTU University ID Scanning */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold uppercase tracking-wider">
                <Scan className="w-4 h-4" />
                <span>Step 1: ASTU Student ID Verification</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                To guarantee 100% campus safety and eliminate impostors, all users must scan an official ASTU Student ID card.
              </p>
            </div>

            {/* ASTU ID Card Visual Mock / Scanner */}
            <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-4 overflow-hidden">
              {/* Laser line when scanning */}
              {isScanning && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-scan-line" />
                </div>
              )}

              {/* ID Card Display Card */}
              <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-amber-500/30 rounded-lg p-4 shadow-md relative">
                {/* ID Header with ASTU Logo badge */}
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xs">
                      ASTU
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-300 uppercase tracking-tight">
                        Adama Science & Technology University
                      </div>
                      <div className="text-[9px] text-slate-400">STUDENT IDENTIFICATION CARD</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      OFFICIAL CARD
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  {/* Photo on card */}
                  <div className="w-20 h-24 rounded border border-slate-700 overflow-hidden bg-slate-800 shrink-0 relative">
                    <img 
                      src={idCardImage} 
                      alt="Student ID Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-center text-slate-300 py-0.5">
                      ASTU SECURE
                    </div>
                  </div>

                  {/* ID Card Fields */}
                  <div className="flex-1 space-y-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">STUDENT NAME</span>
                      <span className="font-semibold text-white">{extractedIdData.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">STUDENT ID</span>
                        <span className="font-mono font-bold text-amber-400">{extractedIdData.astuId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">VALID UNTIL</span>
                        <span className="font-mono text-slate-200">{extractedIdData.validUntil}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">DEPARTMENT / SCHOOL</span>
                      <span className="text-slate-300 text-[11px] truncate block">{extractedIdData.department}</span>
                    </div>
                  </div>
                </div>

                {/* Barcode & Hologram watermark */}
                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>BARCODE: ||||| | |||| || ||| ||||</span>
                  <span className="text-amber-400/80">ASTU-OCR-AUTHENTICATED</span>
                </div>
              </div>

              {/* Action buttons for ID card */}
              <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                <button
                  type="button"
                  onClick={runIdScan}
                  disabled={isScanning}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Scan className="w-3.5 h-3.5" />
                  {isScanning ? 'Scanning ASTU Hologram & OCR...' : idVerified ? 'Scan Completed ✓' : 'Scan & Validate ID Card'}
                </button>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3 h-3 text-slate-400" />
                    <span>Upload ASTU Card</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setIdCardImage(reader.result as string);
                            runIdScan();
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Verification Result Message */}
            {idVerified ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-300">ASTU Student ID Verified Successfully</p>
                  <p className="text-slate-300 mt-0.5">
                    Recognized student <strong>{extractedIdData.name}</strong> ({extractedIdData.astuId}) registered under {extractedIdData.school}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Click &quot;Scan & Validate ID Card&quot; to verify your ASTU student credentials.</span>
              </div>
            )}

            {/* Next step button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!idVerified) {
                    runIdScan();
                    setTimeout(() => setStep(2), 2300);
                  } else {
                    setStep(2);
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                <span>Continue to Photo Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 3 Required Photos Upload */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold uppercase tracking-wider">
                  <Camera className="w-4 h-4" />
                  <span>Step 2: Enter Three Profile Pictures</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {photos.filter(Boolean).length}/3 REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ASTU Spark strictly requires exactly <strong>three clear photos</strong> first before profile creation to prevent fake accounts and uphold campus safety.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* 3 Photos Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => {
                const photoUrl = photos[idx];
                const labels = ['Primary Face Photo', 'Campus / Full Body', 'Casual / Lifestyle'];
                return (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl border border-slate-700 bg-slate-950 overflow-hidden group">
                    {photoUrl ? (
                      <>
                        <img 
                          src={photoUrl} 
                          alt={`Profile photo ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </div>
                        <label className="absolute bottom-2 inset-x-2 py-1 bg-black/70 hover:bg-black/90 backdrop-blur text-[10px] font-medium text-slate-200 text-center rounded cursor-pointer transition-colors">
                          Change
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handlePhotoUpload(e, idx)} 
                          />
                        </label>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-slate-900/50 transition-colors">
                        <Upload className="w-6 h-6 text-slate-500 mb-1" />
                        <span className="text-[11px] font-medium text-slate-300">Add Photo {idx + 1}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">{labels[idx]}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handlePhotoUpload(e, idx)} 
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-400 space-y-1 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Campus Authenticity Standard</span>
              </div>
              <p className="text-[11px]">
                Photos must clearly display your face and natural features. In the next step, you will perform a quick live pose verification to confirm your identity matches these photos.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (photos.filter(Boolean).length < 3) {
                    setUploadError('You must provide all three photos before continuing.');
                  } else {
                    setUploadError('');
                    setStep(3);
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                <span>Continue to Pose Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Manual / Pose Photo Verification */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Step 3: Manual Pose & Campus Safety Verification</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                To guarantee you are indeed the ASTU student depicted in your ID card and 3 photos, perform this fast live pose verification.
              </p>
            </div>

            {/* Verification Challenge Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full text-xs font-semibold mb-2">
                POSE CHALLENGE REQUIRED
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                &ldquo;{poseChallenge}&rdquo;
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hold your hand up with a thumbs-up gesture and smile directly at the camera.
              </p>

              {/* Camera or Capture Box */}
              <div className="mt-4 max-w-xs mx-auto aspect-square rounded-xl bg-slate-900 border-2 border-slate-700 relative overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                ) : liveVerificationPhoto ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={liveVerificationPhoto} 
                      alt="Captured verification selfie" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-medium">Ready for Pose Verification</p>
                    <p className="text-[10px] text-slate-500 mt-1">Click below to activate camera or simulate live pose check</p>
                  </div>
                )}

                {/* Biometric overlay grid */}
                <div className="absolute inset-0 border border-rose-500/20 pointer-events-none rounded-xl" />
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {!cameraActive && !liveVerificationPhoto && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    <span>Open Camera</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCaptureLiveSelfie}
                  disabled={isVerifyingPose}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isVerifyingPose ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Pose & Matching Face...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{liveVerificationPhoto ? 'Retake Pose Photo' : 'Capture & Verify Pose'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verification Status Banner */}
            {poseVerificationSuccess ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-300">Identity & Campus Authenticity Confirmed</p>
                  <p className="text-slate-300 mt-0.5">
                    Biometric match score: <strong>99.1%</strong> with uploaded ID and 3 profile pictures. You have earned the official <strong>ASTU Verified Student Badge</strong>.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!poseVerificationSuccess) {
                    handleCaptureLiveSelfie();
                    setTimeout(() => setStep(4), 1900);
                  } else {
                    setStep(4);
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                <span>Continue to Profile Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ASTU Major, Grad Year, Looking For & Match Radius */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300 max-h-[75vh] overflow-y-auto pr-1">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Step 4: Academic Details & Campus Preferences</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Customize your academic details, your interest in man or woman, connection type, and campus matching radius.
              </p>
            </div>

            {/* Name & ASTU ID Confirmation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Full Student Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" 
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">ASTU Student ID</label>
                <input 
                  type="text" 
                  value={astuId} 
                  onChange={(e) => setAstuId(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-mono focus:outline-none focus:border-rose-500" 
                />
              </div>
            </div>

            {/* School & Major Dropdown */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">ASTU School</label>
              <select
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  const found = ASTU_SCHOOLS.find((s) => s.name === e.target.value);
                  if (found && found.departments.length > 0) {
                    setMajor(found.departments[0]);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {ASTU_SCHOOLS.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Major / Department</label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {ASTU_SCHOOLS.find((s) => s.name === school)?.departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  )) || <option value="Software Engineering">Software Engineering</option>}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Graduation Year</label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {GRADUATION_YEARS.map((y) => (
                    <option key={y} value={y}>{y} ({y === 2025 ? 'Finalist' : y === 2026 ? 'Senior' : y === 2027 ? 'Junior' : 'Pre-Eng'})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender and Interest in Man / Woman */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">I am a</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['man', 'woman', 'non-binary'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-1.5 text-[11px] font-medium rounded capitalize transition-colors ${
                        gender === g ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {g === 'non-binary' ? 'Other' : g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Interested in (Match Type)</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['men', 'women', 'everyone'] as LookingFor[]).map((lf) => (
                    <button
                      key={lf}
                      type="button"
                      onClick={() => setLookingFor(lf)}
                      className={`py-1.5 text-[11px] font-medium rounded capitalize transition-colors ${
                        lookingFor === lf ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Connection Goal / Mode */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Primary Connection Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dating', label: 'Dating & Romance', icon: Heart, desc: 'Find campus dates' },
                  { id: 'study', label: 'Study Partners', icon: BookOpen, desc: 'Ace midterms & projects' },
                  { id: 'social', label: 'Campus Social', icon: Coffee, desc: 'Chill & make friends' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id as 'dating' | 'study' | 'social')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        mode === item.id 
                          ? 'border-rose-500 bg-rose-500/10 text-white' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${mode === item.id ? 'text-rose-400' : 'text-slate-500'}`} />
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campus Radius Setting */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Campus Match Radius
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">{radiusKm} km</span>
              </div>
              <input 
                type="range" 
                min={0.5} 
                max={20} 
                step={0.5} 
                value={radiusKm} 
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))} 
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5 km (Dorm Block)</span>
                <span>3 km (ASTU Main Campus)</span>
                <span>20 km (Adama City / Wonji)</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Campus Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Share a bit about your campus life, studies, or what you're looking for..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Interests selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">Interests & Hobbies (Pick up to 6)</span>
                <span className="text-[10px] font-mono text-slate-500">{selectedInterests.length}/6</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-rose-500 text-white font-medium shadow-sm' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Favorite Campus Spots */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">Favorite ASTU Spots (Pick up to 3)</span>
                <span className="text-[10px] font-mono text-slate-500">{selectedCampusSpots.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ASTU_CAMPUS_SPOTS.slice(0, 8).map((spot) => {
                  const isSelected = selectedCampusSpots.includes(spot);
                  return (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => toggleCampusSpot(spot)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {spot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enter ASTU Spark</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
