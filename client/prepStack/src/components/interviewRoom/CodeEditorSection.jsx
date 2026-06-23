import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";

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
    <>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <Editor
        key={selectedLanguage}
        height="600px"
        language={selectedLanguage}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />
      <h3>Output</h3>
      <div
        style={{
          border: "1px solid gray",
          minHeight: "150px",
          padding: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {output || "No output yet"}
      </div>

      <button onClick={handleRunCode} disabled={isExecuting}>
        {isExecuting ? "Running..." : "Run Code"}
      </button>
    </>
  );
};

export default CodeEditorSection;
