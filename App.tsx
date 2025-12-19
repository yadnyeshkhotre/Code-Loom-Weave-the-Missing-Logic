import React, { useState, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import GameDashboard from './components/GameDashboard';
import { GroupData, AppState } from './types';
import Button from './components/Button';
import { Trophy, RefreshCcw, GraduationCap, Award, Calendar, Clock } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [finishTime, setFinishTime] = useState<Date | null>(null);

  const handleSetupComplete = (data: GroupData) => {
    setGroupData(data);
    setAppState(AppState.GAME);
  };

  const handleGameFinish = (finalData: GroupData) => {
    setGroupData(finalData);
    setFinishTime(new Date());
    setAppState(AppState.SUMMARY);
  };

  const handleRestart = () => {
    setGroupData(null);
    setFinishTime(null);
    setAppState(AppState.SETUP);
  };

  if (appState === AppState.SUMMARY && groupData) {
    const totalScore = groupData.students.reduce((a, b) => a + b.score, 0);
    const maxPossible = groupData.students.length * 15;
    const sortedStudents = [...groupData.students].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden loom-bg font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-icem-teal/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-icem-orange/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-icem-orange/10 rounded-3xl mb-8 ring-4 ring-icem-orange/20 shadow-2xl">
              <Trophy className="w-16 h-16 text-icem-orange" />
            </div>
            <h1 className="text-6xl font-serif font-black mb-3 tracking-tighter leading-tight">
                Competition <span className="text-icem-teal">Verdict</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-[0.4em] font-black text-xs mb-6">Code Loom: Weave the Missing Logic</p>
            <div className="flex flex-wrap justify-center gap-3">
                <div className="bg-red-500/10 text-red-400 px-5 py-1.5 rounded-full border-2 border-red-500/20 text-xs font-black tracking-widest uppercase">
                   TAE 2 EXAM OFFICIAL RECORD
                </div>
                {finishTime && (
                    <div className="bg-slate-900 text-slate-400 px-5 py-1.5 rounded-full border border-slate-800 text-[10px] font-mono font-bold flex items-center gap-3">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-icem-teal" /> {finishTime.toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-icem-orange" /> {finishTime.toLocaleTimeString()}</div>
                    </div>
                )}
            </div>
          </div>

          <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 grid grid-cols-1 md:grid-cols-5 backdrop-blur-md">
            <div className="md:col-span-2 p-12 border-r-2 border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Cumulative Team Points</span>
              <div className="relative group">
                  <div className="absolute -inset-4 bg-icem-teal/20 blur-2xl rounded-full opacity-50"></div>
                  <div className="relative text-8xl font-black text-white leading-none">
                    {totalScore}
                  </div>
              </div>
              <div className="text-slate-600 font-black mt-6 tracking-widest text-sm uppercase">OUT OF {maxPossible}</div>
              
              <div className="mt-12 pt-10 border-t-2 border-slate-800 w-full text-left">
                 <p className="text-icem-orange text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Faculty Panel
                 </p>
                 <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-icem-teal/30">
                        <p className="text-white font-black text-xs">Prof. Poorna Shankar</p>
                        <p className="text-icem-teal text-[8px] font-black uppercase">HOD & Subject Teacher</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-slate-300 font-bold text-xs">Prof. Sanjay Mathapati</p>
                        <p className="text-slate-500 text-[8px] font-black uppercase">Subject Teacher</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-slate-300 font-bold text-xs">Mr. Yadnyesh Khotre</p>
                        <p className="text-slate-500 text-[8px] font-black uppercase">Subject Teacher</p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="md:col-span-3 divide-y-2 divide-slate-800">
              <div className="p-8 bg-slate-900/90 flex justify-between items-center">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Award className="w-5 h-5 text-icem-teal" /> Participant Standings
                 </h3>
                 <span className="text-slate-500 font-mono text-[10px] font-black uppercase">Team: {groupData.name}</span>
              </div>
              <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                {sortedStudents.map((student, idx) => (
                    <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-800/40 transition-all duration-300 group">
                      <div className="flex items-center gap-5">
                        <span className={`w-10 h-10 flex items-center justify-center rounded-2xl font-black text-sm shadow-inner transition-transform group-hover:scale-110 ${
                          idx === 0 ? 'bg-icem-orange text-white' :
                          idx === 1 ? 'bg-slate-400 text-slate-950' :
                          idx === 2 ? 'bg-amber-800 text-white' :
                          'bg-slate-800 text-slate-600 border border-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-black text-slate-200 tracking-tight text-lg group-hover:text-white transition-colors">{student.name}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 group-hover:border-icem-teal/50 transition-all">
                         <span className="font-mono font-black text-icem-teal text-2xl leading-none">{student.score}</span>
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">PTS</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="text-center flex flex-col items-center gap-6">
             <Button onClick={handleRestart} className="px-14 py-5 bg-icem-teal hover:bg-teal-600 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl">
               <RefreshCcw className="w-5 h-5" /> Execute New Session
             </Button>
             <div className="text-center opacity-60">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-1">
                    Indira College of Engineering & Management, Pune
                 </p>
                 <p className="text-[9px] text-slate-600 font-bold italic">
                    Basic Engineering Department - C Programming Division
                 </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-icem-teal/30">
      {appState === AppState.SETUP && <div className="min-h-screen flex items-center justify-center p-4"><SetupForm onComplete={handleSetupComplete} /></div>}
      {appState === AppState.GAME && groupData && (
        <GameDashboard 
          groupData={groupData} 
          onFinish={handleGameFinish} 
        />
      )}
    </div>
  );
}

export default App;