import { createSlice } from '@reduxjs/toolkit';
import { PlaceOfOrigin, fetchPlaceOfOrigin } from '../thunk/fetchPlaceOfOrigin';


type InitialStateType = {
  placeOfOrigin: PlaceOfOrigin[];
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialStateType = {
    placeOfOrigin: [],
  isLoading: false,
  error: null,
};

const placeOfOriginSlice = createSlice({
  name: 'placeOfOrigin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceOfOrigin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlaceOfOrigin.fulfilled, (state, action) => {
        state.placeOfOrigin = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPlaceOfOrigin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default placeOfOriginSlice.reducer;