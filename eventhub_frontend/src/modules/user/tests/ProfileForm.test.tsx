import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { createTestStore } from "../../testing/tests-environement";
import type { User } from "../userSlice";

describe("ProfileForm", () => {
  const testUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    role: "USER",
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

  it("should display profile title", () => {
    setup(testUser);
    expect(screen.getByText("Mon profil")).toBeInTheDocument();
  });

  it("should display user email and role", async () => {
    setup(testUser);

    await waitFor(() => {
      const emailInput = screen.getByRole("textbox", {
        name: /email/i,
      }) as HTMLInputElement;
      expect(emailInput.value).toBe(testUser.email);
    });

    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;
    const roleInput = screen.getByRole("textbox", {
      name: /rôle/i,
    }) as HTMLInputElement;

    expect(emailInput.value).toBe(testUser.email);
    expect(roleInput.value).toBe(testUser.role);
    expect(emailInput).toBeDisabled();
    expect(roleInput).toBeDisabled();
  });

  it("should show loading state while fetching user", () => {
    setup();
    // When no user is provided, useCurrentUser will try to fetch
    // The component should show a loading spinner
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
