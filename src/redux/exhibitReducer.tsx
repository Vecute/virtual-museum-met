import { createSlice } from '@reduxjs/toolkit';
import { fetchExhibitById } from '../thunk/fetchExhibitById';


type Exhibit = {
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
};

type InitialStateType = {
  object: Exhibit;
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialStateType = {
  object: {} as Exhibit,
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
      })
      .addCase(fetchExhibitById.fulfilled, (state, action) => {
        state.object = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchExhibitById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default exhibitSlice.reducer;