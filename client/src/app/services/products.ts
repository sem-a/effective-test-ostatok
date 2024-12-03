import { Products } from "@prisma/client";
import { api } from "./api";

type FilterParams = {
  name?: string;
  plu?: string;
};

const base_url = "/product/";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterProducts: builder.query<Products[], FilterParams>({
      query: ({ name, plu }) => {
        let params = new URLSearchParams();

        if (name) params.append("name", name);
        if (plu) params.append("plu", plu);

        return {
          url: `${base_url}get?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    createProduct: builder.mutation<Products, { name: string }>({
      query: ({ name }) => ({
        url: `${base_url}create`,
        method: "POST",
        body: { name },
      }),
    }),
  }),
});

export const { useCreateProductMutation, useFilterProductsQuery } = productsApi;
export const {
  endpoints: { filterProducts, createProduct },
} = productsApi;
