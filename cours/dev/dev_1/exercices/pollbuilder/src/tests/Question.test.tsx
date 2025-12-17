import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Question } from "../components/Question";
import { PollModel } from "../domain/model/poll-model";
import { useState } from "react";

type Props = {
  question: PollModel.Question;
  onChange: (id: string, value: string) => void;
  addAnswer: (id: string) => void;
  removeAnswer: (id: string, answerId: string) => void;
  updateAnswer: (id: string, answerId: string, value: string) => void;
};

describe("Question", () => {
  const onChange = jest.fn();
  const addAnswer = jest.fn();
  const removeAnswer = jest.fn();
  const updateAnswer = jest.fn();

  const question: PollModel.Question = {
    id: "1",
    title: "Quel est ton langage préféré ?",
    answers: [
      { id: "1", title: "TypeScript" },
      { id: "2", title: "JavaScript" },
    ],
  };

  const Wrapper = (props?: Partial<Props>) => {
    const [title, setTitle] = useState(question.title);
    const [answers, setAnswers] = useState(question.answers);

    const localQuestion: PollModel.Question = {
      ...question,
      title,
      answers,
    };

    return (
      <Question
        question={localQuestion}
        onChange={(id, value) => {
          setTitle(value);
          onChange(id, value);
        }}
        addAnswer={props?.addAnswer ?? (() => {})}
        removeAnswer={(_, answerId) => {
          setAnswers((prev) => prev.filter((a) => a.id !== answerId));
          removeAnswer(question.id, answerId);
        }}
        updateAnswer={(_, answerId, value) => {
          setAnswers((prev) =>
            prev.map((a) => (a.id === answerId ? { ...a, title: value } : a))
          );
          updateAnswer(question.id, answerId, value);
        }}
      />
    );
  };
  const setup = (props?: Partial<Props>) => {
    render(<Wrapper {...props} />);
  };

  it("should display input", () => {
    setup();
    expect(
      screen.getByDisplayValue("Quel est ton langage préféré ?")
    ).toBeInTheDocument();
  });
  it("should display add button", () => {
    setup();
    expect(
      screen.getByRole("button", { name: "Ajouter une réponse" })
    ).toBeInTheDocument();
  });
  it("should call onChange when input is changed", async () => {
    setup();
    const input = screen.getByDisplayValue("Quel est ton langage préféré ?");
    await userEvent.clear(input);
    await userEvent.type(input, "Quel est ton framework préféré ?");

    expect(onChange).toHaveBeenCalledWith(
      "1",
      "Quel est ton framework préféré ?"
    );
  });
  it("should display all answers", () => {
    setup();
    expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
    expect(screen.getByDisplayValue("JavaScript")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Réponse possible")).toHaveLength(2);
  });
  it("should call addAnswer when click on add button", async () => {
    setup({ addAnswer });
    const addButton = screen.getByRole("button", {
      name: "Ajouter une réponse",
    });
    await userEvent.click(addButton);
    expect(addAnswer).toHaveBeenCalledWith("1");
  });
  it("should call removeAnswer when click on remove button", async () => {
    setup({ removeAnswer });
    const removeButton = screen.getAllByRole("button", {
      name: /Supprimer la réponse/i,
    })[0];
    await userEvent.click(removeButton);

    expect(removeAnswer).toHaveBeenCalledWith("1", "1");
    expect(screen.getAllByPlaceholderText("Réponse possible")).toHaveLength(1);
  });
  it("should call updateAnswer when response is changed", async () => {
    setup();
    const input = screen.getByDisplayValue("TypeScript");
    await userEvent.clear(input);
    await userEvent.type(input, "Python");

    expect(updateAnswer).toHaveBeenCalledWith("1", "1", "Python");
    expect(screen.getByDisplayValue("Python")).toBeInTheDocument();
  });
  it("should call addAnswerToQuestion when click on add answer button", async () => {
    addAnswer.mockClear();
    setup({ addAnswer });
    const addAnswerButton = screen.getByRole("button", {
      name: "Ajouter une réponse",
    });
    await userEvent.click(addAnswerButton);
    await userEvent.click(addAnswerButton);

    expect(addAnswer).toHaveBeenCalledTimes(2);
    expect(addAnswer).toHaveBeenCalledWith("1");
  });
});
