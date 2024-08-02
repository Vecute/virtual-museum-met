import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchExhibitById = createAsyncThunk(
  'posts/fetchExhibitById',
  async (objectId: number) => {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/${objectId}`);
    const data = await response.json();
    return data.data;
  }
);