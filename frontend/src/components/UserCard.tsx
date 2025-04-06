import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  height: number;
  weight: number;
  gender: string;
  location: string;
  photoUrl?: string;
}

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <Card
      sx={{
        width: 300, // Фиксированная ширина карточки
        p: 2,
        mb: 2,
        cursor: "pointer",
        "&:hover": { boxShadow: 6 },
      }}
      onClick={handleNavigate}
    >
      <Avatar
        src={user.photoUrl || "/default-avatar.png"}
        alt={`${user.firstName} ${user.lastName}`}
        sx={{ width: 56, height: 56, mx: "auto", mb: 2 }}
      />
      <CardContent sx={{ flex: 1 }}>
        {/* Обрезка длинного текста */}
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2">
          Рост: {user.height} см, Вес: {user.weight} кг
        </Typography>
        <Typography variant="body2">Пол: {user.gender}</Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Место жительства: {user.location}
        </Typography>
        <Box sx={{ mt: 1 }} onClick={(e) => e.stopPropagation()}>
          {/* Иконки для редактирования и удаления */}
          <IconButton onClick={onEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;