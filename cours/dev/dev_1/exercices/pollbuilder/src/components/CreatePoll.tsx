import type React from "react";
import { PollModel } from "../domain/model/poll-model";
import { useCreatePoll } from "../hooks/use-create-poll.hook";
import { Question } from "./Question";

export const CreatePoll: React.FC = () => {
  const hook = useCreatePoll();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Poll Builder App
      </h1>
      <input
        className="w-full max-w-md bg-white border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Entrez le titre du sondage"
        value={hook.form.pollTitle}
        onChange={(e) => hook.updateTitle(e.target.value)}
      />

      {hook.form.questions.map((question: PollModel.Question) => (
        <div
          key={question.id}
          className="flex flex-col items-center justify-center gap-2"
        >
          <Question
            question={question}
            onChange={hook.updateQuestion}
            addAnswer={hook.addAnswerToQuestion}
            removeAnswer={hook.removeAnswerFromQuestion}
            updateAnswer={hook.updateAnswerForQuestion}
          />
          <button
            type="button"
            className="text-pink-500 hover:text-pink-700 text-xl transition"
            aria-label="Supprimer la question"
            onClick={() => hook.removeQuestion(question.id)}
          >
            ❌
          </button>
        </div>
      ))}

      <button
        type="button"
        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
        onClick={hook.addQuestion}
      >
        Ajouter une question
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
        disabled={!hook.isSubmittable}
        onClick={hook.submitPoll}
      >
        Créer
      </button>
    </div>
  );
};
