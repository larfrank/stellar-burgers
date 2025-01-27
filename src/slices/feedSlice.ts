import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from '../services/store';

const initialFeed: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0
};

interface FeedState {
  selectedOrderId: string | null;
  feed: TOrdersData;
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: FeedState = {
  selectedOrderId: null,
  feed: initialFeed,
  order: null,
  isLoading: false,
  error: null
};

const selectOrders = (state: RootState) => state.orders.feed;

export const selectOrderById = createSelector(
  [selectOrders, (_: RootState, id: string) => id],
  (feed, id) => feed.orders.find((order: TOrder) => order.number === Number(id))
);

export const fetchOrders = createAsyncThunk('feed/fetchOrders', async () =>
  getFeedsApi()
);

export const fetchOrdersById = createAsyncThunk(
  'feed/fetchOrdersById',
  async (id: string) => getOrderByNumberApi(Number(id))
);

export const createOrder = createAsyncThunk(
  'feed/createOrder',
  async (ingredientsData: string[]) => orderBurgerApi(ingredientsData)
);

export const getUserOrders = createAsyncThunk('user/getUserOrders', async () =>
  getOrdersApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    resetOrderData: (state) => {
      state.order = null;
    },
    setSelectedOrderId: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.feed = initialFeed;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.feed = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getUserOrders.pending, (state) => {
        state.feed = initialFeed;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.feed.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchOrdersById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersById.fulfilled, (state, action) => {
        state.feed.orders = action.payload.orders;
        state.isLoading = false;
      })
      .addCase(fetchOrdersById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetOrderData, setSelectedOrderId } = feedSlice.actions;
export const reducer = feedSlice.reducer;
