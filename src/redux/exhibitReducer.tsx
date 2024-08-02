import { createSlice } from '@reduxjs/toolkit';
import { fetchExhibitById } from '../thunk/fetchExhibitById';


export type Exhibit = {
    id: number,
    title: string,
    date_start: number,
    date_end: number,
    date_display: string,
    artist_display: string,
    place_of_origin: string,
    description: string,
    dimensions: string,
    medium_display: string,
    credit_line: string,
    publication_history: string,
    provenance_text: string,
    artwork_type_title: string,
    department_title: string,
    department_id: string,
    image_id: string,
};

type InitialStateType = {
  exhibit: Exhibit | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialStateType = {
  exhibit: null,
  isLoading: false,
  error: null,
};

const exhibitSlice = createSlice({
  name: 'exhibit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibitById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExhibitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibit = action.payload;
      })
      .addCase(fetchExhibitById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default exhibitSlice.reducer;