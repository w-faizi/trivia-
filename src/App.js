import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const answers = [...q.incorrect_answers];
          const rand = Math.floor(Math.random() * 4);
          answers.splice(rand, 0, q.correct_answer);
          return {
            question: q.question,
            answers,
            correct: q.correct_answer,
          };
        });
        setQuestions(formatted);
      });
  }, []);

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (answer === questions[current].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (questions.length === 0) return <h2>Loading Questions...</h2>;

  if (showScore)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score} / {questions.length}</p>
      </div>
    );

  const q = questions[current];

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h2 dangerouslySetInnerHTML={{ __html: q.question }} />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {q.answers.map((a, i) => (
          <li key={i}>
            <button
              onClick={() => handleAnswer(a)}
              style={{
                padding: "10px 20px",
                margin: "10px 0",
                width: "100%",
                background:
                  selected === null
                    ? "#eee"
                    : a === q.correct
                    ? "lightgreen"
                    : a === selected
                    ? "salmon"
                    : "#eee",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              dangerouslySetInnerHTML={{ __html: a }}
            />
          </li>
        ))}
      </ul>
      <p>
        Question {current + 1} of {questions.length}
      </p>
    </div>
  );
}

export default App;
