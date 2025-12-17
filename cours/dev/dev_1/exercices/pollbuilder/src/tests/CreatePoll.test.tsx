import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatePoll } from "../components/CreatePoll";

describe("CreatePoll", () => {
  const setup = () => {
    render(<CreatePoll />);
  };

  it("should display title", () => {
    setup();
    expect(screen.getByText("Poll Builder App")).toBeInTheDocument();
  });
  it("should display input for poll title", () => {
    setup();
    expect(
      screen.getByPlaceholderText("Entrez le titre du sondage")
    ).toBeInTheDocument();
  });
  it("should display add button", () => {
    setup();
    expect(
      screen.getByRole("button", { name: "Ajouter une question" })
    ).toBeInTheDocument();
  });
  it("should display disabled submit button", () => {
    setup();
    expect(screen.getByRole("button", { name: "Créer" })).toBeDisabled();
  });
  it("should add a new question when click on add question button", async () => {
    setup();
    const addButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });

    await userEvent.click(addButton);
    await userEvent.click(addButton);

    const questionInputs = screen.getAllByPlaceholderText("Saisir la question");
    expect(questionInputs).toHaveLength(2);
  });
  it("should call removeQuestion when click on remove question button", async () => {
    setup();
    const addButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });
    await userEvent.click(addButton);
    await userEvent.click(addButton);

    const removeButtons = screen.getAllByRole("button", {
      name: /Supprimer la question/i,
    });
    await userEvent.click(removeButtons[0]);

    const questionInputs = screen.getAllByPlaceholderText("Saisir la question");
    expect(questionInputs).toHaveLength(1);
  });
  it("should call removeAnswerFromQuestion when click on remove answer button", async () => {
    setup();
    const addButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });
    await userEvent.click(addButton);

    const addAnswerButton = screen.getByRole("button", {
      name: "Ajouter une réponse",
    });
    await userEvent.click(addAnswerButton);
    await userEvent.click(addAnswerButton);

    const removeButtons = screen.getAllByRole("button", {
      name: /Supprimer la réponse/i,
    });
    await userEvent.click(removeButtons[0]);

    const answerInputs = screen.getAllByPlaceholderText("Réponse possible");
    expect(answerInputs).toHaveLength(1);
  });
  it("should update poll title when change title input", async () => {
    setup();

    const input = screen.getByPlaceholderText("Entrez le titre du sondage");
    await userEvent.clear(input);
    await userEvent.type(input, "New Poll Title");

    expect(input).toHaveValue("New Poll Title");
  });
  it("should call updateQuestion when change question input", async () => {
    setup();
    // on ajoute d'abord une question
    const addButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });
    await userEvent.click(addButton);

    const input = screen.getByPlaceholderText("Saisir la question");
    await userEvent.clear(input);
    await userEvent.type(input, "New Question");

    expect(input).toHaveValue("New Question");
  });
  it("should call updateAnswerForQuestion when change answer input", async () => {
    setup();
    const addButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });
    await userEvent.click(addButton);
    const addAnswerButton = screen.getByRole("button", {
      name: "Ajouter une réponse",
    });
    await userEvent.click(addAnswerButton);

    const input = screen.getByPlaceholderText("Réponse possible");
    await userEvent.clear(input);
    await userEvent.type(input, "New Answer");

    expect(input).toHaveValue("New Answer");
  });
  it("should enable submit button when all requirements are met", async () => {
    setup();

    // Titre du sondage
    const pollTitleInput = screen.getByPlaceholderText(
      "Entrez le titre du sondage"
    );
    await userEvent.clear(pollTitleInput);
    await userEvent.type(pollTitleInput, "Titre sondage");

    // Ajouter la première question
    const addQuestionButton = screen.getByRole("button", {
      name: "Ajouter une question",
    });
    await userEvent.click(addQuestionButton);
    // Ajouter la deuxième question
    await userEvent.click(addQuestionButton);

    // Récupérer les inputs de questions
    const questionInputs = screen.getAllByPlaceholderText("Saisir la question");

    // Remplir les deux titres de question
    await userEvent.clear(questionInputs[0]);
    await userEvent.type(questionInputs[0], "Question 1");

    await userEvent.clear(questionInputs[1]);
    await userEvent.type(questionInputs[1], "Question 2");

    // Pour chaque question, on ajoute deux réponses et on les remplit
    const addAnswerButtons = screen.getAllByRole("button", {
      name: "Ajouter une réponse",
    });

    for (let i = 0; i < 2; i++) {
      await userEvent.click(addAnswerButtons[i]); // réponse 1
      await userEvent.click(addAnswerButtons[i]); // réponse 2

      const answerInputs = screen
        .getAllByPlaceholderText("Réponse possible")
        .slice(i * 2, i * 2 + 2); // 2 réponses par question

      await userEvent.clear(answerInputs[0]);
      await userEvent.type(answerInputs[0], `Réponse 1 pour Q${i + 1}`);

      await userEvent.clear(answerInputs[1]);
      await userEvent.type(answerInputs[1], `Réponse 2 pour Q${i + 1}`);
    }

    // On vérifie que le bouton Créer est activé
    expect(screen.getByRole("button", { name: "Créer" })).toBeEnabled();
  });
});
