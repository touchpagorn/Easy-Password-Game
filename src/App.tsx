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
  RefreshCw
} from 'lucide-react';
import { generateRandomGame } from './data';
import { GameState, Level, PasswordOption, Difficulty } from './types';

export default function App() {
  // Game States
  const [gameState, setGameState] = useState<GameState>('start');
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

    if (!lastAnswerWasCorrect) {
      // If the answer was wrong (or timed out), they lose! Must restart.
      setGameState('game-over');
      return;
    }

    // If correct, check if there are more levels
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
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-rose-500/30 bg-rose-950/40 text-rose-400">CRITICAL_WEAK</span>;
      case 'weak':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-orange-500/30 bg-orange-950/40 text-orange-400">WARNING_WEAK</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-amber-500/30 bg-amber-950/40 text-amber-400">MODERATE_STRENGTH</span>;
      case 'strong':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-yellow-500/30 bg-yellow-950/40 text-yellow-400">SECURE_STRONG</span>;
      case 'very-strong':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">ELITE_HIGH_ENTROPY</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-[#FFD100] font-mono flex flex-col justify-between selection:bg-yellow-950/60 selection:text-yellow-100 relative overflow-x-hidden">
      
      {/* 1. Cyber scanline screen overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-50 bg-[linear-gradient(rgba(255,209,0,0.12)_50%,transparent_50%)] bg-[length:100%_4px]" />
      
      {/* Background ambient glowing nodes in yellow/amber */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-yellow-500/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-amber-500/3 blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="border-b border-yellow-900/30 bg-slate-900/60 backdrop-blur-xs px-4 md:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Sub-info */}
          <div className="flex items-center space-x-3.5 self-start sm:self-auto">
            <div className="p-2 bg-yellow-950/80 border border-yellow-500/30 rounded-lg text-[#FFD100] shadow-[0_0_10px_rgba(255,209,0,0.2)]">
              <Fingerprint size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-yellow-600 uppercase tracking-widest leading-none font-bold">System Status</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-ping" />
              </div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-snug">
                ENCRYPTION_CHALLENGE_V2
              </h1>
            </div>
          </div>
          
          {/* Header Actions & Info */}
          <div className="flex flex-wrap items-center justify-end gap-3.5 self-end sm:self-auto">
            {/* Difficulty Selector */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] text-yellow-600 uppercase tracking-widest font-bold leading-none">Speed Level / เลือกระดับความเร็ว</span>
              <div className="flex items-center bg-slate-950/80 border border-yellow-900/40 rounded-md p-0.5">
                {(['easy', 'medium', 'hard'] as const).map((diff) => {
                  const isActive = difficulty === diff;
                  const label = diff === 'easy' ? 'ระดับต้น' : diff === 'medium' ? 'ระดับกลาง' : 'ระดับสูง';
                  const title = diff === 'easy' ? '25 - 5 วินาที' : diff === 'medium' ? '10 - 3 วินาที' : '5 - 3 วินาที';
                  return (
                    <button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      title={title}
                      className={`px-2 py-1 text-[10px] font-mono rounded-sm transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#FFD100] text-slate-950 font-bold shadow-[0_0_8px_rgba(255,209,0,0.3)]'
                          : 'text-yellow-500/70 hover:text-[#FFD100] hover:bg-yellow-950/20'
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
              <div className="flex items-center space-x-3 bg-slate-950/70 border border-yellow-900/40 px-2.5 py-1.5 rounded-lg h-[30px]">
                <div className="text-center hidden lg:block">
                  <div className="text-[9px] text-yellow-600 uppercase tracking-wider font-bold">Progress</div>
                </div>
                <div className="flex gap-1">
                  {activeLevels.map((lvl, index) => {
                    let indicatorStyle = 'bg-slate-900 border-slate-800';
                    if (index === currentLevelIndex) {
                      indicatorStyle = 'bg-yellow-500/20 border-[#FFD100] shadow-[0_0_8px_rgba(255,209,0,0.4)] scale-105';
                    } else if (index < currentLevelIndex) {
                      indicatorStyle = 'bg-yellow-500/10 border-yellow-500/60 shadow-[0_0_8px_rgba(255,209,0,0.2)]';
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
              <div className="text-[9px] text-yellow-600 uppercase tracking-wider font-bold leading-none">Current Rank</div>
              <div className="text-xs font-bold text-cyan-400 font-mono tracking-wider mt-1">
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
              className="bg-slate-900/70 border-2 border-yellow-900/40 rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(255,209,0,0.03)] flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xs"
              id="start-card"
            >
              {/* Corner decorative borders */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFD100]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFD100]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFD100]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFD100]" />

              <div className="w-20 h-20 bg-yellow-950/60 border border-yellow-500/40 rounded-full flex items-center justify-center text-[#FFD100] mb-6 shadow-[0_0_20px_rgba(255,209,0,0.15)]">
                <ShieldCheck size={42} className="animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-wide mb-3 uppercase">
                PASSWORD GURU TERMINAL
              </h2>
              
              <p className="text-sm text-yellow-400/85 mb-8 max-w-lg leading-relaxed font-sans">
                ยินดีต้อนรับสู่ระบบจำลองการเข้ารหัสความปลอดภัยระดับรัฐบาลกลาง ท้าทายประสาทสัมผัสในการแยกแยะ <span className="font-bold text-white underline decoration-[#FFD100] underline-offset-4">Password แข็งแกร่งที่สุด</span> จากระบบ Brute-Force เพื่อผ่านด่านความมั่นคงปลอดภัยไซเบอร์ทั้งหมด 5 ด่าน
              </p>

              {/* Tactical Rules Highlight Box */}
              <div className="w-full bg-slate-950/80 rounded-xl p-5 mb-8 text-left border border-yellow-900/40 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD100] flex items-center">
                  <Zap size={14} className="text-[#FFD100] mr-2 animate-bounce" /> 
                  SECURITY PROTOCOLS &amp; CHALLENGE RULES
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-slate-300 font-sans">
                  <div className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-yellow-950 text-[#FFD100] border border-yellow-800/60 flex items-center justify-center font-bold text-xs font-mono">01</span>
                    <span>ตอบให้ถูกต้อง <span className="font-semibold text-yellow-300">ต่อเนื่องกันทั้ง 5 ด่าน</span> เพื่ออัปเกรดเป็น Password Guru</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-yellow-950 text-[#FFD100] border border-yellow-800/60 flex items-center justify-center font-bold text-xs font-mono">02</span>
                    <span>ระบบจะบีบเวลาลงเรื่อยๆ จาก <span className="font-semibold text-[#FFD100]">{difficulty === 'easy' ? '25' : difficulty === 'medium' ? '10' : '5'} วินาที ลงไปจนถึง {difficulty === 'easy' ? '5' : '3'} วินาที</span> ในด่านสุดท้าย</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-yellow-950 text-[#FFD100] border border-yellow-800/60 flex items-center justify-center font-bold text-xs font-mono">03</span>
                    <span>ตอบผิดเพียงจุดเดียว หรือปล่อยให้หมดเวลา = <span className="font-semibold text-rose-400">ระบบจะปิดล็อกและล้มเหลวทันที!</span></span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-yellow-950 text-[#FFD100] border border-yellow-800/60 flex items-center justify-center font-bold text-xs font-mono">04</span>
                    <span>ทุกรอบจะสุ่มคำถามและสลับลำดับตัวเลือกใหม่ทั้งหมด ป้องกันการจำคำตอบ!</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255,209,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="w-full max-w-md py-4 bg-[#FFD100] text-slate-950 rounded-xl font-bold text-base transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(255,209,0,0.15)] border-t border-yellow-200"
                id="btn-start"
              >
                <span>INITIALIZE CHALLENGE</span>
                <ChevronRight size={18} />
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
                <div className="inline-block px-3 py-1 bg-yellow-950/80 border border-yellow-850 text-[#FFD100] rounded-md text-xs font-bold tracking-widest uppercase">
                  ด่าน {currentLevelIndex + 1} / 5: {currentLevel.focusTopic}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white max-w-3xl mx-auto leading-relaxed px-2 font-sans">
                  {currentLevel.questionText}
                </h2>
              </div>

              {/* Immersive Circular Timer Section */}
              <div className="relative flex items-center justify-center py-4">
                {/* Glowing rotating/pulsing outer ring */}
                <div className={`absolute rounded-full border-4 ${timeLeft < 2.5 ? 'border-rose-500/20 scale-125 animate-ping' : 'border-yellow-500/10 scale-125'} transition-all duration-300 w-32 h-32`}></div>
                
                {/* Timer Core Circle */}
                <div className={`w-32 h-32 rounded-full border-4 ${timeLeft < 2.5 ? 'border-rose-500 bg-rose-950/20 shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'border-[#FFD100] bg-slate-900 shadow-[0_0_30px_rgba(255,209,0,0.2)]'} flex flex-col items-center justify-center transition-all duration-300 z-10`}>
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${timeLeft < 2.5 ? 'text-rose-400' : 'text-yellow-500/60'}`}>Time Left</span>
                  <span className={`text-4xl font-extrabold ${timeLeft < 2.5 ? 'text-rose-500 font-black' : 'text-[#FFD100]'}`}>
                    {timeLeft < 10 ? '0' : ''}{timeLeft.toFixed(1)}
                  </span>
                  <span className={`text-[8px] uppercase font-bold ${timeLeft < 2.5 ? 'text-rose-400/80' : 'text-yellow-600'}`}>Seconds</span>
                </div>
              </div>

              {/* Dynamic Smooth Progress Indicator at base of timer */}
              <div className="max-w-md mx-auto w-full px-4">
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-yellow-950/60">
                  <motion.div
                    className={`h-full ${timeLeft < 2.5 ? 'bg-rose-500 animate-pulse' : timeLeft < 5 ? 'bg-amber-500' : 'bg-yellow-400'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / currentLevel.timeLimit) * 100}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Touchscreen Option Grid (Clean option cards with nice metadata labels) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" id="options-container">
                {currentLevel.options.map((option, idx) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOptionSelect(option)}
                    className="p-6 bg-slate-900 border border-yellow-900/40 rounded-xl hover:bg-yellow-950/30 hover:border-[#FFD100] transition-all text-left relative group overflow-hidden cursor-pointer flex flex-col justify-between min-h-[120px] focus:outline-none"
                  >
                    {/* Identification header flag */}
                    <span className="absolute top-0 left-0 bg-yellow-900/60 text-[9px] px-2.5 py-1 uppercase font-bold text-yellow-200 tracking-wider">
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    
                    {/* Option Text in large monospace */}
                    <span className="text-base md:text-lg text-yellow-100 block mt-5 break-all font-semibold font-mono tracking-wide leading-relaxed">
                      {option.text}
                    </span>
                    
                    {/* Visual hint indicator at bottom */}
                    <div className="mt-4 flex items-center justify-between w-full border-t border-yellow-950/40 pt-2 text-[10px]">
                      <span className="text-yellow-600 font-bold uppercase tracking-widest group-hover:text-[#FFD100] transition-colors">
                        [ TAP_TO_EVALUATE ]
                      </span>
                      <ChevronRight size={12} className="text-yellow-600 group-hover:text-[#FFD100] transition-colors" />
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
              className="bg-slate-900/80 border-2 border-yellow-900/40 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col space-y-6 relative"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFD100]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFD100]" />

              {/* Outcome Header Banner */}
              {selectedOptionId === '' ? (
                // TIMEOUT STATE
                <div className="flex flex-col items-center text-center p-5 bg-rose-950/30 border border-rose-500/30 rounded-xl">
                  <div className="p-3 bg-rose-500 text-slate-950 rounded-full mb-3 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce">
                    <Timer size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-rose-400 tracking-wider">หมดเวลาพิจารณา (TIME_LIMIT_EXCEEDED)</h3>
                  <p className="text-xs text-rose-300/80 mt-1 font-sans">คุณปล่อยให้เวลาของระบบความปลอดภัยหมดลงก่อนตัดสินใจ</p>
                </div>
              ) : currentLevel.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                // CORRECT STATE
                <div className="flex flex-col items-center text-center p-5 bg-yellow-950/20 border border-[#FFD100]/30 rounded-xl shadow-[0_0_15px_rgba(255,209,0,0.1)]">
                  <div className="p-3 bg-[#FFD100] text-slate-950 rounded-full mb-3 shadow-[0_0_15px_rgba(255,209,0,0.4)]">
                    <Check size={28} className="stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FFD100] tracking-wider font-mono">ยอมรับข้อมูล! ผ่านด่านความปลอดภัย</h3>
                  <p className="text-xs text-yellow-200/80 mt-1 font-sans">คุณเลือกคุณสมบัติของ Password ได้แข็งแกร่งที่สุดในระดับนี้</p>
                </div>
              ) : (
                // INCORRECT STATE
                <div className="flex flex-col items-center text-center p-5 bg-rose-950/30 border border-rose-500/30 rounded-xl">
                  <div className="p-3 bg-rose-500 text-slate-950 rounded-full mb-3 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                    <X size={28} className="stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-rose-400 tracking-wider">ปฏิเสธข้อมูล! พาสเวิร์ดยังไม่ปลอดภัยพอ</h3>
                  <p className="text-xs text-rose-300/80 mt-1 font-sans">รหัสที่คุณเลือกมีจุดโหว่ที่แฮกเกอร์ใช้เจาะระบบได้ในเวลาอันสั้น</p>
                </div>
              )}

              {/* Password breakdown list */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-[#FFD100] uppercase tracking-widest flex items-center">
                  <BookOpen size={14} className="mr-2" /> 
                  SECURITY ENTROPY BREAKDOWN [ข้อมูลเปรียบเทียบ]
                </h4>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {currentLevel.options.map((option, idx) => {
                    const isSelected = option.id === selectedOptionId;
                    const isCorrect = option.isCorrect;
                    
                    let cardBorder = "border-yellow-950/30";
                    let cardBg = "bg-slate-950/60";
                    let indicatorLabel = `OPTION ${String.fromCharCode(65 + idx)}`;

                    if (isSelected && isCorrect) {
                      cardBorder = "border-[#FFD100] bg-yellow-950/40 shadow-[0_0_10px_rgba(255,209,0,0.15)]";
                      cardBg = "bg-yellow-950/20";
                    } else if (isSelected && !isCorrect) {
                      cardBorder = "border-rose-500 bg-rose-950/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
                      cardBg = "bg-rose-950/20";
                    } else if (isCorrect) {
                      cardBorder = "border-yellow-500/50 border-dashed bg-yellow-950/20";
                      indicatorLabel = `EXPECTED SECURE CHOICE [ ${String.fromCharCode(65 + idx)} ]`;
                    }

                    return (
                      <div 
                        key={option.id} 
                        className={`p-4 rounded-xl border transition-all text-xs flex flex-col space-y-2 ${cardBorder} ${cardBg}`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-[#FFD100] font-bold bg-slate-900 px-2 py-0.5 rounded border border-yellow-900/40">
                              {indicatorLabel}
                            </span>
                            <span className="font-mono text-sm font-bold text-white tracking-wide break-all">
                              {option.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            {getStrengthBadge(option.strength)}
                          </div>
                        </div>
                        <p className="text-slate-300 font-sans leading-relaxed text-xs">
                          {option.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Learning Tip */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-yellow-900/40 flex items-start space-x-3 text-xs md:text-sm">
                <Info size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-bold text-cyan-300 block font-mono text-xs uppercase tracking-wider">
                    CRITICAL SECURITY INTELLIGENCE (คำแนะนำเพิ่มเติม)
                  </span>
                  <p className="leading-relaxed text-slate-300 text-xs">{currentLevel.learningTip}</p>
                </div>
              </div>

              {/* Next Step / Retry Navigation */}
              <div className="pt-2">
                {selectedOptionId !== '' && currentLevel.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: '0 0 15px rgba(255,209,0,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleNextStep}
                    className="w-full py-4 bg-[#FFD100] text-slate-950 rounded-xl font-bold text-base flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(255,209,0,0.15)]"
                    id="btn-next"
                  >
                    <span>{currentLevelIndex === activeLevels.length - 1 ? 'PROCEED TO SUMMARY' : 'NEXT STAGE (ไปต่อด่านถัดไป)'}</span>
                    <ChevronRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: '0 0 15px rgba(244,63,94,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleNextStep}
                    className="w-full py-4 bg-rose-500 text-slate-950 rounded-xl font-bold text-base flex items-center justify-center space-x-2 cursor-pointer"
                    id="btn-fail-next"
                  >
                    <span>ANALYZE RECONSTRUCTION (ดูข้อผิดพลาดเพื่อแก้ไข)</span>
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
              className="bg-slate-900/75 border-2 border-rose-900/50 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(244,63,94,0.06)] flex flex-col items-center text-center space-y-6 relative backdrop-blur-xs"
              id="gameover-card"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-rose-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-rose-500" />

              <div className="w-20 h-20 bg-rose-950/60 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-pulse">
                <ShieldAlert size={42} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-rose-400 tracking-wider uppercase">
                  ACCESS DENIED: BREACH DETECTED
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                  ระบบรักษาความปลอดภัยล้มเหลวใน <span className="font-bold text-rose-400 underline font-mono">ด่านที่ {currentLevelIndex + 1}</span> แฮกเกอร์และซอฟต์แวร์เดารหัสสามารถเจาะบัญชีของคุณสำเร็จในพริบตา!
                </p>
              </div>

              {/* Stats overview */}
              <div className="w-full bg-slate-950/80 rounded-xl p-5 border border-rose-950/60 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4 text-center">
                  SESSION TERMINAL DIAGNOSTICS [สรุปข้อมูลจำลอง]
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="border-r border-yellow-950">
                    <span className="text-2xl font-bold text-white block">{score} / 5</span>
                    <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">ด่านที่ผ่าน</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-amber-500 block">{(totalTimeSaved).toFixed(1)}s</span>
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">เวลาที่รักษาได้</span>
                  </div>
                </div>

                {/* Grid of level results */}
                <div className="mt-5 pt-4 border-t border-yellow-950 flex justify-center space-x-2">
                  {levelsCompleted.map((isSuccess, idx) => {
                    const isCurrentFailed = idx === currentLevelIndex;
                    return (
                      <div 
                        key={idx} 
                        className={`w-12 py-2 rounded flex flex-col items-center justify-center text-xs font-mono font-bold border ${
                          isSuccess 
                            ? "bg-yellow-950/40 text-[#FFD100] border-[#FFD100]/30" 
                            : isCurrentFailed 
                              ? "bg-rose-950/50 text-rose-400 border-rose-500 animate-pulse" 
                              : "bg-slate-950 text-slate-600 border-yellow-950"
                        }`}
                      >
                        <span>#{idx + 1}</span>
                        <span className="mt-1">
                          {isSuccess ? <Check size={11} className="stroke-[3]" /> : isCurrentFailed ? <X size={11} className="stroke-[3]" /> : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Hint */}
              <div className="text-xs text-slate-400 max-w-md italic font-sans">
                &ldquo;ความแข็งแกร่งของรหัสผ่านไม่ได้ขึ้นอยู่กับสิ่งที่คุณจำได้ง่าย แต่ขึ้นอยู่กับความซับซ้อนสุ่มที่ระบบ Brute force ไม่สามารถจับทิศทางลวดลายของคำศัพท์ทั่วไปได้ พยายามหลีกเลี่ยงชื่อ วันเกิด หรือคีย์บอร์ดที่เรียงปุ่ม&rdquo;
              </div>

              {/* Retry Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(244,63,94,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="w-full max-w-sm py-4 bg-rose-500 hover:bg-rose-600 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.15)]"
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
              className="bg-slate-900/80 border-2 border-[#FFD100] rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(255,209,0,0.15)] flex flex-col items-center text-center space-y-6 relative overflow-hidden"
              id="victory-card"
            >
              {/* Confetti Visual neon yellow bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
              
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FFD100]" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FFD100]" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FFD100]" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FFD100]" />

              <div className="w-24 h-24 bg-yellow-950/80 border-2 border-[#FFD100] rounded-full flex items-center justify-center text-[#FFD100] shadow-[0_0_30px_rgba(255,209,0,0.4)] animate-bounce mt-3">
                <Trophy size={52} className="stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-yellow-950 border border-yellow-500/50 text-[#FFD100] rounded text-[10px] font-bold uppercase tracking-widest mb-1 animate-pulse">
                  ACCESS STATUS: AUTHORIZED GURU LEVEL
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide leading-none uppercase">
                  คุณคือ PASSWORD GURU!
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-sans">
                  ยินดีด้วย! คุณได้รับการรับรองความรู้ขั้นสูงสุดในการเลือกและปกป้องรหัสผ่าน คุณสามารถแยกแยะความแตกต่างเพื่อสร้างระดับการเข้ารหัสที่สมบูรณ์แบบได้ครบทั้ง 5 ด่าน ภายใต้ความกดดันเวลาจำกัดขั้นวิกฤต!
                </p>
              </div>

              {/* Stats overview */}
              <div className="w-full bg-slate-950/80 rounded-xl p-5 border border-yellow-900/50 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD100] mb-4 text-center">
                  AUTHORIZED SECURITY METRICS [ข้อมูลชัยชนะ]
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-yellow-950">
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-white block">5 / 5</span>
                    <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-wider block">ผ่านครบทุกด่าน</span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-cyan-400 block">
                      {timeTakenPerLevel.reduce((a, b) => a + b, 0).toFixed(1)}s
                    </span>
                    <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-wider block">เวลารวมที่ใช้</span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-amber-400 block">
                      {totalTimeSaved.toFixed(1)}s
                    </span>
                    <span className="text-[8px] text-amber-500 font-bold uppercase tracking-wider block">เวลาประหยัดได้</span>
                  </div>
                </div>
              </div>

              {/* Actionable security tips */}
              <div className="w-full bg-yellow-950/40 rounded-xl p-5 border border-yellow-500/30 text-left space-y-4 font-sans">
                <h3 className="text-xs font-bold text-[#FFD100] uppercase tracking-widest flex items-center font-mono">
                  <Award size={14} className="mr-2 text-amber-400" /> 3 กฎเหล็กสู่ความปลอดภัยตลอดกาล
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-[#FFD100] flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className="text-white font-mono uppercase text-[10px] block mb-0.5">[01] ใช้ Password Manager</strong> เลิกใช้และจำรหัสผ่านที่สั้นหรือจำเจเอง หันมาใช้เครื่องมือสร้างรหัสแบบสุ่มความยาวไม่ต่ำกว่า 16 อักขระ</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-[#FFD100] flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className="text-white font-mono uppercase text-[10px] block mb-0.5">[02] เปิดใช้งานระบบ 2FA เสมอ</strong> รหัสผ่านที่แกร่งที่สุดก็ยังเสี่ยงต่อฟิชชิ่ง การใช้เครื่องมือยืนยันตัวตนขั้นที่สอง (เช่น Authenticator app) ช่วยเซฟบัญชีได้อีกระดับ</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check size={14} className="text-[#FFD100] flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong className="text-white font-mono uppercase text-[10px] block mb-0.5">[03] ป้องกันการรั่วไหลด้วยความยาว</strong> หลีกเลี่ยงรูปแบบคีย์บอร์ดที่เรียงเป็นระเบียบ แนะนำให้ใช้วลีสุ่มเชื่อมด้วยตัวอักษรพิเศษที่ไม่เป็นคำในพจนานุกรมเล่มหลัก</span>
                  </li>
                </ul>
              </div>

              {/* Restart Button Area */}
              <div className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,209,0,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestart}
                  className="w-full py-4 bg-[#FFD100] text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(255,209,0,0.15)]"
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
      <footer className="border-t border-yellow-900/30 bg-slate-950/80 px-4 md:px-8 py-5 mt-auto text-yellow-700">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] font-mono gap-3">
          <div className="flex flex-wrap justify-center items-center gap-3">
            <span className="flex items-center gap-1">
              <Terminal size={12} className="text-yellow-500" /> TERMINAL: TTY-SYSTEM
            </span>
            <span className="w-px h-3.5 bg-yellow-950 hidden md:inline"></span>
            <span>BUFFER: SHIELDED_SSL_ACTIVE</span>
            <span className="w-px h-3.5 bg-yellow-950 hidden md:inline"></span>
            <span className="text-cyan-400">TARGET: PASSWORD_GURU_DECRYPT_VERIFIED</span>
          </div>
          <div>
            &copy; 2026 PASSWORD GURU LABORATORY. ALL SECURED.
          </div>
        </div>
      </footer>

    </div>
  );
}
