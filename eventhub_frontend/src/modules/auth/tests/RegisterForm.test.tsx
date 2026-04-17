import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { createTestStore } from "../../store/testing/tests-environement";
import { apiClient } from "../services/apiClient";

jest.mock("../services/apiClient", () => ({
  apiClient: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    verifyTwoFactorAuth: jest.fn(),
    verifyBackupCode: jest.fn(),
    getQrCode: jest.fn(),
    enableTwoFactorAuth: jest.fn(),
    disableTwoFactorAuth: jest.fn(),
  },
}));

describe("RegisterForm", () => {
  const setup = () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      </Provider>
    );
    return store;
  };

  beforeEach(() => {
    jest.mocked(apiClient.register).mockReset();
  });

  it("should display title", () => {
    setup();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("should display email input", () => {
    setup();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });

  it("should display password input", () => {
    setup();
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should display submit button", () => {
    setup();
    expect(
      screen.getByRole("button", { name: /s'inscrire/i })
    ).toBeInTheDocument();
  });

  it("should display disabled submit button when form is empty", () => {
    setup();
    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeDisabled();
  });

  it("should display disabled submit button when password is invalid", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "short");

    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeDisabled();
  });

  it("should enable submit button when email and password are valid", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "ValidPassword123!");

    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeEnabled();
  });

  it("should update email when email input is changed", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "newemail@example.com");

    expect(emailInput.value).toBe("newemail@example.com");
  });

  it("should update password when password input is changed", async () => {
    setup();
    const passwordInput = screen.getByLabelText(
      /mot de passe/i
    ) as HTMLInputElement;

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "NewPassword123!");

    expect(passwordInput.value).toBe("NewPassword123!");
  });

  it("should display password criteria list when password is entered", async () => {
    setup();
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(passwordInput, "test");

    expect(screen.getByText("Critères du mot de passe :")).toBeInTheDocument();
    expect(screen.getByText("12 caractères minimum")).toBeInTheDocument();
    expect(screen.getByText("Au moins une majuscule")).toBeInTheDocument();
    expect(screen.getByText("Au moins une minuscule")).toBeInTheDocument();
    expect(screen.getByText("Au moins un chiffre")).toBeInTheDocument();
    expect(
      screen.getByText("Au moins un caractère spécial (+=%#/*!?,.)")
    ).toBeInTheDocument();
  });

  it("should display error message when fields are empty on submit", async () => {
    setup();
    const form = screen
      .getByRole("textbox", { name: /email/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "onlyemail@example.com");

    fireEvent.submit(form);

    expect(
      await screen.findByText("Veuillez remplir tous les champs")
    ).toBeInTheDocument();
  });

  it("should display error message when password is invalid on submit", async () => {
    setup();
    const form = screen
      .getByRole("textbox", { name: /email/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "short");

    fireEvent.submit(form);

    expect(
      await screen.findByText(
        "Le mot de passe ne respecte pas les critères requis"
      )
    ).toBeInTheDocument();
  });

  it("should display error message when email already exists", async () => {
    jest.mocked(apiClient.register).mockRejectedValueOnce(
      new Error("Cet email est déjà utilisé")
    );

    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    await userEvent.type(emailInput, "existing@example.com");
    await userEvent.type(passwordInput, "ValidPassword123!");
    await userEvent.click(submitButton);

    expect(
      await screen.findByText("Cet email est déjà utilisé")
    ).toBeInTheDocument();
  });

  it("should successfully register when fields are valid", async () => {
    jest.mocked(apiClient.register).mockResolvedValueOnce({
      user: {
        id: "new-id",
        email: "newuser@example.com",
        role: "USER",
      },
    });

    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    await userEvent.type(emailInput, "newuser@example.com");
    await userEvent.type(passwordInput, "ValidPassword123!");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Inscription réussie !")).toBeInTheDocument();
    });
  });

  it("should clear error message when user starts typing after invalid submit", async () => {
    setup();
    const form = screen
      .getByRole("textbox", { name: /email/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "short");

    fireEvent.submit(form);

    await screen.findByText(
      "Le mot de passe ne respecte pas les critères requis"
    );

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "Valid");

    expect(
      screen.queryByText("Le mot de passe ne respecte pas les critères requis")
    ).not.toBeInTheDocument();
  });
});
