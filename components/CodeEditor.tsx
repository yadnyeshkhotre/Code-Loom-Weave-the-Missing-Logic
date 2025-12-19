import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-sm h-full flex flex-col group focus-within:border-indigo-500 transition-colors">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <span className="text-xs text-slate-400 ml-2">main.c</span>
        {readOnly && <span className="ml-auto text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Read Only</span>}
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="flex-1 w-full bg-transparent text-slate-200 p-4 resize-none outline-none custom-scrollbar leading-relaxed"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
};

export default CodeEditor;