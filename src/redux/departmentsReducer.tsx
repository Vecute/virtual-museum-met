import { createSlice } from '@reduxjs/toolkit';
import { fetchDepartments } from '../thunk/fetchDepartmets'; // Импортируем thunk

type Department = {
  departmentId: number;
  displayName: string;
};

type InitialStateType = {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialStateType = {
  departments: [],
  isLoading: false,
  error: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default departmentsSlice.reducer;