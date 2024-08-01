import { createSlice } from '@reduxjs/toolkit';
import { fetchExhibitById } from '../thunk/fetchExhibitById';


export type Exhibit = {
    objectID: 12,
    accessionYear: string,
    primaryImage: string,
    department: string,
    objectName: string,
    title: string,
    culture: string,
    period: string,
    dynasty: string,
    reign: string,
    artistDisplayName: string,
    artistDisplayBio: string,
    artistNationality: string,
    artistWikidata_URL:  string,
    objectBeginDate: number,
    objectEndDate: number,
    objectDate: string;
    medium: string,
    dimensions: string,
    creditLine: string,
    geographyType: string,
    city: string,
    state: string,
    county: string,
    country: string,
    region: string,
    subregion: string,
    objectURL: string,
    objectWikidata_URL: string,
    additionalImages: string[]
};

type InitialStateType = {
  exhibits: { [id: number]: Exhibit };
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialStateType = {
  exhibits: {},
  isLoading: false,
  error: null,
};

const exhibitSlice = createSlice({
  name: 'exhibits',
  initialState,
  reducers: {
    // ... другие редьюсеры
    clearExhibits: (state) => {
      state.exhibits = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibitById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExhibitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibits[action.payload.objectID] = action.payload; 
      })
      .addCase(fetchExhibitById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { clearExhibits } = exhibitSlice.actions;
export default exhibitSlice.reducer;