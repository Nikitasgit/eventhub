import React from "react";
import { Box } from "@mui/material";
import { ProfileForm } from "../components/ProfileForm";

export const ProfilePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ProfileForm />
    </Box>
  );
};
