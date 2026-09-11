
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Menu, X, ArrowLeft, Home, Lightbulb, Search, Wrench, ChevronRight, Shield, MessageCircle, Star, LogOut, Calculator, StickyNote, Timer as TimerIcon, Play, Square as SquareIcon, RotateCcw, RefreshCcw, LayoutGrid, BookOpen, Save, Trash2, Plus, Sigma, Languages, Mail, AlertCircle, WifiOff, FileText, Lock, Eye, Info, Check, Download } from 'lucide-react';
import { SUBJECTS_DATA } from './constants';
import { ViewState, Subject, Chapter, GuideMode, ToolSubView, SavedNote } from './types';

declare global {
  interface Window {
    Android?: {
      triggerInterstitialAd?: () => void;
      triggerInterstitialAdWithAction?: (action: string) => void;
      openExternalUrl?: (url: string) => void;
      exitApp?: () => void;
      downloadPdf?: (chapterId: string, downloadUrl: string, callbackJs: string) => void;
      getPdfBase64?: (chapterId: string) => string | null;
      isPdfDownloaded?: (chapterId: string) => boolean;
      deletePdf?: (chapterId: string) => boolean;
      getDownloadedChapters?: () => string;
      onAppReady?: () => void;
    };
    showExitPopupFromNative?: () => void;
    onInterstitialDismissedFromNative?: (action: string) => void;
    __onDownloadProgress?: (percent: number, loadedMb: string, totalMb: string) => void;
    __onListDownloadComplete?: (result: string | null) => void;
  }
}

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
  const [noteInput, setNoteInput] = useState('');
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    const data = localStorage.getItem('user_notes_v3');
    return data ? JSON.parse(data) : [];
  });
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const chapterClickCounter = useRef(0);
  const userActionCounterRef = useRef(0);
  const lastInterstitialActionRef = useRef(-2);
  const lastInterstitialTsRef = useRef(0);
  const pendingActionRef = useRef<null | { key: string; run: () => void }>(null);
  const pendingActionTimerRef = useRef<number | null>(null);

  const ADS_ENABLED = false;

  // --- Converter States ---
  const [converterType, setConverterType] = useState<'bmi' | 'length' | 'weight'>('bmi');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<{ value: string; status: string; color: string } | null>(null);
  const [convInput, setConvInput] = useState('');
  const [convFromUnit, setConvFromUnit] = useState('m');
  const [convToUnit, setConvToUnit] = useState('cm');
  const [convResult, setConvResult] = useState<string | null>(null);

  // --- Math Formulas Data ---
  const MATH_FORMULAS = [
    {
      category: "Algebra",
      items: [
        { formula: "(a + b)² = a² + 2ab + b²" },
        { formula: "(a - b)² = a² - 2ab + b²" },
        { formula: "a² - b² = (a + b)(a - b)" },
        { formula: "(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca" }
      ]
    },
    {
      category: "Geometry",
      items: [
        { title: "Area of Square", formula: "A = s² (s = side)" },
        { title: "Area of Rectangle", formula: "A = l × w" },
        { title: "Area of Triangle", formula: "A = ½ × b × h" },
        { title: "Area of Circle", formula: "A = πr²" },
        { title: "Circumference of Circle", formula: "C = 2πr" }
      ]
    },
    {
      category: "Arithmetic",
      items: [
        { title: "Profit", formula: "Selling Price - Cost Price" },
        { title: "Loss", formula: "Cost Price - Selling Price" },
        { title: "Percentage (%)", formula: "(Value / Total) × 100" },
        { title: "Simple Interest", formula: "I = Pnr / 100" }
      ]
    }
  ];

  // --- English Grammar Data ---
  const GRAMMAR_RULES = [
    {
      category: "Tense (ক্রিয়া)",
      rules: [
        { title: "Present Indefinite", rule: "Subject + Verb(s/es) + Object", example: "He plays football." },
        { title: "Present Continuous", rule: "Subject + am/is/are + Verb+ing", example: "I am reading a book." },
        { title: "Past Indefinite", rule: "Subject + Verb(past form) + Object", example: "She went to school." },
        { title: "Future Indefinite", rule: "Subject + shall/will + Verb + Object", example: "They will win." }
      ]
    },
    {
      category: "Articles",
      rules: [
        { title: "Use of 'A'", rule: "ব্যবহৃত হয় Consonant এর আগে।", example: "A cat, A book." },
        { title: "Use of 'An'", rule: "ব্যবহৃত হয় Vowel (a, e, i, o, u) এর আগে।", example: "An apple, An egg." },
        { title: "Use of 'The'", rule: "নির্দিষ্ট কিছু বুঝাতে ব্যবহৃত হয়।", example: "The Padma, The Quran." }
      ]
    },
    {
      category: "Sentence (বাক্য)",
      rules: [
        { title: "Assertive", rule: "বিবৃতিমূলক বাক্য।", example: "Bangladesh is beautiful." },
        { title: "Interrogative", rule: "প্রশ্নবোধক বাক্য।", example: "What is your name?" },
        { title: "Imperative", rule: "আদেশ বা অনুরোধমূলক বাক্য।", example: "Open the door." }
      ]
    }
  ];

  useEffect(() => {
    localStorage.setItem('user_notes_v3', JSON.stringify(savedNotes));
  }, [savedNotes]);

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
    }, 3200)

    const bridge = window.Android
    if (bridge?.triggerInterstitialAdWithAction) {
      bridge.triggerInterstitialAdWithAction(actionKey)
      return
    }

    bridge?.triggerInterstitialAd?.()
  }

  const shouldShowInterstitialNow = () => {
    if (!ADS_ENABLED) return false
    const now = Date.now()
    const actionGapOk = (userActionCounterRef.current - lastInterstitialActionRef.current) >= 1
    const cooldownOk = (now - lastInterstitialTsRef.current) >= 20_000
    return actionGapOk && cooldownOk
  }

  useEffect(() => {
    window.showExitPopupFromNative = () => {
      setShowExitPopup(true);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CLOSE_PDF_VIEWER') {
        setView('chapters');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.showExitPopupFromNative = undefined;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
      setCurrentSubject(subject);
      setCurrentChapter(chapter);
      setView('content');
      setIsSearchOpen(false);
      setSearchQuery('');
    };

    if (!shouldShowInterstitialNow()) {
      openPdf();
      return;
    }

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

  const fallbackBrowserDownload = (chapter: Chapter, onFinish: (success: boolean) => void) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', chapter.pdfUrl, true);
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
      if (xhr.status === 200 && xhr.response) {
        try {
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
    if (!chapter.pdfUrl || chapter.pdfUrl === "") {
      triggerComingSoon();
      return;
    }

    const isDownloaded = downloadedChapters.has(chapter.id) ||
      Boolean(window.Android?.isPdfDownloaded && window.Android.isPdfDownloaded(chapter.id));

    if (isOffline && !isDownloaded) {
      setShowNoInternetModal(true);
      return;
    }

    // If already downloaded: NEVER re-download! Open directly from phone memory!
    if (isDownloaded) {
      openChapterContent(chapter, subject);
      return;
    }

    // If not downloaded: download completely from the outside first, then open!
    startExternalDownload(chapter, subject);
  };

  const handleToolClick = (toolId: ToolSubView) => {
    userActionCounterRef.current += 1;
    const openTool = () => {
      setActiveTool(toolId);
      setView('tools');
    }

    if (!shouldShowInterstitialNow()) {
      openTool()
      return
    }

    lastInterstitialActionRef.current = userActionCounterRef.current
    lastInterstitialTsRef.current = Date.now()
    const actionKey = `open_tool_${toolId}_${Date.now()}`
    runWithInterstitial(actionKey, openTool)
  };

  const handleBack = useCallback(() => {
    if (view === 'content') setView('chapters');
    else if (view === 'chapters' || view === 'tools') { setView('subjects'); setCurrentSubject(null); }
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
    if (val === 'C') setCalcDisplay('0');
    else if (val === '=') {
      try {
        let exp = calcDisplay.replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin((${a})*Math.PI/180)`)
                            .replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos((${a})*Math.PI/180)`)
                            .replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan((${a})*Math.PI/180)`)
                            .replace(/sqrt/g, 'Math.sqrt').replace(/pi/g, 'Math.PI').replace(/\^/g, '**');
        const res = Function(`"use strict"; return (${exp})`)();
        setCalcDisplay(Number.isFinite(res) ? Number(res.toFixed(4)).toString() : 'Error');
      } catch { setCalcDisplay('Error'); }
    } else setCalcDisplay(p => p === '0' || p === 'Error' ? val : p + val);
  };

  const calculateBMI = () => {
    const w = parseFloat(bmiWeight), h = parseFloat(bmiHeight)/100;
    if (w > 0 && h > 0) {
      const bmi = w/(h*h);
      let s = '', c = '';
      if (bmi < 18.5) { s = 'Underweight'; c = 'text-yellow-600'; }
      else if (bmi < 25) { s = 'Normal'; c = 'text-green-600'; }
      else if (bmi < 30) { s = 'Overweight'; c = 'text-orange-600'; }
      else { s = 'Obese'; c = 'text-red-600'; }
      setBmiResult({ value: bmi.toFixed(1), status: s, color: c });
    }
  };

  const convertUnits = () => {
    const v = parseFloat(convInput);
    if (isNaN(v)) return;
    const l: any = { mm: 0.001, cm: 0.01, m: 1, km: 1000, host: 1, inch: 0.0254, ft: 0.3048, mile: 1609.34 };
    const w: any = { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, lb: 0.453592, oz: 0.0283495 };
    const u = converterType === 'length' ? l : w;
    if (convFromUnit && convToUnit) setConvResult((v * u[convFromUnit] / u[convToUnit]).toFixed(4));
  };

  const saveNote = () => {
    if (!noteInput.trim()) return;
    const newNote: SavedNote = {
      id: Date.now().toString(),
      text: noteInput,
      date: new Date().toLocaleString('bn-BD')
    };
    setSavedNotes([newNote, ...savedNotes]);
    setNoteInput('');
  };

  const deleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter(n => n.id !== id));
  };

  const lengthUnitOptions = [{v:'mm',l:'Millimeter'},{v:'cm',l:'Centimeter'},{v:'m',l:'Meter'},{v:'km',l:'Kilometer'},{v:'inch',l:'Inch'},{v:'ft',l:'Foot'},{v:'mile',l:'Mile'}];
  const weightUnitOptions = [{v:'mg',l:'Milligram'},{v:'g',l:'Gram'},{v:'kg',l:'Kilogram'},{v:'ton',l:'Ton'},{v:'lb',l:'Pound'},{v:'oz',l:'Ounce'}];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: any[] = [];
    Object.values(SUBJECTS_DATA).forEach(s => {
      [...s.chapters, ...(s.altChapters || [])].forEach(c => {
        if (c.title.toLowerCase().includes(searchQuery.toLowerCase())) results.push({ chapter: c, subject: s });
      });
    });
    return results;
  }, [searchQuery]);

  const LOGO_GIF = window.Android
    ? "file:///android_asset/Image/sticker/logo.gif"
    : "./Image/sticker/logo.gif";
  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.gyansohayota.class7guide";

  const openExternalLink = (url: string) => {
    window.Android?.openExternalUrl?.(url) ?? window.open(url, "_blank")
  }

  const toolItems = [
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={20}/> },
    { id: 'grammar', label: 'Grammar', icon: <Languages size={20}/> },
    { id: 'formulas', label: 'Formulas', icon: <Sigma size={20}/> },
    { id: 'converter', label: 'Convert', icon: <RefreshCcw size={20}/> },
    { id: 'note', label: 'Notepad', icon: <StickyNote size={20}/> },
    { id: 'timer', label: 'Timer', icon: <TimerIcon size={20}/> }
  ];

  return (
    <div className="relative min-h-screen pb-32 overflow-x-hidden selection:bg-blue-200">
      <div className="bird-container">
        {[...Array(5)].map((_, i) => (<div key={i} className="bird" style={{ top: `${10 + i * 20}%`, animationDuration: `${16 + Math.random() * 8}s`, animationDelay: `${i * 2}s` }} />))}
      </div>

      <header className="fixed top-4 left-4 right-4 h-18 floating-header flex items-center justify-between px-4 sm:px-6 py-2">
        <div className="flex items-center gap-3 shrink-0">
          {view === 'subjects' ? (
            <button onClick={toggleDrawer} className="h-10 w-10 flex flex-col justify-center gap-1.5 p-2 bg-white/10 rounded-lg transition-transform active:scale-90">
              <div className="w-7 h-0.5 bg-sky-100 rounded-full"></div><div className="w-5 h-0.5 bg-sky-100 rounded-full"></div>
            </button>
          ) : (<button onClick={handleBack} className="h-10 w-10 flex items-center justify-center text-white bg-white/10 rounded-lg transition-transform active:scale-90"><ArrowLeft size={24}/></button>)}
        </div>
        <div className="text-center flex-1 min-w-0 px-2">
          {view === 'chapters' && currentSubject ? (
            <>
              <h1 className="text-base font-black text-white brand-font tracking-wide truncate">{currentSubject.name}</h1>
              <p className="text-[9px] font-bold text-sky-200 tracking-wider truncate">
                {chapterFilter === 'favorite' ? '★ প্রিয় অধ্যায়সমূহ' : (guideMode === 'guide' ? 'মূল গাইড' : 'বিকল্প গাইড')} • সপ্তম শ্রেণী
              </p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-black text-white brand-font tracking-wide">জ্ঞান সহায়তা</h1>
              <p className="text-[9px] font-bold text-sky-200 tracking-wider">সপ্তম শ্রেণী • বাংলা মাধ্যম</p>
            </>
          )}
        </div>
        <div className="shrink-0 flex items-center">
          {view === 'chapters' && currentSubject ? (
            (() => {
              const allChs = guideMode === 'guide' ? currentSubject.chapters : (currentSubject.altChapters || []);
              const favCount = allChs.filter(c => favoriteChapters.includes(c.id)).length;
              const isFavActive = chapterFilter === 'favorite';
              return (
                <button
                  type="button"
                  onClick={() => setChapterFilter(prev => prev === 'favorite' ? 'all' : 'favorite')}
                  className={`h-10 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-90 shadow-md ${
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
                    {isFavActive ? 'সব অধ্যায়' : 'প্রিয়'}
                    {favCount > 0 && ` (${favCount})`}
                  </span>
                </button>
              );
            })()
          ) : (
            <div className="h-12 w-12 bg-white/20 rounded-xl p-1 shadow-lg transition-transform active:scale-95">
              <img src={LOGO_GIF} className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </header>

      <main className="pt-24 px-4 z-10 relative max-w-2xl mx-auto">
        {view === 'subjects' && (
          <div className="space-y-4">
            <div className="animate-in slide-in-from-top-2 duration-500 mb-6">
                <div className="flex overflow-x-auto gap-2 py-4 px-1 scrollbar-hide snap-x snap-mandatory">
                  {toolItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => handleToolClick(item.id as ToolSubView)}
                      className="flex flex-col items-center justify-center gap-2 group flex-shrink-0 w-[23%] snap-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-md border border-white group-active:scale-90 transition-all duration-200 icon-glow">
                        {item.icon}
                      </div>
                      <span className="text-[7px] font-black text-blue-900 uppercase tracking-tighter opacity-70 text-center whitespace-nowrap">{item.label}</span>
                    </button>
                  ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pb-12 animate-in fade-in zoom-in-95 duration-500">
              {Object.values(SUBJECTS_DATA).map(s => (
                <button key={s.id} onClick={() => handleSubjectClick(s)} className="card-3d py-2.5 px-4 flex flex-col items-center justify-center gap-1.5 group">
                  <div className="h-10 w-10 flex items-center justify-center icon-glow">
                     <div className="text-3xl icon-shadow group-active:scale-110 transition-transform">{s.icon}</div>
                  </div>
                  <span className="text-[13px] font-black text-white text-center brand-font leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'chapters' && currentSubject && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Subject Header Card - Lower opacity bar */}
            <div className="bg-white/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-11 w-11 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner shrink-0 border border-white/40">
                  {currentSubject.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-blue-950 brand-font leading-tight truncate">{currentSubject.name}</h2>
                  <p className="text-[11px] font-bold text-blue-900/80 mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    {(() => {
                      const allChs = [...currentSubject.chapters, ...(currentSubject.altChapters || [])];
                      const dCount = allChs.filter(c => downloadedChapters.has(c.id)).length;
                      return `${dCount} / ${allChs.length} টি ডাউনলোডকৃত`;
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Guide Switch Tabs - Subtle translucent bar */}
            <div className="flex bg-white/20 backdrop-blur-md p-1 rounded-2xl gap-1 border border-white/25 shadow-sm">
              <button
                onClick={() => setGuideMode('guide')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                  guideMode === 'guide' ? 'bg-sky-600 text-white shadow-md' : 'text-blue-900/60 hover:text-blue-900'
                }`}
              >
                মূল গাইড
              </button>
              <button
                onClick={() => setGuideMode('altGuide')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                  guideMode === 'altGuide' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-900/60 hover:text-blue-900'
                }`}
              >
                বিকল্প গাইড
              </button>
            </div>

            {/* Active Favorite Filter Banner (if filter is active from header) */}
            {chapterFilter === 'favorite' && (
              <div className="bg-amber-400/25 backdrop-blur-md border border-amber-300/50 p-2.5 px-3.5 rounded-2xl flex items-center justify-between text-xs font-black text-blue-950 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Star size={14} className="fill-amber-500 text-amber-500 shrink-0" />
                  <span className="truncate">শুধু প্রিয় অধ্যায়সমূহ দেখাচ্ছে</span>
                </div>
                <button
                  type="button"
                  onClick={() => setChapterFilter('all')}
                  className="text-[11px] font-black text-blue-950 bg-white/70 hover:bg-white px-2.5 py-1 rounded-lg border border-amber-300/60 shadow-xs shrink-0 ml-2"
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
                  <div className="bg-white/30 backdrop-blur-md rounded-2xl p-7 text-center border border-white/40 shadow-sm space-y-2">
                    <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
                      <Star size={24} className="fill-amber-400" />
                    </div>
                    <h3 className="text-sm font-black text-blue-950">কোনো প্রিয় অধ্যায় নেই</h3>
                    <p className="text-xs text-blue-900/70 leading-relaxed">
                      অধ্যায়ের ডান পাশের স্টার (★) বাটনে চাপ দিয়ে যেকোনো অধ্যায় প্রিয় তালিকায় রাখুন।
                    </p>
                    <button
                      type="button"
                      onClick={() => setChapterFilter('all')}
                      className="mt-2 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform"
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
                        className={`w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all cursor-pointer active:scale-[0.98] ${
                          isFav ? 'ring-1 ring-amber-300' : ''
                        } ${
                          isDownloadingThis
                            ? 'bg-sky-50 border-sky-300'
                            : isDownloaded
                              ? 'bg-emerald-50/90 border-emerald-300/80 hover:bg-emerald-50'
                              : isFav
                                ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50/90'
                                : 'bg-white/90 border-sky-100/90 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className={`relative h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs border transition-colors ${
                            isDownloaded 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : isDownloadingThis
                                ? 'bg-sky-200 text-sky-800 border-sky-300 animate-pulse'
                                : isFav
                                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                                  : 'bg-sky-100 text-blue-800 border-sky-200'
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
                              <span className="text-blue-950 font-bold text-left text-sm truncate">{c.title}</span>
                              {isFav && (
                                <span className="text-[9px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                  ★ প্রিয়
                                </span>
                              )}
                            </div>
                            {isDownloadingThis ? (
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-sky-700 mt-0.5">
                                <RefreshCcw size={11} className="animate-spin text-sky-600" />
                                ডাউনলোড হচ্ছে {toBengaliDigits(downloadingState?.percent || 0)}%...
                              </span>
                            ) : isDownloaded ? (
                              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                সংরক্ষিত (মেমোরি) • অফলাইনে পড়া যাবে
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                                <Download size={11} />
                                ক্লিক করে ডাউনলোড ও পড়ুন
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {/* Favorite (Priyo) Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavoriteChapter(c.id, e)}
                            title={isFav ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় তালিকায় রাখুন"}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center active:scale-75 transition-all shadow-sm ${
                              isFav
                                ? 'bg-amber-100 text-amber-500 border border-amber-300'
                                : 'bg-slate-50 hover:bg-amber-50 text-slate-300 hover:text-amber-400 border border-slate-200'
                            }`}
                          >
                            <Star
                              size={17}
                              className={isFav ? "fill-amber-400 text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" : ""}
                            />
                          </button>

                          {isDownloadingThis ? (
                            <div className="h-9 w-9 rounded-xl bg-sky-100 border border-sky-300 text-sky-600 flex items-center justify-center shadow-xs">
                              <RefreshCcw size={16} className="animate-spin" />
                            </div>
                          ) : isDownloaded ? (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDownload(c.id, c.title, e)}
                              title="ডাউনলোড মুছে ফেলুন"
                              className="h-9 w-9 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 flex items-center justify-center active:scale-90 transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
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
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6 bg-white/40 p-3 rounded-[30px] border border-white shadow-sm">
                <button onClick={() => setView('subjects')} className="h-11 w-11 bg-white rounded-full flex items-center justify-center text-blue-700 shadow-sm active:scale-90 transition-transform"><ArrowLeft size={20}/></button>
                <div className="flex-1">
                  <h3 className="font-black text-blue-900 text-xs uppercase tracking-widest">{toolItems.find(i => i.id === activeTool)?.label}</h3>
                  <p className="text-[8px] font-bold text-blue-900/40 uppercase">Utility Tool</p>
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-[36px] p-6 min-h-[480px] shadow-2xl border-2 border-white/50 pb-12 overflow-hidden animate-in zoom-in-95 duration-500">
              {activeTool === 'calculator' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-sky-50 p-6 rounded-[28px] text-right text-3xl font-black text-blue-900 h-24 flex items-center justify-end border border-sky-100 shadow-inner">{calcDisplay}</div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {['sin(', 'cos(', 'tan(', 'sqrt(', 'pi', '^', '(', ')', '7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                      <button key={btn} onClick={() => handleCalcInput(btn)} className={`p-4 rounded-xl font-bold transition-all active:scale-90 ${['sin(','cos(','tan(','sqrt(','pi','^','(',')'].includes(btn) ? 'bg-sky-100 text-blue-900 text-[10px]' : btn === 'C' ? 'bg-red-50 text-red-500' : btn === '=' ? 'bg-blue-700 text-white' : 'bg-white border border-sky-50 text-blue-900 shadow-sm'}`}>{btn.replace('(','')}</button>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'grammar' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {GRAMMAR_RULES.map((cat, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="text-blue-900 font-black text-[10px] uppercase tracking-widest px-2 border-l-4 border-blue-700">{cat.category}</h4>
                        <div className="grid gap-3">
                          {cat.rules.map((item, rIdx) => (
                            <div key={rIdx} className="bg-white border border-sky-50 p-4 rounded-2xl shadow-sm">
                              <p className="text-blue-700 text-[10px] font-black uppercase mb-1">{item.title}</p>
                              <p className="text-blue-900 font-bold text-sm mb-2">{item.rule}</p>
                              <div className="bg-sky-50 p-2 rounded-lg border-l-2 border-sky-200">
                                <p className="text-blue-900/60 text-[9px] font-mono"><span className="font-black">Ex:</span> {item.example}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'formulas' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {MATH_FORMULAS.map((cat, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="text-blue-900 font-black text-[10px] uppercase tracking-widest px-2 border-l-4 border-blue-700">{cat.category}</h4>
                        <div className="grid gap-3">
                          {cat.items.map((item, iIdx) => (
                            <div key={iIdx} className="bg-white border border-sky-50 p-4 rounded-2xl shadow-sm">
                              {item.title && <p className="text-blue-300 text-[8px] font-black uppercase mb-1">{item.title}</p>}
                              <p className="text-blue-900 font-black text-lg font-mono tracking-tight">{item.formula}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'converter' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="flex bg-sky-100/50 p-1.5 rounded-2xl">
                    {['bmi', 'length', 'weight'].map(t => (
                      <button key={t} onClick={() => { setConverterType(t as any); setConvResult(null); }} className={`flex-1 py-3 text-[9px] font-black rounded-xl transition-all ${converterType === t ? 'bg-blue-700 text-white shadow-lg' : 'text-blue-900/40'}`}>{t.toUpperCase()}</button>
                    ))}
                  </div>
                  {converterType === 'bmi' ? (
                    <div className="space-y-4">
                      <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} placeholder="Weight (KG)" className="w-full bg-white border-2 border-sky-50 p-4 rounded-xl focus:outline-none font-bold" />
                      <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} placeholder="Height (CM)" className="w-full bg-white border-2 border-sky-50 p-4 rounded-xl focus:outline-none font-bold" />
                      <button onClick={calculateBMI} className="w-full bg-blue-700 text-white py-4 rounded-xl font-black shadow-xl">Calculate BMI</button>
                      {bmiResult && <div className="bg-sky-50 p-6 rounded-[28px] text-center mt-4"><h4 className="text-4xl font-black text-blue-900">{bmiResult.value}</h4><p className={`font-black text-xs uppercase tracking-widest ${bmiResult.color}`}>{bmiResult.status}</p></div>}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <input type="number" value={convInput} onChange={e => setConvInput(e.target.value)} placeholder="Enter value" className="w-full bg-white border-2 border-sky-50 p-4 rounded-xl focus:outline-none font-bold" />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={convFromUnit} onChange={e => setConvFromUnit(e.target.value)} className="w-full bg-white border-2 border-sky-50 p-4 rounded-xl font-bold text-xs appearance-none">
                          {(converterType === 'length' ? lengthUnitOptions : weightUnitOptions).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                        <select value={convToUnit} onChange={e => setConvToUnit(e.target.value)} className="w-full bg-white border-2 border-sky-50 p-4 rounded-xl font-bold text-xs appearance-none">
                          {(converterType === 'length' ? lengthUnitOptions : weightUnitOptions).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </div>
                      <button onClick={convertUnits} className="w-full bg-blue-700 text-white py-4 rounded-xl font-black shadow-xl">Convert</button>
                      {convResult && <div className="bg-sky-50 p-6 rounded-[28px] text-center mt-4"><h4 className="text-2xl font-black text-blue-900">{convResult} <span className="text-xs uppercase opacity-40 font-bold">{convToUnit}</span></h4></div>}
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'timer' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-10 animate-in fade-in">
                  <div className="h-52 w-52 rounded-full border-[10px] border-white flex items-center justify-center bg-sky-50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-700 opacity-10" style={{ height: `${(time % 60) * 1.66}%`, top: 'auto', bottom: 0 }}></div>
                    <span className="text-5xl font-black text-blue-900 z-10 font-mono">{formatTime(time)}</span>
                  </div>
                  <div className="flex gap-6">
                    <button onClick={() => { if(isTimerRunning){ clearInterval(timerRef.current!); setIsTimerRunning(false); } else { setIsTimerRunning(true); timerRef.current = window.setInterval(()=>setTime(t=>t+1),1000); } }} className={`h-16 w-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${isTimerRunning ? 'bg-red-500' : 'bg-blue-700'}`}>{isTimerRunning ? <SquareIcon size={24}/> : <Play size={24} className="ml-1"/>}</button>
                    <button onClick={() => { clearInterval(timerRef.current!); setTime(0); setIsTimerRunning(false); }} className="h-16 w-16 bg-white border border-sky-50 text-blue-900 rounded-full flex items-center justify-center shadow-md"><RotateCcw size={24}/></button>
                  </div>
                </div>
              )}

              {activeTool === 'note' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <textarea 
                      className="w-full h-36 bg-white border-2 border-sky-50 p-5 rounded-[28px] focus:outline-none focus:border-blue-500 font-bold text-blue-900 resize-none shadow-sm text-sm" 
                      placeholder="Type your note here..." 
                      onChange={e => setNoteInput(e.target.value)} 
                      value={noteInput} 
                    />
                    <button onClick={saveNote} className="w-full bg-blue-700 text-white py-3.5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <Plus size={20} /> Save Note
                    </button>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-sky-50">
                    <h5 className="text-[9px] font-black text-blue-900/30 uppercase tracking-widest px-2">Notebook ({savedNotes.length})</h5>
                    {savedNotes.length === 0 ? (
                      <div className="text-center py-12 opacity-10 flex flex-col items-center gap-2"><StickyNote size={48} /><p className="text-[10px] font-black uppercase">No saved data</p></div>
                    ) : (
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                        {savedNotes.map(note => (
                          <div key={note.id} className="bg-white border border-sky-50 p-5 rounded-[24px] shadow-sm animate-in slide-in-from-bottom-2">
                             <p className="text-blue-900 font-bold text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
                             <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-50">
                               <span className="text-[8px] font-bold text-blue-300">{note.date}</span>
                               <button onClick={() => deleteNote(note.id)} className="text-red-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Custom 'No Internet' Modal */}
      {showNoInternetModal && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-2xl z-[15000] flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] w-full max-w-[340px] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff size={40} className="text-amber-500"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-4 brand-font leading-tight">ইন্টারনেট সংযোগ নেই!</h3>
            <p className="text-blue-900/60 font-bold text-xs mb-8 leading-relaxed px-2">
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
          <div className="bg-blue-950/95 backdrop-blur-[30px] px-8 py-5 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 flex items-center gap-4">
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
        <nav className="fixed bottom-3 left-8 right-8 h-16 fixed-bottom-nav flex justify-around items-center px-4">
          <button onClick={() => setView('subjects')} className={`flex flex-col items-center gap-1 transition-all ${view==='subjects'?'text-sky-300 scale-110':'text-sky-100/30'}`}><Home size={22}/><span className="text-[8px] font-bold uppercase tracking-tighter">Home</span></button>
          <button onClick={() => {
            const url = "https://whatsapp.com/channel/0029VbBZ8m2A2pLJKBuQrK2L"
            window.Android?.openExternalUrl?.(url) ?? window.open(url, "_blank")
          }} className="flex flex-col items-center gap-1 text-sky-100/30 active:scale-95 transition-all"><Lightbulb size={22}/><span className="text-[8px] font-bold uppercase tracking-tighter">Suggestion</span></button>
          <button onClick={() => setIsSearchOpen(true)} className={`flex flex-col items-center gap-1 transition-all ${isSearchOpen?'text-sky-300 scale-110':'text-sky-100/30'}`}><Search size={22}/><span className="text-[8px] font-bold uppercase tracking-tighter">Search</span></button>
          <button onClick={() => handleToolClick(activeTool)} className={`flex flex-col items-center gap-1 transition-all ${view==='tools'?'text-sky-300 scale-110':'text-sky-100/30'}`}><Wrench size={22}/><span className="text-[8px] font-bold uppercase tracking-tighter">Tools</span></button>
        </nav>
      )}

      {/* Extreme Zoom Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-blue-950/98 backdrop-blur-[40px] z-[8000] flex flex-col animate-in fade-in zoom-in-75 slide-in-from-bottom-12 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
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
      <div className={`fixed inset-0 bg-blue-950/60 backdrop-blur-md z-[5000] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleDrawer}>
        <div className={`absolute top-4 left-4 h-[calc(100%-32px)] w-[88%] max-w-[340px] drawer-card transition-transform duration-500 shadow-2xl flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-[110%]'}`} onClick={e=>e.stopPropagation()}>
          <div className="p-8 relative shrink-0">
            <button onClick={toggleDrawer} className="absolute top-8 right-8 text-white/50"><X size={30}/></button>
            <div className="flex flex-col items-center text-center mt-6">
              <div className="h-20 w-20 bg-white rounded-[32px] p-3 shadow-xl flex items-center justify-center mb-6">
                <img src={LOGO_GIF} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-black text-white brand-font tracking-tight leading-none mb-1">জ্ঞান সহায়তা</h3>
              <p className="text-sky-200/60 text-[10px] font-black uppercase tracking-[0.2em]">Class 7 Guide</p>
            </div>
          </div>
          
          <div className="px-6 pb-10 space-y-3 overflow-y-auto grow scrollbar-hide">
            <button onClick={() => { setShowSourcesModal(true); setIsDrawerOpen(false); }} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <FileText size={20} className="text-sky-300"/> Disclaimer & Sources
            </button>
            <button onClick={() => { setIsDrawerOpen(false); openExternalLink(PLAY_STORE_URL); }} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <Star size={20} className="text-sky-300"/> Rate This App
            </button>
            <button onClick={() => { setShowPrivacyModal(true); setIsDrawerOpen(false); }} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <Shield size={20} className="text-sky-300"/> Privacy Policy
            </button>
            <button onClick={() => { setShowAdminPopup(true); setIsDrawerOpen(false); }} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <MessageCircle size={20} className="text-sky-300"/> Admin Support
            </button>
            <button onClick={() => {
              const url = "https://whatsapp.com/channel/0029VbBZ8m2A2pLJKBuQrK2L"
              openExternalLink(url)
            }} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-white/10 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
               <MessageCircle size={20} className="text-sky-300"/> Suggestion
            </button>
            <div className="pt-6 border-t border-white/10">
               <button onClick={() => setShowExitPopup(true)} className="flex items-center gap-5 w-full p-4 rounded-[22px] bg-red-500/20 text-white font-black text-xs border border-white/5 active:scale-95 transition-all">
                  <LogOut size={20} className="text-red-300"/> Exit App
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Support Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-3xl z-[9000] flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] w-full max-w-[340px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={30} className="text-blue-700"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-4 brand-font leading-tight">Admin Support</h3>
            <p className="text-blue-900/60 font-bold text-xs mb-8 leading-relaxed px-2">
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
            <button onClick={() => setShowAdminPopup(false)} className="w-full py-4 bg-sky-50 text-blue-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-sky-100 active:bg-sky-100 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {showExitPopup && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-xl z-[9000] flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] w-full max-w-[320px] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut size={28} className="text-red-500"/>
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-6 brand-font leading-tight">আপনি কি অ্যাপ থেকে বের হতে চান?</h3>
            <div className="space-y-3">
              <button onClick={() => {
                setShowExitPopup(false)
                openExternalLink(PLAY_STORE_URL)
              }} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">Rate This App</button>
              <div className="flex gap-4">
                <button onClick={() => setShowExitPopup(false)} className="flex-1 py-4 bg-sky-50 text-blue-900 rounded-2xl font-black text-xs border border-sky-100">না</button>
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
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-3xl z-[16000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300 scrollbar-hide">
            <div className="text-center mb-6">
              <div className="text-green-800 text-2xl font-black brand-font tracking-wide">PRIVACY POLICY</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">Class 7 All Guide 2026</div>
            </div>

            <div className="space-y-6 text-blue-900 font-bold text-xs leading-relaxed">
               <p className="bg-sky-50 p-4 rounded-2xl border border-sky-100 italic">
                 Gyan sohayota built the "Class 7 All Guide 2026" app as a free educational guide. This service is provided as-is.
               </p>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 mb-1">
                    <Eye size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">1. Information We Handle</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    We do not require you to create an account and we do not collect personal information directly. If you use the Notes feature, your notes are stored locally on your device and are not sent to us.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 mb-1">
                    <FileText size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">2. WebView & Third-Party Content</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    The app displays educational PDFs/flipbooks using a WebView. Some content may be loaded from third-party websites (for example SharePoint/Heyzine). Those websites may collect data under their own privacy policies.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 mb-1">
                    <Lock size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">3. Permissions & Security</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    The app uses Internet and Network State permissions to load online content and to check connectivity. If ads are enabled, the app may also use the Advertising ID permission (AD_ID) for advertising and fraud prevention. We try to keep data minimal, but no method of transmission over the internet is 100% secure.
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-700 mb-1">
                    <Info size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">4. Children’s Privacy & Ads</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    This educational guide is intended for students. We do not knowingly collect personal information from children under 13. The app may show ads provided by Google AdMob. Ad providers may collect and use device information (such as Advertising ID), IP address, and usage data to serve and measure ads, and to prevent fraud. Please review Google’s policies for more information.
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-blue-700 mb-4">
                    <Mail size={18} className="shrink-0" />
                    <span className="font-black text-sm uppercase">Contact Us</span>
                  </div>
                  <div className="bg-blue-700 text-white p-6 rounded-3xl shadow-xl">
                    <p className="text-[10px] opacity-80 mb-1 font-black uppercase tracking-widest">Support Email</p>
                    <p className="text-lg font-black tracking-tight">gyansohayota@gmail.com</p>
                  </div>
               </div>
            </div>
            
            <button onClick={() => setShowPrivacyModal(false)} className="w-full bg-green-700 text-white py-4 rounded-[6px] font-black mt-8 shadow-xl text-xs active:scale-95 transition-all uppercase tracking-widest">
              Agree
            </button>
          </div>
        </div>
      )}

      {/* Download Progress Modal - Outside download before opening */}
      {downloadingState && (
        <div className="fixed inset-0 z-[16000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-sky-100 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
              <Download size={30} className="animate-bounce" />
            </div>
            <div className="w-full space-y-1">
              <h3 className="text-base font-black text-blue-950">অধ্যায় ডাউনলোড হচ্ছে</h3>
              <p className="text-xs font-bold text-sky-700 truncate px-2">{downloadingState.chapterTitle}</p>
              <p className="text-[11px] font-medium text-slate-400">সম্পূর্ণ ডাউনলোড হওয়ার পর স্বয়ংক্রিয়ভাবে ওপেন হবে</p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.max(5, downloadingState.percent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-black text-slate-600 px-1">
                <span>{toBengaliDigits(downloadingState.percent)}%</span>
                <span>{downloadingState.loadedMb ? `${downloadingState.loadedMb}MB ${downloadingState.totalMb ? '/ ' + downloadingState.totalMb + 'MB' : ''}` : 'প্রস্তুত হচ্ছে...'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDownloadingState(null)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      )}

      {showSourcesModal && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-3xl z-[16000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300 scrollbar-hide">
            <div className="text-center mb-6">
              <div className="text-green-800 text-2xl font-black brand-font tracking-wide">DISCLAIMER</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">Official Sources</div>
            </div>

            <div className="space-y-4 text-slate-800 font-bold text-xs leading-relaxed">
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                This app is an independent educational guide. It is <span className="font-black">not affiliated with, endorsed by, or representing</span> any government entity of Bangladesh.
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                Some educational content and references may relate to government/public education information. For the official and original sources, please use the links below:
              </div>

              <div className="space-y-2">
                <a className="block underline text-blue-700 break-all" href="https://nctb.gov.bd/" target="_blank" rel="noreferrer">https://nctb.gov.bd/</a>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                Note: PDFs/flipbooks may be displayed via third-party viewers (for example Heyzine). Those websites have their own privacy policies and terms.
              </div>
            </div>

            <button onClick={() => setShowSourcesModal(false)} className="w-full bg-green-700 text-white py-4 rounded-[6px] font-black mt-8 shadow-xl text-xs active:scale-95 transition-all uppercase tracking-widest">
              Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
