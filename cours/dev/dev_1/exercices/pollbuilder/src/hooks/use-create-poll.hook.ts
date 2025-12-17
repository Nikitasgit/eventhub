import { useState } from "react";

import { PollModel } from "../domain/model/poll-model";

export const useCreatePoll = () => {
  function updateTitle(value: string) {
    setForm({
      ...form,
      pollTitle: value,
    });
  }

  function addQuestion() {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          id: String(crypto.randomUUID()),
          title: "",
          answers: [],
        },
      ],
    });
  }
  function removeQuestion(questionId: string) {
    setForm({
      ...form,
      questions: form.questions.filter(
        (question: PollModel.Question) => question.id !== questionId
      ),
    });
  }
  function updateQuestion(questionId: string, value: string) {
    setForm({
      ...form,
      questions: form.questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            title: value,
          };
        }
        return question;
      }),
    });
  }

  function addAnswerToQuestion(questionId: string) {
    setForm({
      ...form,
      questions: form.questions.map((question: PollModel.Question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: [
              ...question.answers,
              {
                id: crypto.randomUUID(),
                title: "",
              },
            ],
          };
        }
        return question;
      }),
    });
  }
  function removeAnswerFromQuestion(questionId: string, answerId: string) {
    setForm({
      ...form,
      questions: form.questions.map((question: PollModel.Question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.filter(
              (answer: PollModel.Answer) => answer.id !== answerId
            ),
          };
        }
        return question;
      }),
    });
  }
  function updateAnswerForQuestion(
    questionId: string,
    answerId: string,
    value: string
  ) {
    setForm({
      ...form,
      questions: form.questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  title: value,
                };
              }
              return answer;
            }),
          };
        }
        return question;
      }),
    });
  }

  function submitPoll() {}
  function isSubmittable() {
    return (
      form.pollTitle !== "" &&
      form.questions.length >= 2 &&
      form.questions.every((question) => question.title !== "") &&
      form.questions.every((question) => question.answers.length >= 2) &&
      form.questions.every((question) =>
        question.answers.every((answer) => answer.title !== "")
      )
    );
  }

  const [form, setForm] = useState<PollModel.Form>({
    pollTitle: "",
    questions: [],
  });

  return {
    updateTitle,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addAnswerToQuestion,
    removeAnswerFromQuestion,
    updateAnswerForQuestion,
    submitPoll,
    isSubmittable: isSubmittable(),
    form,
  };
};
