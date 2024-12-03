import { Products } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../../app/services/products";
import { RootState } from "../../app/store";

interface InitialState {
  products: Products[] | null;
}

const initialState: InitialState = {
  products: null,
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      productsApi.endpoints.filterProducts.matchFulfilled,
      (state, action) => {
        state.products = action.payload;
      }
    );
  },
});

export default slice.reducer;
export const selectProducts = (state: RootState) => state.products;
