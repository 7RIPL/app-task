import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser, updateUser, uploadImage } from "../api/api";
import { fetchUsers } from "../features/usersSlice";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputLabel,
} from "@mui/material";

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSuccess }) => {
  const isEditMode = !!user;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    height: "",
    weight: "",
    gender: "",
    location: "",
    photoUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedPhotoUrl = formData.photoUrl;

    if (selectedFile) {
      const imageData = new FormData();
      imageData.append("file", selectedFile);

      try {
        const response = await uploadImage(imageData);
        uploadedPhotoUrl = response.data.photoUrl;
      } catch (error) {
        console.error("Ошибка загрузки изображения", error);
        return;
      }
    }

    const finalData = { ...formData, photoUrl: uploadedPhotoUrl };

    try {
      if (isEditMode) {
        await updateUser(user.id, finalData);
        onSuccess?.("Пользователь успешно обновлён!");
      } else {
        await createUser(finalData);
        onSuccess?.("Пользователь успешно создан!");
      }
      dispatch(fetchUsers({ page: 1, limit: 10 }) as any);
    } catch (error) {
      console.error("Ошибка при сохранении пользователя", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isEditMode
          ? "Редактировать пользователя"
          : "Создать нового пользователя"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          name="firstName"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.firstName}
          inputProps={{ maxLength: 15 }}
        />
        <TextField
          label="Фамилия"
          name="lastName"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.lastName}
        />
        <TextField
          label="Рост (см)"
          name="height"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.height}
        />
        <TextField
          label="Вес (кг)"
          name="weight"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.weight}
        />
        <TextField
          label="Пол"
          name="gender"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.gender}
        />
        <TextField
          label="Место жительства"
          name="location"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          value={formData.location}
        />

        <InputLabel htmlFor="file-upload">Выберите файл</InputLabel>
        <input
          accept="image/*"
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Добавить изображение
          </Button>
        </label>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2, width: "100%" }}
        >
          {isEditMode ? "Сохранить" : "Создать"}
        </Button>
      </form>
    </Box>
  );
};

export default UserForm;
