
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Menu, X, ArrowLeft, Home, Lightbulb, Search, Wrench, ChevronRight, Shield, MessageCircle, Star, LogOut, Calculator, StickyNote, Timer as TimerIcon, Play, Square as SquareIcon, RotateCcw, RefreshCcw, LayoutGrid, BookOpen, Save, Trash2, Plus, Sigma, Languages, Mail, AlertCircle, WifiOff, FileText, Lock, Eye, Info, Check, Download, Sun, Moon, Monitor, Copy, CheckCheck, Sparkles, Clock, Flame, GraduationCap, ChevronDown, Award, ClipboardCheck } from 'lucide-react';
import { SUBJECTS_DATA } from './constants';
import { ViewState, Subject, Chapter, GuideMode, ToolSubView, SavedNote, ThemeMode } from './types';
import { COMPREHENSIVE_GRAMMAR } from './grammarData';
import { ModelTestView } from './ModelTestView';
import LOGO_GIF from './Image/sticker/logo.gif';
import CLASS7_BG from './Image/class7_bg.png';

declare global {
  interface Window {
    Android?: {
      triggerInterstitialAd?: () => void;
      triggerInterstitialAdWithAction?: (action: string) => void;
      triggerRewardedAdWithAction?: (action: string) => void;
      showBannerAd?: (show: boolean) => void;
      isNetworkAvailable?: () => boolean;
      openExternalUrl?: (url: string) => void;
      exitApp?: () => void;
      downloadPdf?: (chapterId: string, downloadUrl: string, callbackJs: string) => void;
      getPdfBase64?: (chapterId: string) => string | null;
      isPdfDownloaded?: (chapterId: string) => boolean;
      deletePdf?: (chapterId: string) => boolean;
      getDownloadedChapters?: () => string;
      setSystemBarTheme?: (isDark: boolean) => void;
      setAppTheme?: (themeName: string) => void;
      onAppReady?: () => void;
    };
    onRewardedAdDismissedFromNative?: (action: string, rewardEarned?: boolean) => void;
    handleNativeBackPressed?: () => boolean | void;
    showExitPopupFromNative?: () => void;
    onInterstitialDismissedFromNative?: (action: string) => void;
    __onDownloadProgress?: (percent: number, loadedMb: string, totalMb: string) => void;
    __onListDownloadComplete?: (result: string | null) => void;
  }
}

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.gyansohayota.class7guide";

const openExternalLink = (url: string) => {
  try {
    if (window.Android?.openExternalUrl) {
      window.Android.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  } catch {
    window.open(url, '_blank');
  }
};

const toBengaliDigits = (val: string | number): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('subjects');
  const [activeTool, setActiveTool] = useState<ToolSubView>('calculator');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: { chapter: Chapter; subject: Subject }[] = [];
    Object.values(SUBJECTS_DATA).forEach(subject => {
      subject.chapters.forEach(ch => {
        if (ch.title.toLowerCase().includes(q) || subject.name.toLowerCase().includes(q)) {
          results.push({ chapter: ch, subject });
        }
      });
      subject.altChapters?.forEach(ch => {
        if (ch.title.toLowerCase().includes(q) || subject.name.toLowerCase().includes(q)) {
          results.push({ chapter: ch, subject });
        }
      });
    });
    return results;
  }, [searchQuery]);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [guideMode, setGuideMode] = useState<GuideMode>('guide');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showNoInternetModal, setShowNoInternetModal] = useState(false);

  // --- Theme Mode State ('sky' (default) | 'light' | 'dark') ---
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('theme_preference_v2');
      if (saved === 'dark' || saved === 'light' || saved === 'sky') return saved as ThemeMode;
      return 'sky'; // Default on entering app: Full Sky Blue
    } catch {
      return 'sky';
    }
  });
  const [effectiveTheme, setEffectiveTheme] = useState<'sky' | 'light' | 'dark'>('sky');
  const [themeToast, setThemeToast] = useState<string | null>(null);

  // Apply theme directly across HTML, body, and native system bars
  useEffect(() => {
    setEffectiveTheme(themeMode);
    const rootEl = document.documentElement;
    const bodyEl = document.body;

    rootEl.classList.remove('dark', 'theme-dark', 'theme-light', 'theme-sky');
    bodyEl.classList.remove('dark', 'theme-dark', 'theme-light', 'theme-sky');

    let metaColor = '#38bdf8';

    if (themeMode === 'dark') {
      rootEl.classList.add('dark', 'theme-dark');
      bodyEl.classList.add('dark', 'theme-dark');
      metaColor = '#090d16';
    } else if (themeMode === 'light') {
      rootEl.classList.add('theme-light');
      bodyEl.classList.add('theme-light');
      metaColor = '#ffffff';
    } else {
      // 'sky' (Default wallpaper background mode)
      rootEl.classList.add('theme-sky');
      bodyEl.classList.add('theme-sky');
      metaColor = '#38bdf8';
    }

    const themeMeta = document.getElementById('meta-theme-color') as HTMLMetaElement;
    if (themeMeta) {
      themeMeta.content = metaColor;
    }

    try {
      if (window.Android?.setAppTheme) {
        window.Android.setAppTheme(themeMode);
      } else {
        window.Android?.setSystemBarTheme?.(themeMode === 'dark');
      }
    } catch (_) {}

    try {
      localStorage.setItem('theme_preference_v2', themeMode);
    } catch (_) {}
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => {
      let next: ThemeMode;
      let msg = '';
      if (prev === 'sky') {
        next = 'light';
        msg = '☀️ ফুল হোয়াইট লাইট মোড চালু হয়েছে';
      } else if (prev === 'light') {
        next = 'dark';
        msg = '🌙 ফুল ডার্ক মোড চালু হয়েছে';
      } else {
        next = 'sky';
        msg = '🌊 ডিফল্ট স্কাই ব্লু মোড চালু হয়েছে';
      }
      setThemeToast(msg);
      setTimeout(() => setThemeToast(null), 2000);
      return next;
    });
  };

  // --- Favorite Chapters ---
  const [favoriteChapters, setFavoriteChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorite_chapters_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [chapterFilter, setChapterFilter] = useState<'all' | 'favorite'>('all');

  interface LastReadChapter {
    chapterId: string;
    chapterTitle: string;
    subjectId: string;
    subjectName: string;
    subjectIcon: string;
    timestamp: number;
  }
  const [lastReadChapter, setLastReadChapter] = useState<LastReadChapter | null>(() => {
    try {
      const saved = localStorage.getItem('class7_last_read_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // --- Downloaded Chapters & Progress State ---
  const [downloadedChapters, setDownloadedChapters] = useState<Set<string>>(new Set());
  interface DownloadProgressState {
    chapterId: string;
    chapterTitle: string;
    percent: number;
    loadedMb: string;
    totalMb: string;
  }
  const [downloadingState, setDownloadingState] = useState<DownloadProgressState | null>(null);

  // --- Tool States ---
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [noteCategory, setNoteCategory] = useState<string>('সাধারণ');
  const [noteFilter, setNoteFilter] = useState<string>('সব');
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const data = localStorage.getItem('user_notes_v3');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [grammarSelectedCat, setGrammarSelectedCat] = useState<string>('parts_of_speech');
  const [isToolsPopupOpen, setIsToolsPopupOpen] = useState(false);

  // --- Pomodoro & Stopwatch Timer States ---
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [time, setTime] = useState(0); // Stopwatch seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [pomoPreset, setPomoPreset] = useState<number>(25 * 60); // 25 min default
  const [pomoRemaining, setPomoRemaining] = useState<number>(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'study' | 'break'>('study');
  const [pomoSessionsCompleted, setPomoSessionsCompleted] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('pomo_sessions_v1') || '0', 10);
    } catch { return 0; }
  });

  const chapterClickCounter = useRef(0);
  const userActionCounterRef = useRef(0);
  const lastInterstitialActionRef = useRef(-2);
  const lastInterstitialTsRef = useRef(0);
  const pendingActionRef = useRef<null | { key: string; run: () => void }>(null);
  const pendingActionTimerRef = useRef<number | null>(null);

  const ADS_ENABLED = true;

  // State refs to ensure native back button always accesses fresh states
  const viewRef = useRef(view);
  viewRef.current = view;
  const isDrawerOpenRef = useRef(isDrawerOpen);
  isDrawerOpenRef.current = isDrawerOpen;
  const isSearchOpenRef = useRef(isSearchOpen);
  isSearchOpenRef.current = isSearchOpen;
  const isToolsPopupOpenRef = useRef(isToolsPopupOpen);
  isToolsPopupOpenRef.current = isToolsPopupOpen;
  const showExitPopupRef = useRef(showExitPopup);
  showExitPopupRef.current = showExitPopup;
  const showAdminPopupRef = useRef(showAdminPopup);
  showAdminPopupRef.current = showAdminPopup;
  const showPrivacyModalRef = useRef(showPrivacyModal);
  showPrivacyModalRef.current = showPrivacyModal;
  const showSourcesModalRef = useRef(showSourcesModal);
  showSourcesModalRef.current = showSourcesModal;

  const handleNativeBackPressed = useCallback(() => {
    // 1. If PDF viewer is open (view === 'content'), ALWAYS go back to chapters!
    if (viewRef.current === 'content') {
      setView('chapters');
      return true;
    }

    // 2. If exit popup is open, close it
    if (showExitPopupRef.current) {
      setShowExitPopup(false);
      return true;
    }

    // 3. If any modal is open, close it
    if (showAdminPopupRef.current) {
      setShowAdminPopup(false);
      return true;
    }
    if (showPrivacyModalRef.current) {
      setShowPrivacyModal(false);
      return true;
    }
    if (showSourcesModalRef.current) {
      setShowSourcesModal(false);
      return true;
    }

    // 4. If search is open, close it
    if (isSearchOpenRef.current) {
      setIsSearchOpen(false);
      return true;
    }

    // 5. If drawer is open, close it
    if (isDrawerOpenRef.current) {
      setIsDrawerOpen(false);
      return true;
    }

    // 6. If tools popup is open, close it
    if (isToolsPopupOpenRef.current) {
      setIsToolsPopupOpen(false);
      return true;
    }

    // 7. If in chapters, tools, or model_test view, go back to subjects
    if (viewRef.current === 'chapters' || viewRef.current === 'tools' || viewRef.current === 'model_test') {
      setView('subjects');
      setCurrentSubject(null);
      return true;
    }

    // 8. If on subjects view (root), prompt exit confirmation
    if (viewRef.current === 'subjects') {
      setShowExitPopup(true);
      return true;
    }

    return false;
  }, []);

  // --- Converter States ---
  const [converterType, setConverterType] = useState<'length' | 'weight' | 'temp' | 'data' | 'bmi'>('length');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<{ value: string; status: string; color: string } | null>(null);
  const [convInput, setConvInput] = useState('1');
  const [convFromUnit, setConvFromUnit] = useState('m');
  const [convToUnit, setConvToUnit] = useState('cm');
  const [convResult, setConvResult] = useState<string | null>('100');

  // --- Formulas State & Data ---
  const [formulaTab, setFormulaTab] = useState<'algebra' | 'geometry' | 'arithmetic' | 'science'>('algebra');
  const EXPANDED_FORMULAS = [
    {
      id: "algebra",
      category: "বীজগণিত (Algebra)",
      items: [
        { title: "বর্গের সূত্রাবলী", formula: "(a + b)² = a² + 2ab + b²" },
        { title: "বর্গের বিয়োগ সূত্র", formula: "(a - b)² = a² - 2ab + b²" },
        { title: "বর্গান্তর সূত্র", formula: "a² - b² = (a + b)(a - b)" },
        { title: "ত্রিপদী রাশির বর্গ", formula: "(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca" },
        { title: "অনুসিদ্ধান্ত ১", formula: "a² + b² = (a + b)² - 2ab" },
        { title: "অনুসিদ্ধান্ত ২", formula: "a² + b² = (a - b)² + 2ab" },
        { title: "অনুসিদ্ধান্ত ৩", formula: "(a + b)² = (a - b)² + 4ab" },
        { title: "অনুসিদ্ধান্ত ৪", formula: "4ab = (a + b)² - (a - b)²" },
        { title: "ঘনের সূত্র ১", formula: "(a + b)³ = a³ + 3a²b + 3ab² + b³" },
        { title: "ঘনের সূত্র ২", formula: "(a - b)³ = a³ - 3a²b + 3ab² - b³" }
      ]
    },
    {
      id: "geometry",
      category: "জ্যামিতি ও পরিমিতি (Geometry)",
      items: [
        { title: "বর্গক্ষেত্রের ক্ষেত্রফল", formula: "ক্ষেত্রফল = বাহু² (A = a²)" },
        { title: "বর্গক্ষেত্রের পরিসীমা", formula: "পরিসীমা = ৪ × বাহু (P = 4a)" },
        { title: "আয়তক্ষেত্রের ক্ষেত্রফল", formula: "ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ (A = l × w)" },
        { title: "আয়তক্ষেত্রের পরিসীমা", formula: "পরিসীমা = ২(দৈর্ঘ্য + প্রস্থ)" },
        { title: "ত্রিভুজের ক্ষেত্রফল", formula: "ক্ষেত্রফল = ½ × ভূমি × উচ্চতা (A = ½bh)" },
        { title: "বৃত্তের পরিধি", formula: "পরিধি = ২πr (r = ব্যাসার্ধ, π ≈ ৩.১৪১৬)" },
        { title: "বৃত্তের ক্ষেত্রফল", formula: "ক্ষেত্রফল = πr²" },
        { title: "রম্বসের ক্ষেত্রফল", formula: "ক্ষেত্রফল = ½ × কর্ণদ্বয়ের গুণফল (½ × d₁ × d₂)" }
      ]
    },
    {
      id: "arithmetic",
      category: "পাটিগণিত (Arithmetic)",
      items: [
        { title: "লাভ নির্ণয়", formula: "লাভ = বিক্রয়মূল্য - ক্রয়মূল্য" },
        { title: "ক্ষতি নির্ণয়", formula: "ক্ষতি = ক্রয়মূল্য - বিক্রয়মূল্য" },
        { title: "শতকরা লাভ", formula: "শতকরা লাভ = (লাভ / ক্রয়মূল্য) × ১০০%" },
        { title: "সরল মুনাফা", formula: "I = Pnr (I = মুনাফা, P = মূলধন, n = সময়, r = মুনাফার হার)" },
        { title: "গতিবেগ নির্ণয়", formula: "বেগ = অতিক্রান্ত দূরত্ব / সময় (v = s / t)" }
      ]
    },
    {
      id: "science",
      category: "বিজ্ঞান ও পদার্থ সূত্র (Science & Physics)",
      items: [
        { title: "গতির সূত্র (বেগ)", formula: "v = s / t (দূরত্ব ÷ সময়)" },
        { title: "ত্বরণ (Acceleration)", formula: "a = (v - u) / t (শেষ বেগ - আদি বেগ ÷ সময়)" },
        { title: "নিউটনের বলের সূত্র", formula: "F = ma (বল = ভর × ত্বরণ)" },
        { title: "কাজের পরিমাণ", formula: "W = Fs (কাজ = বল × সরণ)" },
        { title: "ক্ষমতার সমীকরণ", formula: "P = W / t (ক্ষমতা = কাজ ÷ সময়)" },
        { title: "ঘনত্ব পরিমাপ", formula: "ρ = m / V (ঘনত্ব = ভর ÷ আয়তন)" }
      ]
    }
  ];

  useEffect(() => {
    localStorage.setItem('user_notes_v3', JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Pomodoro Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (pomoIsRunning) {
      interval = setInterval(() => {
        setPomoRemaining(prev => {
          if (prev <= 1) {
            setPomoIsRunning(false);
            if (pomoMode === 'study') {
              const updated = pomoSessionsCompleted + 1;
              setPomoSessionsCompleted(updated);
              try { localStorage.setItem('pomo_sessions_v1', String(updated)); } catch (_) {}
              setPomoMode('break');
              return 5 * 60; // 5 min break
            } else {
              setPomoMode('study');
              return 25 * 60; // 25 min study
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoIsRunning, pomoMode, pomoSessionsCompleted]);

  const copyText = (txt: string, id: string) => {
    try {
      navigator.clipboard.writeText(txt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch (_) {}
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleFavoriteChapter = (chapterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteChapters(prev => {
      const next = prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId];
      try {
        localStorage.setItem('favorite_chapters_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const refreshDownloadedChapters = useCallback(async () => {
    const downloadedSet = new Set<string>();

    // 1. Check Android native cache
    try {
      if (window.Android?.getDownloadedChapters) {
        const jsonStr = window.Android.getDownloadedChapters();
        if (jsonStr) {
          const arr: string[] = JSON.parse(jsonStr);
          arr.forEach(id => downloadedSet.add(id));
        }
      }
    } catch (_) {}

    // 2. Check IndexedDB
    try {
      const dbReq = indexedDB.open('Class7PdfCache', 1);
      dbReq.onsuccess = () => {
        const db = dbReq.result;
        if (db.objectStoreNames.contains('pdfs')) {
          const tx = db.transaction('pdfs', 'readonly');
          const store = tx.objectStore('pdfs');
          const getAllKeysReq = store.getAllKeys();
          getAllKeysReq.onsuccess = () => {
            if (getAllKeysReq.result) {
              (getAllKeysReq.result as string[]).forEach(k => downloadedSet.add(k));
              setDownloadedChapters(new Set(downloadedSet));
            }
          };
        }
      };
    } catch (_) {}

    // 3. Check localStorage cache registry
    try {
      const localRegistry = localStorage.getItem('downloaded_chapter_ids');
      if (localRegistry) {
        const ids: string[] = JSON.parse(localRegistry);
        ids.forEach(id => downloadedSet.add(id));
      }
    } catch (_) {}

    setDownloadedChapters(new Set(downloadedSet));
  }, []);

  useEffect(() => {
    refreshDownloadedChapters();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PDF_DOWNLOAD_COMPLETE' && e.data?.chapterId) {
        setDownloadedChapters(prev => {
          const next = new Set(prev);
          next.add(e.data.chapterId);
          try {
            localStorage.setItem('downloaded_chapter_ids', JSON.stringify(Array.from(next)));
          } catch (_) {}
          return next;
        });
      }
    };
    window.addEventListener('message', handleMessage);

    window.__onDownloadProgress = (percent: number, loadedMb: string, totalMb: string) => {
      setDownloadingState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          percent: Math.max(0, Math.min(100, Math.round(percent))),
          loadedMb: loadedMb || prev.loadedMb,
          totalMb: totalMb || prev.totalMb,
        };
      });
    };

    return () => {
      window.removeEventListener('message', handleMessage);
      window.__onDownloadProgress = undefined;
    };
  }, [refreshDownloadedChapters]);

  const handleDeleteDownload = (chapterId: string, chapterTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`"${chapterTitle}" এর ডাউনলোড করা ফাইলটি কি মুছে ফেলতে চান?`)) return;

    try {
      window.Android?.deletePdf?.(chapterId);
    } catch (_) {}

    try {
      const dbReq = indexedDB.open('Class7PdfCache', 1);
      dbReq.onsuccess = () => {
        const db = dbReq.result;
        if (db.objectStoreNames.contains('pdfs')) {
          const tx = db.transaction('pdfs', 'readwrite');
          tx.objectStore('pdfs').delete(chapterId);
        }
      };
    } catch (_) {}

    setDownloadedChapters(prev => {
      const next = new Set(prev);
      next.delete(chapterId);
      try {
        localStorage.setItem('downloaded_chapter_ids', JSON.stringify(Array.from(next)));
      } catch (_) {}
      return next;
    });
  };

  useEffect(() => {
    window.onInterstitialDismissedFromNative = (action: string) => {
      const pending = pendingActionRef.current
      if (!pending || pending.key !== action) return

      if (pendingActionTimerRef.current) {
        window.clearTimeout(pendingActionTimerRef.current)
        pendingActionTimerRef.current = null
      }

      pendingActionRef.current = null
      pending.run()
    }

    return () => {
      window.onInterstitialDismissedFromNative = undefined
    }
  }, [])

  const runWithInterstitial = (actionKey: string, next: () => void) => {
    if (!ADS_ENABLED) {
      next()
      return
    }

    pendingActionRef.current = { key: actionKey, run: next }

    if (pendingActionTimerRef.current) {
      window.clearTimeout(pendingActionTimerRef.current)
    }

    pendingActionTimerRef.current = window.setTimeout(() => {
      const pending = pendingActionRef.current
      if (!pending || pending.key !== actionKey) return
      pendingActionRef.current = null
      pendingActionTimerRef.current = null
      next()
    }, 5500)

    const bridge = window.Android
    if (bridge?.triggerInterstitialAdWithAction) {
      bridge.triggerInterstitialAdWithAction(actionKey)
      return
    }

    bridge?.triggerInterstitialAd?.()
  }

  const shouldShowInterstitialNow = () => {
    return ADS_ENABLED;
  };

  useEffect(() => {
    try {
      window.Android?.showBannerAd?.(view === 'content');
    } catch (_) {}
  }, [view]);

  useEffect(() => {
    window.handleNativeBackPressed = handleNativeBackPressed;
    window.showExitPopupFromNative = () => {
      handleNativeBackPressed();
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CLOSE_PDF_VIEWER') {
        setView('chapters');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.handleNativeBackPressed = undefined;
      window.showExitPopupFromNative = undefined;
      window.removeEventListener('message', handleMessage);
    };
  }, [handleNativeBackPressed]);

  const triggerComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleSubjectClick = (subject: Subject) => {
    refreshDownloadedChapters();
    setChapterFilter('all');
    setTimeout(() => {
      setCurrentSubject(subject);
      setGuideMode('guide');
      setView('chapters');
    }, 180);
  };

  const openChapterContent = (chapter: Chapter, subject: Subject) => {
    chapterClickCounter.current += 1;
    userActionCounterRef.current += 1;
    const openPdf = () => {
      try {
        window.Android?.showBannerAd?.(true);
      } catch (_) {}
      setCurrentSubject(subject);
      setCurrentChapter(chapter);
      setView('content');
      setIsSearchOpen(false);
      setSearchQuery('');
    };

    lastInterstitialActionRef.current = userActionCounterRef.current;
    lastInterstitialTsRef.current = Date.now();
    const actionKey = `open_pdf_${subject.id}_${chapter.id}_${chapterClickCounter.current}`;
    runWithInterstitial(actionKey, openPdf);
  };

  const startExternalDownload = (chapter: Chapter, subject: Subject) => {
    if (isOffline) {
      setShowNoInternetModal(true);
      return;
    }

    setDownloadingState({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      percent: 5,
      loadedMb: '0.1',
      totalMb: '',
    });

    const finishDownload = (success: boolean) => {
      setDownloadingState(null);
      if (success) {
        setDownloadedChapters(prev => {
          const next = new Set(prev);
          next.add(chapter.id);
          try {
            const list = JSON.parse(localStorage.getItem('downloaded_chapter_ids') || '[]');
            if (!list.includes(chapter.id)) {
              list.push(chapter.id);
              localStorage.setItem('downloaded_chapter_ids', JSON.stringify(list));
            }
          } catch (_) {}
          return next;
        });

        // Fully downloaded, now open immediately from phone storage
        openChapterContent(chapter, subject);
      } else {
        alert('অধ্যায় ডাউনলোড সম্পন্ন করা যায়নি। ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
      }
    };

    if (window.Android?.downloadPdf) {
      window.__onListDownloadComplete = (result: string | null) => {
        if (result && typeof result === 'string' && result.length > 0) {
          finishDownload(true);
        } else {
          finishDownload(false);
        }
      };

      try {
        window.Android.downloadPdf(chapter.id, chapter.pdfUrl, 'window.__onListDownloadComplete');
      } catch (e) {
        console.error('Android.downloadPdf error:', e);
        fallbackBrowserDownload(chapter, finishDownload);
      }
      return;
    }

    fallbackBrowserDownload(chapter, finishDownload);
  };

  const getDirectDownloadUrl = (url: string) => {
    if (!url) return '';
    const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m1) return `https://drive.usercontent.google.com/download?id=${m1[1]}&export=download&confirm=t`;
    const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return `https://drive.usercontent.google.com/download?id=${m2[1]}&export=download&confirm=t`;
    return url;
  };

  const fallbackBrowserDownload = (chapter: Chapter, onFinish: (success: boolean) => void) => {
    const directUrl = getDirectDownloadUrl(chapter.pdfUrl);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', directUrl, true);
    xhr.responseType = 'arraybuffer';

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        const loadedMb = (e.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = (e.total / (1024 * 1024)).toFixed(1);
        setDownloadingState(prev => prev ? { ...prev, percent, loadedMb, totalMb } : null);
      } else {
        const loadedMb = (e.loaded / (1024 * 1024)).toFixed(1);
        setDownloadingState(prev => prev ? { ...prev, percent: 50, loadedMb, totalMb: '' } : null);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 && xhr.response && xhr.response.byteLength > 2000) {
        try {
          const header = new Uint8Array(xhr.response, 0, 4);
          const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
          if (!isPdf) {
            onFinish(false);
            return;
          }

          const dbReq = indexedDB.open('Class7PdfCache', 1);
          dbReq.onupgradeneeded = (e: any) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('pdfs')) db.createObjectStore('pdfs');
          };
          dbReq.onsuccess = () => {
            const db = dbReq.result;
            const tx = db.transaction('pdfs', 'readwrite');
            const store = tx.objectStore('pdfs');
            store.put(xhr.response, chapter.id);
            tx.oncomplete = () => onFinish(true);
            tx.onerror = () => onFinish(false);
          };
          dbReq.onerror = () => onFinish(false);
        } catch (_) {
          onFinish(false);
        }
      } else {
        onFinish(false);
      }
    };

    xhr.onerror = () => onFinish(false);
    xhr.send();
  };

  const handleChapterClick = (chapter: Chapter, subject: Subject) => {
    const lr: LastReadChapter = {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectIcon: subject.icon,
      timestamp: Date.now(),
    };
    setLastReadChapter(lr);
    try {
      localStorage.setItem('class7_last_read_v1', JSON.stringify(lr));
    } catch (_) {}

    if (!chapter.pdfUrl || chapter.pdfUrl === "") {
      triggerComingSoon();
      return;
    }

    // Checking internet: MUST have active internet connection to open or download!
    // As requested: Even if downloaded, if there is no internet, do not open and show popup!
    const hasNet = navigator.onLine && (!window.Android?.isNetworkAvailable || window.Android.isNetworkAvailable());
    if (!hasNet) {
      setShowNoInternetModal(true);
      return;
    }

    const isDownloaded = downloadedChapters.has(chapter.id) ||
      Boolean(window.Android?.isPdfDownloaded && window.Android.isPdfDownloaded(chapter.id));

    // If already downloaded: show interstitial ad first, then open directly from phone memory!
    if (isDownloaded) {
      openChapterContent(chapter, subject);
      return;
    }

    // If not downloaded: show interstitial ad first, then download completely!
    const actionKey = `download_pdf_${subject.id}_${chapter.id}_${Date.now()}`;
    runWithInterstitial(actionKey, () => {
      startExternalDownload(chapter, subject);
    });
  };

  const handleToolClick = (toolId: ToolSubView) => {
    userActionCounterRef.current += 1;
    const openTool = () => {
      setActiveTool(toolId);
      setView('tools');
    };

    lastInterstitialActionRef.current = userActionCounterRef.current;
    lastInterstitialTsRef.current = Date.now();
    const actionKey = `open_tool_${toolId}_${Date.now()}`;
    runWithInterstitial(actionKey, openTool);
  };

  const handleBack = useCallback(() => {
    if (view === 'content') setView('chapters');
    else if (view === 'chapters' || view === 'tools' || view === 'model_test') { setView('subjects'); setCurrentSubject(null); }
    else if (view === 'subjects') setShowExitPopup(true);
  }, [view]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const exitApp = () => {
    if (window.Android?.exitApp) {
      window.Android.exitApp();
      return;
    }
    window.close();
  };

  const handleCalcInput = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === 'DEL') {
      setCalcDisplay(p => p.length > 1 ? p.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        let exp = calcDisplay
          .replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin((${a})*Math.PI/180)`)
          .replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos((${a})*Math.PI/180)`)
          .replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan((${a})*Math.PI/180)`)
          .replace(/sqrt\(([^)]+)\)/g, (_, a) => `Math.sqrt(${a})`)
          .replace(/log\(([^)]+)\)/g, (_, a) => `Math.log10(${a})`)
          .replace(/pi/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/%/g, '/100')
          .replace(/\^/g, '**');
        const res = Function(`"use strict"; return (${exp})`)();
        const formatted = Number.isFinite(res) ? Number(res.toFixed(4)).toString() : 'Error';
        setCalcHistory(prev => [`${calcDisplay} = ${formatted}`, ...prev.slice(0, 5)]);
        setCalcDisplay(formatted);
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(p => p === '0' || p === 'Error' ? val : p + val);
    }
  };

  const calculateBMI = () => {
    const w = parseFloat(bmiWeight), h = parseFloat(bmiHeight)/100;
    if (w > 0 && h > 0) {
      const bmi = w/(h*h);
      let s = '', c = '';
      if (bmi < 18.5) { s = 'স্বাভাবিকের চেয়ে কম (Underweight)'; c = 'text-yellow-500'; }
      else if (bmi < 25) { s = 'আদর্শ ওজন (Normal Weight)'; c = 'text-emerald-500'; }
      else if (bmi < 30) { s = 'অতিরিক্ত ওজন (Overweight)'; c = 'text-amber-500'; }
      else { s = 'স্থূলতা (Obese)'; c = 'text-red-500'; }
      setBmiResult({ value: bmi.toFixed(1), status: s, color: c });
    }
  };

  const convertUnits = () => {
    const v = parseFloat(convInput);
    if (isNaN(v)) return;

    if (converterType === 'length') {
      const l: any = { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34 };
      if (l[convFromUnit] && l[convToUnit]) setConvResult((v * l[convFromUnit] / l[convToUnit]).toFixed(4));
    } else if (converterType === 'weight') {
      const w: any = { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, lb: 0.453592, oz: 0.0283495 };
      if (w[convFromUnit] && w[convToUnit]) setConvResult((v * w[convFromUnit] / w[convToUnit]).toFixed(4));
    } else if (converterType === 'temp') {
      let c = v;
      if (convFromUnit === 'F') c = (v - 32) * (5 / 9);
      else if (convFromUnit === 'K') c = v - 273.15;

      let res = c;
      if (convToUnit === 'F') res = (c * 9 / 5) + 32;
      else if (convToUnit === 'K') res = c + 273.15;
      setConvResult(res.toFixed(2));
    } else if (converterType === 'data') {
      const d: any = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 };
      if (d[convFromUnit] && d[convToUnit]) setConvResult((v * d[convFromUnit] / d[convToUnit]).toFixed(4));
    }
  };

  const saveNote = () => {
    if (!noteInput.trim()) return;
    const newNote: SavedNote = {
      id: Date.now().toString(),
      text: noteInput.trim(),
      date: new Date().toLocaleString('bn-BD'),
      category: noteCategory
    };
    setSavedNotes([newNote, ...savedNotes]);
    setNoteInput('');
  };

  const deleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter(n => n.id !== id));
  };

  const lengthUnitOptions = [
    {v:'mm',l:'মিলিমিটার (mm)'},{v:'cm',l:'সেন্টিমিটার (cm)'},{v:'m',l:'মিটার (m)'},{v:'km',l:'কিলোমিটার (km)'},
    {v:'inch',l:'ইঞ্চি (Inch)'},{v:'ft',l:'ফুট (Foot)'},{v:'yard',l:'গজ (Yard)'},{v:'mile',l:'মাইল (Mile)'}
  ];
  const weightUnitOptions = [
    {v:'mg',l:'মিলিগ্রাম (mg)'},{v:'g',l:'গ্রাম (g)'},{v:'kg',l:'কিলোগ্রাম (kg)'},{v:'ton',l:'টন (Ton)'},
    {v:'lb',l:'পাউন্ড (Pound)'},{v:'oz',l:'আউন্স (Ounce)'}
  ];
  const tempUnitOptions = [
    {v:'C',l:'সেলসিয়াস (°C)'},{v:'F',l:'ফারেনহাইট (°F)'},{v:'K',l:'কেলভিন (K)'}
  ];
  const dataUnitOptions = [
    {v:'B',l:'বাইট (Byte)'},{v:'KB',l:'কিলোবাইট (KB)'},{v:'MB',l:'মেগাবাইট (MB)'},{v:'GB',l:'গিগাবাইট (GB)'},{v:'TB',l:'টেরাবাইট (TB)'}
  ];

  const toolItems = [
    { 
      id: 'grammar', 
      label: 'ইংরেজি ও বাংলা ব্যাকরণ', 
      desc: 'Parts of Speech, Tense, Voice, সন্ধি, কারক', 
      icon: <Languages size={22} className="text-emerald-400" />,
      bgClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    { 
      id: 'calculator', 
      label: 'সায়েন্টিফিক ক্যালকুলেটর', 
      desc: 'sin, cos, tan, sqrt, ঘাত ও হিস্ট্রি', 
      icon: <Calculator size={22} className="text-sky-400" />,
      bgClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    },
    { 
      id: 'timer', 
      label: 'পোমোডোরো স্টাডি টাইমার', 
      desc: '২৫/৫০ মিনিট ফোকাস স্টাডি ও ব্রেক', 
      icon: <TimerIcon size={22} className="text-amber-400" />,
      bgClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { 
      id: 'formulas', 
      label: 'গণিত ও বিজ্ঞান সূত্রাবলী', 
      desc: 'বীজগণিত, জ্যামিতি, পরিমিতি ও বিজ্ঞান', 
      icon: <Sigma size={22} className="text-purple-400" />,
      bgClass: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    },
    { 
      id: 'converter', 
      label: 'স্মার্ট ইউনিট কনভার্টার', 
      desc: 'দৈর্ঘ্য, ওজন, তাপমাত্রা, ডেটা ও বিএমআই', 
      icon: <RefreshCcw size={22} className="text-cyan-400" />,
      bgClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    },
    { 
      id: 'note', 
      label: 'কুইক স্টাডি নোটপ্যাড', 
      desc: 'টপিক অনুযায়ী নোট লেখা, শব্দ গণনা ও কপি', 
      icon: <StickyNote size={22} className="text-rose-400" />,
      bgClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    }
  ];

  return (
    <div className={`relative min-h-screen pb-36 overflow-x-hidden selection:bg-blue-200 transition-colors duration-200 ${
      themeMode === 'dark' 
        ? 'dark text-slate-100 bg-[#070b14]' 
        : themeMode === 'light'
          ? 'text-slate-900 bg-[#f1f5f9]'
          : 'text-blue-950'
    }`}>
      {/* Background graphic only under subjects in sky mode: user custom wallpaper */}
      {themeMode === 'sky' && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{ 
            backgroundImage: `url(${CLASS7_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1
          }}
        />
      )}
      {themeMode === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#070b14] transition-all duration-300" />
      )}
      {themeMode === 'light' && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#f1f5f9] transition-all duration-300" />
      )}

      <div className={`bird-container z-10 relative pointer-events-none ${themeMode === 'dark' ? 'opacity-20' : themeMode === 'light' ? 'opacity-25' : 'opacity-40'}`}>
        {[...Array(5)].map((_, i) => (<div key={i} className="bird" style={{ top: `${10 + i * 20}%`, animationDuration: `${16 + Math.random() * 8}s`, animationDelay: `${i * 2}s` }} />))}
      </div>

      {/* Theme Switch Toast Popup */}
      {themeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[12000] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="bg-slate-900/95 text-white px-4 py-2.5 rounded-full shadow-2xl border border-sky-400/50 text-xs font-black flex items-center gap-2">
            {themeToast}
          </div>
        </div>
      )}

      {/* 100% Solid Fixed Top Panel: Status Bar + Header + Welcome Banner Zone. All scrolling content underneath gets completely and sharply hidden! */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 pointer-events-auto border-b ${
          themeMode === 'dark'
            ? 'bg-[#070b14] border-sky-950/60 shadow-[0_6px_24px_rgba(0,0,0,0.6)]'
            : themeMode === 'light'
              ? 'bg-[#f1f5f9] border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
              : 'border-white/25 shadow-md'
        }`}
        style={themeMode === 'sky' ? {
          backgroundImage: `url(${CLASS7_BG})`,
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        } : undefined}
      >
        <div className="max-w-2xl mx-auto px-4 pt-2.5 pb-2.5">
          {/* Floating Header */}
          <header className={`h-14 floating-header flex items-center justify-between px-3 sm:px-4 py-2 transition-all ${
            themeMode === 'light'
              ? 'bg-[#f8fafc] border-2 border-slate-200 text-slate-900 shadow-xs'
              : themeMode === 'dark'
                ? 'bg-gradient-to-r from-[#090d16] via-[#0f172a] to-[#0369a1] text-white border border-sky-400/30 shadow-md'
                : 'bg-slate-900/50 backdrop-blur-md text-white border border-white/25 shadow-xl'
          }`}>
            <div className="flex items-center gap-2 shrink-0">
              {view === 'subjects' ? (
                <button 
                  onClick={toggleDrawer} 
                  className={`h-10 w-10 flex flex-col justify-center items-center gap-1.5 p-2 rounded-xl transition-transform active:scale-90 ${
                    themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200' : 'bg-white/10 hover:bg-white/20'
                  }`} 
                  aria-label="মেনু"
                >
                  <div className={`w-6 h-0.5 rounded-full ${themeMode === 'light' ? 'bg-slate-800' : 'bg-sky-100'}`}></div>
                  <div className={`w-4 h-0.5 rounded-full ${themeMode === 'light' ? 'bg-slate-800' : 'bg-sky-100'}`}></div>
                </button>
              ) : (
                <button 
                  onClick={handleBack} 
                  className={`h-10 w-10 flex items-center justify-center rounded-xl transition-transform active:scale-90 ${
                    themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`} 
                  aria-label="পেছনে যান"
                >
                  <ArrowLeft size={22}/>
                </button>
              )}
            </div>

            <div className="text-center flex-1 min-w-0 px-2">
              {view === 'chapters' && currentSubject ? (
                <>
                  <h1 className={`text-base font-black brand-font tracking-wide truncate ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    {currentSubject.name}
                  </h1>
                  <p className={`text-[9px] font-bold tracking-wider truncate ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>
                    {chapterFilter === 'favorite' ? '★ প্রিয় অধ্যায়সমূহ' : (guideMode === 'guide' ? 'মূল গাইড' : 'বিকল্প গাইড')} • সপ্তম শ্রেণী
                  </p>
                </>
              ) : view === 'model_test' ? (
                <>
                  <h1 className={`text-base font-black brand-font tracking-wide truncate ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    মডেল টেস্ট ও কুইজ
                  </h1>
                  <p className={`text-[9px] font-bold tracking-wider truncate ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>
                    ৩৫০টি এমসিকিউ ব্যাংক • সপ্তম শ্রেণী
                  </p>
                </>
              ) : (
                <>
                  <h1 className={`text-lg font-black brand-font tracking-wide ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    জ্ঞান সহায়তা
                  </h1>
                  <p className={`text-[9px] font-bold tracking-wider ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>
                    সপ্তম শ্রেণী • বাংলা মাধ্যম
                  </p>
                </>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {/* Header Theme Toggle Button (Sky / Light / Dark) */}
              <button
                type="button"
                onClick={toggleThemeMode}
                className={`h-10 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border active:scale-90 shadow-md ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                }`}
                title={`থিম পরিবর্তন (বর্তমান: ${themeMode === 'dark' ? 'ডার্ক' : themeMode === 'light' ? 'লাইট' : 'স্কাই ব্লু'})`}
              >
                {themeMode === 'dark' ? (
                  <>
                    <Moon size={16} className="text-sky-300 fill-sky-300" />
                    <span className="text-[11px] font-black brand-font leading-none">ডার্ক</span>
                  </>
                ) : themeMode === 'light' ? (
                  <>
                    <Sun size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-black brand-font leading-none text-slate-900">লাইট</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} className="text-sky-200 fill-sky-200" />
                    <span className="text-[11px] font-black brand-font leading-none">স্কাই</span>
                  </>
                )}
              </button>

              {view === 'chapters' && currentSubject ? (
                (() => {
                  const allChs = guideMode === 'guide' ? currentSubject.chapters : (currentSubject.altChapters || []);
                  const favCount = allChs.filter(c => favoriteChapters.includes(c.id)).length;
                  const isFavActive = chapterFilter === 'favorite';
                  return (
                    <button
                      type="button"
                      onClick={() => setChapterFilter(prev => prev === 'favorite' ? 'all' : 'favorite')}
                      className={`h-10 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-90 shadow-md ${
                        isFavActive
                          ? 'bg-amber-400 text-amber-950 ring-2 ring-white/90 shadow-amber-500/40'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/25'
                      }`}
                      title={isFavActive ? "সকল অধ্যায় দেখুন" : "প্রিয় অধ্যায় দেখুন"}
                    >
                      <Star
                        size={16}
                        className={isFavActive ? 'fill-amber-950 text-amber-950' : (favCount > 0 ? 'fill-amber-300 text-amber-300' : 'text-white')}
                      />
                      <span className="text-xs font-black brand-font leading-none">
                        {isFavActive ? 'সব' : 'প্রিয়'}
                        {favCount > 0 && ` (${favCount})`}
                      </span>
                    </button>
                  );
                })()
              ) : (
                <div className="h-10 w-10 bg-white/20 rounded-xl p-1 shadow-lg transition-transform active:scale-95 flex items-center justify-center">
                  <img src={LOGO_GIF} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </header>

          {/* Motivational Student Hero Banner: Fixed directly in the solid top panel in subjects view */}
          {view === 'subjects' && (
            <div className="mt-2.5 transition-all">
              <div className={`p-3.5 sm:p-4 rounded-3xl border relative overflow-hidden transition-all ${
                themeMode === 'light'
                  ? 'bg-gradient-to-br from-[#f8fafc] via-white to-[#edf2f7] border-2 border-slate-200/90 text-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.05)]'
                  : themeMode === 'dark'
                    ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0369a1] text-white border-sky-400/30 shadow-lg'
                    : 'bg-slate-900/50 backdrop-blur-md text-white border border-white/25 shadow-2xl'
              }`}>
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${
                        themeMode === 'light' 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-amber-400/30 text-amber-200 border-amber-300/40'
                      }`}>
                        সপ্তম শ্রেণী ২০২৬
                      </span>
                      <span className={`text-[10px] font-bold ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>
                        ★ অল গাইড
                      </span>
                    </div>
                    <h2 className={`text-base sm:text-lg font-black brand-font tracking-wide leading-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      স্বাগতম শিক্ষার্থী! 🎓
                    </h2>
                    <p className={`text-[10px] sm:text-[11px] font-medium leading-relaxed ${themeMode === 'light' ? 'text-slate-600' : 'text-sky-100/90'}`}>
                      সহজে যেকোনো অধ্যায় পড়ুন, অফলাইনে ডাউনলোড করে রাখুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className={`h-10 px-3.5 rounded-2xl flex items-center gap-1.5 border shadow-sm shrink-0 transition-all active:scale-95 ${
                      themeMode === 'light'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500 shadow-blue-500/20'
                        : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                    }`}
                  >
                    <Search size={15} className={themeMode === 'light' ? 'text-white' : 'text-sky-200'} />
                    <span className="text-xs font-black brand-font">খুঁজুন</span>
                  </button>
                </div>

                {/* Row: "মোট বিষয়" and "সর্বশেষ পঠিত অধ্যায়" */}
                <div className={`flex items-center gap-2 mt-2.5 pt-2.5 border-t ${
                  themeMode === 'light' ? 'border-slate-200' : 'border-white/15'
                }`}>
                  {/* মোট বিষয় (Kept as requested) */}
                  <div className={`rounded-2xl py-1.5 px-3 border shrink-0 text-center min-w-[74px] sm:min-w-[82px] ${
                    themeMode === 'light' ? 'bg-[#f8fafc] border-slate-200 shadow-2xs' : 'bg-black/35 border-white/10'
                  }`}>
                    <p className={`text-[8px] font-bold uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>মোট বিষয়</p>
                    <p className={`text-xs font-black leading-tight mt-0.5 ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{toBengaliDigits(Object.keys(SUBJECTS_DATA).length)} টি</p>
                  </div>

                  {/* সর্বশেষ পঠিত অধ্যায় (Replacing the other two cards) */}
                  {lastReadChapter ? (
                    <button
                      type="button"
                      onClick={() => {
                        const subj = (SUBJECTS_DATA as any)[lastReadChapter.subjectId];
                        if (subj) {
                          const ch = subj.chapters.find((c: Chapter) => c.id === lastReadChapter.chapterId) ||
                            (subj.altChapters || []).find((c: Chapter) => c.id === lastReadChapter.chapterId);
                          if (ch) {
                            handleChapterClick(ch, subj);
                          } else {
                            handleSubjectClick(subj);
                          }
                        }
                      }}
                      className={`flex-1 min-w-0 rounded-2xl py-1.5 px-2.5 border flex items-center justify-between gap-2 text-left transition-all active:scale-[0.98] group overflow-hidden ${
                        themeMode === 'light'
                          ? 'bg-gradient-to-r from-sky-50 via-white to-blue-50 border-sky-200 shadow-2xs hover:border-sky-300'
                          : 'bg-black/35 border-white/10 hover:bg-black/45'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-7 w-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 text-base">
                          {lastReadChapter.subjectIcon || '📖'}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            themeMode === 'light' ? 'text-sky-700' : 'text-sky-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block animate-pulse"></span>
                            সর্বশেষ পঠিত • {lastReadChapter.subjectName}
                          </p>
                          <p className={`text-xs font-black truncate leading-tight mt-0.5 ${
                            themeMode === 'light' ? 'text-slate-900' : 'text-white'
                          }`}>
                            {lastReadChapter.chapterTitle}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-xl shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        themeMode === 'light'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-sky-500/30 text-sky-200 border border-sky-400/30'
                      }`}>
                        পড়ুন →
                      </span>
                    </button>
                  ) : (
                    <div className={`flex-1 min-w-0 rounded-2xl py-1.5 px-2.5 border flex items-center gap-2 text-left ${
                      themeMode === 'light' ? 'bg-[#f8fafc] border-slate-200' : 'bg-black/35 border-white/10'
                    }`}>
                      <div className="h-7 w-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-sm">
                        📖
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[8px] font-bold uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-sky-200'}`}>
                          সর্বশেষ পঠিত
                        </p>
                        <p className={`text-[11px] font-bold truncate leading-tight ${themeMode === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                          যেকোনো অধ্যায়ে ক্লিক করে পড়া শুরু করুন
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fixed Subject Info & Guide Switch Tabs in Chapters View */}
          {view === 'chapters' && currentSubject && (
            <div className="mt-2 space-y-2 transition-all">
              {/* Subject Info Card */}
              <div className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                themeMode === 'light'
                  ? 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] border-2 border-slate-200/90 text-slate-900 shadow-sm'
                  : themeMode === 'dark'
                    ? 'bg-[#0f172a]/95 text-white border-sky-400/30 shadow-md'
                    : 'bg-slate-900/50 backdrop-blur-md text-white border border-white/25 shadow-xl'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 border ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                      : 'bg-white/25 border-white/40 text-white'
                  }`}>
                    {currentSubject.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className={`text-sm sm:text-base font-black brand-font leading-tight truncate ${
                      themeMode === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>{currentSubject.name}</h2>
                    <p className={`text-[10px] font-bold mt-0.5 flex items-center gap-1.5 ${
                      themeMode === 'light' ? 'text-slate-600' : 'text-sky-100/90'
                    }`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                      {(() => {
                        const allChs = [...currentSubject.chapters, ...(currentSubject.altChapters || [])];
                        const dCount = allChs.filter(c => downloadedChapters.has(c.id)).length;
                        return `${toBengaliDigits(dCount)} / ${toBengaliDigits(allChs.length)} টি ডাউনলোডকৃত`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guide Switch Tabs - Always Fixed at Top */}
              <div className={`p-1.5 rounded-2xl flex gap-1 border transition-all ${
                themeMode === 'light'
                  ? 'bg-[#e2e8f0]/90 border border-slate-300/80 shadow-inner'
                  : themeMode === 'dark'
                    ? 'bg-[#0f172a]/95 border-sky-950/60 shadow-md'
                    : 'bg-slate-900/50 backdrop-blur-md border border-white/25 shadow-xl'
              }`}>
                <button
                  type="button"
                  onClick={() => setGuideMode('guide')}
                  className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                    guideMode === 'guide'
                      ? (themeMode === 'light' ? 'bg-white text-blue-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200' : 'bg-sky-500 text-white shadow-md')
                      : (themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white')
                  }`}
                >
                  মূল গাইড
                </button>
                <button
                  type="button"
                  onClick={() => setGuideMode('altGuide')}
                  className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                    guideMode === 'altGuide'
                      ? (themeMode === 'light' ? 'bg-white text-blue-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200' : 'bg-blue-600 text-white shadow-md')
                      : (themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white')
                  }`}
                >
                  বিকল্প গাইড
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: Padding top ensures subjects start right below the solid fixed top zone */}
      <main className={`px-4 z-10 relative max-w-2xl mx-auto ${view === 'subjects' ? 'pt-[236px]' : view === 'chapters' ? 'pt-[195px]' : 'pt-[76px]'}`}>
        {view === 'subjects' && (
          <div className="space-y-4 pb-56 animate-in fade-in zoom-in-95 duration-500">
            {/* Subject Cards Grid with Rich Color Palettes & Soft Light-Mode Shades */}
            <div className="grid grid-cols-2 gap-3.5">
              {Object.values(SUBJECTS_DATA).map((s, sIdx) => {
                const totalChs = s.chapters.length;
                const dCount = s.chapters.filter(c => downloadedChapters.has(c.id)).length;
                
                // Rich distinct gradients for sky/dark mode
                const gradients = [
                  'from-sky-600 via-blue-700 to-indigo-800',
                  'from-indigo-600 via-purple-700 to-slate-900',
                  'from-emerald-600 via-teal-700 to-cyan-900',
                  'from-cyan-600 via-blue-700 to-sky-900',
                  'from-violet-600 via-purple-700 to-fuchsia-900',
                  'from-amber-600 via-orange-700 to-rose-900',
                  'from-teal-600 via-emerald-700 to-slate-900',
                  'from-blue-600 via-indigo-700 to-slate-900',
                  'from-rose-600 via-pink-700 to-purple-900',
                  'from-cyan-600 via-teal-700 to-emerald-900',
                  'from-amber-600 via-yellow-700 to-orange-900',
                  'from-fuchsia-600 via-pink-700 to-rose-900',
                  'from-emerald-600 via-cyan-700 to-blue-900',
                  'from-teal-700 via-emerald-800 to-slate-900',
                  'from-amber-700 via-orange-800 to-red-950',
                ];

                // Elegant distinct soft shades for white/light mode
                const lightSubjectGradients = [
                  'from-[#eff6ff] via-white to-[#dbeafe] border-blue-200/90 text-blue-950',
                  'from-[#eef2ff] via-white to-[#e0e7ff] border-indigo-200/90 text-indigo-950',
                  'from-[#ecfdf5] via-white to-[#d1fae5] border-emerald-200/90 text-emerald-950',
                  'from-[#ecfeff] via-white to-[#cffafe] border-cyan-200/90 text-cyan-950',
                  'from-[#f5f3ff] via-white to-[#ede9fe] border-purple-200/90 text-purple-950',
                  'from-[#fff7ed] via-white to-[#ffedd5] border-amber-200/90 text-amber-950',
                  'from-[#f0fdfa] via-white to-[#ccfbf1] border-teal-200/90 text-teal-950',
                  'from-[#eff6ff] via-white to-[#e0e7ff] border-sky-200/90 text-blue-950',
                  'from-[#fff1f2] via-white to-[#ffe4e6] border-rose-200/90 text-rose-950',
                  'from-[#ecfeff] via-white to-[#d1fae5] border-teal-200/90 text-teal-950',
                  'from-[#fefce8] via-white to-[#fef9c3] border-yellow-200/90 text-amber-950',
                  'from-[#fdf4ff] via-white to-[#fae8ff] border-fuchsia-200/90 text-fuchsia-950',
                ];

                const cardGrad = gradients[sIdx % gradients.length];
                const lightGrad = lightSubjectGradients[sIdx % lightSubjectGradients.length];

                return (
                  <button 
                    key={s.id} 
                    onClick={() => handleSubjectClick(s)} 
                    className={`subject-card-v3 py-4 px-3 flex flex-col items-center justify-between text-center min-h-[135px] group transition-all active:scale-[0.97] ${
                      themeMode === 'light'
                        ? `bg-gradient-to-br ${lightGrad} border-2 shadow-[0_4px_14px_rgba(15,23,42,0.07)] hover:shadow-md`
                        : `bg-gradient-to-br ${cardGrad} text-white shadow-lg border border-white/20`
                    }`}
                  >
                    {/* Top Glow & Badge */}
                    <div className="w-full flex items-center justify-between px-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        themeMode === 'light'
                          ? 'text-slate-700 bg-white/90 border-slate-300/80 shadow-2xs'
                          : 'text-white/80 bg-black/40 border-white/20'
                      }`}>
                        {toBengaliDigits(totalChs)} টি অধ্যায়
                      </span>
                      {dCount > 0 && (
                        <span className={`flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full border ${
                          themeMode === 'light'
                            ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                            : 'text-emerald-200 bg-emerald-900/60 border-emerald-400/40'
                        }`}>
                          <Check size={9} strokeWidth={3} /> {toBengaliDigits(dCount)}
                        </span>
                      )}
                    </div>

                    {/* Icon with glowing 3D depth */}
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center my-1 transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${
                      themeMode === 'light'
                        ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200'
                        : 'bg-white/20 border border-white/30 shadow-inner icon-glow'
                    }`}>
                      <div className="text-3xl icon-shadow">{s.icon}</div>
                    </div>

                    {/* Title */}
                    <span className={`text-[13px] font-black brand-font leading-tight px-1 ${
                      themeMode === 'light'
                        ? 'text-slate-900 drop-shadow-none'
                        : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                    }`}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === 'chapters' && currentSubject && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Active Favorite Filter Banner */}
            {chapterFilter === 'favorite' && (
              <div className={`border p-2.5 px-3.5 rounded-2xl flex items-center justify-between text-xs font-black shadow-sm animate-in fade-in duration-300 ${
                themeMode === 'light'
                  ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                  : themeMode === 'dark'
                    ? 'bg-amber-950/70 border-amber-600/40 text-amber-200'
                    : 'bg-amber-500/25 backdrop-blur-md border border-amber-300/40 text-white'
              }`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span className="truncate">শুধু প্রিয় অধ্যায়সমূহ দেখাচ্ছে</span>
                </div>
                <button
                  type="button"
                  onClick={() => setChapterFilter('all')}
                  className={`text-[11px] font-black px-2.5 py-1 rounded-lg border shadow-xs shrink-0 ml-2 transition-all ${
                    themeMode === 'light'
                      ? 'bg-white text-slate-900 border-amber-300'
                      : themeMode === 'dark'
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  সব অধ্যায় দেখুন
                </button>
              </div>
            )}

            {/* Chapter Items List */}
            {(() => {
              const allChs = guideMode === 'guide' ? currentSubject.chapters : (currentSubject.altChapters || []);
              const displayedChapters = chapterFilter === 'favorite'
                ? allChs.filter(c => favoriteChapters.includes(c.id))
                : allChs;

              if (chapterFilter === 'favorite' && displayedChapters.length === 0) {
                return (
                  <div className={`rounded-2xl p-7 text-center border shadow-sm space-y-2 ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : themeMode === 'dark'
                        ? 'bg-slate-900 border-slate-700/60 text-white'
                        : 'bg-white/20 backdrop-blur-md border border-white/35 text-white shadow-lg'
                  }`}>
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
                      <Star size={24} className="fill-amber-400" />
                    </div>
                    <h3 className={`text-sm font-black ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'}`}>কোনো প্রিয় অধ্যায় নেই</h3>
                    <p className={`text-xs leading-relaxed font-bold ${themeMode === 'dark' ? 'text-white/80' : 'text-slate-900'}`}>
                      অধ্যায়ের ডান পাশের স্টার (★) বাটনে চাপ দিয়ে যেকোনো অধ্যায় প্রিয় তালিকায় রাখুন।
                    </p>
                    <button
                      type="button"
                      onClick={() => setChapterFilter('all')}
                      className={`mt-2 px-4 py-2 text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform ${
                        themeMode === 'light'
                          ? 'bg-blue-700 text-white'
                          : themeMode === 'dark'
                            ? 'bg-sky-600 text-white'
                            : 'bg-sky-500 text-white shadow-sky-500/30'
                      }`}
                    >
                      সকল অধ্যায় দেখুন
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-3 pb-10">
                  {displayedChapters.map((c, idx) => {
                    const isDownloaded = downloadedChapters.has(c.id) ||
                      Boolean(window.Android?.isPdfDownloaded && window.Android.isPdfDownloaded(c.id));
                    const isFav = favoriteChapters.includes(c.id);
                    const isDownloadingThis = downloadingState?.chapterId === c.id;
                    const chapterNumStr = toBengaliDigits(c.id.split('.')[1] || (idx + 1));

                    return (
                      <div
                        key={c.id}
                        onClick={() => handleChapterClick(c, currentSubject)}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between border transition-all cursor-pointer active:scale-[0.98] ${
                          isFav ? 'ring-2 ring-amber-400' : ''
                        } ${
                          isDownloadingThis
                            ? (themeMode === 'light'
                                ? 'bg-sky-50 border-sky-300'
                                : themeMode === 'dark'
                                  ? 'bg-sky-950/60 border-sky-600'
                                  : 'bg-sky-100/35 backdrop-blur-md border border-sky-400/50 text-slate-950 animate-pulse shadow-sm')
                            : isDownloaded
                              ? (themeMode === 'light'
                                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300/80 shadow-[0_3px_10px_rgba(16,185,129,0.08)]'
                                  : themeMode === 'dark'
                                    ? 'bg-emerald-950/40 border-emerald-600/40 hover:bg-emerald-950/60 text-white'
                                    : 'bg-emerald-100/30 backdrop-blur-md border border-emerald-400/50 text-slate-950 hover:bg-emerald-100/40 shadow-sm')
                              : isFav
                                ? (themeMode === 'light'
                                    ? 'bg-gradient-to-r from-amber-50 via-yellow-50/50 to-amber-50 border-2 border-amber-300/80 shadow-[0_3px_10px_rgba(245,158,11,0.08)]'
                                    : themeMode === 'dark'
                                      ? 'bg-amber-950/40 border-amber-600/40 hover:bg-amber-950/60 text-white'
                                      : 'bg-amber-100/30 backdrop-blur-md border border-amber-400/50 text-slate-950 hover:bg-amber-100/40 shadow-sm')
                                : themeMode === 'light'
                                  ? 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] border-2 border-slate-200/90 hover:border-slate-300 hover:bg-slate-100/70 text-slate-900 shadow-[0_3px_12px_rgba(15,23,42,0.06)]'
                                  : themeMode === 'dark'
                                    ? 'bg-slate-900/90 border-slate-800 hover:bg-slate-850 text-white shadow-sm'
                                    : 'bg-white/30 backdrop-blur-md border border-white/40 text-slate-950 hover:bg-white/40 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className={`relative h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs border transition-colors ${
                            isDownloaded 
                              ? (themeMode === 'light'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : themeMode === 'dark'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                    : 'bg-emerald-200/50 text-emerald-950 border border-emerald-400/60')
                              : isDownloadingThis
                                ? (themeMode === 'light'
                                    ? 'bg-sky-200 text-sky-800 border-sky-300 animate-pulse'
                                    : themeMode === 'dark'
                                      ? 'bg-sky-950 text-sky-300 border-sky-700 animate-pulse'
                                      : 'bg-sky-200/50 text-sky-950 border border-sky-400/60 animate-pulse')
                                : isFav
                                  ? (themeMode === 'light'
                                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                                      : themeMode === 'dark'
                                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                                        : 'bg-amber-200/50 text-amber-950 border border-amber-400/60')
                                  : themeMode === 'light'
                                    ? 'bg-slate-100 text-slate-800 border-slate-200'
                                    : themeMode === 'dark'
                                      ? 'bg-slate-800 text-sky-300 border-slate-700'
                                      : 'bg-white/40 text-slate-950 border border-white/50'
                          }`}>
                            {chapterNumStr}
                            {isDownloaded && (
                              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
                                <Check size={10} strokeWidth={3.5} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-black text-left text-sm truncate ${
                                themeMode === 'dark' ? 'text-white' : 'text-slate-950'
                              }`}>{c.title}</span>
                              {isFav && (
                                <span className="text-[9px] font-black text-amber-950 bg-amber-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0 border border-amber-400">
                                  ★ প্রিয়
                                </span>
                              )}
                            </div>
                            {isDownloadingThis ? (
                              <span className={`flex items-center gap-1.5 text-[10px] font-black mt-0.5 ${
                                themeMode === 'dark' ? 'text-sky-300' : 'text-sky-950'
                              }`}>
                                <RefreshCcw size={11} className="animate-spin text-sky-700" />
                                ডাউনলোড হচ্ছে {toBengaliDigits(downloadingState?.percent || 0)}%...
                              </span>
                            ) : isDownloaded ? (
                              <span className={`flex items-center gap-1.5 text-[10px] font-black mt-0.5 ${
                                themeMode === 'dark' ? 'text-emerald-300' : 'text-emerald-950'
                              }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                                সংরক্ষিত (মেমোরি) • অফলাইনে পড়া যাবে
                              </span>
                            ) : (
                              <span className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${
                                themeMode === 'dark' ? 'text-slate-300' : 'text-slate-900'
                              }`}>
                                <Download size={11} className={themeMode === 'dark' ? 'text-slate-400' : 'text-slate-900'} />
                                ক্লিক করে ডাউনলোড ও পড়ুন
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {/* Favorite Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavoriteChapter(c.id, e)}
                            title={isFav ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় তালিকায় রাখুন"}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center active:scale-75 transition-all shadow-sm ${
                              isFav
                                ? 'bg-amber-100 text-amber-500 border border-amber-300'
                                : (themeMode === 'light'
                                    ? 'bg-slate-100 text-slate-700 hover:text-amber-500 border border-slate-300'
                                    : themeMode === 'dark'
                                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                      : 'bg-white/30 text-slate-700 hover:text-amber-500 border border-white/40')
                            }`}
                          >
                            <Star
                              size={17}
                              className={isFav ? "fill-amber-400 text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" : ""}
                            />
                          </button>

                          {isDownloadingThis ? (
                            <div className="h-9 w-9 rounded-xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-300 flex items-center justify-center shadow-xs">
                              <RefreshCcw size={16} className="animate-spin" />
                            </div>
                          ) : isDownloaded ? (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDownload(c.id, c.title, e)}
                              title="ডাউনলোড মুছে ফেলুন"
                              className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center active:scale-90 transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-xs ${
                              themeMode === 'light'
                                ? 'bg-sky-50 border border-sky-200 text-sky-600'
                                : themeMode === 'dark'
                                  ? 'bg-slate-800 border border-slate-700 text-sky-400'
                                  : 'bg-white/30 border border-white/40 text-slate-900'
                            }`}>
                              <Download size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {view === 'tools' && (
          <div className="animate-in fade-in duration-500 pb-20">
            {/* Top Tool Navigation & Switcher Header */}
            <div className={`flex items-center justify-between gap-3 mb-5 p-3 sm:p-4 rounded-[26px] border shadow-sm transition-all ${
              themeMode === 'light'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white/40 dark:bg-slate-800/80 border-white/50 dark:border-slate-700'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setView('subjects')} 
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs active:scale-90 transition-transform shrink-0 ${
                    themeMode === 'light' 
                      ? 'bg-white text-slate-800 border border-slate-200' 
                      : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-sky-300 border border-white/40 dark:border-slate-700'
                  }`}
                  title="হোমে ফিরুন"
                >
                  <ArrowLeft size={20}/>
                </button>
                <div className="min-w-0">
                  <h3 className={`font-black text-sm truncate brand-font ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-blue-950 dark:text-white'
                  }`}>
                    {toolItems.find(i => i.id === activeTool)?.label}
                  </h3>
                  <p className={`text-[10px] font-bold truncate ${
                    themeMode === 'light' ? 'text-slate-500' : 'text-blue-900/70 dark:text-sky-300/80'
                  }`}>
                    স্মার্ট সহায়ক শিক্ষণ টুলস
                  </p>
                </div>
              </div>

              {/* Tool Switcher Button that triggers the Tools Popup Modal */}
              <button
                type="button"
                onClick={() => setIsToolsPopupOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs shrink-0 shadow-xs active:scale-95 transition-all ${
                  themeMode === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-sky-600 text-white hover:bg-sky-500'
                }`}
              >
                <Wrench size={14} />
                <span>টুলস মেনু</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Active Tool Content Container */}
            <div className={`rounded-[32px] p-4 sm:p-6 min-h-[500px] shadow-xl pb-12 overflow-hidden transition-all ${
              themeMode === 'light'
                ? 'bg-white border border-slate-200 text-slate-900'
                : 'bg-white/95 dark:bg-slate-900/98 border border-white/60 dark:border-slate-800 text-blue-950 dark:text-white'
            }`}>
              
              {/* ================= 1. GRAMMAR TOOL ================= */}
              {activeTool === 'grammar' && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Category Pills Slider */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {COMPREHENSIVE_GRAMMAR.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setGrammarSelectedCat(cat.id)}
                        className={`px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all shrink-0 active:scale-95 flex items-center gap-1.5 ${
                          grammarSelectedCat === cat.id
                            ? (themeMode === 'light' ? 'bg-blue-600 text-white shadow-md' : 'bg-sky-600 text-white shadow-md')
                            : (themeMode === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800')
                        }`}
                      >
                        <span>{cat.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Category Header */}
                  {(() => {
                    const activeCat = COMPREHENSIVE_GRAMMAR.find(c => c.id === grammarSelectedCat) || COMPREHENSIVE_GRAMMAR[0];
                    return (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                          themeMode === 'light' ? 'bg-blue-50/70 border-blue-200' : 'bg-sky-950/40 border-sky-800/60'
                        }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white uppercase">
                                {activeCat.badge}
                              </span>
                              <h4 className="text-base font-black brand-font text-blue-950 dark:text-sky-200">
                                {activeCat.bengaliTitle}
                              </h4>
                            </div>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                              সপ্তম শ্রেণির বোর্ড বই ও পরীক্ষার জন্য বিস্তারিত নিয়ম ও উদাহরণ
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Languages size={22} />
                          </div>
                        </div>

                        {/* List of Grammar Items in Category */}
                        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-hide">
                          {activeCat.items.map((item, idx) => {
                            const isCopied = copiedId === item.title;
                            return (
                              <div 
                                key={idx} 
                                className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 transition-all ${
                                  themeMode === 'light'
                                    ? 'bg-slate-50/80 border-slate-200 hover:border-blue-300'
                                    : 'bg-slate-800/60 border-slate-700/80 hover:border-sky-500/50'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-sm font-black text-blue-900 dark:text-sky-300 brand-font">
                                      {item.title}
                                    </h5>
                                    {item.subtitle && (
                                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                        {item.subtitle}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => copyText(`${item.title}\n${item.explanation}\n${item.structure || ''}\n${item.examples.join('\n')}`, item.title)}
                                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition-all active:scale-95 ${
                                      isCopied
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                                    }`}
                                    title="নোট হিসেবে কপি করুন"
                                  >
                                    {isCopied ? <CheckCheck size={12} /> : <Copy size={12} />}
                                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                                  </button>
                                </div>

                                <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                                  {item.explanation}
                                </p>

                                {item.structure && (
                                  <div className={`p-3 rounded-xl border text-xs font-mono font-bold whitespace-pre-line leading-relaxed ${
                                    themeMode === 'light'
                                      ? 'bg-amber-50 text-amber-950 border-amber-200'
                                      : 'bg-amber-950/40 text-amber-200 border-amber-800/60'
                                  }`}>
                                    <span className="text-[10px] uppercase font-black text-amber-600 dark:text-amber-400 block mb-0.5">গঠন / স্ট্রাকচার:</span>
                                    {item.structure}
                                  </div>
                                )}

                                {item.examples && item.examples.length > 0 && (
                                  <div className="space-y-1.5 pt-1">
                                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-sky-400 block">
                                      উদাহরণ (Examples):
                                    </span>
                                    <div className="space-y-1.5">
                                      {item.examples.map((ex, exIdx) => (
                                        <div 
                                          key={exIdx} 
                                          className={`text-xs p-2.5 rounded-xl border-l-4 font-medium ${
                                            themeMode === 'light'
                                              ? 'bg-white border-blue-500 text-slate-800 shadow-xs'
                                              : 'bg-slate-900 border-sky-400 text-slate-200'
                                          }`}
                                        >
                                          {ex}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.tips && (
                                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-2">
                                    <Sparkles size={14} className="shrink-0 text-emerald-500" />
                                    <span>{item.tips}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ================= 2. ADVANCED SCIENTIFIC CALCULATOR ================= */}
              {activeTool === 'calculator' && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Calculation Display Screen */}
                  <div className={`p-5 rounded-3xl border shadow-inner flex flex-col justify-end min-h-[105px] text-right transition-all ${
                    themeMode === 'light'
                      ? 'bg-slate-100 text-slate-900 border-slate-200'
                      : 'bg-slate-950 text-sky-300 border-slate-800'
                  }`}>
                    <div className="text-xs font-mono opacity-50 truncate mb-1">
                      {calcHistory[0] || 'Scientific Calculator'}
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tight break-all">
                      {calcDisplay}
                    </div>
                  </div>

                  {/* Calculator History Tape (if any) */}
                  {calcHistory.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-[11px] font-mono opacity-75">
                      <span className="text-[9px] uppercase font-bold text-slate-400">হিস্ট্রি:</span>
                      {calcHistory.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 whitespace-nowrap shrink-0">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      'sin(', 'cos(', 'tan(', 'sqrt(', 'pi',
                      '(', ')', '^', '%', 'DEL',
                      '7', '8', '9', '/', 'C',
                      '4', '5', '6', '*', 'log(',
                      '1', '2', '3', '-', 'e',
                      '0', '.', '=', '+'
                    ].map(btn => {
                      const isAction = btn === '=' || btn === 'C' || btn === 'DEL';
                      const isFunc = ['sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'pi', 'e', '^', '%', '(', ')'].includes(btn);
                      const isColSpan2 = btn === '=';

                      return (
                        <button
                          key={btn}
                          onClick={() => handleCalcInput(btn)}
                          className={`p-3.5 rounded-xl font-bold text-sm transition-all active:scale-90 shadow-xs flex items-center justify-center ${
                            isColSpan2 ? 'col-span-2' : ''
                          } ${
                            btn === '='
                              ? 'bg-blue-600 text-white shadow-blue-500/30'
                              : btn === 'C' || btn === 'DEL'
                                ? 'bg-red-50 dark:bg-red-950/60 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900'
                                : isFunc
                                  ? 'bg-sky-100 dark:bg-slate-800 text-blue-900 dark:text-sky-300 text-xs font-black'
                                  : 'bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                          }`}
                        >
                          {btn === 'sqrt(' ? '√' : btn.replace('(', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= 3. POMODORO STUDY TIMER ================= */}
              {activeTool === 'timer' && (
                <div className="space-y-6 animate-in fade-in text-center py-2">
                  {/* Mode Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-xs mx-auto">
                    <button
                      onClick={() => { setTimerMode('pomodoro'); setIsTimerRunning(false); }}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                        timerMode === 'pomodoro' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      পোমোডোরো (Pomodoro)
                    </button>
                    <button
                      onClick={() => { setTimerMode('stopwatch'); setPomoIsRunning(false); }}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                        timerMode === 'stopwatch' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      স্টপওয়াচ
                    </button>
                  </div>

                  {timerMode === 'pomodoro' ? (
                    <div className="space-y-6">
                      {/* Presets */}
                      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                        {[
                          { label: '২৫ মি.', s: 25 * 60, mode: 'study' },
                          { label: '৫০ মি.', s: 50 * 60, mode: 'study' },
                          { label: '৫ মি. ব্রেক', s: 5 * 60, mode: 'break' },
                          { label: '১৫ মি. ব্রেক', s: 15 * 60, mode: 'break' }
                        ].map(p => (
                          <button
                            key={p.label}
                            onClick={() => {
                              setPomoPreset(p.s);
                              setPomoRemaining(p.s);
                              setPomoMode(p.mode as any);
                              setPomoIsRunning(false);
                            }}
                            className={`py-2 px-2 rounded-xl text-xs font-black border transition-all active:scale-95 ${
                              pomoPreset === p.s && pomoMode === p.mode
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Circular Timer Display */}
                      <div className="relative w-56 h-56 rounded-full border-[10px] border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center mx-auto shadow-2xl bg-sky-50 dark:bg-slate-950 overflow-hidden">
                        <div 
                          className="absolute inset-x-0 bottom-0 bg-blue-600/15 transition-all duration-1000"
                          style={{ height: `${((pomoPreset - pomoRemaining) / pomoPreset) * 100}%` }}
                        />
                        <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-sky-400 z-10 mb-1">
                          {pomoMode === 'study' ? '📖 মনোযোগ দিয়ে পড়ার সময়' : '☕ রিলাক্স / ব্রেক টাইম'}
                        </span>
                        <span className="text-5xl font-black text-blue-950 dark:text-white z-10 font-mono tracking-tight">
                          {formatTime(pomoRemaining)}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setPomoIsRunning(!pomoIsRunning)}
                          className={`h-14 px-8 rounded-2xl flex items-center gap-2 text-white font-black text-sm shadow-lg active:scale-95 transition-all ${
                            pomoIsRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {pomoIsRunning ? <SquareIcon size={18} /> : <Play size={18} className="fill-white" />}
                          <span>{pomoIsRunning ? 'বিরতি (Pause)' : 'শুরু করুন (Start)'}</span>
                        </button>
                        <button
                          onClick={() => { setPomoIsRunning(false); setPomoRemaining(pomoPreset); }}
                          className="h-14 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold active:scale-95 transition-all flex items-center justify-center"
                          title="রিসেট"
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>

                      {/* Completed Sessions Counter */}
                      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 max-w-sm mx-auto flex items-center justify-between text-xs font-bold text-blue-950 dark:text-sky-200">
                        <div className="flex items-center gap-2">
                          <Award size={18} className="text-amber-500" />
                          <span>আজকে সম্পন্ন সেশন:</span>
                        </div>
                        <span className="font-black text-sm text-blue-600 dark:text-sky-400">
                          {toBengaliDigits(pomoSessionsCompleted)} টি
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Stopwatch Mode */
                    <div className="space-y-6">
                      <div className="w-56 h-56 rounded-full border-[10px] border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center mx-auto shadow-2xl bg-sky-50 dark:bg-slate-950">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">স্টপওয়াচ সময়</span>
                        <span className="text-5xl font-black text-blue-950 dark:text-white font-mono">{formatTime(time)}</span>
                      </div>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            if (isTimerRunning) {
                              clearInterval(timerRef.current!);
                              setIsTimerRunning(false);
                            } else {
                              setIsTimerRunning(true);
                              timerRef.current = window.setInterval(() => setTime(t => t + 1), 1000);
                            }
                          }}
                          className={`h-14 px-8 rounded-2xl flex items-center gap-2 text-white font-black text-sm shadow-lg active:scale-95 transition-all ${
                            isTimerRunning ? 'bg-red-500' : 'bg-blue-600'
                          }`}
                        >
                          {isTimerRunning ? <SquareIcon size={18} /> : <Play size={18} className="fill-white" />}
                          <span>{isTimerRunning ? 'থামুন' : 'শুরু করুন'}</span>
                        </button>
                        <button
                          onClick={() => { clearInterval(timerRef.current!); setTime(0); setIsTimerRunning(false); }}
                          className="h-14 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold active:scale-95 transition-all"
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= 4. FORMULAS SHEET ================= */}
              {activeTool === 'formulas' && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Category Filter Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {EXPANDED_FORMULAS.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFormulaTab(cat.id as any)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                          formulaTab === cat.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>

                  {/* List of Formulas in selected category */}
                  <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-hide">
                    {EXPANDED_FORMULAS.find(c => c.id === formulaTab)?.items.map((item, idx) => {
                      const isCopied = copiedId === item.formula;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-xs transition-all ${
                            themeMode === 'light'
                              ? 'bg-slate-50 border-slate-200 hover:border-blue-300'
                              : 'bg-slate-800/80 border-slate-700 hover:border-sky-500'
                          }`}
                        >
                          <div>
                            {item.title && (
                              <p className="text-[10px] font-black uppercase text-blue-600 dark:text-sky-400 mb-1">
                                {item.title}
                              </p>
                            )}
                            <p className="text-base font-black font-mono tracking-tight text-blue-950 dark:text-white">
                              {item.formula}
                            </p>
                          </div>
                          <button
                            onClick={() => copyText(item.formula, item.formula)}
                            className={`p-2 rounded-xl border text-xs transition-all active:scale-90 ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                            }`}
                            title="কপি করুন"
                          >
                            {isCopied ? <CheckCheck size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= 5. SMART UNIT CONVERTER ================= */}
              {activeTool === 'converter' && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Category switcher */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'length', label: 'দৈর্ঘ্য' },
                      { id: 'weight', label: 'ভর / ওজন' },
                      { id: 'temp', label: 'তাপমাত্রা' },
                      { id: 'data', label: 'কম্পিউটার ডেটা' },
                      { id: 'bmi', label: 'বিএমআই (BMI)' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setConverterType(t.id as any); setConvResult(null); }}
                        className={`flex-1 min-w-[70px] py-2.5 text-xs font-black rounded-xl transition-all whitespace-nowrap px-2 ${
                          converterType === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {converterType === 'bmi' ? (
                    <div className="space-y-4 max-w-sm mx-auto">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500">ওজন (কিলোগ্রাম - KG)</label>
                        <input
                          type="number"
                          value={bmiWeight}
                          onChange={e => setBmiWeight(e.target.value)}
                          placeholder="উদাঃ 45"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500">উচ্চতা (সেন্টিমিটার - CM)</label>
                        <input
                          type="number"
                          value={bmiHeight}
                          onChange={e => setBmiHeight(e.target.value)}
                          placeholder="উদাঃ 150"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={calculateBMI}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all"
                      >
                        বিএমআই হিসাব করুন (Calculate)
                      </button>
                      {bmiResult && (
                        <div className="p-5 rounded-2xl text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 animate-in zoom-in-95">
                          <div className="text-4xl font-black text-blue-600 dark:text-sky-300 font-mono">
                            {bmiResult.value}
                          </div>
                          <div className={`text-xs font-black uppercase ${bmiResult.color}`}>
                            {bmiResult.status}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-sm mx-auto">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500">মান লিখুন</label>
                        <input
                          type="number"
                          value={convInput}
                          onChange={e => setConvInput(e.target.value)}
                          placeholder="1"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500">হতে (From)</label>
                          <select
                            value={convFromUnit}
                            onChange={e => setConvFromUnit(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-xs"
                          >
                            {(converterType === 'length' 
                              ? lengthUnitOptions 
                              : converterType === 'weight' 
                                ? weightUnitOptions 
                                : converterType === 'temp'
                                  ? tempUnitOptions
                                  : dataUnitOptions
                            ).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500">হবে (To)</label>
                          <select
                            value={convToUnit}
                            onChange={e => setConvToUnit(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-xs"
                          >
                            {(converterType === 'length' 
                              ? lengthUnitOptions 
                              : converterType === 'weight' 
                                ? weightUnitOptions 
                                : converterType === 'temp'
                                  ? tempUnitOptions
                                  : dataUnitOptions
                            ).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={convertUnits}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all"
                      >
                        রূপান্তর করুন (Convert)
                      </button>

                      {convResult && (
                        <div className="p-4 rounded-2xl text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-[9px] uppercase font-black text-slate-400">ফলাফল</span>
                          <div className="text-2xl font-black text-blue-600 dark:text-sky-300 font-mono">
                            {convResult} <span className="text-xs uppercase opacity-75">{convToUnit}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ================= 6. STUDY NOTEPAD ================= */}
              {activeTool === 'note' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-3">
                    {/* Category Tag Selector */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold">
                      <span className="text-[10px] text-slate-400 uppercase font-black">ট্যাগ:</span>
                      {['সাধারণ', 'গণিত', 'ইংরেজি', 'বিজ্ঞান', 'বাংলা'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setNoteCategory(tag)}
                          className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                            noteCategory === tag
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <textarea
                      className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:border-blue-500 font-medium text-slate-900 dark:text-white placeholder-slate-400 resize-none text-sm"
                      placeholder="এখানে গুরুত্বপূর্ণ নোট লিখুন..."
                      onChange={e => setNoteInput(e.target.value)}
                      value={noteInput}
                    />

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                      <span>শব্দ: {noteInput.trim() ? noteInput.trim().split(/\s+/).length : 0} | অক্ষর: {noteInput.length}</span>
                      <button
                        onClick={saveNote}
                        disabled={!noteInput.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-xs shadow-md disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Plus size={16} />
                        <span>নোট সংরক্ষণ</span>
                      </button>
                    </div>
                  </div>

                  {/* Saved Notes List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black uppercase text-slate-400">সংরক্ষিত নোটসমূহ ({savedNotes.length})</h5>
                    </div>

                    {savedNotes.length === 0 ? (
                      <div className="text-center py-10 opacity-30 flex flex-col items-center gap-2">
                        <StickyNote size={40} />
                        <p className="text-xs font-bold">কোনো নোট সংরক্ষিত নেই</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
                        {savedNotes.map(n => {
                          const isCopied = copiedId === n.id;
                          return (
                            <div
                              key={n.id}
                              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 space-y-2 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-sky-300">
                                  {n.category || 'সাধারণ'}
                                </span>
                                <span className="text-[10px] text-slate-400">{n.date}</span>
                              </div>
                              <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
                                {n.text}
                              </p>
                              <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                <button
                                  onClick={() => copyText(n.text, n.id)}
                                  className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                    isCopied ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'
                                  }`}
                                  title="কপি"
                                >
                                  {isCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
                                  <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                                </button>
                                <button
                                  onClick={() => deleteNote(n.id)}
                                  className="p-1.5 text-red-400 hover:text-red-500 rounded-lg transition-all"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {view === 'model_test' && (
          <ModelTestView 
            themeMode={themeMode}
            onBack={() => setView('subjects')}
          />
        )}
      </main>

      {/* Custom 'No Internet' Modal */}
      {showNoInternetModal && (
        <div className="fixed inset-0 bg-blue-950/90 z-[15000] flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[40px] w-full max-w-[340px] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 bg-amber-50 dark:bg-amber-950/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff size={40} className="text-amber-500"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 dark:text-white mb-4 brand-font leading-tight">ইন্টারনেট সংযোগ নেই!</h3>
            <p className="text-blue-900/60 dark:text-slate-300 font-bold text-xs mb-8 leading-relaxed px-2">
              পিডিএফ অথবা টুলস ব্যবহার করতে আপনার ডিভাইসে ইন্টারনেট কানেকশন প্রয়োজন। দয়া করে ইন্টারনেট চালু করুন।
            </p>
            <button 
              onClick={() => setShowNoInternetModal(false)} 
              className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* Edge-to-Edge PDF Viewer Outside Main Wrapper */}
      {view === 'content' && currentChapter && (
        <div className="fixed inset-0 bg-[#1a1e24] z-[9999] flex flex-col animate-in fade-in duration-300">
          <iframe 
            src={`./reader.html?id=${encodeURIComponent(currentChapter.id)}&title=${encodeURIComponent(currentChapter.title)}&url=${encodeURIComponent(currentChapter.pdfUrl)}`} 
            className="w-full h-full border-none m-0 p-0" 
            title={currentChapter.title}
            allow="fullscreen"
          />
        </div>
      )}

      {/* High-end Floating Update Coming Soon Notification */}
      {showComingSoon && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[11000] animate-in slide-in-from-top-6 fade-in duration-500 pointer-events-none">
          <div className="bg-blue-950/98 px-8 py-5 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 flex items-center gap-4">
            <div className="h-10 w-10 bg-sky-400/20 rounded-2xl flex items-center justify-center animate-bounce">
              <AlertCircle size={22} className="text-sky-300" />
            </div>
            <div className="text-left">
              <p className="text-white font-black text-sm tracking-tight leading-none mb-1">আপডেট শীঘ্রই আসছে</p>
              <p className="text-sky-300/50 text-[9px] font-bold uppercase tracking-[0.2em]">STAY TUNED WITH US</p>
            </div>
          </div>
        </div>
      )}

      {view !== 'content' && (
        <>
          {/* Fixed Bottom Backdrop Barrier: Completely hides all cards/subject names as they scroll down under/towards the bottom navigation bar */}
          <div 
            className={`fixed bottom-0 left-0 right-0 h-32 z-30 pointer-events-none transition-all duration-300 ${
              themeMode === 'dark'
                ? 'bg-gradient-to-t from-[#070b14] via-[#070b14]/98 to-transparent'
                : themeMode === 'light'
                  ? 'bg-gradient-to-t from-[#f1f5f9] via-[#f1f5f9]/98 to-transparent'
                  : 'hidden'
            }`} 
          />

          <div 
            className={`fixed bottom-0 left-0 right-0 z-40 pb-3 px-4 pt-1.5 pointer-events-none transition-all duration-300 border-t ${
              themeMode === 'dark'
                ? 'bg-[#070b14] border-white/5'
                : themeMode === 'light'
                  ? 'bg-[#f1f5f9] border-slate-200/90'
                  : 'border-white/20 shadow-md'
            }`}
            style={themeMode === 'sky' ? {
              backgroundImage: `url(${CLASS7_BG})`,
              backgroundPosition: 'bottom center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            } : undefined}
          >
            <nav className={`h-16 max-w-2xl mx-auto fixed-bottom-nav flex justify-around items-center px-2 pointer-events-auto transition-all ${
              themeMode === 'dark'
                ? 'bg-[#090d16] border border-slate-800'
                : themeMode === 'light'
                  ? 'bg-[#f8fafc] border-2 border-slate-200/90 text-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
                  : 'bg-slate-900/50 backdrop-blur-md border border-white/25 text-white shadow-2xl'
            }`}>
              <button onClick={() => setView('subjects')} className={`flex flex-col items-center gap-1 transition-all ${
                view === 'subjects'
                  ? (themeMode === 'light' ? 'text-blue-600 scale-110 font-black' : 'text-sky-200 scale-110 font-black')
                  : (themeMode === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-sky-100/60 hover:text-white')
              }`}>
                <Home size={20}/>
                <span className="text-[8px] font-bold uppercase tracking-tighter">Home</span>
              </button>
              <button onClick={() => setIsSearchOpen(true)} className={`flex flex-col items-center gap-1 transition-all ${
                isSearchOpen
                  ? (themeMode === 'light' ? 'text-blue-600 scale-110 font-black' : 'text-sky-200 scale-110 font-black')
                  : (themeMode === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-sky-100/60 hover:text-white')
              }`}>
                <Search size={20}/>
                <span className="text-[8px] font-bold uppercase tracking-tighter">Search</span>
              </button>
              <button 
                type="button"
                onClick={() => setView('model_test')} 
                className={`flex flex-col items-center gap-1 transition-all ${
                  view === 'model_test'
                    ? (themeMode === 'light' ? 'text-blue-600 scale-110 font-black' : 'text-sky-200 scale-110 font-black')
                    : (themeMode === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-sky-100/60 hover:text-white')
                }`}
                title="মডেল টেস্ট"
              >
                <ClipboardCheck size={20}/>
                <span className="text-[8px] font-bold uppercase tracking-tighter">Model Test</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsToolsPopupOpen(prev => !prev)} 
                className={`flex flex-col items-center gap-1 transition-all ${
                  isToolsPopupOpen || view === 'tools'
                    ? (themeMode === 'light' ? 'text-blue-600 scale-110 font-black' : 'text-sky-200 scale-110 font-black')
                    : (themeMode === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-sky-100/60 hover:text-white')
                }`}
                title="স্টাডি টুলস পপআপ"
              >
                <Wrench size={20}/>
                <span className="text-[8px] font-bold uppercase tracking-tighter">Tools</span>
              </button>
              <button onClick={() => {
                const url = "https://whatsapp.com/channel/0029VbBZ8m2A2pLJKBuQrK2L"
                window.Android?.openExternalUrl?.(url) ?? window.open(url, "_blank")
              }} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${
                themeMode === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-sky-100/60 hover:text-white'
              }`}>
                <Lightbulb size={20}/>
                <span className="text-[8px] font-bold uppercase tracking-tighter">Suggestion</span>
              </button>
            </nav>
          </div>

          {/* Interactive Tools Popup Bottom Sheet Modal */}
          {isToolsPopupOpen && (
            <div className="fixed inset-0 z-[7000] flex flex-col justify-end">
              {/* Dark Overlay Backdrop */}
              <div 
                onClick={() => setIsToolsPopupOpen(false)} 
                className="fixed inset-0 bg-blue-950/75 animate-in fade-in duration-200" 
              />

              {/* Popup Bottom Sheet Dialog */}
              <div 
                className={`relative z-10 w-full max-w-lg mx-auto rounded-t-[36px] p-6 pb-12 shadow-[0_-15px_40px_rgba(0,0,0,0.4)] border-t animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col ${
                  themeMode === 'dark'
                    ? 'bg-[#0f172a] text-white border-slate-700'
                    : themeMode === 'light'
                      ? 'bg-white text-slate-900 border-slate-200'
                      : 'bg-[#0369a1] text-white border-sky-400/40'
                }`}
              >
                {/* Drag Handle Indicator */}
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4 opacity-70" />

                {/* Header with Title and Close Button */}
                <div className="flex items-center justify-between pb-3.5 border-b border-black/10 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${
                      themeMode === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-white/15 text-sky-200'
                    }`}>
                      <Wrench size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-base brand-font tracking-wide">স্টাডি টুলস পপআপ</h3>
                      <p className={`text-[10px] font-bold ${
                        themeMode === 'light' ? 'text-slate-500' : 'text-sky-200/80'
                      }`}>
                        যেকোনো টুল সিলেক্ট করে দ্রুত পড়ালেখা শুরু করুন
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsToolsPopupOpen(false)}
                    className={`p-2 rounded-full transition-all active:scale-90 ${
                      themeMode === 'light' 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                    title="বন্ধ করুন"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Grid of 6 Advanced Tools */}
                <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-0.5 scrollbar-hide py-1">
                  {toolItems.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        handleToolClick(tool.id as ToolSubView);
                        setIsToolsPopupOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl flex flex-col text-left gap-2.5 border transition-all active:scale-95 group ${
                        activeTool === tool.id && view === 'tools'
                          ? (themeMode === 'light' 
                              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm' 
                              : 'bg-white/20 border-sky-300 ring-2 ring-sky-300/40')
                          : (themeMode === 'light' 
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 shadow-xs' 
                              : themeMode === 'dark'
                                ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                                : 'bg-white/10 hover:bg-white/15 border-white/15')
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-2.5 rounded-xl ${tool.bgClass}`}>
                          {tool.icon}
                        </div>
                        {activeTool === tool.id && view === 'tools' && (
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            themeMode === 'light' ? 'bg-blue-600 text-white' : 'bg-white text-blue-950 font-bold'
                          }`}>
                            সক্রিয়
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black line-clamp-1 group-hover:translate-x-0.5 transition-transform ${
                          themeMode === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {tool.label}
                        </h4>
                        <p className={`text-[10px] font-medium line-clamp-2 mt-0.5 leading-tight ${
                          themeMode === 'light' ? 'text-slate-500' : 'text-sky-100/75'
                        }`}>
                          {tool.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Extreme Zoom Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-blue-950/98 z-[8000] flex flex-col animate-in fade-in zoom-in-75 slide-in-from-bottom-12 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="flex flex-col p-6 h-full origin-center">
            <div className="flex gap-4 mb-10 mt-4 animate-in slide-in-from-top-6 duration-700 delay-150 fill-mode-both">
              <div className="relative flex-1 group">
                <input 
                  autoFocus 
                  type="text" 
                  placeholder="Search chapters..." 
                  className="w-full bg-white/10 border border-white/20 rounded-full py-5 pl-14 pr-6 text-white placeholder-sky-200/40 focus:outline-none focus:ring-4 focus:ring-sky-400/30 font-bold transition-all duration-300" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-white group-focus-within:scale-110 transition-all" size={24} />
              </div>
              <button 
                onClick={() => {setIsSearchOpen(false); setSearchQuery('');}} 
                className="p-4 bg-white/10 rounded-full text-white shadow-lg active:scale-75 active:rotate-180 transition-all duration-500 ease-out"
              >
                <X size={28}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-32 scrollbar-hide">
              {searchQuery.trim() === '' ? (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 gap-4 animate-in zoom-in-50 fade-in duration-1000">
                   <div className="p-8 rounded-full bg-white/5 border border-white/10">
                     <Search size={60} className="text-white animate-pulse"/>
                   </div>
                   <p className="text-white font-black tracking-[0.2em] uppercase text-[10px]">Start your search journey...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((res: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => handleChapterClick(res.chapter, res.subject)} 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-[28px] flex items-center justify-between group active:scale-[0.95] transition-all animate-in slide-in-from-bottom-10 duration-500 ease-out"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center icon-glow">
                        <div className="text-2xl group-hover:scale-110 transition-all duration-300">{res.subject.icon}</div>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-black text-sm mb-1 leading-tight group-hover:text-sky-300 transition-colors">{res.chapter.title}</p>
                        <p className="text-sky-300/40 text-[8px] font-black uppercase tracking-widest">{res.subject.name}</p>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                      <BookOpen size={18} className="text-sky-400 group-hover:text-white group-hover:rotate-12 transition-all" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="text-white font-black uppercase tracking-widest text-[10px]">Nothing matched your query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drawer Overlay */}
      <div className={`fixed inset-0 bg-blue-950/75 z-[5000] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleDrawer}>
        <div className={`absolute top-4 left-4 h-[calc(100%-32px)] w-[88%] max-w-[340px] drawer-card transition-transform duration-500 shadow-2xl flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-[110%]'}`} onClick={e=>e.stopPropagation()}>
          <div className="p-5 relative shrink-0">
            <button onClick={toggleDrawer} className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg active:scale-90 transition-transform"><X size={22}/></button>
            <div className="flex flex-col items-center text-center mt-1">
              <div className="h-12 w-12 bg-white rounded-2xl p-1.5 shadow-lg flex items-center justify-center mb-2">
                <img src={LOGO_GIF} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-black text-white brand-font tracking-tight leading-none mb-1">জ্ঞান সহায়তা</h3>
              <p className="text-sky-200/70 text-[10px] font-black uppercase tracking-[0.2em]">Class 7 Guide</p>
            </div>
          </div>
          
          <div className="px-6 pb-8 space-y-3 overflow-y-auto grow scrollbar-hide">
            {/* Drawer Theme Mode Selection Row (Sky, Light & Dark) */}
            <div className={`p-3.5 rounded-[22px] border space-y-2 ${
              themeMode === 'light'
                ? 'bg-slate-100 border-slate-200'
                : 'bg-white/10 dark:bg-slate-800/80 border-white/15 dark:border-slate-700/80'
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest px-1 ${
                themeMode === 'light' ? 'text-slate-600' : 'text-sky-200 dark:text-sky-300'
              }`}>
                অ্যাপ থিম (Theme)
              </p>
              <div className="grid grid-cols-3 gap-1.5 bg-black/25 dark:bg-black/40 p-1.5 rounded-xl border border-white/10 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('sky');
                    setThemeToast('🌊 ডিফল্ট স্কাই ব্লু মোড চালু হয়েছে');
                    setTimeout(() => setThemeToast(null), 2000);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex flex-col items-center justify-center gap-1 transition-all ${
                    themeMode === 'sky' ? 'bg-sky-500 text-white shadow-md ring-2 ring-white/60' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Sun size={15} className={themeMode === 'sky' ? 'fill-white' : ''} />
                  <span className="text-[9px]">স্কাই (ডিফল্ট)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('light');
                    setThemeToast('☀️ ফুল হোয়াইট লাইট মোড চালু হয়েছে');
                    setTimeout(() => setThemeToast(null), 2000);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex flex-col items-center justify-center gap-1 transition-all ${
                    themeMode === 'light' ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-white/60' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Sun size={15} className={themeMode === 'light' ? 'fill-slate-900' : ''} />
                  <span className="text-[9px]">ফুল হোয়াইট</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('dark');
                    setThemeToast('🌙 ফুল ডার্ক মোড চালু হয়েছে');
                    setTimeout(() => setThemeToast(null), 2000);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex flex-col items-center justify-center gap-1 transition-all ${
                    themeMode === 'dark' ? 'bg-slate-900 text-sky-400 shadow-md ring-2 ring-sky-400/50' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Moon size={15} className={themeMode === 'dark' ? 'fill-sky-400' : ''} />
                  <span className="text-[9px]">ফুল ডার্ক</span>
                </button>
              </div>
            </div>

            <button onClick={() => { setShowSourcesModal(true); setIsDrawerOpen(false); }} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <FileText size={18} className="text-sky-300"/> Disclaimer & Sources
            </button>
            <button onClick={() => { setIsDrawerOpen(false); openExternalLink(PLAY_STORE_URL); }} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <Star size={18} className="text-sky-300"/> Rate This App
            </button>
            <button onClick={() => { setShowPrivacyModal(true); setIsDrawerOpen(false); }} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <Shield size={18} className="text-sky-300"/> Privacy Policy
            </button>
            <button onClick={() => { setShowAdminPopup(true); setIsDrawerOpen(false); }} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <MessageCircle size={18} className="text-sky-300"/> Admin Support
            </button>
            <button onClick={() => {
              const url = "https://whatsapp.com/channel/0029VbBZ8m2A2pLJKBuQrK2L"
              openExternalLink(url)
            }} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <MessageCircle size={18} className="text-sky-300"/> Suggestion
            </button>
            <div className="pt-4 border-t border-white/10">
               <button onClick={() => setShowExitPopup(true)} className="flex items-center gap-4 w-full p-3.5 rounded-[20px] bg-red-500/20 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
                  <LogOut size={18} className="text-red-300"/> Exit App
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Support Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-blue-950/90 z-[9000] flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[40px] w-full max-w-[340px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-sky-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={30} className="text-blue-700 dark:text-sky-400"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 dark:text-white mb-4 brand-font leading-tight">Admin Support</h3>
            <p className="text-blue-900/60 dark:text-slate-300 font-bold text-xs mb-8 leading-relaxed px-2">
              যদি কোনো চ্যাপ্টার ওপেন হতে প্রবলেম হয় আমার সাথে যোগাযোগ করুন সাথে সাথে
            </p>
            <div className="space-y-3 mb-8">
              <a href="https://wa.me/qr/2BNZLW7EGN5NH1" target="_blank" className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">
                <MessageCircle size={18}/> WhatsApp
              </a>
              <a href="mailto:gyansohayota@gmail.com" className="flex items-center justify-center gap-3 w-full bg-blue-700 text-white py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">
                <Mail size={18}/> Gmail
              </a>
            </div>
            <button onClick={() => setShowAdminPopup(false)} className="w-full py-4 bg-sky-50 dark:bg-slate-800 text-blue-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-sky-100 dark:border-slate-700 active:bg-sky-100 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {showExitPopup && (
        <div className="fixed inset-0 bg-blue-950/90 z-[9000] flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[40px] w-full max-w-[320px] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-red-50 dark:bg-red-950/60 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut size={28} className="text-red-500 dark:text-red-400"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 dark:text-white mb-6 brand-font leading-tight">আপনি কি অ্যাপ থেকে বের হতে চান?</h3>
            <div className="space-y-3">
              <button onClick={() => {
                setShowExitPopup(false)
                openExternalLink(PLAY_STORE_URL)
              }} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">Rate This App</button>
              <div className="flex gap-4">
                <button onClick={() => setShowExitPopup(false)} className="flex-1 py-4 bg-sky-50 dark:bg-slate-800 text-blue-900 dark:text-white rounded-2xl font-black text-xs border border-sky-100 dark:border-slate-700">না</button>
                <button onClick={() => {
                  setShowExitPopup(false)
                  window.Android?.exitApp?.()
                }} className="flex-1 py-4 bg-blue-700 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">হ্যাঁ, বের হই</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-blue-950/90 z-[16000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[10px] w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 scrollbar-hide">
            <div className="text-center mb-6">
              <div className="text-green-800 dark:text-emerald-400 text-2xl font-black brand-font tracking-wide">PRIVACY POLICY</div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">Class 7 All Guide 2026</div>
            </div>

            <div className="space-y-6 text-blue-900 dark:text-slate-200 font-bold text-xs leading-relaxed">
               <p className="bg-sky-50 dark:bg-slate-800 p-4 rounded-2xl border border-sky-100 dark:border-slate-700 italic">
                 Gyan sohayota built the "Class 7 All Guide 2026" app as a free educational guide. This service is provided as-is.
               </p>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-sky-400 mb-1">
                    <Eye size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">1. Information We Handle</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                    We do not require you to create an account and we do not collect personal information directly. If you use the Notes feature, your notes are stored locally on your device and are not sent to us.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-sky-400 mb-1">
                    <FileText size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">2. WebView & Third-Party Content</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                    The app displays educational PDFs/flipbooks using a WebView. Some content may be loaded from third-party websites (for example SharePoint/Heyzine). Those websites may collect data under their own privacy policies.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-sky-400 mb-1">
                    <Lock size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">3. Permissions & Security</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                    The app uses Internet and Network State permissions to load online content and to check connectivity. If ads are enabled, the app may also use the Advertising ID permission (AD_ID) for advertising and fraud prevention. We try to keep data minimal, but no method of transmission over the internet is 100% secure.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-sky-400 mb-1">
                    <Info size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">4. Children’s Privacy & Ads</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                    This educational guide is intended for students. We do not knowingly collect personal information from children under 13. The app may show ads provided by Google AdMob. Ad providers may collect and use device information (such as Advertising ID), IP address, and usage data to serve and measure ads, and to prevent fraud. Please review Google’s policies for more information.
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-sky-400 mb-4">
                    <Mail size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">Contact Us</span>
                  </div>
                  <div className="bg-blue-700 text-white p-6 rounded-3xl shadow-xl">
                    <p className="text-[10px] opacity-80 mb-1 font-black uppercase tracking-widest">Support Email</p>
                    <p className="text-lg font-black tracking-tight">gyansohayota@gmail.com</p>
                  </div>
               </div>
            </div>
            
            <button onClick={() => setShowPrivacyModal(false)} className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-[6px] font-black mt-8 shadow-xl text-xs active:scale-95 transition-all uppercase tracking-widest">
              Agree
            </button>
          </div>
        </div>
      )}

      {/* Download Progress Modal */}
      {downloadingState && (
        <div className="fixed inset-0 z-[16000] bg-black/75 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-sky-100 dark:border-slate-800 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner">
              <Download size={30} className="animate-bounce" />
            </div>
            <div className="w-full space-y-1">
              <h3 className="text-base font-black text-blue-950 dark:text-white">অধ্যায় ডাউনলোড হচ্ছে</h3>
              <p className="text-xs font-bold text-sky-700 dark:text-sky-400 truncate px-2">{downloadingState.chapterTitle}</p>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">সম্পূর্ণ ডাউনলোড হওয়ার পর স্বয়ংক্রিয়ভাবে ওপেন হবে</p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.max(5, downloadingState.percent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-black text-slate-600 dark:text-slate-300 px-1">
                <span>{toBengaliDigits(downloadingState.percent)}%</span>
                <span>{downloadingState.loadedMb ? `${downloadingState.loadedMb}MB ${downloadingState.totalMb ? '/ ' + downloadingState.totalMb + 'MB' : ''}` : 'প্রস্তুত হচ্ছে...'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDownloadingState(null)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      )}

      {showSourcesModal && (
        <div className="fixed inset-0 bg-blue-950/90 z-[16000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[10px] w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 scrollbar-hide">
            <div className="text-center mb-6">
              <div className="text-green-800 dark:text-emerald-400 text-2xl font-black brand-font tracking-wide">DISCLAIMER</div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">Official Sources</div>
            </div>

            <div className="space-y-4 text-slate-800 dark:text-slate-200 font-bold text-xs leading-relaxed">
              <div className="bg-sky-50 dark:bg-slate-800 p-4 rounded-lg border border-sky-100 dark:border-slate-700">
                This app is an independent educational guide. It is <span className="font-black">not affiliated with, endorsed by, or representing</span> any government entity of Bangladesh.
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                Some educational content and references may relate to government/public education information. For the official and original sources, please use the links below:
              </div>

              <div className="space-y-2">
                <a className="block underline text-blue-700 dark:text-sky-400 break-all" href="https://nctb.gov.bd/" target="_blank" rel="noreferrer">https://nctb.gov.bd/</a>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                Note: PDFs/flipbooks may be displayed via third-party viewers (for example Heyzine). Those websites have their own privacy policies and terms.
              </div>
            </div>

            <button onClick={() => setShowSourcesModal(false)} className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-[6px] font-black mt-8 shadow-xl text-xs active:scale-95 transition-all uppercase tracking-widest">
              Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
