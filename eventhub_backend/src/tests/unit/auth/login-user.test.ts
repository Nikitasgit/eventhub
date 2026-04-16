import { LoginUserUseCase } from "@/application/usecases/user/login-user.usecase";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

describe("login user use case", () => {
  it("should throw invalid credentials when user is not found", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
    } as any;

    const useCase = new LoginUserUseCase(userRepository);

    await expect(
      useCase.execute({
        email: "nobody@test.dev",
        password: "password123",
      })
    ).rejects.toThrow(ERROR_MESSAGES.INVALID_CREDENTIALS);

    expect(userRepository.findByEmail).toHaveBeenCalledWith("nobody@test.dev");
  });
});
