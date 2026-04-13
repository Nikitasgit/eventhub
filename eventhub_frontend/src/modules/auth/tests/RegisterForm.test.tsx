import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { createTestStore } from "../../testing/tests-environement";
import { UserService } from "../../user/services/userService";

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
    UserService.reset();
  });

  it("should display title", () => {
    setup();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("should display firstName input", () => {
    setup();
    expect(
      screen.getByRole("textbox", { name: /prénom/i })
    ).toBeInTheDocument();
  });

  it("should display lastName input", () => {
    setup();
    expect(screen.getByLabelText(/^nom\s/i)).toBeInTheDocument();
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
    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "short"); // Mot de passe trop court

    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeDisabled();
  });

  it("should enable submit button when all fields are filled and password is valid", async () => {
    setup();
    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "ValidPassword123!");

    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeEnabled();
  });

  it("should update firstName when firstName input is changed", async () => {
    setup();
    const firstNameInput = screen.getByRole("textbox", {
      name: /prénom/i,
    }) as HTMLInputElement;

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    expect(firstNameInput.value).toBe("Jane");
  });

  it("should update lastName when lastName input is changed", async () => {
    setup();
    const lastNameInput = screen.getByLabelText(/^nom\s/i) as HTMLInputElement;

    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Smith");

    expect(lastNameInput.value).toBe("Smith");
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
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    await userEvent.type(firstNameInput, "John");

    fireEvent.submit(form);

    expect(
      await screen.findByText("Veuillez remplir tous les champs")
    ).toBeInTheDocument();
  });

  it("should display error message when password is invalid", async () => {
    setup();
    const form = screen
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
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
    const existingUser = UserService.createUser({
      email: "existing@example.com",
      firstName: "Existing",
      lastName: "User",
    });

    setup();
    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, existingUser.email);
    await userEvent.type(passwordInput, "ValidPassword123!");
    await userEvent.click(submitButton);

    expect(
      await screen.findByText("Cet email est déjà utilisé")
    ).toBeInTheDocument();
  });

  it("should successfully register when all fields are valid", async () => {
    setup();
    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "newuser@example.com");
    await userEvent.type(passwordInput, "ValidPassword123!");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Inscription réussie !")).toBeInTheDocument();
    });
  });

  it("should clear error message when user starts typing", async () => {
    setup();
    const form = screen
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
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


