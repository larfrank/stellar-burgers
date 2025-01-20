import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk('ingredients/getall', async () =>
  getIngredientsApi()
);

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state: TIngredientsState) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
        state.ingredients = [];
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.error = null;
        state.ingredients = action.payload;
        state.isLoading = false;
      });
  }
});

export const reducer = ingredientsSlice.reducer;
export const { getIngredientsSelector } = ingredientsSlice.selectors;
