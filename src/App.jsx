import { useState } from "react";
import axios from "axios";
import { languages } from "./languages";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setTranslated("");
    try {
      const options = {
        method: "POST",
        url: "https://google-translator9.p.rapidapi.com/v2",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "2e788494f8msh0fad4c09354a46ap1134e5jsn15e8b1547c98",
          "X-RapidAPI-Host": "google-translator9.p.rapidapi.com",
        },
        data: JSON.stringify({
          q: input,
          target: targetLang,
          source: "en",
        }),
      };
      const response = await axios.request(options);
      if (response.data?.data?.translations?.[0]?.translatedText) {
        setTranslated(response.data.data.translations[0].translatedText);
      } else if (response.data?.translatedText) {
        setTranslated(response.data.translatedText);
      } else {
        setError("Unexpected API response: " + JSON.stringify(response.data));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          JSON.stringify(err.response?.data) ||
          err.message ||
          "Translation failed. Check your API key or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translator-bg">
      <h1 className="translator-heading-animated">
        Translator App using React
      </h1>
      <div className="translator-container">
        <textarea
          className="translator-textarea"
          rows={4}
          placeholder="Enter text in English..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ marginBottom: "1.2rem" }}
        />
        <div className="translator-row" style={{ marginBottom: "1.2rem" }}>
          <label className="translator-label">Translate to:</label>
          <select
            className="translator-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="translator-btn"
          onClick={handleTranslate}
          disabled={!input || loading}
          style={{ marginBottom: "1.2rem", marginTop: "0.5rem" }}
        >
          {loading ? "Translating..." : "Translate"}
        </button>
        {error && (
          <div className="translator-error" style={{ marginBottom: "1.2rem" }}>
            {error}
          </div>
        )}
        {translated && (
          <div className="translator-result" style={{ marginBottom: "1.2rem" }}>
            <span className="translator-result-label">Translation:</span>
            <div className="translator-result-text">{translated}</div>
          </div>
        )}
      </div>
      <p className="translator-footer">Powered by RapidAPI Google Translate</p>
    </div>
  );
}

export default App;
