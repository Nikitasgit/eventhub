import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { login } from "../../user/userSlice";
import { AuthService } from "../services/authService";
import { useForm } from "../../common/hooks/useForm";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { formData, state, handleChange, handleSubmit } =
    useForm<LoginFormData>({
      initialState: { email: "", password: "" },
      validate: (data) => {
        if (!data.email || !data.password) {
          return "Veuillez remplir tous les champs";
        }
        return null;
      },
      onSubmit: async (data) => {
        const user = AuthService.authenticate(data.email, data.password);
        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }
        dispatch(login(user));
        navigate("/profile");
      },
      resetOnSuccess: true,
    });

  const isFormValid = formData.email !== "" && formData.password !== "";

  return {
    formData,
    state,
    handleChange,
    handleSubmit,
    isFormValid,
  };
};
