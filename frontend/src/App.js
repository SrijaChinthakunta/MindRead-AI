import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mode, setMode] = useState("face"); // face | text | voice
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setEmotion("");

    try {
      let res;

      if (mode === "face" && image) {
        const formData = new FormData();
        formData.append("file", image);
        res = await axios.post("http://127.0.0.1:8000/analyze/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (mode === "text" && text.trim()) {
        const formData = new FormData();
        formData.append("text", text);
        res = await axios.post("http://127.0.0.1:8000/analyze_text/", formData);
      } else if (mode === "voice" && voice) {
        const formData = new FormData();
        formData.append("file", voice);
        res = await axios.post("http://127.0.0.1:8000/analyze_voice/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        alert("Please provide valid input for the selected mode.");
        setLoading(false);
        return;
      }

      setEmotion(res.data.emotion || "Emotion not detected");
    } catch (err) {
      console.error(err);
      alert("Error analyzing emotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🧠 MindRead</h1>
      <p className="subtitle">See Beyond Emotions</p>

      <div className="mode-buttons">
        <button
          className={mode === "face" ? "active" : ""}
          onClick={() => setMode("face")}
        >
          🧍 Face
        </button>
        <button
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}
        >
          💬 Text
        </button>
        <button
          className={mode === "voice" ? "active" : ""}
          onClick={() => setMode("voice")}
        >
          🎧 Voice
        </button>
      </div>

      <div className="input-section">
        {mode === "face" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="preview"
              />
            )}
          </>
        )}

        {mode === "text" && (
          <textarea
            placeholder="Type your thoughts here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {mode === "voice" && (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setVoice(e.target.files[0])}
          />
        )}
      </div>

      <button onClick={handleAnalyze} className="analyze-btn" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Emotion"}
      </button>

      {emotion && (
        <p className="emotion-display">
          Detected Emotion: <strong>{emotion}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
