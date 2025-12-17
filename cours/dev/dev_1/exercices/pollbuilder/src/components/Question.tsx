import type React from "react";

import { Answer } from "./Answer";
import { PollModel } from "../domain/model/poll-model";

export const Question: React.FC<{
  question: PollModel.Question;
  onChange: (id: string, value: string) => void;
  addAnswer: (id: string) => void;
  removeAnswer: (id: string, answerId: string) => void;
  updateAnswer: (id: string, answerId: string, value: string) => void;
}> = ({ question, onChange, addAnswer, removeAnswer, updateAnswer }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white shadow rounded-lg">
      <input
        className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full mb-4"
        type="text"
        value={question.title}
        placeholder="Saisir la question"
        onChange={(e) => onChange(question.id, e.target.value)}
      />

      <div className="space-y-2 my-4">
        {question.answers.map((answer: PollModel.Answer) => (
          <Answer
            key={answer.id}
            title={answer.title}
            onRemove={() => removeAnswer(question.id, answer.id)}
            onChange={(title) => updateAnswer(question.id, answer.id, title)}
          />
        ))}
      </div>

      <button
        type="button"
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition w-full"
        onClick={() => addAnswer(question.id)}
      >
        Ajouter une réponse
      </button>
    </div>
  );
};
