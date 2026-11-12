import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Clock, Award, 
  RotateCcw, Sparkles, ChevronRight, AlertCircle, 
  HelpCircle, Check, Flag, BookOpen, BarChart3, ListFilter, Play
} from 'lucide-react';
import { ThemeMode, MCQQuestion, ModelTestResult } from './types';
import { 
  MODEL_TEST_SUBJECTS, ModelTestSubjectInfo, 
  getModelTestSets, getQuestionsForSet, getRandom30Questions, 
  toBengaliNumber 
} from './modelTestData';

interface ModelTestViewProps {
  themeMode: ThemeMode;
  onBack: () => void;
}

type ScreenState = 'subject_select' | 'set_select' | 'exam' | 'result' | 'history';

export const ModelTestView: React.FC<ModelTestViewProps> = ({ themeMode, onBack }) => {
  const [screen, setScreen] = useState<ScreenState>('subject_select');
  const [selectedSubject, setSelectedSubject] = useState<ModelTestSubjectInfo | null>(null);
  const [currentSetNumber, setCurrentSetNumber] = useState<number | 'random'>(1);
  const [currentQuestions, setCurrentQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // qId -> optionIndex
  
  // Timer: 30 minutes = 1800 seconds
  const TOTAL_TIME = 30 * 60;
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [isExamRunning, setIsExamRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Submit / Review states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examResult, setExamResult] = useState<ModelTestResult | null>(null);
  const [testHistory, setTestHistory] = useState<ModelTestResult[]>(() => {
    try {
      const saved = localStorage.getItem('class7_model_test_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Timer countdown
  useEffect(() => {
    if (isExamRunning && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamRunning, timeRemaining]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${toBengaliNumber(m.toString().padStart(2, '0'))}:${toBengaliNumber(s.toString().padStart(2, '0'))}`;
  };

  const handleSelectSubject = (subj: ModelTestSubjectInfo) => {
    setSelectedSubject(subj);
    setScreen('set_select');
  };

  const handleStartSet = (setNum: number | 'random') => {
    if (!selectedSubject) return;

    // Check internet connection
    const hasNet = navigator.onLine && (!window.Android?.isNetworkAvailable || window.Android.isNetworkAvailable());
    if (!hasNet) {
      alert("ইন্টারনেট সংযোগ নেই! মডেল টেস্ট শুরু করতে সক্রিয় ইন্টারনেট সংযোগ প্রয়োজন। দয়া করে ইন্টারনেট চালু করুন।");
      return;
    }

    const startExamNow = () => {
      let questions: MCQQuestion[] = [];
      if (setNum === 'random') {
        questions = getRandom30Questions(selectedSubject.id);
      } else {
        questions = getQuestionsForSet(selectedSubject.id, setNum);
      }
      setCurrentSetNumber(setNum);
      setCurrentQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeRemaining(TOTAL_TIME);
      setIsExamRunning(true);
      setScreen('exam');
    };

    // Trigger Rewarded Ad before starting model test
    if (window.Android?.triggerRewardedAdWithAction) {
      const actionKey = `model_test_${selectedSubject.id}_${setNum}_${Date.now()}`;
      let handled = false;
      const timeoutId = window.setTimeout(() => {
        if (!handled) {
          handled = true;
          startExamNow();
        }
      }, 6500);

      window.onRewardedAdDismissedFromNative = (key: string) => {
        if (key === actionKey && !handled) {
          handled = true;
          window.clearTimeout(timeoutId);
          startExamNow();
        }
      };

      try {
        window.Android.triggerRewardedAdWithAction(actionKey);
        return;
      } catch (_) {}
    }

    startExamNow();
  };

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleClearOption = (qId: number) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleTimeUp = () => {
    setIsExamRunning(false);
    calculateAndShowResult();
  };

  const calculateAndShowResult = () => {
    if (!selectedSubject) return;
    setIsExamRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correct++;
      }
    });

    const timeSpent = TOTAL_TIME - timeRemaining;
    const setNameStr = currentSetNumber === 'random' 
      ? 'র্যান্ডম স্পেশাল টেস্ট' 
      : `মডেল টেস্ট সেট ${toBengaliNumber(currentSetNumber)}`;

    const result: ModelTestResult = {
      id: Date.now().toString(),
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      setName: setNameStr,
      score: correct,
      total: currentQuestions.length,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeSpentSeconds: timeSpent
    };

    setExamResult(result);
    setTestHistory(prev => {
      const updated = [result, ...prev].slice(0, 50);
      try {
        localStorage.setItem('class7_model_test_history', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    setShowSubmitModal(false);
    setScreen('result');
  };

  const currentQ = currentQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-full pb-28 pt-2">
      {/* 1. Subject Selection Screen */}
      {screen === 'subject_select' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all ${
            themeMode === 'light'
              ? 'bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 border-slate-200/90 text-slate-900 shadow-md'
              : themeMode === 'dark'
                ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
                : 'bg-slate-900/50 backdrop-blur-md text-white border border-white/25 shadow-xl'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    themeMode === 'light' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                  }`}>
                    পূর্ণাঙ্গ সিলেবাস ২০২৬
                  </span>
                  <span className="text-[10px] font-bold text-sky-400">★ ৩৫০টি প্রশ্ন প্রতি বিষয়ে</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black brand-font tracking-tight leading-tight">
                  মডেল টেস্ট ও এমসিকিউ ব্যাংক 🎯
                </h2>
                <p className={`text-xs font-bold leading-relaxed ${themeMode === 'light' ? 'text-slate-600' : 'text-sky-100/80'}`}>
                  প্রতিটি বিষয়ে ৩৫০টি প্রশ্ন থেকে ৩০ নম্বরের সময়ভিত্তিক স্বয়ংক্রিয় মডেল টেস্ট দিন।
                </p>
              </div>

              {testHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setScreen('history')}
                  className={`px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-black border shadow-xs transition-transform active:scale-95 shrink-0 ${
                    themeMode === 'light'
                      ? 'bg-white text-blue-700 border-slate-200 shadow-sm'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  <BarChart3 size={15} />
                  <span>পূর্বের স্কোর</span>
                </button>
              )}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODEL_TEST_SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                type="button"
                onClick={() => handleSelectSubject(subj)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3.5 transition-all active:scale-[0.98] group ${
                  themeMode === 'light'
                    ? 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-sm hover:border-blue-300'
                    : themeMode === 'dark'
                      ? 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-white shadow-sm'
                      : 'bg-white/30 backdrop-blur-md hover:bg-white/40 border border-white/40 text-slate-950 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs border ${
                    themeMode === 'light' ? 'bg-sky-50 border-sky-100' : 'bg-white/10 border-white/20'
                  }`}>
                    {subj.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-sm sm:text-base font-black truncate leading-tight ${
                      themeMode === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}>
                      {subj.name}
                    </h3>
                    <p className={`text-[11px] font-bold mt-1 flex items-center gap-1.5 ${
                      themeMode === 'dark' ? 'text-sky-300' : 'text-slate-800'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      {toBengaliNumber(subj.totalQuestions)}টি এমসিকিউ • {toBengaliNumber(subj.totalSets)}টি টেস্ট সেট
                    </p>
                  </div>
                </div>

                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:translate-x-1 ${
                  themeMode === 'light'
                    ? 'bg-sky-50 text-blue-600 border-sky-200'
                    : 'bg-white/10 text-white border-white/20'
                }`}>
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Set Selection Screen */}
      {screen === 'set_select' && selectedSubject && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setScreen('subject_select')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black border transition-all active:scale-95 ${
                themeMode === 'light'
                  ? 'bg-white text-slate-800 border-slate-200 shadow-xs'
                  : 'bg-slate-900/60 text-white border-white/20 backdrop-blur-md'
              }`}
            >
              <ArrowLeft size={16} />
              <span>সকল বিষয়</span>
            </button>
            <div className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
              themeMode === 'light' ? 'bg-sky-50 text-sky-900 border-sky-200' : 'bg-white/10 text-white border-white/20'
            }`}>
              {selectedSubject.icon} {selectedSubject.name}
            </div>
          </div>

          {/* Special Random 30 Questions Exam Card */}
          <div className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all shadow-md ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white border-blue-500'
              : 'bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 text-white border-sky-500/30'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                  ⚡ স্পেশাল র্যান্ডম টেস্ট
                </span>
                <h3 className="text-lg sm:text-xl font-black brand-font leading-tight">
                  যেকোনো ৩০টি প্রশ্নের স্পেশাল পরীক্ষা
                </h3>
                <p className="text-xs text-sky-100/90 font-medium">
                  {selectedSubject.name}-এর সম্পূর্ণ ৩৫০টি প্রশ্নভাণ্ডার থেকে দৈবচয়ন পদ্ধতিতে ৩০টি প্রশ্ন আসবে।
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-sky-200">
                  <span className="flex items-center gap-1"><HelpCircle size={13}/> ৩০টি প্রশ্ন</span>
                  <span className="flex items-center gap-1"><Clock size={13}/> ৩০ মিনিট</span>
                  <span className="flex items-center gap-1"><Award size={13}/> পূর্ণমান: ৩০</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartSet('random')}
                className="px-4 py-3 rounded-2xl bg-white text-blue-700 hover:bg-sky-50 font-black text-xs shadow-lg active:scale-95 transition-transform shrink-0 flex items-center gap-1.5"
              >
                <Play size={16} className="fill-blue-700" />
                <span>শুরু করুন</span>
              </button>
            </div>
          </div>

          {/* Model Test Sets Header */}
          <div className="flex items-center justify-between pt-2 px-1">
            <h4 className={`text-sm font-black brand-font ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              নির্ধারিত মডেল টেস্ট সেটসমূহ (১১টি সেট)
            </h4>
            <span className={`text-[11px] font-bold ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-700'}`}>
              প্রতি সেটে ৩০টি প্রশ্ন
            </span>
          </div>

          {/* Sets List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {getModelTestSets().map((st) => (
              <div
                key={st.setNumber}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  themeMode === 'light'
                    ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                    : themeMode === 'dark'
                      ? 'bg-slate-900/80 border-slate-800 text-white shadow-xs'
                      : 'bg-white/30 backdrop-blur-md border border-white/40 text-slate-950 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${
                    themeMode === 'light' ? 'bg-sky-50 text-blue-700 border-sky-200' : 'bg-white/10 text-white border-white/20'
                  }`}>
                    {toBengaliNumber(st.setNumber)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-black truncate leading-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                      {st.title}
                    </p>
                    <p className={`text-[10px] font-bold mt-0.5 flex items-center gap-2 ${
                      themeMode === 'dark' ? 'text-sky-200/80' : 'text-slate-700'
                    }`}>
                      <span>প্রশ্ন {toBengaliNumber(st.startIndex + 1)}-{toBengaliNumber(st.endIndex)}</span>
                      <span>•</span>
                      <span>৩০ মিনিট</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartSet(st.setNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all active:scale-95 shrink-0 ${
                    themeMode === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500 shadow-xs'
                      : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border-sky-400/30'
                  }`}
                >
                  পরীক্ষা দিন →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Active Exam Screen */}
      {screen === 'exam' && currentQ && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Top Exam Navigation Bar with Live Countdown Timer */}
          <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-2 shadow-sm ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900'
              : themeMode === 'dark'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-slate-900/60 backdrop-blur-md border border-white/20 text-white'
          }`}>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('আপনি কি মডেল টেস্ট বাতিল করে ফিরে যেতে চান?')) {
                  setIsExamRunning(false);
                  setScreen('set_select');
                }
              }}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-transform active:scale-95 ${
                themeMode === 'light' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/10 text-white border-white/10'
              }`}
              title="বাতিল করুন"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Countdown Timer Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-black border ${
              timeRemaining < 120 
                ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse' 
                : timeRemaining < 300 
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500' 
                  : (themeMode === 'light' ? 'bg-sky-50 text-blue-700 border-sky-200' : 'bg-sky-500/20 text-sky-300 border-sky-400/30')
            }`}>
              <Clock size={14} />
              <span>{formatTimer(timeRemaining)}</span>
            </div>

            {/* Counter */}
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
              themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/10 border-white/15 text-white'
            }`}>
              উত্তর: {toBengaliNumber(answeredCount)} / {toBengaliNumber(currentQuestions.length)}
            </div>

            {/* Finish Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs active:scale-95 transition-transform"
            >
              সাবমিট
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 dark:bg-sky-400 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Current Question Card */}
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-4 ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900'
              : themeMode === 'dark'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white/35 backdrop-blur-md border border-white/40 text-slate-950'
          }`}>
            <div className="flex items-center justify-between gap-2 border-b pb-2.5 border-slate-200/60 dark:border-white/10">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                themeMode === 'light' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
              }`}>
                প্রশ্ন {toBengaliNumber(currentQuestionIndex + 1)} / {toBengaliNumber(currentQuestions.length)}
              </span>
              <span className={`text-[11px] font-bold ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-600'}`}>
                {currentQ.chapter || selectedSubject?.name}
              </span>
            </div>

            {/* Question Text */}
            <h3 className={`text-base sm:text-lg font-black leading-relaxed ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;
                const optLabels = ['ক', 'খ', 'গ', 'ঘ'];
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.99] ${
                      isSelected
                        ? (themeMode === 'light'
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-950 font-black shadow-xs'
                            : 'bg-sky-950/70 border-2 border-sky-400 text-white font-black shadow-md')
                        : (themeMode === 'light'
                            ? 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-900'
                            : themeMode === 'dark'
                              ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-white'
                              : 'bg-white/40 hover:bg-white/50 border-white/50 text-slate-950')
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : (themeMode === 'light' ? 'bg-white text-slate-700 border-slate-300' : 'bg-white/10 text-white border-white/20')
                      }`}>
                        {optLabels[oIdx]}
                      </span>
                      <span className="text-sm font-bold leading-snug">
                        {opt}
                      </span>
                    </div>

                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                themeMode === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              ← পূর্ববর্তী
            </button>

            {selectedAnswers[currentQ.id] !== undefined && (
              <button
                type="button"
                onClick={() => handleClearOption(currentQ.id)}
                className="text-[11px] font-bold text-red-500 hover:underline px-2 py-1"
              >
                উত্তর মুছুন
              </button>
            )}

            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs active:scale-95 transition-transform"
              >
                পরবর্তী →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs active:scale-95 transition-transform"
              >
                জমা দিন (Submit)
              </button>
            )}
          </div>

          {/* Quick Question Navigation Grid (1 to 30) */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            themeMode === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-black/30 border-white/10'
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-600'}`}>
              প্রশ্ন তালিকা (যেখানে চাপবেন সেখানে যাবে):
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {currentQuestions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-8 rounded-lg font-black text-xs flex items-center justify-center border transition-all active:scale-90 ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 border-blue-500 scale-105 font-black ' + (isAnswered ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')
                        : isAnswered
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : (themeMode === 'light' ? 'bg-white text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700')
                    }`}
                  >
                    {toBengaliNumber(idx + 1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[10000] bg-blue-950/80 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Award size={30} />
            </div>
            <div>
              <h3 className="text-lg font-black brand-font text-slate-900 dark:text-white leading-tight">
                মডেল টেস্ট জমা দিতে চান?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                আপনি {toBengaliNumber(currentQuestions.length)}টি প্রশ্নের মধ্যে <strong>{toBengaliNumber(answeredCount)}টি</strong> প্রশ্নের উত্তর দিয়েছেন।
              </p>
              {answeredCount < currentQuestions.length && (
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                  বাকি রয়েছে: {toBengaliNumber(currentQuestions.length - answeredCount)}টি প্রশ্ন
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={calculateAndShowResult}
                className="py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md"
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Result & Detailed Review Screen */}
      {screen === 'result' && examResult && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Result Card */}
          <div className={`p-5 sm:p-6 rounded-3xl border text-center relative overflow-hidden shadow-md space-y-3 ${
            themeMode === 'light'
              ? 'bg-gradient-to-br from-white via-sky-50 to-blue-50 border-slate-200 text-slate-900'
              : 'bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border-slate-800 text-white'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-sky-500/20 dark:text-sky-300 inline-block">
              {examResult.setName} • {examResult.subjectName}
            </span>

            {/* Score Circle */}
            <div className="py-2">
              <div className="h-28 w-28 rounded-full border-4 border-blue-500/30 flex flex-col items-center justify-center mx-auto bg-white/50 dark:bg-black/30 shadow-inner">
                <span className="text-3xl font-black text-blue-600 dark:text-sky-400">
                  {toBengaliNumber(examResult.score)}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  / {toBengaliNumber(examResult.total)}
                </span>
              </div>
            </div>

            {/* Feedback Badge */}
            <div>
              <h3 className="text-xl font-black brand-font leading-tight">
                {examResult.score >= 24 
                  ? 'চমৎকার পারফরম্যান্স! 🌟' 
                  : examResult.score >= 18 
                    ? 'ভালো হয়েছে! 👍' 
                    : examResult.score >= 12 
                      ? 'সন্তোষজনক, আরও পড়তে হবে! 📖' 
                      : 'বেশি বেশি অনুশীলন প্রয়োজন! 💪'}
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                সময় লেগেছে: {toBengaliNumber(Math.floor(examResult.timeSpentSeconds / 60))} মিনিট {toBengaliNumber(examResult.timeSpentSeconds % 60)} সেকেন্ড
              </p>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                <p className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">সঠিক</p>
                <p className="text-base font-black text-emerald-700 dark:text-emerald-300">{toBengaliNumber(examResult.score)}</p>
              </div>
              <div className="p-2 rounded-xl bg-red-100/70 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
                <p className="text-[9px] font-bold text-red-800 dark:text-red-300 uppercase">ভুল</p>
                <p className="text-base font-black text-red-700 dark:text-red-300">
                  {toBengaliNumber(examResult.total - examResult.score - (examResult.total - answeredCount))}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">উত্তরবিহীন</p>
                <p className="text-base font-black text-slate-700 dark:text-slate-300">{toBengaliNumber(examResult.total - answeredCount)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => handleStartSet(currentSetNumber)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs active:scale-95 transition-transform flex items-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>আবার পরীক্ষা দিন</span>
              </button>
              <button
                type="button"
                onClick={() => setScreen('set_select')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-transform active:scale-95 ${
                  themeMode === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                অন্যান্য সেট
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h4 className={`text-sm font-black brand-font ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                সম্পূর্ণ উত্তরপত্র ও সঠিক উত্তরের ব্যাখ্যা
              </h4>
              <span className={`text-[11px] font-bold ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-700'}`}>
                ৩০টি প্রশ্ন পর্যালোচনা
              </span>
            </div>

            {currentQuestions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.answerIndex;
              const isSkipped = userAns === undefined;
              const optLabels = ['ক', 'খ', 'গ', 'ঘ'];

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                    isCorrect
                      ? (themeMode === 'light' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-800/50')
                      : isSkipped
                        ? (themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800')
                        : (themeMode === 'light' ? 'bg-red-50/50 border-red-200' : 'bg-red-950/20 border-red-800/50')
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-slate-500">
                      প্রশ্ন {toBengaliNumber(idx + 1)}.
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isCorrect 
                        ? 'bg-emerald-600 text-white' 
                        : isSkipped 
                          ? 'bg-slate-400 text-white' 
                          : 'bg-red-600 text-white'
                    }`}>
                      {isCorrect ? '✓ সঠিক' : isSkipped ? '— উত্তর দেননি' : '✗ ভুল'}
                    </span>
                  </div>

                  <p className={`text-sm font-black leading-snug ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-bold pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isThisCorrect = oIdx === q.answerIndex;
                      const isThisSelected = oIdx === userAns;

                      let badgeClass = themeMode === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-300';
                      if (isThisCorrect) {
                        badgeClass = 'bg-emerald-500 text-white font-black border-emerald-600';
                      } else if (isThisSelected && !isCorrect) {
                        badgeClass = 'bg-red-500 text-white font-black border-red-600';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border flex items-center gap-2 ${badgeClass}`}
                        >
                          <span className="font-mono font-bold text-[11px] shrink-0">
                            {optLabels[oIdx]})
                          </span>
                          <span className="truncate flex-1">{opt}</span>
                          {isThisCorrect && <Check size={13} strokeWidth={3} className="shrink-0" />}
                          {isThisSelected && !isCorrect && <XCircle size={13} strokeWidth={3} className="shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className={`p-2.5 rounded-xl border text-[11px] font-bold mt-1 ${
                      themeMode === 'light' ? 'bg-sky-50/80 border-sky-100 text-sky-900' : 'bg-sky-950/40 border-sky-900/60 text-sky-200'
                    }`}>
                      💡 <strong>ব্যাখ্যা:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Test History Screen */}
      {screen === 'history' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setScreen('subject_select')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black border transition-all active:scale-95 ${
                themeMode === 'light' ? 'bg-white border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-900 border-white/20 text-white'
              }`}
            >
              <ArrowLeft size={16} />
              <span>বিষয় নির্বাচন</span>
            </button>
            <h3 className={`text-sm font-black brand-font ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              পূর্ববর্তী পরীক্ষার ফলাফল ({toBengaliNumber(testHistory.length)}টি)
            </h3>
          </div>

          <div className="space-y-2.5">
            {testHistory.map((h) => {
              const percent = Math.round((h.score / h.total) * 100);
              return (
                <div
                  key={h.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-900 border-slate-800 text-white shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {h.date} • {h.setName}
                    </span>
                    <h4 className={`text-sm font-black leading-tight mt-0.5 ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                      {h.subjectName}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                      সময়: {toBengaliNumber(Math.floor(h.timeSpentSeconds / 60))} মি. {toBengaliNumber(h.timeSpentSeconds % 60)} সে.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-lg font-black ${
                      percent >= 80 ? 'text-emerald-600 dark:text-emerald-400' : percent >= 50 ? 'text-blue-600 dark:text-sky-400' : 'text-red-500'
                    }`}>
                      {toBengaliNumber(h.score)} / {toBengaliNumber(h.total)}
                    </span>
                    <p className="text-[10px] font-bold text-slate-500">
                      ({toBengaliNumber(percent)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
