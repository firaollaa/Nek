import React, { useState } from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  Eye, 
  Lock, 
  MapPin, 
  GraduationCap, 
  UserX, 
  PhoneCall, 
  AlertOctagon, 
  Check, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { PrivacySettings } from '../types';

interface PrivacySettingsModalProps {
  currentSettings: PrivacySettings;
  onSave: (updated: PrivacySettings) => void;
  onClose: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  currentSettings,
  onSave,
  onClose,
}) => {
  const [settings, setSettings] = useState<PrivacySettings>({ ...currentSettings });
  const [blockedAstuIds, setBlockedAstuIds] = useState<string[]>([
    'UGR/12099/13',
  ]);
  const [newBlockInput, setNewBlockInput] = useState<string>('');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  const toggle = (key: keyof PrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddBlock = () => {
    if (newBlockInput.trim() && !blockedAstuIds.includes(newBlockInput.trim())) {
      setBlockedAstuIds([...blockedAstuIds, newBlockInput.trim().toUpperCase()]);
      setNewBlockInput('');
    }
  };

  const handleRemoveBlock = (idToRemove: string) => {
    setBlockedAstuIds(blockedAstuIds.filter((id) => id !== idToRemove));
  };

  const handleSaveAll = () => {
    onSave(settings);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Campus Privacy & Safety</h2>
              <p className="text-[11px] text-slate-400">Control what other ASTU students can view</p>
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

        {/* Scrollable Privacy Toggles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Toggles Container */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profile Field Visibility
            </h3>

            {/* Hide Graduation Year */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Hide Graduation Year</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Your class year (e.g. 2026 / Senior) will not appear publicly on swipe cards.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('hideGradYear')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.hideGradYear ? 'bg-rose-600' : 'bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                    settings.hideGradYear ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>

            {/* Hide Exact Campus Location */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Hide Exact Dorm / Campus Location</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Replaces specific dorm block details with general &quot;ASTU Main Campus&quot;.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('hideLocation')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.hideLocation ? 'bg-rose-600' : 'bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                    settings.hideLocation ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>

            {/* Hide Student ID Number */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Redact ASTU Student ID</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Hides your registration number as <code>UGR/*****/14</code> while maintaining verified status.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('hideStudentId')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.hideStudentId ? 'bg-rose-600' : 'bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                    settings.hideStudentId ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>

            {/* Incognito Mode */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Campus Incognito Mode</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Only students you have already swiped right on will ever see your profile.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('incognitoMode')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.incognitoMode ? 'bg-rose-600' : 'bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                    settings.incognitoMode ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Block Student by ASTU ID */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-rose-400" />
              <span>Campus ID Block List</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Enter an ASTU student ID to prevent them from ever seeing or matching with your profile.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. UGR/14290/13"
                value={newBlockInput}
                onChange={(e) => setNewBlockInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleAddBlock}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Block ID</span>
              </button>
            </div>

            {/* Blocked List */}
            {blockedAstuIds.length > 0 && (
              <div className="space-y-1.5">
                {blockedAstuIds.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <span className="font-mono text-slate-300">{id} (Blocked from view)</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ASTU Campus Emergency Hotlines */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-rose-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <AlertOctagon className="w-4 h-4" />
              <span>ASTU Campus Security & Emergency Support</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAIN GATE SECURITY</span>
                <span className="font-mono font-semibold text-white">022-111-0400</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CAMPUS PROCTOR DESK</span>
                <span className="font-mono font-semibold text-white">022-111-0402</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            {showSavedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>Privacy Settings Saved!</span>
              </>
            ) : (
              <span>Save Privacy Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
