import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import type { AppState } from "../../store/store";
import { updateProfile } from "../userSlice";
import { UserService } from "../services/userService";
import { useForm } from "../../common/hooks/useForm";

interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
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

  const { formData, state, handleChange, handleSubmit, setFormData } =
    useForm<ProfileFormData>({
      initialState: initialFormData,
      validate: (data) => {
        if (!currentUser) {
          return "Aucun utilisateur connecté";
        }
        if (!data.email || !data.firstName || !data.lastName) {
          return "Veuillez remplir tous les champs";
        }
        if (
          data.email !== currentUser.email &&
          UserService.emailExists(data.email)
        ) {
          return "Cet email est déjà utilisé";
        }
        return null;
      },
      onSubmit: async (data) => {
        if (!currentUser) {
          throw new Error("Aucun utilisateur connecté");
        }
        const updatedUser = UserService.updateUser(currentUser.id, {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        if (!updatedUser) {
          throw new Error("Erreur lors de la mise à jour du profil");
        }
        dispatch(updateProfile(updatedUser));
      },
    });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      });
    }
  }, [currentUser, setFormData]);

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
