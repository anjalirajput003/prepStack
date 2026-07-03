import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck, FaCode } from "react-icons/fa";
import { LANGUAGES } from "../constants/languages";

function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const selected =
    LANGUAGES.find((language) => language.id === selectedLanguage) ||
    LANGUAGES[0];

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(id) {
    onLanguageChange(id);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() => {
        document.getElementById("lang-option-0")?.focus();
      });
    }
  }

  function handleOptionKeyDown(e, index) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      document.getElementById(`lang-option-${index + 1}`)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        triggerRef.current?.focus();
      } else {
        document.getElementById(`lang-option-${index - 1}`)?.focus();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(LANGUAGES[index].id);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <style>{`
        @keyframes ivLangIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .iv-lang-in { animation: ivLangIn 0.15s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .iv-lang-in { animation: none !important; }
        }
      `}</style>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15 text-[13px] font-medium text-slate-200 transition-all min-w-[172px]"
      >
        <FaCode className="text-[#5B8DEF] text-[12px] shrink-0" />
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <FaChevronDown
          className={`text-[10px] text-slate-500 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[210px] max-h-72 overflow-y-auto py-1.5 rounded-xl bg-[#101a2e] border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.55)] iv-lang-in"
        >
          {LANGUAGES.map((language, index) => {
            const isSelected = language.id === selectedLanguage;
            return (
              <li
                key={language.id}
                id={`lang-option-${index}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(language.id)}
                onKeyDown={(e) => handleOptionKeyDown(e, index)}
                className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-[13px] cursor-pointer transition-colors outline-none ${
                  isSelected
                    ? "bg-[#5B8DEF]/15 text-[#8FB2FF] font-semibold"
                    : "text-slate-300 hover:bg-white/[0.06] focus:bg-white/[0.06]"
                }`}
              >
                <span className="flex-1 truncate">{language.label}</span>
                {isSelected && <FaCheck className="text-[10px] shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;
