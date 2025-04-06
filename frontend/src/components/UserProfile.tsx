import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, deleteUser } from '../api/api';
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Snackbar,
  Alert,
} from '@mui/material';
import UserForm from './UserForm';
import ConfirmDialog from './ConfirmDialog';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserById(Number(id));
        setUser(data);
      } catch (error) {
        console.error('Ошибка получения пользователя', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await deleteUser(Number(id));
    setDeleteDialogOpen(false);
    navigate('/');
  };

  const handleSuccess = async () => {
    setIsEditModalOpen(false);
    const updatedUser = await fetchUserById(Number(id));
    setUser(updatedUser);
    setSnackbarOpen(true);
  };

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>Пользователь не найден</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate('/')}>← Назад</Button>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Avatar
          src={user.photoUrl || '/default-avatar.png'}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
        <Typography>Рост: {user.height} см</Typography>
        <Typography>Вес: {user.weight} кг</Typography>
        <Typography>Пол: {user.gender}</Typography>
        <Typography>Место жительства: {user.location}</Typography>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setIsEditModalOpen(true)}>
          Редактировать
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Удалить
        </Button>
      </Box>

      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <UserForm
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        message="Вы уверены, что хотите удалить этого пользователя?"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          Пользователь обновлён
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
