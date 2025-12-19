import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { createTestStore } from "../../testing/tests-environement";
import { UserService } from "../services/userService";
import type { User } from "../userSlice";

describe("ProfileForm", () => {
  const testUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
  };

  const setup = (user?: User) => {
    const store = createTestStore({
      initialState: user
        ? {
            user: {
              currentUser: user,
              isAuthenticated: true,
            },
          }
        : undefined,
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileForm />
        </BrowserRouter>
      </Provider>
    );
    return store;
  };

  beforeEach(() => {
    UserService.reset();
  });

  it("should display form with title and submit button", () => {
    const user = UserService.createUser({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    });
    setup(user);
    expect(screen.getByText("Mon profil")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mettre à jour" })
    ).toBeInTheDocument();
  });

  it("should prefill form with user data", async () => {
    const user = UserService.createUser({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    });
    setup(user);

    await waitFor(() => {
      const firstNameInput = screen.getByRole("textbox", {
        name: /prénom/i,
      }) as HTMLInputElement;
      expect(firstNameInput.value).toBe(user.firstName);
    });

    const firstNameInput = screen.getByRole("textbox", {
      name: /prénom/i,
    }) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/^nom\s/i) as HTMLInputElement;
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;

    expect(firstNameInput.value).toBe(user.firstName);
    expect(lastNameInput.value).toBe(user.lastName);
    expect(emailInput.value).toBe(user.email);
  });

  it("should display error message when fields are empty on submit", async () => {
    const user = UserService.createUser({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    });

    setup(user);
    const form = screen
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    await waitFor(() => {
      const firstNameInput = screen.getByRole("textbox", {
        name: /prénom/i,
      }) as HTMLInputElement;
      expect(firstNameInput.value).toBe(user.firstName);
    });

    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    await userEvent.clear(firstNameInput);

    fireEvent.submit(form);

    expect(
      await screen.findByText("Veuillez remplir tous les champs")
    ).toBeInTheDocument();
  });

  it("should display error message when email already exists", async () => {
    const user = UserService.createUser({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    });

    const existingUser = UserService.createUser({
      email: "existing@example.com",
      firstName: "Existing",
      lastName: "User",
    });

    setup(user);
    const form = screen
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    await waitFor(() => {
      const emailInput = screen.getByRole("textbox", {
        name: /email/i,
      }) as HTMLInputElement;
      expect(emailInput.value).toBe(user.email);
    });

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, existingUser.email);
    fireEvent.submit(form);

    expect(
      await screen.findByText("Cet email est déjà utilisé")
    ).toBeInTheDocument();
  });

  it("should successfully update profile when all fields are valid", async () => {
    const user = UserService.createUser({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    });

    setup(user);
    const form = screen
      .getByRole("textbox", { name: /prénom/i })
      .closest("form");

    if (!form) {
      throw new Error("Form not found");
    }

    await waitFor(() => {
      const firstNameInput = screen.getByRole("textbox", {
        name: /prénom/i,
      }) as HTMLInputElement;
      expect(firstNameInput.value).toBe(user.firstName);
    });

    const firstNameInput = screen.getByRole("textbox", { name: /prénom/i });
    const lastNameInput = screen.getByLabelText(/^nom\s/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "UpdatedFirstName");
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "UpdatedLastName");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "updated@example.com");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("Profil mis à jour avec succès !")
      ).toBeInTheDocument();
    });
  });
});
