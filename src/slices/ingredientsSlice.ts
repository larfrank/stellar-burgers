import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { INGREDIENT_TYPES } from '../utils/constansts';
import { v4 as uuidv4 } from 'uuid';

export const getIngredients = createAsyncThunk('ingredients/getall', async () =>
  getIngredientsApi()
);

type TIngredientsState = {
  ingredients: TIngredient[];
  constructor: {
    bun?: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  constructor: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        switch (action.payload.type) {
          case INGREDIENT_TYPES.BUN:
            state.constructor.bun = action.payload;
            break;
          default:
            state.constructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    resetConstructor: (state) => {
      state.constructor = initialState.constructor;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );

      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    reorderIngredients: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.constructor.ingredients;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ingredients.length ||
        toIndex >= ingredients.length
      ) {
        return;
      }

      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
    }
  },
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
export const {
  addIngredient,
  resetConstructor,
  reorderIngredients,
  removeIngredient
} = ingredientsSlice.actions;
export const { getIngredientsSelector } = ingredientsSlice.selectors;
