import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import type { AppState } from "../../store/store";
import { updateProfile } from "../userSlice";
import { UserService } from "../services/userService";

interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
}

interface ProfileState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector((state: AppState) => state.user.currentUser);

  const initialFormData = useMemo<ProfileFormData>(
    () => ({
      email: currentUser?.email || "",
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    }),
    [currentUser?.email, currentUser?.firstName, currentUser?.lastName]
  );

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  const [state, setState] = useState<ProfileState>({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
    if (state.success) {
      setState((prev) => ({ ...prev, success: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setState({
        loading: false,
        error: "Aucun utilisateur connecté",
        success: false,
      });
      return;
    }

    setState({ loading: true, error: null, success: false });

    try {
      if (!formData.email || !formData.firstName || !formData.lastName) {
        setState({
          loading: false,
          error: "Veuillez remplir tous les champs",
          success: false,
        });
        return;
      }
      if (
        formData.email !== currentUser.email &&
        UserService.emailExists(formData.email)
      ) {
        setState({
          loading: false,
          error: "Cet email est déjà utilisé",
          success: false,
        });
        return;
      }
      const updatedUser = UserService.updateUser(currentUser.id, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (!updatedUser) {
        setState({
          loading: false,
          error: "Erreur lors de la mise à jour du profil",
          success: false,
        });
        return;
      }
      dispatch(updateProfile(updatedUser));
      setState({ loading: false, error: null, success: true });
    } catch {
      setState({
        loading: false,
        error: "Une erreur est survenue lors de la mise à jour",
        success: false,
      });
    }
  };

  const isFormValid =
    formData.email !== "" &&
    formData.firstName !== "" &&
    formData.lastName !== "";

  return {
    formData,
    state,
    handleChange,
    handleSubmit,
    isFormValid,
  };
};
