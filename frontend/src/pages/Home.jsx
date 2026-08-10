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

    if (date) url += `?date=${date}`;

    const response = await fetch(url);
    setSpaceData(await response.json());

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

    setLoading(false);
  }

  async function generateQuiz() {
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

    setQuiz(await response.json());
    setResult("");
  }

  function checkAnswer(option) {
    if (option === quiz.answer) {
      setResult("Correct!");
    } else {
      setResult("Try again!");
    }
  }

  return (
    <main>
      <h2>Discover the Universe</h2>

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={getSpaceData}>Search</button>

      <h3>{spaceData.title}</h3>

      {spaceData.media_type === "video" ? (
        <iframe
          src={spaceData.url}
          title={spaceData.title}
        />
      ) : (
        <img
          src={spaceData.url}
          alt={spaceData.title}
          width="600"
        />
      )}

      <p>{spaceData.explanation}</p>

      <button onClick={aiExplain} disabled={loading}>
        {loading ? "Loading..." : "AI Explain"}
      </button>

      <button onClick={saveFavorite}>
        Save Favorite
      </button>

      <p>{aiExplanation}</p>

      <button onClick={generateQuiz}>
        Generate Quiz
      </button>

      {quiz && (
        <div>
          <h3>{quiz.question}</h3>

          {quiz.options.map((option) => (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
            >
              {option}
            </button>
          ))}

          <p>{result}</p>
        </div>
      )}
    </main>
  );
}