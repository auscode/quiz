const ScoreScreen = ({ score, totalQuestions, onExit }) => {
  const handleExit = () => {
    localStorage.removeItem("quizState");
    onExit();
  };
  return (
    <div className="score-screen bg-[#FFEAA7] my-4 p-10 rounded-lg shadow-xl">
      <h2 className="font-bold text-2xl">Quiz Completed!🎉🎉</h2>
      <p className="mt-2">
        Your Score:
        <span className=" ml-1 text-green-900 font-bold ">
          {score} / {totalQuestions}
        </span>
      </p>
      <button
        onClick={handleExit}
        className="bg-red-500 text-white px-10 py-2 mt-4 rounded-md shadow-md hover:bg-red-600"
      >
        Exit
      </button>
    </div>
  );
};

export default ScoreScreen;
