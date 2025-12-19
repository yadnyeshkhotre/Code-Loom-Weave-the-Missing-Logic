import React, { useState, useEffect } from 'react';
import { GroupData, Student } from '../types';
import Button from './Button';
import { UserPlus, Clock, Calendar, GraduationCap, Award, Trash2, PlusCircle, Info } from 'lucide-react';

interface SetupFormProps {
  onComplete: (data: GroupData) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [groupName, setGroupName] = useState('');
  const [studentNames, setStudentNames] = useState<string[]>(Array(6).fill(''));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...studentNames];
    newNames[index] = value;
    setStudentNames(newNames);
  };

  const addStudent = () => {
    setStudentNames([...studentNames, '']);
  };

  const removeStudent = (index: number) => {
    if (studentNames.length <= 1) return;
    const newNames = studentNames.filter((_, i) => i !== index);
    setStudentNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeNames = studentNames.filter(name => name.trim() !== '');
    if (!groupName.trim() || activeNames.length === 0) return;

    const students: Student[] = activeNames.map((name, index) => ({
      id: `student-${index}-${Date.now()}`,
      name: name.trim(),
      score: 0,
      status: 'PENDING'
    }));

    onComplete({
      name: groupName.trim(),
      students
    });
  };

  const isFormValid = groupName.trim() !== '' && studentNames.some(n => n.trim() !== '');

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 border-b-4 border-icem-orange">
        <div className="w-full md:w-auto flex justify-center">
            <div className="bg-slate-50 px-5 py-3 rounded-xl border-2 border-slate-100 shadow-sm">
                <div className="text-slate-900 font-bold text-center">
                    <span className="text-icem-teal block text-sm leading-tight uppercase tracking-tighter font-black">Indira College of</span>
                    <span className="text-icem-blue block text-base leading-tight uppercase font-black">Engineering & Management</span>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent my-1.5"></div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Pune | Affiliated to SPPU</span>
                </div>
            </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-slate-900 font-serif text-3xl font-black tracking-tight leading-tight">Code Loom: <span className="text-icem-orange">Weave the Missing Logic</span></h1>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mt-1">Basic Engineering Department | C Programming</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
            <div className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-black border border-red-200 flex items-center gap-2 shadow-sm">
                <Award className="w-4 h-4" /> TAE 2 EXAM ACTIVITY
            </div>
            <div className="flex flex-col items-end text-slate-500 font-mono text-[10px] font-bold">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-icem-teal" /> {formattedDate}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-icem-orange" /> {formattedTime}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">
                    Competition Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-700 focus:ring-2 focus:ring-icem-teal focus:border-transparent outline-none transition-all font-mono text-lg"
                    placeholder="Enter Team ID / Name..."
                  />
                </div>
                <div className="shrink-0">
                    <Button 
                        type="button" onClick={addStudent}
                        variant="secondary"
                        className="py-4 border-icem-teal/30 text-icem-teal hover:bg-icem-teal/10"
                    >
                        <PlusCircle className="w-5 h-5" /> Add Student
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Student Participants ({studentNames.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentNames.map((name, index) => (
                  <div key={index} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserPlus className="h-4 w-4 text-slate-600 group-focus-within:text-icem-teal transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-700 focus:ring-2 focus:ring-icem-teal focus:border-transparent outline-none transition-all"
                          placeholder={`Participant ${index + 1} Name`}
                        />
                    </div>
                    {studentNames.length > 1 && (
                        <button 
                            type="button" onClick={() => removeStudent(index)}
                            className="p-3.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/30"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" disabled={!isFormValid} 
                className="w-full text-xl py-5 bg-icem-teal hover:bg-teal-600 rounded-2xl shadow-lg shadow-teal-900/20 font-black uppercase tracking-widest"
              >
                Launch Competition Environment
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-icem-orange font-black text-[10px] uppercase tracking-[0.2em] mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4 h-4" /> Organizing Faculty
            </h3>
            <div className="space-y-5">
              <div className="border-l-4 border-icem-teal pl-4 py-1">
                <p className="text-white font-black text-sm leading-tight">Prof. Poorna Shankar</p>
                <p className="text-icem-teal text-[10px] font-bold uppercase mt-0.5">HOD & Subject Teacher</p>
              </div>
              <div className="border-l-4 border-slate-700 pl-4 py-1">
                <p className="text-slate-200 font-bold text-sm leading-tight">Prof. Sanjay Mathapati</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">Subject Teacher</p>
              </div>
              <div className="border-l-4 border-slate-700 pl-4 py-1">
                <p className="text-slate-200 font-bold text-sm leading-tight">Mr. Yadnyesh Khotre</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">Subject Teacher</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-icem-blue/10 rounded-2xl border border-icem-blue/20 backdrop-blur-sm">
            <h3 className="text-icem-blue font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Exam Protocol
            </h3>
            <ul className="text-[11px] text-slate-400 space-y-3 font-medium">
              <li className="flex gap-2">
                  <span className="text-icem-teal">●</span> 
                  <span>Official task for <strong className="text-white">TAE 2 Exam</strong>.</span>
              </li>
              <li className="flex gap-2">
                  <span className="text-icem-teal">●</span> 
                  <span>Correct logic corrections earn maximum of 15 points.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;