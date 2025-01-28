import { combineReducers } from '@reduxjs/toolkit';
import { reducer as ingredientsReducer } from '../slices/ingredientsSlice';
import { reducer as userReducer } from '../slices/userSlice';
import { reducer as ordersReducer } from '../slices/feedSlice';
import { expect } from '@jest/globals';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer
});

describe('rootReducer', () => {
  it('should check that initial state was correctly dispatched according to action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedState = {
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      orders: ordersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    };

    expect(initialState).toEqual(expectedState);
  });
});
