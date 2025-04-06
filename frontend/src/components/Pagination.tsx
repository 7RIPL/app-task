import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/usersSlice';
import { RootState } from '../store';
import { Pagination, Box } from '@mui/material';

const CustomPagination: React.FC = () => {
  const dispatch = useDispatch();
  const { total, data } = useSelector((state: RootState) => state.users);
  const limit = 10;

  // Получаем сохранённую страницу из localStorage или используем 1 по умолчанию
  const savedPage = Number(localStorage.getItem('currentPage')) || 1;
  const [page, setPage] = React.useState(savedPage);

  // Обработчик изменения страницы
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    localStorage.setItem('currentPage', String(value)); // Сохраняем текущую страницу
    dispatch(fetchUsers({ page: value, limit }) as any);
  };

  // Логика для проверки необходимости перехода на предыдущую страницу
  React.useEffect(() => {
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && totalPages > 0) {
      const newPage = Math.max(1, page - 1); // Переход на предыдущую страницу
      setPage(newPage);
      localStorage.setItem('currentPage', String(newPage)); // Сохраняем новую страницу
      dispatch(fetchUsers({ page: newPage, limit }) as any);
    }
  }, [total, page, limit, dispatch]);

  return (
    <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
      <Pagination count={Math.ceil(total / limit)} page={page} onChange={handleChange} />
    </Box>
  );
};

export default CustomPagination;