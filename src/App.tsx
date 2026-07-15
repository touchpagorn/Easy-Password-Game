/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  RotateCcw, 
  Trophy, 
  Timer, 
  Check, 
  X, 
  BookOpen, 
  Award, 
  Fingerprint, 
  Zap,
  Lock,
  ChevronRight,
  Info,
  Terminal,
  Cpu,
  Shield,
  Activity,
  AlertTriangle,
  RefreshCw,
  Power,
  Sun,
  Moon
} from 'lucide-react';
import { generateRandomGame } from './data';
import { GameState, Level, PasswordOption, Difficulty } from './types';

export default function App() {
  // Game States
  const [gameState, setGameState] = useState<GameState>('start');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('password-guru-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeLevels, setActiveLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [totalTimeSaved, setTotalTimeSaved] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  
  // Track stats for the final screen
  const [levelsCompleted, setLevelsCompleted] = useState<boolean[]>(new Array(5).fill(false));
  const [timeTakenPerLevel, setTimeTakenPerLevel] = useState<number[]>([]);

  // Initialize random levels on first load or when difficulty changes
  useEffect(() => {
    setActiveLevels(generateRandomGame(difficulty));
  }, [difficulty]);

  const currentLevel = activeLevels[currentLevelIndex] || null;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart entire game (regenerate game sets)
  const handleRestart = () => {
    const newLevels = generateRandomGame(difficulty);
    setActiveLevels(newLevels);
    setGameState('start');
    setCurrentLevelIndex(0);
    setSelectedOptionId(null);
    setTotalTimeSaved(0);
    setScore(0);
    setLevelsCompleted(new Array(5).fill(false));
    setTimeTakenPerLevel([]);
  };

  // Start the game with fresh randomized questions
  const handleStartGame = () => {
    const newLevels = generateRandomGame(difficulty);
    setActiveLevels(newLevels);
    setGameState('playing');
    setCurrentLevelIndex(0);
    setSelectedOptionId(null);
    setTotalTimeSaved(0);
    setScore(0);
    setLevelsCompleted(new Array(5).fill(false));
    setTimeTakenPerLevel([]);
    setTimeLeft(newLevels[0].timeLimit);
  };

  // Change difficulty level and restart the game state
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const newLevels = generateRandomGame(newDifficulty);
    setActiveLevels(newLevels);
    setGameState('start');
    setCurrentLevelIndex(0);
    setSelectedOptionId(null);
    setTotalTimeSaved(0);
    setScore(0);
    setLevelsCompleted(new Array(5).fill(false));
    setTimeTakenPerLevel([]);
  };

  // Select password option
  const handleOptionSelect = (option: PasswordOption) => {
    if (selectedOptionId !== null || gameState !== 'playing' || !currentLevel) return;
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSelectedOptionId(option.id);
    const timeSaved = Math.max(0, parseFloat(timeLeft.toFixed(1)));
    const timeTaken = currentLevel.timeLimit - timeSaved;
    
    setTimeTakenPerLevel(prev => [...prev, timeSaved]); // store for reference

    if (option.isCorrect) {
      setScore(prev => prev + 1);
      setTotalTimeSaved(prev => prev + timeSaved);
      
      const newCompleted = [...levelsCompleted];
      newCompleted[currentLevelIndex] = true;
      setLevelsCompleted(newCompleted);

      setGameState('answer-feedback');
    } else {
      // Failed!
      setGameState('answer-feedback');
    }
  };

  // Handle continuous high-resolution ticking (every 100ms) for ultra-smooth progress bar
  useEffect(() => {
    if (gameState === 'playing' && currentLevel) {
      const intervalMs = 100;
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev - (intervalMs / 1000);
          if (nextTime <= 0) {
            // Time is up! Game Over!
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeTakenPerLevel(prevList => [...prevList, currentLevel.timeLimit]);
            setSelectedOptionId(''); // None selected means timeout
            setGameState('answer-feedback');
            return 0;
          }
          return nextTime;
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, currentLevelIndex, currentLevel]);

  // Advance to next level or end game
  const handleNextStep = () => {
    if (!currentLevel) return;

    const lastAnswerWasCorrect = selectedOptionId 
      ? currentLevel.options.find(o => o.id === selectedOptionId)?.isCorrect 
      : false;

    if (difficulty === 'easy') {
      // In easy difficulty, they can continue regardless of correct/incorrect answers!
      if (currentLevelIndex < activeLevels.length - 1) {
        const nextIndex = currentLevelIndex + 1;
        setCurrentLevelIndex(nextIndex);
        setSelectedOptionId(null);
        setTimeLeft(activeLevels[nextIndex].timeLimit);
        setGameState('playing');
      } else {
        // Checked at the very end of 5 levels: need at least 3 out of 5 correct to win
        if (score >= 3) {
          setGameState('victory');
        } else {
          setGameState('game-over');
        }
      }
    } else {
      // Normal/Hard rules: must get everything correct
      if (!lastAnswerWasCorrect) {
        setGameState('game-over');
        return;
      }

      if (currentLevelIndex < activeLevels.length - 1) {
        const nextIndex = currentLevelIndex + 1;
        setCurrentLevelIndex(nextIndex);
        setSelectedOptionId(null);
        setTimeLeft(activeLevels[nextIndex].timeLimit);
        setGameState('playing');
      } else {
        // Completed all 5 levels correctly!
        setGameState('victory');
      }
    }
  };

  // Get current tactical rank based on current progress
  const getCurrentRankName = () => {
    if (gameState === 'victory') return 'PASSWORD GURU';
    if (gameState === 'game-over') return 'DECRYPT FAILURE';
    
    switch (currentLevelIndex) {
      case 0: return 'SECURITY INITIATE';
      case 1: return 'CYBER CADET';
      case 2: return 'CRYPTIC AGENT';
      case 3: return 'FIREWALL DEFENDER';
      case 4: return 'MASTER DECRYPTER';
      default: return 'SECURITY ANALYST';
    }
  };

  // Password strength label with terminal style badges
  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'very-weak':
        return <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border transition-colors duration-300 ${theme === 'dark' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>CRITICAL_WEAK</span>;
      case 'weak':
        return <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border transition-colors duration-300 ${theme === 'dark' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-orange-200 bg-orange-50 text-orange-700'}`}>WARNING_WEAK</span>;
      case 'moderate':
        return <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border transition-colors duration-300 ${theme === 'dark' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>MODERATE_STRENGTH</span>;
      case 'strong':
        return <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border transition-colors duration-300 ${theme === 'dark' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>SECURE_STRONG</span>;
      case 'very-strong':
        return <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border transition-colors duration-300 ${theme === 'dark' ? 'border-sky-500/30 bg-sky-500/10 text-sky-400' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>ELITE_HIGH_ENTROPY</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen font-mono flex flex-col justify-between transition-colors duration-300 relative overflow-x-hidden ${theme === 'dark' ? 'bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-white' : 'bg-slate-50 text-slate-800 selection:bg-amber-100 selection:text-amber-900'}`}>
      
      {/* 1. Cyber scanline screen overlay */}
      <div className={`absolute inset-0 pointer-events-none z-50 bg-[length:100%_4px] transition-all duration-300 ${theme === 'dark' ? 'opacity-[0.04] bg-[linear-gradient(rgba(245,158,11,0.04)_50%,transparent_50%)]' : 'opacity-[0.03] bg-[linear-gradient(rgba(100,116,139,0.08)_50%,transparent_50%)]'}`} />
      
      {/* Background ambient glowing nodes in soft yellow/amber */}
      <div className={`absolute top-1/4 left-1/10 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-all duration-500 ${theme === 'dark' ? 'bg-amber-500/5' : 'bg-amber-200/20'}`} />
      <div className={`absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-all duration-500 ${theme === 'dark' ? 'bg-orange-500/5' : 'bg-orange-200/20'}`} />

      {/* Header Navigation */}
      <header className={`border-b backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 z-40 shadow-md transition-all duration-300 ${theme === 'dark' ? 'border-slate-900 bg-slate-950/80' : 'border-slate-200 bg-white/85'}`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 space-y-4 sm:space-y-0">
          
          {/* Brand Logo & Sub-info */}
          <div className="flex items-center space-x-3.5 self-start sm:self-auto">
            <div className={`p-2 rounded-lg shadow-xs transition-all duration-300 ${theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-500/10 border border-amber-200'}`}>
              <Fingerprint size={22} className={`animate-pulse ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs uppercase tracking-widest leading-none font-bold transition-colors ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>System Status</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              </div>
              <h1 className={`text-lg font-bold tracking-tight leading-snug transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                ENCRYPTION_CHALLENGE_V2
              </h1>
            </div>
          </div>
          
          {/* Header Actions & Info */}
          <div className="flex flex-wrap items-center justify-end gap-3.5 self-end sm:self-auto">
            
            {/* Theme Toggle */}
            <div className="flex flex-col items-end gap-1 space-y-1">
              <span className={`text-[8px] uppercase tracking-widest font-bold leading-none transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Theme / ธีม</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="สลับโหมดสว่าง/มืด"
                className={`p-1.5 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-amber-500 hover:text-amber-400 hover:bg-slate-800/80'
                    : 'bg-slate-100 border-slate-200 text-amber-600 hover:text-amber-700 hover:bg-slate-200/60'
                }`}
              >
                {theme === 'dark' ? <Sun size={14} className="stroke-[2.5]" /> : <Moon size={14} className="stroke-[2.5]" />}
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col items-end gap-1 space-y-1">
              <span className={`text-[8px] uppercase tracking-widest font-bold leading-none transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Speed Level / เลือกระดับความเร็ว</span>
              <div className={`flex items-center rounded-md p-0.5 border transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-slate-100 border-slate-200'}`}>
                {(['easy', 'medium', 'hard'] as const).map((diff) => {
                  const isActive = difficulty === diff;
                  const label = diff === 'easy' ? 'ระดับต้น' : diff === 'medium' ? 'ระดับกลาง' : 'ระดับสูง';
                  const title = diff === 'easy' ? '15 วินาทีทุกข้อ' : diff === 'medium' ? '10 - 3 วินาที' : '5 - 3 วินาที';
                  return (
                    <button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      title={title}
                      className={`px-2 py-1 text-[10px] font-mono rounded-sm transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/40'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Levels & Progression block */}
            {(gameState === 'playing' || gameState === 'answer-feedback') && activeLevels.length > 0 ? (
              <div className={`flex items-center space-x-3 px-2.5 py-1.5 rounded-lg h-[30px] border transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <div className="text-center hidden lg:block">
                  <div className={`text-[9px] uppercase tracking-wider font-bold transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Progress</div>
                </div>
                <div className="flex gap-1 space-x-1">
                  {activeLevels.map((lvl, index) => {
                    let indicatorStyle = theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-slate-200 border-slate-300';
                    if (index === currentLevelIndex) {
                      indicatorStyle = theme === 'dark' 
                        ? 'bg-amber-500/40 border-amber-500 shadow-lg scale-105' 
                        : 'bg-amber-500/20 border-amber-500 shadow-sm scale-105';
                    } else if (index < currentLevelIndex) {
                      indicatorStyle = theme === 'dark' 
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-md' 
                        : 'bg-amber-500/10 border-amber-500/60 shadow-sm';
                    }
                    return (
                      <div 
                        key={index} 
                        className={`w-6 h-2 rounded-sm border transition-all duration-300 ${indicatorStyle}`}
                        title={`Level ${lvl.id}`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Current Tactical Rank */}
            <div className="text-right hidden md:block">
              <div className={`text-[9px] uppercase tracking-wider font-bold leading-none transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Current Rank</div>
              <div className={`text-xs font-bold font-mono tracking-wider mt-1 transition-colors ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>
                {getCurrentRankName()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {/* 1. START SCREEN */}
          {gameState === 'start' && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}
              id="start-card"
            >
              {/* Corner decorative borders */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500" />

              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg border transition-all ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/5' : 'bg-amber-50 border-amber-200'}`}>
                <ShieldCheck size={42} className={`animate-pulse ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} />
              </div>
              
              <h2 className={`text-2xl md:text-3xl font-bold tracking-wide mb-3 uppercase transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                PASSWORD GURU TERMINAL
              </h2>
              
              <p className={`text-sm mb-8 max-w-lg leading-relaxed font-sans transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                ยินดีต้อนรับสู่ระบบจำลองการเข้ารหัสความปลอดภัยระดับรัฐบาลกลาง ท้าทายประสาทสัมผัสในการแยกแยะ <span className={`font-bold underline decoration-amber-500 underline-offset-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Password แข็งแกร่งที่สุด</span> จากระบบ Brute-Force เพื่อผ่านด่านความมั่นคงปลอดภัยไซเบอร์ทั้งหมด 5 ด่าน
              </p>

              {/* Tactical Rules Highlight Box */}
              <div className={`w-full rounded-xl p-5 mb-8 text-left border space-y-4 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center transition-colors ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'}`}>
                  <Zap size={14} className="text-amber-500 mr-2 animate-bounce" /> 
                  SECURITY PROTOCOLS &amp; CHALLENGE RULES
                </h3>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm font-sans transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="flex items-start space-x-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-xs font-mono border transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200/60'}`}>01</span>
                    {difficulty === 'easy' ? (
                      <span>ตอบให้ถูกต้อง <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>อย่างน้อย 3 ใน 5 ข้อ</span> เพื่อผ่านเป็น Password Guru</span>
                    ) : (
                      <span>ตอบให้ถูกต้อง <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>ต่อเนื่องกันทั้ง 5 ด่าน</span> เพื่ออัปเกรดเป็น Password Guru</span>
                    )}
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-xs font-mono border transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200/60'}`}>02</span>
                    {difficulty === 'easy' ? (
                      <span>มีเวลาให้คิด <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>15 วินาทีเท่ากันทุกข้อ</span> ไม่รีบเร่ง ตอบได้อย่างละเอียด</span>
                    ) : (
                      <span>ระบบจะบีบเวลาลงเรื่อยๆ จาก <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>{difficulty === 'medium' ? '10' : '5'} วินาที ลงไปจนถึง 3 วินาที</span> ในด่านสุดท้าย</span>
                    )}
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-xs font-mono border transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200/60'}`}>03</span>
                    {difficulty === 'easy' ? (
                      <span>หากตอบผิดหรือปล่อยให้หมดเวลา <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>ระบบจะไม่ตัดสิทธิ์</span> แต่ให้ผ่านไปด่านความมั่นคงต่อไปได้</span>
                    ) : (
                      <span>ตอบผิดเพียงจุดเดียว หรือปล่อยให้หมดเวลา = <span className={`font-semibold ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>ระบบจะปิดล็อกและล้มเหลวทันที!</span></span>
                    )}
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-xs font-mono border transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200/60'}`}>04</span>
                    <span>คำถามในแต่ละครั้ง <span className={`font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>จะถูกสุ่มชุดรหัสผ่านใหม่เสมอ</span> ป้องกันการจดจำ</span>
                  </div>
                </div>
              </div>

              {/* Start Simulator button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-sm tracking-widest uppercase flex items-center space-x-2 cursor-pointer shadow-md border border-amber-600/10 focus:outline-none"
                id="btn-start-game"
              >
                <Power size={18} />
                <span>INITIALIZE SECURITY TESTING PROTOCOL (เริ่มทดสอบรหัสผ่าน)</span>
              </motion.button>
            </motion.div>
          )}

          {/* 2. PLAYING / ACTIVE LEVEL SCREEN */}
          {gameState === 'playing' && currentLevel && (
            <motion.div
              key={`level-${currentLevelIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col space-y-6"
            >
              {/* Question Header Status */}
              <div className="text-center space-y-2">
                <div className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase border transition-all ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-amber-500/10 border-amber-200 text-amber-700'}`}>
                  ด่าน {currentLevelIndex + 1} / 5: {currentLevel.focusTopic}
                </div>
                {difficulty === 'easy' && (
                  <div className={`text-[10px] font-bold uppercase tracking-widest font-mono transition-colors ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    [ TARGET: สะสมให้ได้ 3 คะแนน &mdash; ปัจจุบันได้: {score} คะแนน ]
                  </div>
                )}
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold max-w-3xl mx-auto leading-tight px-2 font-sans tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {currentLevel.questionText}
                </h2>
              </div>
 
              {/* Immersive Circular Timer Section */}
              <div className="relative flex items-center justify-center py-4">
                {/* Glowing rotating/pulsing outer ring */}
                <div className={`absolute rounded-full border-4 ${timeLeft < 2.5 ? 'border-rose-500/20 scale-125 animate-ping' : theme === 'dark' ? 'border-amber-500/10 scale-125' : 'border-amber-500/20 scale-125'} transition-all duration-300 w-32 h-32`}></div>
                
                {/* Timer Core Circle */}
                <div className={`w-32 h-32 rounded-full border-4 ${timeLeft < 2.5 ? (theme === 'dark' ? 'border-rose-500 bg-slate-900 shadow-xl shadow-rose-500/10' : 'border-rose-500 bg-rose-50 shadow-md') : (theme === 'dark' ? 'border-amber-500 bg-slate-900 shadow-xl' : 'border-amber-500 bg-white shadow-md')} flex flex-col items-center justify-center transition-all duration-300 z-10`}>
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${timeLeft < 2.5 ? 'text-rose-400' : (theme === 'dark' ? 'text-amber-500' : 'text-amber-600')}`}>Time Left</span>
                  <span className={`text-4xl font-extrabold ${timeLeft < 2.5 ? 'text-rose-500 font-black' : (theme === 'dark' ? 'text-white' : 'text-slate-800')}`}>
                    {timeLeft < 10 ? '0' : ''}{timeLeft.toFixed(1)}
                  </span>
                  <span className={`text-[8px] uppercase font-bold ${timeLeft < 2.5 ? 'text-rose-400/80' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}>Seconds</span>
                </div>
              </div>
 
              {/* Dynamic Smooth Progress Indicator at base of timer */}
              <div className="max-w-md mx-auto w-full px-4">
                <div className={`w-full h-2 rounded-full overflow-hidden border transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300/40'}`}>
                  <motion.div
                    className={`h-full ${timeLeft < 2.5 ? 'bg-rose-500 animate-pulse' : timeLeft < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / currentLevel.timeLimit) * 100}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                </div>
              </div>
 
              {/* Touchscreen Option Grid (Clean option cards with nice metadata labels) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 -m-1.5" id="options-container">
                {currentLevel.options.map((option, idx) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`m-1.5 p-6 rounded-xl transition-all text-left relative group overflow-hidden cursor-pointer flex flex-col justify-between min-h-[120px] focus:outline-none shadow-lg hover:shadow-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-amber-500 hover:shadow-amber-500/5' : 'bg-white border-slate-200 hover:bg-amber-50/25 hover:border-amber-500'}`}
                  >
                    {/* Identification header flag */}
                    <span className={`absolute top-0 left-0 text-[9px] px-2.5 py-1 uppercase font-bold border-r border-b tracking-wider transition-colors ${theme === 'dark' ? 'bg-slate-850 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200/85'}`}>
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    
                    {/* Option Text in large monospace */}
                    <span className={`text-base md:text-lg block mt-5 break-all font-semibold font-mono tracking-wide leading-relaxed transition-colors group-hover:text-amber-400 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {option.text}
                    </span>
                    
                    {/* Visual hint indicator at bottom */}
                    <div className={`mt-4 flex items-center justify-between w-full border-t pt-2 text-[10px] transition-colors ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'}`}>
                      <span className={`font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 group-hover:text-amber-400' : 'text-slate-500 group-hover:text-amber-600'}`}>
                        [ TAP_TO_EVALUATE ]
                      </span>
                      <ChevronRight size={12} className={`transition-colors ${theme === 'dark' ? 'text-slate-500 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-amber-600'}`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. ANSWER FEEDBACK SCREEN */}
          {gameState === 'answer-feedback' && currentLevel && (
            <motion.div
              key="feedback-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col space-y-6 relative transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500" />

              {/* Outcome Header Banner */}
              {selectedOptionId === '' ? (
                // TIMEOUT STATE
                <div className={`flex flex-col items-center text-center p-5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="p-3 bg-rose-500 text-white rounded-full mb-3 shadow-md animate-bounce">
                    <Timer size={28} className={`${theme === 'dark' ? 'text-rose-400' : 'text-white'}`} />
                  </div>
                  <h3 className={`text-lg font-bold tracking-wider ${theme === 'dark' ? 'text-rose-400' : 'text-rose-700'}`}>หมดเวลาพิจารณา (TIME_LIMIT_EXCEEDED)</h3>
                  <p className={`text-xs mt-1 font-sans ${theme === 'dark' ? 'text-rose-300' : 'text-rose-600/85'}`}>คุณปล่อยให้เวลาของระบบความปลอดภัยหมดลงก่อนตัดสินใจ</p>
                </div>
              ) : currentLevel.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                // CORRECT STATE
                <div className={`flex flex-col items-center text-center p-5 rounded-xl shadow-xs border transition-all ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="p-3 bg-emerald-500 text-slate-950 rounded-full mb-3 shadow-md">
                    <Check size={28} className="stroke-[3]" />
                  </div>
                  <h3 className={`text-lg font-bold tracking-wider font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>ยอมรับข้อมูล! ผ่านด่านความปลอดภัย</h3>
                  <p className={`text-xs mt-1 font-sans ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600/85'}`}>คุณเลือกคุณสมบัติของ Password ได้แข็งแกร่งที่สุดในระดับนี้</p>
                </div>
              ) : (
                // INCORRECT STATE
                <div className={`flex flex-col items-center text-center p-5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="p-3 bg-rose-500 text-slate-950 rounded-full mb-3 shadow-md">
                    <X size={28} className="stroke-[3]" />
                  </div>
                  <h3 className={`text-lg font-bold tracking-wider ${theme === 'dark' ? 'text-rose-400' : 'text-rose-700'}`}>ปฏิเสธข้อมูล! พาสเวิร์ดยังไม่ปลอดภัยพอ</h3>
                  <p className={`text-xs mt-1 font-sans ${theme === 'dark' ? 'text-rose-300' : 'text-rose-600/85'}`}>รหัสที่คุณเลือกมีจุดโหว่ที่แฮกเกอร์ใช้เจาะระบบได้ในเวลาอันสั้น</p>
                </div>
              )}

              {/* Security Learning Tip (แสดงผลแนะนำตัวเลือกก่อนตามโจทย์ขอ) */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs md:text-sm transition-all duration-300 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <Info size={18} className={`${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'} flex-shrink-0 mt-0.5`} />
                <div className="space-y-1 font-sans">
                  <span className={`font-bold block font-mono text-xs uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-sky-400' : 'text-sky-700'}`}>
                    CRITICAL SECURITY INTELLIGENCE (คำแนะนำเพิ่มเติมเพื่อความปลอดภัย)
                  </span>
                  <p className={`leading-relaxed text-xs transition-colors ${theme === 'dark' ? 'text-slate-200' : 'text-slate-600'}`}>{currentLevel.learningTip}</p>
                </div>
              </div>

              {/* Password breakdown list */}
              <div className="space-y-3.5">
                <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                  <BookOpen size={14} className="mr-2 text-amber-500" /> 
                  SECURITY ENTROPY BREAKDOWN [ข้อมูลเปรียบเทียบตัวเลือก]
                </h4>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {currentLevel.options.map((option, idx) => {
                    const isSelected = option.id === selectedOptionId;
                    const isCorrect = option.isCorrect;
                    
                    let cardBorder = theme === 'dark' ? "border-slate-800" : "border-slate-200";
                    let cardBg = theme === 'dark' ? "bg-slate-950/30" : "bg-slate-50/50";
                    let indicatorLabel = `OPTION ${String.fromCharCode(65 + idx)}`;
                    let textHighlight = theme === 'dark' ? "text-white" : "text-slate-900";

                    if (isSelected && isCorrect) {
                      cardBorder = theme === 'dark' ? "border-emerald-500/60 bg-emerald-500/5 shadow-xs" : "border-emerald-550 bg-emerald-50/40 shadow-xs";
                      cardBg = theme === 'dark' ? "bg-emerald-500/10" : "bg-emerald-50/20";
                      textHighlight = theme === 'dark' ? "text-emerald-400 font-bold" : "text-emerald-700 font-bold";
                    } else if (isSelected && !isCorrect) {
                      cardBorder = theme === 'dark' ? "border-rose-500/40 bg-rose-500/5 shadow-xs" : "border-rose-300 bg-rose-50/40 shadow-xs";
                      cardBg = theme === 'dark' ? "bg-rose-500/10" : "bg-rose-50/20";
                      textHighlight = theme === 'dark' ? "text-rose-400 font-bold" : "text-rose-700 font-bold";
                    } else if (isCorrect) {
                      cardBorder = theme === 'dark' ? "border-emerald-500/40 border-dashed bg-emerald-500/5" : "border-emerald-500/50 border-dashed bg-emerald-50/10";
                      indicatorLabel = `EXPECTED SECURE CHOICE [ ${String.fromCharCode(65 + idx)} ]`;
                    }

                    return (
                      <div 
                        key={option.id} 
                        className={`p-4 rounded-xl border transition-all text-xs flex flex-col space-y-2 ${cardBorder} ${cardBg}`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${theme === 'dark' ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                              {indicatorLabel}
                            </span>
                            <span className={`font-mono text-sm tracking-wide break-all ${textHighlight}`}>
                              {option.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            {getStrengthBadge(option.strength)}
                          </div>
                        </div>
                        <p className={`font-sans leading-relaxed text-xs transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {option.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Step / Retry Navigation */}
              <div className="pt-2">
                {selectedOptionId !== '' && currentLevel.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleNextStep}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-650 text-slate-950 rounded-xl font-bold text-base flex items-center justify-center space-x-2 cursor-pointer shadow-md border border-emerald-600/10"
                    id="btn-next"
                  >
                    <span>{currentLevelIndex === activeLevels.length - 1 ? 'PROCEED TO SUMMARY (ดูผลสรุปการประเมิน)' : 'NEXT STAGE (ไปต่อด่านถัดไป)'}</span>
                    <ChevronRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleNextStep}
                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                      difficulty === 'easy'
                        ? 'bg-amber-500 hover:bg-amber-600 border border-amber-600/10 text-slate-950'
                        : 'bg-rose-500 hover:bg-rose-600 border border-rose-600/10 text-slate-950'
                    }`}
                    id="btn-fail-next"
                  >
                    <span>
                      {difficulty === 'easy'
                        ? (currentLevelIndex === activeLevels.length - 1 ? 'PROCEED TO SUMMARY (ดูผลสรุปการประเมิน)' : 'NEXT STAGE (ไปต่อด่านถัดไป)')
                        : 'ANALYZE RECONSTRUCTION (ดูข้อผิดพลาดเพื่อแก้ไข)'}
                    </span>
                    <ChevronRight size={18} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. GAME OVER SCREEN (Lost) */}
          {gameState === 'game-over' && currentLevel && (
            <motion.div
              key="game-over-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col items-center text-center space-y-6 relative backdrop-blur-md transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}
              id="gameover-card"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-rose-500/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-rose-500/40" />

              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-pulse border transition-all ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30 shadow-rose-500/5' : 'bg-rose-50 border-rose-200'}`}>
                <ShieldAlert size={42} className={`${theme === 'dark' ? 'text-rose-400' : 'text-rose-500'}`} />
              </div>

              <div className="space-y-2">
                <h2 className={`text-2xl md:text-3xl font-bold tracking-wider uppercase transition-colors ${theme === 'dark' ? 'text-rose-400' : 'text-rose-700'}`}>
                  ACCESS DENIED: BREACH DETECTED
                </h2>
                <p className={`text-xs md:text-sm max-w-md mx-auto leading-relaxed font-sans transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {difficulty === 'easy' ? (
                    <>ระบบรักษาความปลอดภัยล้มเหลวเนื่องจากคุณเก็บคะแนนได้เพียง <span className={`font-bold underline font-mono ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>{score} จาก 5 คะแนน</span> (ระดับต้นต้องการอย่างน้อย 3 คะแนนเพื่อประเมินผ่านเป็น Password Guru)</>
                  ) : (
                    <>ระบบรักษาความปลอดภัยล้มเหลวใน <span className={`font-bold underline font-mono ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>ด่านที่ {currentLevelIndex + 1}</span> แฮกเกอร์และซอฟต์แวร์เดารหัสสามารถเจาะบัญชีของคุณสำเร็จในพริบตา!</>
                  )}
                </p>
              </div>

              {/* Stats overview */}
              <div className={`w-full rounded-xl p-5 border text-left transition-all duration-300 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 text-center transition-colors ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>
                  SESSION TERMINAL DIAGNOSTICS [สรุปข้อมูลจำลอง]
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className={`border-r transition-colors ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className={`text-2xl font-bold block transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{score} / 5</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ด่านที่ผ่าน</span>
                  </div>
                  <div>
                    <span className={`text-2xl font-bold block transition-colors ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>{(totalTimeSaved).toFixed(1)}s</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>เวลาที่รักษาได้</span>
                  </div>
                </div>

                {/* Grid of level results */}
                <div className={`mt-5 pt-4 border-t flex justify-center space-x-2 transition-colors ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  {levelsCompleted.map((isSuccess, idx) => {
                    const wasPlayed = difficulty === 'easy' || idx <= currentLevelIndex;
                    const isFailed = wasPlayed && !isSuccess;
                    return (
                      <div 
                        key={idx} 
                        className={`w-12 py-2 rounded flex flex-col items-center justify-center text-xs font-mono font-bold border transition-all duration-200 ${
                          isSuccess 
                            ? (theme === 'dark' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200") 
                            : isFailed 
                              ? (theme === 'dark' ? "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse" : "bg-rose-50 text-rose-600 border-rose-300 animate-pulse") 
                              : (theme === 'dark' ? "bg-slate-950/30 text-slate-600 border-slate-900" : "bg-slate-100 text-slate-450 border-slate-200")
                        }`}
                      >
                        <span>#{idx + 1}</span>
                        <span className="mt-1">
                          {isSuccess ? <Check size={11} className="stroke-[3]" /> : isFailed ? <X size={11} className="stroke-[3]" /> : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Hint */}
              <div className={`text-xs max-w-md italic font-sans leading-relaxed transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                &ldquo;ความแข็งแกร่งของรหัสผ่านไม่ได้ขึ้นอยู่กับสิ่งที่คุณจำได้ง่าย แต่ขึ้นอยู่กับความซับซ้อนสุ่มที่ระบบ Brute force ไม่สามารถจับทิศทางลวดลายของคำศัพท์ทั่วไปได้ พยายามหลีกเลี่ยงชื่อ วันเกิด หรือคีย์บอร์ดที่เรียงปุ่ม&rdquo;
              </div>

              {/* Retry Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="w-full max-w-sm py-4 bg-rose-500 hover:bg-rose-600 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-md border border-rose-600/10"
                id="btn-retry"
              >
                <RefreshCw size={16} />
                <span>RE-INITIALIZE PROTOCOLS (ท้าทายใหม่อีกครั้ง)</span>
              </motion.button>
            </motion.div>
          )}

          {/* 5. VICTORY SCREEN (Won all 5 levels) */}
          {gameState === 'victory' && (
            <motion.div
              key="victory-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className={`border rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}
              id="victory-card"
            >
              {/* Confetti Visual gold bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500" />
              
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-500" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-500" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-500" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-500" />

              <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg animate-bounce mt-3 border transition-all ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/5' : 'bg-emerald-50 border-2 border-emerald-500'}`}>
                <Trophy size={52} className={`stroke-[1.5] ${theme === 'dark' ? 'text-emerald-450' : 'text-emerald-600'}`} />
              </div>

              <div className="space-y-2">
                <div className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-1 animate-pulse border transition-all ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-250 text-emerald-800'}`}>
                  ACCESS STATUS: AUTHORIZED GURU LEVEL
                </div>
                <h2 className={`text-3xl md:text-4xl font-extrabold tracking-wide leading-none uppercase transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  คุณคือ PASSWORD GURU!
                </h2>
                <p className={`text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {difficulty === 'easy' ? (
                    <>ยินดีด้วย! คุณได้รับการรับรองความรู้ขั้นสูงสุดในการเลือกและปกป้องรหัสผ่าน คุณสามารถผ่านด่านการทดสอบระดับต้นได้อย่างปลอดภัยด้วยคะแนนสะสม <span className={`font-bold underline font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{score} จาก 5 คะแนน</span> (ระดับต้นต้องการอย่างน้อย 3 คะแนน)!</>
                  ) : (
                    <>ยินดีด้วย! คุณได้รับการรับรองความรู้ขั้นสูงสุดในการเลือกและปกป้องรหัสผ่าน คุณสามารถแยกแยะความแตกต่างเพื่อสร้างระดับการเข้ารหัสที่สมบูรณ์แบบได้ครบทั้ง 5 ด่าน ภายใต้ความกดดันเวลาจำกัดขั้นวิกฤต!</>
                  )}
                </p>
              </div>

              {/* Stats overview */}
              <div className={`w-full rounded-xl p-5 border text-left transition-all duration-300 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 text-center transition-colors ${theme === 'dark' ? 'text-emerald-450' : 'text-emerald-700'}`}>
                  AUTHORIZED SECURITY METRICS [ข้อมูลชัยชนะ]
                </h3>
                <div className={`grid grid-cols-3 gap-2 text-center divide-x transition-colors ${theme === 'dark' ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  <div>
                    <span className={`text-xl md:text-2xl font-bold block transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{score} / 5</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider block transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {difficulty === 'easy' ? 'คะแนนที่สะสมได้' : 'ผ่านครบทุกด่าน'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-sky-400 block">
                      {timeTakenPerLevel.reduce((a, b) => a + b, 0).toFixed(1)}s
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider block transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>เวลารวมที่ใช้</span>
                  </div>
                  <div>
                    <span className={`text-xl md:text-2xl font-bold block transition-colors ${theme === 'dark' ? 'text-emerald-450' : 'text-emerald-600'}`}>
                      {totalTimeSaved.toFixed(1)}s
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider block transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>เวลาประหยัดได้</span>
                  </div>
                </div>
              </div>

              {/* Actionable security tips */}
              <div className={`w-full rounded-xl p-5 border text-left space-y-4 font-sans transition-all duration-300 ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/40 border-emerald-200'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center font-mono transition-colors ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                  <Award size={14} className={`mr-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`} /> 3 กฎเหล็กสู่ความปลอดภัยตลอดกาล
                </h3>
                <ul className={`space-y-3 text-xs transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-emerald-450 flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className={`font-mono uppercase text-[10px] block mb-0.5 transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>[01] ใช้ Password Manager</strong> เลิกใช้และจำรหัสผ่านที่สั้นหรือจำเจเอง หันมาใช้เครื่องมือสร้างรหัสแบบสุ่มความยาวไม่ต่ำกว่า 16 อักขระ</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-emerald-450 flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className={`font-mono uppercase text-[10px] block mb-0.5 transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>[02] เปิดใช้งานระบบ 2FA เสมอ</strong> รหัสผ่านที่แกร่งที่สุดก็ยังเสี่ยงต่อฟิชชิ่ง การใช้เครื่องมือยืนยันตัวตนขั้นที่สอง (เช่น Authenticator app) ช่วยเซฟบัญชีได้อีกระดับ</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-emerald-450 flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className={`font-mono uppercase text-[10px] block mb-0.5 transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>[03] ป้องกันการรั่วไหลด้วยความยาว</strong> หลีกเลี่ยงรูปแบบคีย์บอร์ดที่เรียงเป็นระเบียบ แนะนำให้ใช้วลีสุ่มเชื่อมด้วยตัวอักษรพิเศษที่ไม่เป็นคำในพจนานุกรมเล่มหลัก</span>
                  </li>
                </ul>
              </div>

              {/* Restart Button Area */}
              <div className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestart}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-650 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-md border border-emerald-600/10"
                  id="btn-victory-restart"
                >
                  <RotateCcw size={16} />
                  <span>START NEW SIMULATION (ท้าทายระบบรักษาความปลอดภัยอีกรอบ)</span>
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <footer className={`border-t px-4 md:px-8 py-5 mt-auto text-slate-500 transition-all duration-300 ${theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] font-mono gap-3 space-y-3 md:space-y-0">
          <div className="flex flex-wrap justify-center items-center gap-3 space-x-3">
            <span className="flex items-center gap-1 space-x-1">
              <Terminal size={12} className={`${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} /> TERMINAL: TTY-SYSTEM
            </span>
            <span className={`w-px h-3.5 hidden md:inline transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'}`}></span>
            <span>BUFFER: SHIELDED_SSL_ACTIVE</span>
            <span className={`w-px h-3.5 hidden md:inline transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'}`}></span>
            <span className={`font-bold transition-colors ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>TARGET: PASSWORD_GURU_DECRYPT_VERIFIED</span>
          </div>
          <div>
            &copy; 2026 PASSWORD GURU LABORATORY. ALL SECURED.
          </div>
        </div>
      </footer>

    </div>
  );
}

