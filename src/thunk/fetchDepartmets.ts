import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async () => {
    const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
    const data = await response.json();
    return data.departments;
  }
);