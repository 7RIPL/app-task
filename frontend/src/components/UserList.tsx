import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../features/usersSlice";
import { AppDispatch, RootState } from "../store";
import {
  Grid,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import ConfirmDialog from "./ConfirmDialog";

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, total } = useSelector(
    (state: RootState) => state.users
  );
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const savedPage = Number(localStorage.getItem("currentPage")) || 1;
  const [page, setPage] = useState(savedPage);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && totalPages > 0) {
      const newPage = Math.max(1, page - 1);
      setPage(newPage);
      localStorage.setItem("currentPage", String(newPage));
      dispatch(fetchUsers({ page: newPage, limit }));
    }
  }, [total, page, limit, dispatch]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
  };

  const handleDeleteConfirmed = () => {
    if (confirmDeleteId !== null) {
      dispatch(deleteUser(confirmDeleteId));
      setSnackbarMessage("Пользователь удалён");
      setSnackbarOpen(true);
      setConfirmDeleteId(null);
    }
  };

  const handleFormSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setSelectedUser(null);
  };

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Список пользователей
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {data.map((user) => (
          <Grid item key={user.id}{...({} as any)}>
            <UserCard
              user={user}
              onEdit={() => handleEdit(user)}
              onDelete={() => setConfirmDeleteId(user.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSuccess={handleFormSuccess}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        message="Вы уверены, что хотите удалить пользователя?"
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteConfirmed}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;
