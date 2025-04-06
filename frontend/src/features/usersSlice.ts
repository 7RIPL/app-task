import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  height: number;
  weight: number;
  gender: string;
  location: string;
  photoUrl: string;
}

interface UsersState {
  data: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      return id;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // Данные для текущей страницы
        state.total = action.payload.total; // Общее количество пользователей
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching users';
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload);
        state.total -= 1; // Уменьшаем общее количество пользователей
      });
  },
});

export default usersSlice.reducer;