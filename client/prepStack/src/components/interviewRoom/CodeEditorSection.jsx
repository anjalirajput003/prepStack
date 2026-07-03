import React from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector"; 
import { FaPlay, FaTerminal } from "react-icons/fa";

const CodeEditorSection = ({
  selectedLanguage,
  setSelectedLanguage,
  code,
  handleCodeChange,
  output,
  handleRunCode,
  isExecuting,
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Editor Toolbar */}
      <div className="flex justify-between items-center px-5 py-2.5 border-b border-white/[0.06] bg-[#0e1526]">
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
        <button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="px-5 py-2 bg-[#34D399]/15 text-[#34D399] hover:bg-[#34D399]/25 hover:text-[#5EE9B5] rounded-lg flex items-center gap-2 text-[13px] font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#34D399]/25 active:scale-[0.97]"
        >
          {isExecuting ? (
            <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <FaPlay className="text-[10px]" />
          )}
          {isExecuting ? "Running…" : "Run Code"}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative w-full">
        <Editor
          key={selectedLanguage}
          language={selectedLanguage}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
          }}
          loading={
            <div className="text-slate-500 p-4 text-sm">Loading editor…</div>
          }
        />
      </div>

      {/* Output Console */}
      <div className="h-[230px] border-t border-white/[0.06] bg-[#070b14] flex flex-col shrink-0">
        <div className="px-4 py-2 bg-[#0e1526] border-b border-white/[0.05] flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]/70" />
          </span>
          <FaTerminal className="text-slate-600 text-[10px] ml-1" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Output
          </span>
        </div>
        <div
          className="flex-1 p-4 text-[13px] text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {output ? (
            <span>
              <span className="text-[#34D399] mr-2 select-none">$</span>
              {output}
            </span>
          ) : (
            <span className="text-slate-600">Waiting for code execution…</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorSection;
