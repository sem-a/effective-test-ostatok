import { Shops } from "@prisma/client";
import { api } from "./api";

const base_url = "/shop/";

export const shopsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterShops: builder.query<Shops[], void>({
      query: () => ({
        url: `${base_url}get`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFilterShopsQuery } = shopsApi;
export const {
  endpoints: { filterShops },
} = shopsApi;
