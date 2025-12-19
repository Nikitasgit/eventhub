import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { login } from "../userSlice";
import { UserService } from "../services/userService";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [state, setState] = useState<LoginState>({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ loading: true, error: null, success: false });

    try {
      if (!formData.email || !formData.password) {
        setState({
          loading: false,
          error: "Veuillez remplir tous les champs",
          success: false,
        });
        return;
      }
      const user = UserService.authenticate(formData.email, formData.password);

      if (!user) {
        setState({
          loading: false,
          error: "Email ou mot de passe incorrect",
          success: false,
        });
        return;
      }
      dispatch(login(user));
      setState({ loading: false, error: null, success: true });

      setFormData({ email: "", password: "" });
      navigate("/profile");
    } catch {
      setState({
        loading: false,
        error: "Une erreur est survenue lors de la connexion",
        success: false,
      });
    }
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return {
    formData,
    state,
    handleChange,
    handleSubmit,
    isFormValid,
  };
};
