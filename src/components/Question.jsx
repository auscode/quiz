import { useState } from "react";

const Question = ({ question, onAnswer }) => {
  const { id, text, options } = question;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionText) => {
    setSelectedOption(optionText);
    onAnswer(id, optionText);
  };

  const optionColor = (optionText) => {
    return selectedOption === optionText ? "green" : "";
  };

  return (
    <div className="question bg-blue-200 rounded-lg mx-10 my-4 py-2">
      <h2 className="font-bold text-xl">{text}</h2>
      <ul className="bg-green-200 mx-2 p-2">
        {options.map((option) => (
          <li
            key={option.id}
            className="bg-red-100 mb-2 rounded-lg hover:bg-red-300 p-2"
            style={{ backgroundColor: optionColor(option.text) }}
          >
            <div
              className={selectedOption === option.text ? "selected" : ""}
              onClick={() => handleOptionSelect(option.text)}
              style={{ fontWeight: "bold", fontSize: "16px" }}
            >
              {option.text}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
