import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { login } from "../../user/userSlice";
import { UserService } from "../../user/services/userService";
import { PasswordValidator } from "../services/passwordValidator";
import { useForm } from "../../common/hooks/useForm";

interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  passwordErrors: string[];
}

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const { formData, state, handleChange, handleSubmit } = useForm<
    RegisterFormData,
    RegisterState
  >({
    initialState: { email: "", password: "", firstName: "", lastName: "" },
    initialFormState: {
      passwordErrors: [],
    },
    validate: (data) => {
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return "Veuillez remplir tous les champs";
      }
      const passwordValidation = PasswordValidator.validate(data.password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        return "Le mot de passe ne respecte pas les critères requis";
      }
      if (UserService.emailExists(data.email)) {
        return "Cet email est déjà utilisé";
      }
      return null;
    },
    onSubmit: async (data) => {
      const newUser = UserService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      dispatch(login(newUser));
      setPasswordErrors([]);
      navigate("/profile");
    },
    resetOnSuccess: true,
    onFieldChange: (field, value) => {
      if (field === "password") {
        const validation = PasswordValidator.validate(value);
        setPasswordErrors(validation.errors);
        return { passwordErrors: validation.errors };
      }
      return undefined;
    },
  });

  const isFormValid = () => {
    const passwordValidation = PasswordValidator.validate(formData.password);
    return (
      formData.email !== "" &&
      formData.password !== "" &&
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      passwordValidation.isValid
    );
  };

  return {
    formData,
    state: { ...state, passwordErrors },
    handleChange,
    handleSubmit,
    isFormValid,
  };
};
