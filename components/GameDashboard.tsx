import React, { useState, useEffect } from 'react';
import { GroupData, Student, GameState } from '../types';
import { generateChallenge, evaluateSubmission } from '../services/geminiService';
import Button from './Button';
import CodeEditor from './CodeEditor';
import { Terminal, AlertCircle, CheckCircle2, Play, RefreshCw, XCircle, Award, Bookmark, Clock, Calendar, CheckSquare } from 'lucide-react';

interface GameDashboardProps {
  groupData: GroupData;
  onFinish: (finalGroupData: GroupData) => void;
}

const GameDashboard: React.FC<GameDashboardProps> = ({ groupData, onFinish }) => {
  const [students, setStudents] = useState<Student[]>(groupData.students);
  const [game, setGame] = useState<GameState>({
    currentStudentId: null,
    currentChallenge: null,
    isEvaluating: false,
    evaluationResult: null,
  });
  const [currentCode, setCurrentCode] = useState('');
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingStudents = students.filter(s => s.status === 'PENDING');
  const completedStudents = students.filter(s => s.status === 'COMPLETED');
  const currentStudent = students.find(s => s.id === game.currentStudentId);
  const totalScore = students.reduce((acc, s) => acc + s.score, 0);

  useEffect(() => {
    if (pendingStudents.length === 0 && !game.currentStudentId) {
      onFinish({ ...groupData, students });
    }
  }, [pendingStudents, game.currentStudentId, onFinish, groupData, students]);

  const selectNextStudent = async () => {
    if (pendingStudents.length === 0) return;
    const availableIds = pendingStudents.map(s => s.id);
    const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];

    setStudents(prev => prev.map(s => s.id === randomId ? { ...s, status: 'PLAYING' } : s));
    setIsLoadingChallenge(true);
    setGame(prev => ({ ...prev, currentStudentId: randomId, evaluationResult: null, currentChallenge: null }));
    
    try {
      const challenge = await generateChallenge();
      setGame(prev => ({ ...prev, currentChallenge: challenge }));
      setCurrentCode(challenge.buggyCode);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  const handleSubmit = async () => {
    if (!game.currentChallenge || !currentStudent) return;
    setGame(prev => ({ ...prev, isEvaluating: true }));
    const result = await evaluateSubmission(game.currentChallenge, currentCode);
    setGame(prev => ({ ...prev, isEvaluating: false, evaluationResult: result }));
    setStudents(prev => prev.map(s => 
      s.id === currentStudent.id ? { ...s, score: result.score, status: 'COMPLETED' } : s
    ));
  };

  const handleNextTurn = () => {
    setGame({ currentStudentId: null, currentChallenge: null, isEvaluating: false, evaluationResult: null });
    setCurrentCode('');
  };

  const formattedDate = currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <header className="bg-white border-b-4 border-icem-teal flex items-center justify-between px-6 py-3 z-10 shrink-0 shadow-md">
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
             <div className="bg-slate-900 px-4 py-2 rounded-lg border-2 border-slate-100 shadow-sm">
                <div className="text-white text-[9px] leading-tight font-black tracking-tight text-center uppercase">
                   ICEM Pune<br/>
                   <span className="text-icem-teal font-bold">Basic Engg. Dept</span>
                </div>
             </div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
          <div>
            <h1 className="text-slate-900 font-black text-xl leading-none flex items-center gap-2">
                Code Loom: <span className="text-icem-orange">Weave the Missing Logic</span>
            </h1>
            <div className="flex items-center gap-3 mt-1.5 font-mono">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                    <Calendar className="w-3 h-3 text-icem-teal" /> {formattedDate}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-icem-orange" /> {formattedTime}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-red-600 font-black uppercase tracking-tighter ml-2">
                    <Award className="w-3 h-3" /> TAE 2 EXAM
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-xl px-5 py-2 flex flex-col items-center shadow-lg">
             <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Total Points</span>
             <span className="text-icem-teal font-mono text-2xl font-black leading-none">{totalScore}</span>
          </div>
          <div className="bg-icem-teal rounded-xl px-5 py-2 flex flex-col items-center shadow-lg shadow-teal-900/20">
             <span className="text-[9px] text-white/70 font-black uppercase tracking-widest leading-none mb-1">Roster</span>
             <span className="text-white font-mono text-2xl font-black leading-none">{completedStudents.length}<span className="text-white/40 text-xs font-normal">/{students.length}</span></span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-5 border-b border-slate-800 pb-3">Participant List</h2>
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className={`p-3.5 rounded-xl flex items-center justify-between border transition-all duration-300 ${student.id === game.currentStudentId ? 'bg-icem-teal/10 border-icem-teal/50' : 'bg-slate-800/40 border-slate-700/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${student.status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : student.status === 'PLAYING' ? 'bg-icem-orange animate-pulse' : 'bg-slate-700'}`} />
                    <span className={`text-sm font-bold truncate max-w-[130px] ${student.id === game.currentStudentId ? 'text-icem-teal' : 'text-slate-300'}`}>{student.name}</span>
                  </div>
                  {student.status === 'COMPLETED' && <span className="text-[10px] font-mono font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+{student.score}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 border-t border-slate-800 bg-slate-950/40">
             <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">
                <Bookmark className="w-3 h-3 text-icem-teal" /> Team ID
             </div>
             <div className="text-white font-mono text-sm font-black truncate bg-slate-950 p-2 rounded-lg border border-slate-800">{groupData.name}</div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
          {!game.currentStudentId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center loom-bg">
              <div className="w-24 h-24 bg-icem-teal/10 rounded-3xl flex items-center justify-center mb-8 ring-4 ring-icem-teal/20 rotate-3 transition-transform hover:rotate-6">
                <Terminal className="w-10 h-10 text-icem-teal" />
              </div>
              <h2 className="text-4xl font-serif font-black text-white mb-3">Awaiting Examiner Initialization</h2>
              <p className="text-slate-500 mb-10 max-w-lg font-medium leading-relaxed uppercase tracking-widest text-[11px]">
                  The logic loom is primed. Subject faculty requires the next student to start their evaluation for the TAE 2 exam.
              </p>
              {pendingStudents.length > 0 && (
                <Button onClick={selectNextStudent} className="text-lg px-12 py-5 bg-icem-teal hover:bg-teal-600 shadow-2xl rounded-2xl font-black uppercase">
                  <Play className="w-5 h-5 fill-current" /> Initialize Next Participant
                </Button>
              )}
            </div>
          ) : isLoadingChallenge ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/80 backdrop-blur-xl">
               <div className="w-20 h-20 border-t-4 border-l-4 border-icem-teal rounded-full animate-spin mb-8"></div>
               <h3 className="text-2xl font-serif text-white uppercase tracking-[0.2em] font-black">Weaving Challenge Matrix</h3>
               <p className="text-slate-600 mt-4 font-mono text-xs animate-pulse tracking-widest">ENCRYPTING LOGIC FLAWS FOR: {currentStudent?.name.toUpperCase()}</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/20 flex flex-col overflow-y-auto custom-scrollbar">
                <div className="p-8 space-y-8">
                  <div>
                    <span className="inline-flex px-3 py-1 bg-icem-orange/20 text-icem-orange text-[10px] font-black uppercase tracking-widest rounded-full mb-2">Examinee</span>
                    <h2 className="text-3xl font-black text-white leading-tight tracking-tight">{currentStudent?.name}</h2>
                  </div>

                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black text-icem-teal uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Logic Objective
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-sm italic font-serif">
                          "{game.currentChallenge?.description}"
                        </p>
                    </div>
                    <div className="pt-6 border-t border-slate-800">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Expected Output</h4>
                      <pre className="bg-black p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {game.currentChallenge?.expectedOutput}
                      </pre>
                    </div>
                  </div>

                  {game.evaluationResult && (
                    <div className={`rounded-2xl p-6 border-2 shadow-2xl transition-all animate-in zoom-in-95 duration-500 ${game.evaluationResult.score >= 10 ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-red-950/20 border-red-500/40'}`}>
                      <div className="flex items-start justify-between mb-5">
                         <div className="flex items-center gap-3">
                            {game.evaluationResult.score >= 10 ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <XCircle className="w-7 h-7 text-red-400" />}
                            <div>
                                <h3 className={`font-black uppercase tracking-tighter text-xl leading-none ${game.evaluationResult.score >= 10 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {game.evaluationResult.score >= 10 ? 'VERIFIED' : 'FAILED'}
                                </h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">TAE 2 Assessment Sync</p>
                            </div>
                         </div>
                         <div className="bg-slate-900 px-4 py-2 rounded-2xl border-2 border-slate-700 shadow-inner">
                           <span className="text-2xl font-black text-white">{game.evaluationResult.score}</span><span className="text-[10px] text-slate-500 font-black ml-1">/15</span>
                         </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-6 leading-relaxed font-bold italic">"{game.evaluationResult.feedback}"</p>
                      
                      <Button 
                        onClick={handleNextTurn} 
                        className="w-full bg-icem-orange hover:bg-orange-600 text-white font-black py-4 uppercase tracking-[0.1em] text-xs rounded-xl shadow-lg border-none ring-2 ring-icem-orange/20 ring-offset-2 ring-offset-slate-950"
                      >
                        <CheckSquare className="w-4 h-4" /> Acknowledge & Sync Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col p-6 bg-slate-950">
                <div className="flex-1 mb-6 relative shadow-2xl">
                  <CodeEditor code={currentCode} onChange={setCurrentCode} readOnly={!!game.evaluationResult} />
                </div>
                {!game.evaluationResult && (
                  <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 p-5 rounded-2xl border border-slate-800 backdrop-blur-md gap-4">
                    <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                       <Award className="w-4 h-4 text-icem-orange" /> TAE 2 Real-time Assessment
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <Button onClick={() => setCurrentCode(game.currentChallenge?.buggyCode || '')} variant="secondary" className="px-6 text-[10px] uppercase font-black border-slate-700" disabled={game.isEvaluating}>
                        <RefreshCw className="w-4 h-4" /> Reset
                      </Button>
                      <Button onClick={handleSubmit} isLoading={game.isEvaluating} className="bg-icem-teal hover:bg-teal-600 px-10 rounded-xl font-black uppercase text-xs shadow-lg flex-1 md:flex-none">Verify Correction</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GameDashboard;