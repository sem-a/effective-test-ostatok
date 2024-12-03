import { Stocks } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../../app/services/products";
import { RootState } from "../../app/store";
import { stocksApi } from "../../app/services/stocks";

interface InitialState {
  stocks: Stocks[] | null;
}

const initialState: InitialState = {
  stocks: null,
};

const slice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      stocksApi.endpoints.filterStock.matchFulfilled,
      (state, action) => {
        state.stocks = action.payload;
      }
    );
  },
});

export default slice.reducer;
export const selectStocks = (state: RootState) => state.stocks;
