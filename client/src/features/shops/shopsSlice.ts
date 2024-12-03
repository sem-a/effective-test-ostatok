import { Shops } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { shopsApi } from "../../app/services/shops";
import { RootState } from "../../app/store";

interface InitialState {
  shops: Shops[] | null;
}

const initialState: InitialState = {
  shops: null,
};

const slice = createSlice({
  name: "shops",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      shopsApi.endpoints.filterShops.matchFulfilled,
      (state, action) => {
        state.shops = action.payload;
      }
    );
  },
});

export default slice.reducer;
export const selectShops = (state: RootState) => state.shops;
