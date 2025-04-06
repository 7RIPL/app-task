import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import UserList from "./UserList";
import Pagination from "./Pagination";
import UserForm from "./UserForm";
import { Container, Typography, Button, Dialog } from "@mui/material";

const AppContent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Container maxWidth="md">
      <Typography variant="h3" textAlign="center" sx={{ mt: 4 }}>
        User Management App
      </Typography>
      {location.pathname === "/" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ display: "block", mx: "auto", my: 2 }}
          onClick={() => setOpen(true)}
        >
          Добавить пользователя
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <UserForm
          onClose={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
      <div>
        <UserList />
        <Pagination />
      </div>
    </Container>
  );
};

export default AppContent;
