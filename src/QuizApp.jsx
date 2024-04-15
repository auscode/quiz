import { useState, useEffect } from "react";
import Question from "./components/Question.jsx";
import questionsData from "./data/questions.json";
import ScoreScreen from "./components/ScoreScreen.jsx";
import FullScreenBlocker from "./components/FullScreenBlocker.jsx";

function QuizApp() {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const quizState = {
        currentQuestionIndex,
        userAnswers,
      };
      localStorage.setItem("quizState", JSON.stringify(quizState));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentQuestionIndex, userAnswers]);

  useEffect(() => {
    // Load questions from JSON file
    setQuestions(questionsData);

    // Check for saved state and restore it if available
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setUserAnswers(savedState.userAnswers);
    }

    // Initialize violation count from local storage
    const savedViolationCount = localStorage.getItem("violationCount");
    if (savedViolationCount) {
      setViolationCount(parseInt(savedViolationCount, 10));
    }
  }, []);

  useEffect(() => {
    // Save user progress to local storage whenever it changes
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({ currentQuestionIndex, userAnswers })
    );
  }, [currentQuestionIndex, userAnswers]);

  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.visibilityState === "hidden") {
        // Increment violation count only if the document is hidden
        setViolationCount((prevCount) => {
          const newCount = prevCount + 1;
          localStorage.setItem("violationCount", newCount); // Store the new count in local storage
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleTabSwitch);
    return () => {
      document.removeEventListener("visibilitychange", handleTabSwitch);
    };
  }, []);

  useEffect(() => {
    // Check if the browser is in full-screen mode
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleAnswer = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    setSelectedOption(answer); // Set the selected option
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null); // Reset selected option for the next question
    }
  };

  const handleFinish = () => {
    let totalScore = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.ans) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setIsCompleted(true);
  };

  const handleExit = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setIsCompleted(false);
    setViolationCount(0);
  };
  return (
    <div className="quiz-app">
      {isCompleted ? (
        <ScoreScreen
          score={score}
          totalQuestions={questions.length}
          onExit={handleExit}
        />
      ) : isFullScreen ? (
        <>
          <div className="flex justify-between mx-10">
            <div>
              <span className="font-bold text-xl text-green-900">
                {currentQuestionIndex + 1} / {questions.length}{" "}
              </span>
            </div>
            <div className="font-semibold text-red-800">
              Violation Count: {violationCount}
            </div>
          </div>
          <Question
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            selectedOption={selectedOption}
          />
          {currentQuestionIndex < questions.length - 1 && (
            <>
              <button
                disabled={selectedOption === null}
                onClick={handleNextQuestion}
                className="bg-blue-300 hover:bg-blue-500 px-4 py-1 rounded-lg"
              >
                Next
              </button>
            </>
          )}
          {currentQuestionIndex === questions.length - 1 && (
            <button
              className="bg-green-300 hover:bg-green-500 px-4 py-1 rounded-lg"
              disabled={selectedOption === null}
              onClick={handleFinish}
            >
              Finish
            </button>
          )}
        </>
      ) : (
        <>
          <FullScreenBlocker />
        </>
      )}
    </div>
  );
}

export default QuizApp;
