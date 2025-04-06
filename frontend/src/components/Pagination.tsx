import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/usersSlice';
import { RootState } from '../store';
import { Pagination, Box } from '@mui/material';

const CustomPagination: React.FC = () => {
  const dispatch = useDispatch();
  const { total } = useSelector((state: RootState) => state.users);
  const limit = 10;

  const savedPage = Number(localStorage.getItem('currentPage')) || 1;
  const [page, setPage] = React.useState(savedPage);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    localStorage.setItem('currentPage', String(value)); 
    dispatch(fetchUsers({ page: value, limit }) as any);
  };

  React.useEffect(() => {
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && totalPages > 0) {
      const newPage = Math.max(1, page - 1); 
      setPage(newPage);
      localStorage.setItem('currentPage', String(newPage)); 
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