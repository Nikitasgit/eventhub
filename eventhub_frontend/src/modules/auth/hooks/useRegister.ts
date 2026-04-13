import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordValidator } from "../services/passwordValidator";
import { useForm } from "../../common/hooks/useForm";
import { apiClient } from "../services/apiClient";

interface RegisterFormData {
  email: string;
  password: string;
}

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  passwordErrors: string[];
}

export const useRegister = () => {
  const navigate = useNavigate();
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const { formData, state, handleChange, handleSubmit } = useForm<
    RegisterFormData,
    RegisterState
  >({
    initialState: { email: "", password: "" },
    initialFormState: {
      passwordErrors: [],
    },
    validate: (data) => {
      if (!data.email || !data.password) {
        return "Veuillez remplir tous les champs";
      }
      const passwordValidation = PasswordValidator.validate(data.password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        return "Le mot de passe ne respecte pas les critères requis";
      }
      return null;
    },
    onSubmit: async (data) => {
      await apiClient.register(data.email, data.password);
      setPasswordErrors([]);
      navigate("/login");
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
