import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchExhibitById = createAsyncThunk(
  'posts/fetchExhibitById',
  async (objectId: number) => {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
    const data = await response.json();
    return data;
  }
);