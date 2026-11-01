import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Check, 
  ChevronLeft,
  Smile,
  X
} from 'lucide-react';
import { StudentProfile, ChatMessage, MatchItem } from '../types';
import { CallModal } from './CallModal';

interface ChatViewProps {
  currentUser: StudentProfile;
  matches: MatchItem[];
  initialActiveMatchId?: string | null;
  onSelectMatch?: (matchId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  matches,
  initialActiveMatchId,
}) => {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(
    initialActiveMatchId || (matches.length > 0 ? matches[0].id : null)
  );

  // Messages dictionary keyed by matchId
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({
    'match-01': [
      {
        id: 'm1',
        matchId: 'match-01',
        senderId: 'astu-stu-01',
        text: 'Hey! Fellow SoEEC student here! Nice to match with you on ASTU Spark 😊',
        timestamp: '10:24 AM',
      },
      {
        id: 'm2',
        matchId: 'match-01',
        senderId: 'current-user-astu',
        text: 'Hey Selamawit! Great to connect. Are you surviving Software Engineering capstone season?',
        timestamp: '10:28 AM',
      },
      {
        id: 'm3',
        matchId: 'match-01',
        senderId: 'astu-stu-01',
        text: 'Barely haha! Living off double macchiatos at Library 2 right now. Are you around campus?',
        timestamp: '10:30 AM',
      },
    ],
  });

  const [inputMsg, setInputMsg] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showStudyInviteModal, setShowStudyInviteModal] = useState<boolean>(false);
  
  // Study invite modal fields
  const [studyLocation, setStudyLocation] = useState<string>('Library 2 Quiet Zone (3rd Floor)');
  const [studyTopic, setStudyTopic] = useState<string>('Algorithms & Data Structures Review');
  const [studyTime, setStudyTime] = useState<string>('Today at 4:30 PM');

  // Active call state
  const [callSession, setCallSession] = useState<{
    isOpen: boolean;
    mode: 'audio' | 'video';
  }>({
    isOpen: false,
    mode: 'audio',
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeMatch = matches.find((m) => m.id === activeMatchId);
  const activeStudent = activeMatch?.profile;
  const currentMessages = activeMatchId ? messagesMap[activeMatchId] || [] : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || !activeMatchId || !activeStudent) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId: activeMatchId,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeMatchId]: [...(prev[activeMatchId] || []), newMsg],
    }));

    setInputMsg('');

    // Simulate smart ASTU reply after 1.4 seconds
    setTimeout(() => {
      const replies = [
        `That sounds awesome! Let's definitely catch up at ${activeStudent.favoriteCampusSpots[0] || 'the campus cafe'}.`,
        'Haha totally! Surviving midterms together is the true ASTU bond 🤝',
        'Are you going to the campus hackathon this weekend?',
        'I have a class in SoEEC until 4:00 PM, let me know if you want to grab coffee after!',
        'Sounds good! Love talking to people who understand engineering life haha.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        matchId: activeMatchId,
        senderId: activeStudent.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeMatchId]: [...(prev[activeMatchId] || []), replyMsg],
      }));
    }, 1400);
  };

  const handleSendVoiceNote = () => {
    if (!activeMatchId) return;

    const seconds = recordingSeconds || 4;
    setIsRecordingVoice(false);

    const voiceMsg: ChatMessage = {
      id: `voice-${Date.now()}`,
      matchId: activeMatchId,
      senderId: currentUser.id,
      text: 'Voice note',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceNote: true,
      voiceDuration: `0:${String(seconds).padStart(2, '0')}`,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeMatchId]: [...(prev[activeMatchId] || []), voiceMsg],
    }));
  };

  const handleSendStudyInvite = () => {
    if (!activeMatchId) return;

    const inviteMsg: ChatMessage = {
      id: `invite-${Date.now()}`,
      matchId: activeMatchId,
      senderId: currentUser.id,
      text: `Proposed a campus study session at ${studyLocation}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studyInvite: {
        location: studyLocation,
        date: studyTime,
        time: studyTime,
        topic: studyTopic,
        status: 'pending',
      },
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeMatchId]: [...(prev[activeMatchId] || []), inviteMsg],
    }));

    setShowStudyInviteModal(false);

    // Auto-accept by student after 2 seconds
    setTimeout(() => {
      setMessagesMap((prev) => {
        const msgs = prev[activeMatchId] || [];
        return {
          ...prev,
          [activeMatchId]: msgs.map((m) =>
            m.id === inviteMsg.id && m.studyInvite
              ? { ...m, studyInvite: { ...m.studyInvite, status: 'accepted' } }
              : m
          ),
        };
      });
    }, 2200);
  };

  const toggleVoicePlay = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => setPlayingVoiceId(null), 4000);
    }
  };

  const icebreakers = [
    '☕ Meet at Main Cafeteria after class?',
    '📚 Studying for midterms at Library 2?',
    '⚡ How is your semester capstone project going?',
    '🍕 Favorite food spot around Adama / Bole?',
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Matches / Conversations Sidebar */}
      <div 
        className={`w-full md:w-80 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0 ${
          activeMatchId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Campus Matches</h2>
            <p className="text-[11px] text-slate-400">Verified ASTU Students ({matches.length})</p>
          </div>
          <span className="p-1 px-2 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-full border border-rose-500/20">
            Active
          </span>
        </div>

        {/* Matches Horizontal Ribbon (Top Swipes) */}
        <div className="p-3 border-b border-slate-800 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
            New Matches
          </span>
          <div className="flex gap-3">
            {matches.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMatchId(m.id)}
                className="flex flex-col items-center shrink-0 group"
              >
                <div className={`relative w-12 h-12 rounded-full p-0.5 border-2 transition-all ${
                  activeMatchId === m.id ? 'border-rose-500 scale-105' : 'border-slate-700 group-hover:border-slate-500'
                }`}>
                  <img
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {m.profile.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  )}
                </div>
                <span className="text-[10px] text-slate-300 font-medium truncate max-w-[60px] mt-1">
                  {m.profile.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {matches.map((m) => {
            const isSelected = activeMatchId === m.id;
            const msgs = messagesMap[m.id] || [];
            const lastMsg = msgs[msgs.length - 1];

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMatchId(m.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                  isSelected ? 'bg-slate-800/80 border-l-4 border-rose-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 text-emerald-400 bg-slate-900 rounded-full p-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white truncate">
                      {m.profile.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lastMsg?.timestamp || m.lastMessageTime || 'Just now'}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-300 truncate font-medium">
                    {m.profile.major}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {lastMsg?.text || 'Matched on ASTU Spark'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat Conversation Pane */}
      {activeStudent && activeMatch ? (
        <div className={`flex-1 flex flex-col bg-slate-950 ${!activeMatchId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveMatchId(null)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={activeStudent.photos[0]}
                  alt={activeStudent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">{activeStudent.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400">
                  {activeStudent.major} · {activeStudent.locationName}
                </p>
              </div>
            </div>

            {/* In-App Call Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStudyInviteModal(true)}
                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                title="Send ASTU Study Session Proposal"
              >
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Study Invite</span>
              </button>

              {/* Audio Call Button */}
              <button
                type="button"
                onClick={() => setCallSession({ isOpen: true, mode: 'audio' })}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                title="Start Audio Call"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Video Call Button */}
              <button
                type="button"
                onClick={() => setCallSession({ isOpen: true, mode: 'video' })}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                title="Start Video Call"
              >
                <Video className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950">
            {/* Campus Security Encryption Notice */}
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>ASTU Private Encrypted Chat · Verified Students Only</span>
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Study Date Invite Card inside message stream */}
                  {msg.studyInvite ? (
                    <div className="max-w-sm rounded-2xl p-4 bg-slate-900 border border-rose-500/40 shadow-xl space-y-2.5 my-1">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                        <BookOpen className="w-4 h-4" />
                        <span>ASTU Campus Study Invitation</span>
                      </div>
                      <div className="text-xs text-white font-medium">{msg.studyInvite.topic}</div>
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{msg.studyInvite.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{msg.studyInvite.time}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${msg.studyInvite.status === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {msg.studyInvite.status === 'accepted' ? '✓ Accepted by student!' : 'Pending response...'}
                        </span>
                        <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
                      </div>
                    </div>
                  ) : msg.isVoiceNote ? (
                    /* Voice Note Bubble */
                    <div className={`p-3 rounded-2xl flex items-center gap-3 ${
                      isMe ? 'bg-rose-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      <button
                        type="button"
                        onClick={() => toggleVoicePlay(msg.id)}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                      
                      {/* Audio waveform visualization */}
                      <div className="flex items-center gap-1">
                        {[14, 28, 42, 20, 36, 12, 30, 22, 10].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full ${
                              playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/60'
                            }`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>

                      <span className="text-[11px] font-mono opacity-80">{msg.voiceDuration || '0:05'}</span>
                      <span className="text-[9px] opacity-70 ml-1">{msg.timestamp}</span>
                    </div>
                  ) : (
                    /* Regular Text Bubble */
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow ${
                        isMe
                          ? 'bg-rose-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-rose-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick ASTU Icebreakers Drawer */}
          <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800/80 overflow-x-auto flex gap-2">
            {icebreakers.map((ice, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(ice)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 whitespace-nowrap shrink-0 transition-colors"
              >
                {ice}
              </button>
            ))}
          </div>

          {/* Chat Input Toolbar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            {isRecordingVoice ? (
              <div className="flex items-center justify-between px-4 py-2 bg-rose-950/60 border border-rose-500/40 rounded-xl">
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Recording ASTU Voice Note: <strong>0:{String(recordingSeconds).padStart(2, '0')}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecordingVoice(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendVoiceNote}
                    className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Record Voice Note"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={`Message ${activeStudent.name}...`}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />

                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl shadow transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <BookOpen className="w-12 h-12 text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-white">Select a Campus Match</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Choose an ASTU connection on the left to start messaging, plan study dates, or make voice &amp; video calls.
          </p>
        </div>
      )}

      {/* Study Session Invitation Modal */}
      {showStudyInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-500" />
                <span>Propose Study Date</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowStudyInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Campus Location</label>
              <select
                value={studyLocation}
                onChange={(e) => setStudyLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Library 2 Quiet Zone (3rd Floor)">Library 2 Quiet Zone (3rd Floor)</option>
                <option value="Central Digital Library (SoEEC)">Central Digital Library (SoEEC)</option>
                <option value="Main Cafeteria Terrace">Main Cafeteria Terrace</option>
                <option value="Bole Lounge & Cafe Macchiato">Bole Lounge &amp; Cafe Macchiato</option>
                <option value="Gate 1 Green Garden & Fountain">Gate 1 Green Garden &amp; Fountain</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Subject / Project Topic</label>
              <input
                type="text"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms Prep"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Proposed Time</label>
              <input
                type="text"
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                placeholder="e.g. Today at 5:00 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleSendStudyInvite}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Study Invitation</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Call Modal */}
      {callSession.isOpen && activeStudent && (
        <CallModal
          match={activeStudent}
          mode={callSession.mode}
          onClose={() => setCallSession({ isOpen: false, mode: 'audio' })}
        />
      )}
    </div>
  );
};
