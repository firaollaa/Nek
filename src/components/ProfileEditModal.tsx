import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  GraduationCap, 
  MapPin, 
  Heart, 
  BookOpen, 
  Coffee, 
  X, 
  Check, 
  Upload, 
  Trash2,
  Sparkles,
  Award
} from 'lucide-react';
import { StudentProfile, LookingFor, Gender } from '../types';
import { ASTU_SCHOOLS, ASTU_CAMPUS_SPOTS, POPULAR_INTERESTS, GRADUATION_YEARS } from '../data/astuDepartments';

interface ProfileEditModalProps {
  currentUser: StudentProfile;
  onSave: (updated: StudentProfile) => void;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  currentUser,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>(currentUser.name);
  const [bio, setBio] = useState<string>(currentUser.bio);
  const [major, setMajor] = useState<string>(currentUser.major);
  const [gradYear, setGradYear] = useState<number>(currentUser.gradYear);
  const [lookingFor, setLookingFor] = useState<LookingFor>(currentUser.lookingFor);
  const [mode, setMode] = useState<'dating' | 'study' | 'social'>(currentUser.mode);
  const [photos, setPhotos] = useState<string[]>([...currentUser.photos]);
  const [interests, setInterests] = useState<string[]>([...currentUser.interests]);
  const [favoriteCampusSpots, setFavoriteCampusSpots] = useState<string[]>([...currentUser.favoriteCampusSpots]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhotos = [...photos];
        newPhotos[index] = reader.result as string;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (photos.filter(Boolean).length < 3) {
      setErrorMessage('ASTU Spark requires at least three photos on your profile.');
      return;
    }

    const updated: StudentProfile = {
      ...currentUser,
      name,
      bio,
      major,
      gradYear,
      lookingFor,
      mode,
      photos,
      interests,
      favoriteCampusSpots,
    };

    onSave(updated);
    onClose();
  };

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      if (interests.length < 6) {
        setInterests([...interests, item]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Edit ASTU Profile</h2>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified ID: {currentUser.astuId}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* 3 Photos Requirement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-400" />
                <span>Profile Photos (Min. 3 Required)</span>
              </label>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {photos.filter(Boolean).length}/3
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group"
                >
                  {photos[idx] ? (
                    <>
                      <img
                        src={photos[idx]}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-white cursor-pointer transition-opacity">
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, idx)}
                        />
                      </label>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900">
                      <Upload className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-400">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, idx)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Campus Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Major / Department</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Graduation Year</label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Mode */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Campus Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dating', label: 'Dating', icon: Heart },
                { id: 'study', label: 'Study Partner', icon: BookOpen },
                { id: 'social', label: 'Campus Social', icon: Coffee },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as 'dating' | 'study' | 'social')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      mode === item.id
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-rose-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interested In */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Looking for</label>
            <div className="grid grid-cols-3 gap-2">
              {(['men', 'women', 'everyone'] as LookingFor[]).map((lf) => (
                <button
                  key={lf}
                  type="button"
                  onClick={() => setLookingFor(lf)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                    lookingFor === lf
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {lf}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Interests</label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INTERESTS.slice(0, 10).map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white font-medium'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all"
          >
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
};
