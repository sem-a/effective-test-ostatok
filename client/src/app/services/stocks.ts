import { Stocks } from "@prisma/client";
import { api } from "./api";

type FilterParams = {
  plu?: string;
  shopId?: number;
  shelfQuantityFrom?: number;
  shelfQuantityTo?: number;
  orderQuantityFrom?: number;
  orderQuantityTo?: number;
};

type PutParams = {
  id: number;
  amount: number;
  remains: string;
};

type Stock = {
  productId: number;
  shopId: number;
  quantityOnShelf: number;
  quantityOnOrder: number;
};

const base_url = "/stock/";

export const stocksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    filterStock: builder.query<Stocks[], FilterParams>({
      query: ({
        plu,
        shopId,
        shelfQuantityFrom,
        shelfQuantityTo,
        orderQuantityFrom,
        orderQuantityTo,
      }) => {
        let params = new URLSearchParams();

        if (plu) params.append("plu", plu);
        if (shopId) params.append("shopId", shopId.toString());
        if (shelfQuantityFrom)
          params.append("shelfQuantityFrom", shelfQuantityFrom.toString());
        if (shelfQuantityTo)
          params.append("shelfQuantityTo", shelfQuantityTo.toString());
        if (orderQuantityFrom)
          params.append("orderQuantityFrom", orderQuantityFrom.toString());
        if (orderQuantityTo)
          params.append("orderQuantityTo", orderQuantityTo.toString());

        return {
          url: `${base_url}get?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    createStock: builder.mutation<Stocks, Stock>({
      query: (stock) => ({
        url: `${base_url}create`,
        method: "POST",
        body: stock,
      }),
    }),
    increase: builder.mutation<Stocks, PutParams>({
      query: ({ id, amount, remains }) => {
        let params = new URLSearchParams();

        if (remains) params.append("remains", remains);

        return {
          url: `${base_url}increase?${params.toString()}`,
          method: "PUT",
          body: { id, amount },
        };
      },
    }),
    decrease: builder.mutation<Stocks, PutParams>({
      query: ({ id, amount, remains }) => {
        let params = new URLSearchParams();

        if (remains) params.append("remains", remains);

        return {
          url: `${base_url}decrease?${params.toString()}`,
          method: "PUT",
          body: { id, amount },
        };
      },
    }),
  }),
});

export const {
  useCreateStockMutation,
  useFilterStockQuery,
  useIncreaseMutation,
  useDecreaseMutation,
} = stocksApi;

export const {
  endpoints: { createStock, filterStock, increase, decrease },
} = stocksApi;
