import { useEffect, useState } from "react";

export default function Home() {
  const [spaceData, setSpaceData] = useState({});
  const [date, setDate] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    getSpaceData();
  }, []);

  async function getSpaceData() {
    let url =
      "https://capstone-project-6qdz.onrender.com/api/nasa/apod";

    if (date) {
      url += `?date=${date}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    setSpaceData(data);
    setAiExplanation("");
    setQuiz(null);
    setResult("");
  }

  async function saveFavorite() {
    await fetch(
      "https://capstone-project-6qdz.onrender.com/api/favorites",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spaceData),
      }
    );

    alert("Saved!");
  }

  async function aiExplain() {
    setLoading(true);

    try {
      const response = await fetch(
        "https://capstone-project-6qdz.onrender.com/api/ai/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            explanation: spaceData.explanation,
          }),
        }
      );

      const data = await response.json();

      setAiExplanation(data.explanation);
    } catch (error) {
      console.log(error);
      alert("AI explanation failed");
    }

    setLoading(false);
  }

  async function generateQuiz() {
    try {
      const response = await fetch(
        "https://capstone-project-6qdz.onrender.com/api/ai/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            explanation: spaceData.explanation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Quiz failed");
        return;
      }

      setQuiz(data);
      setResult("");
    } catch (error) {
      console.log(error);
      alert("Quiz request failed");
    }
  }

  function checkAnswer(option) {
    if (option === quiz.answer) {
      setResult("Correct!");
    } else {
      setResult("Try again!");
    }
  }

  return (
    <main className="home-page">
      <div className="search-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={getSpaceData}>
          Search
        </button>
      </div>

      <section className="nasa-section">
        <h2>{spaceData.title}</h2>

        {spaceData.media_type === "video" ? (
          <iframe
            src={spaceData.url}
            title={spaceData.title}
          />
        ) : (
          spaceData.url && (
            <img
              src={spaceData.url}
              alt={spaceData.title}
            />
          )
        )}

        <p>{spaceData.explanation}</p>

        <div className="action-buttons">
          <button
            onClick={aiExplain}
            disabled={loading}
          >
            {loading ? "Loading..." : "AI Explain"}
          </button>

          <button onClick={saveFavorite}>
            Save Favorite
          </button>
        </div>
      </section>

      <section className="ai-section">
        <h2>AI Explanation</h2>

        <div className="ai-box">
          {aiExplanation ||
            "Click AI Explain to get a simple explanation."}
        </div>

        <div className="quiz-header">
          <h2>AI Quiz</h2>

          <button onClick={generateQuiz}>
            Generate Quiz
          </button>
        </div>

        {quiz && (
          <div className="quiz-box">
            <h3>{quiz.question}</h3>

            <div className="quiz-options">
              {quiz.options.map((option) => (
                <button
                  key={option}
                  onClick={() => checkAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <p className="quiz-result">
              {result}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}