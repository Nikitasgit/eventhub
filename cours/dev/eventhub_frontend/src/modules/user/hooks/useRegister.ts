import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { login } from "../userSlice";
import { UserService } from "../services/userService";
import { PasswordValidator } from "../services/passwordValidator";

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
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [state, setState] = useState<RegisterState>({
    loading: false,
    error: null,
    success: false,
    passwordErrors: [],
  });

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      const validation = PasswordValidator.validate(value);
      setState((prev) => ({
        ...prev,
        passwordErrors: validation.errors,
      }));
    }
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      if (
        !formData.email ||
        !formData.password ||
        !formData.firstName ||
        !formData.lastName
      ) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Veuillez remplir tous les champs",
          success: false,
        }));
        return;
      }
      const passwordValidation = PasswordValidator.validate(formData.password);
      if (!passwordValidation.isValid) {
        setState((prev) => ({
          ...prev,
          loading: false,
          passwordErrors: passwordValidation.errors,
          error: "Le mot de passe ne respecte pas les critères requis",
          success: false,
        }));
        return;
      }
      if (UserService.emailExists(formData.email)) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Cet email est déjà utilisé",
          success: false,
        }));
        return;
      }

      const newUser = UserService.createUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      dispatch(login(newUser));
      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        success: true,
      }));

      setFormData({ email: "", password: "", firstName: "", lastName: "" });
      setState((prev) => ({ ...prev, passwordErrors: [] }));

      navigate("/profile");
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Une erreur est survenue lors de l'inscription",
        success: false,
      }));
    }
  };

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
    state,
    handleChange,
    handleSubmit,
    isFormValid,
  };
};
