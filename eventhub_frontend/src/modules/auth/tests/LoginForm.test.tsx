import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { createTestStore } from "../../store/testing/tests-environement";
import { UserService } from "../../user/services/userService";
import { apiClient } from "../services/apiClient";
import type { User } from "../authSlice";

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

describe("LoginForm", () => {
  let currentUser: User | null = null;

  const setupApiMocks = () => {
    currentUser = null;
    jest.mocked(apiClient.login).mockImplementation(async (email: string) => {
      const user = UserService.findByEmail(email);
      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }
      currentUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      };
      return { user: currentUser };
    });
    jest.mocked(apiClient.getCurrentUser).mockImplementation(async () => {
      if (!currentUser) {
        throw new Error("Utilisateur non authentifié");
      }
      return { user: currentUser };
    });
  };

  const setup = () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );
    return store;
  };

  beforeEach(() => {
    UserService.reset();
    setupApiMocks();
  });

  it("should display title", () => {
    setup();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
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
      screen.getByRole("button", { name: "Se connecter" })
    ).toBeInTheDocument();
  });

  it("should display disabled submit button when form is empty", () => {
    setup();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeDisabled();
  });

  it("should enable submit button when both fields are filled", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(screen.getByRole("button", { name: "Se connecter" })).toBeEnabled();
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
    await userEvent.type(passwordInput, "newpassword123");

    expect(passwordInput.value).toBe("newpassword123");
  });

  it("should display error message when email or password is incorrect", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: "Se connecter" });

    await userEvent.type(emailInput, "nonexistent@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);

    expect(
      await screen.findByText("Email ou mot de passe incorrect")
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
    await userEvent.type(emailInput, "test@example.com");

    fireEvent.submit(form);

    expect(
      await screen.findByText("Veuillez remplir tous les champs")
    ).toBeInTheDocument();
  });

  it("should successfully login when credentials are correct", async () => {
    UserService.createUser({
      email: "test@example.com",
      role: "USER",
    });

    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: "Se connecter" });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "anypassword");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Connexion réussie !")).toBeInTheDocument();
    });
  });

  it("should clear error message when user starts typing", async () => {
    setup();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: "Se connecter" });

    await userEvent.type(emailInput, "wrong@example.com");
    await userEvent.type(passwordInput, "wrong");
    await userEvent.click(submitButton);

    await screen.findByText("Email ou mot de passe incorrect");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "new");

    expect(
      screen.queryByText("Email ou mot de passe incorrect")
    ).not.toBeInTheDocument();
  });
});
