import { LANGUAGES } from "../constants/languages";

function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
    >
      {LANGUAGES.map((language) => (
        <option key={language.id} value={language.id}>
          {language.label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
