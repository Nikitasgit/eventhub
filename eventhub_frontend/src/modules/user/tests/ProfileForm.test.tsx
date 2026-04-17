import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { createTestStore } from "../../store/testing/tests-environement";
import type { User } from "../../auth/authSlice";

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
            auth: {
              user,
              loading: false,
              error: null,
              pending2FA: false,
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
      expect(screen.getByText(testUser.email)).toBeInTheDocument();
    });

    expect(screen.getByText(testUser.role)).toBeInTheDocument();
  });

  it("should show loading state while fetching user", () => {
    const store = createTestStore({
      initialState: {
        auth: {
          user: null,
          loading: true,
          error: null,
          pending2FA: false,
        },
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
