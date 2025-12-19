import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import type { PasswordCriteria } from "../services/passwordValidator";

interface PasswordCriteriaListProps {
  criteria: PasswordCriteria;
}

export const PasswordCriteriaList: React.FC<PasswordCriteriaListProps> = ({
  criteria,
}) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" gutterBottom>
        Critères du mot de passe :
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            {criteria.hasMinLength ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </ListItemIcon>
          <ListItemText primary="12 caractères minimum" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {criteria.hasUpperCase ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </ListItemIcon>
          <ListItemText primary="Au moins une majuscule" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {criteria.hasLowerCase ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </ListItemIcon>
          <ListItemText primary="Au moins une minuscule" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {criteria.hasDigit ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </ListItemIcon>
          <ListItemText primary="Au moins un chiffre" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {criteria.hasSpecialChar ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </ListItemIcon>
          <ListItemText primary="Au moins un caractère spécial (+=%#/*!?,.)" />
        </ListItem>
      </List>
    </Box>
  );
};
