import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import {
  useDecreaseMutation,
  useFilterStockQuery,
  useIncreaseMutation,
} from "../../app/services/stocks";
import { columns } from "./column";
import { Container } from "../container";
import { useFilterProductsQuery } from "../../app/services/products";
import { useFilterShopsQuery } from "../../app/services/shops";
import styles from "./index.module.css";

type Stock = {
  id: number;
  quantityOnShelf: number;
  quantityOnOrder: number;
  productName: string;
  shopName: string;
};
type Product = {
  id: number;
  plu: string;
  name: string;
};
type Shop = {
  id: number;
  name: string;
};

type Filters = {
  plu?: string;
  shopId?: number;
  shelfQuantityFrom?: number;
  shelfQuantityTo?: number;
  orderQuantityFrom?: number;
  orderQuantityTo?: number;
};

export const StocksTable = () => {
  const [selectedRowData, setSelectedRowData] = useState<Stock | null>(null);
  const [select, setSelect] = useState<string>("shelf");
  const [input, setInput] = useState<number>(1);
  const [stocksData, setStocksData] = useState<Stock[]>([]);

  const [filters, setFilters] = useState<Filters>({});

  const {
    data: stocksResponse,
    isLoading: isLoadingStocks,
    isError: isErrorStocks,
  } = useFilterStockQuery(filters);

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useFilterProductsQuery({});

  const {
    data: shopsResponse,
    isLoading: isLoadingShops,
    isError: isErrorShops,
  } = useFilterShopsQuery();

  const [increase] = useIncreaseMutation();
  const [decrease] = useDecreaseMutation();

  const handleRowClick = (record: Stock) => {
    setSelectedRowData(record);
  };
  const handleChangeSelect = (value: string) => {
    setSelect(value);
  };
  const handleChangeInput = (value: number) => {
    setInput(value);
  };

  const handleChangePLU = (value: string) => {
    setFilters({ ...filters, plu: value });
  };
  const handleChangeShop = (value: number) => {
    setFilters({ ...filters, shopId: value });
  };
  const handleChangeShelfFrom = (e: any) => {
    setFilters({ ...filters, shelfQuantityFrom: e.target.value });
  };
  const handleChangeShelfTo = (e: any) => {
    setFilters({ ...filters, shelfQuantityTo: e.target.value });
  };
  const handleChangeOrderFrom = (e: any) => {
    setFilters({ ...filters, orderQuantityFrom: e.target.value });
  };
  const handleChangeOrderTo = (e: any) => {
    setFilters({ ...filters, orderQuantityTo: e.target.value });
  };

  const handleIncrease = (id: number, amount: number, remains: string) => {
    increase({ id, amount, remains })
      .then((response) => {
        console.log("Уменьшение успешно", response);
        if (remains === "shelf") {
          setStocksData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, quantityOnShelf: item.quantityOnShelf + input }
                : item
            )
          );
        } else {
          setStocksData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, quantityOnOrder: item.quantityOnOrder + input }
                : item
            )
          );
        }
      })
      .catch((error) => {
        console.error("Ошибка при уменьшении:", error);
      });
  };

  const handleDecrease = (id: number, amount: number, remains: string) => {
    decrease({ id, amount, remains })
      .then((response) => {
        console.log("Уменьшение успешно", response);
        if (remains === "shelf") {
          setStocksData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, quantityOnShelf: item.quantityOnShelf - input }
                : item
            )
          );
        } else {
          setStocksData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, quantityOnOrder: item.quantityOnOrder - input }
                : item
            )
          );
        }
      })
      .catch((error) => {
        console.error("Ошибка при уменьшении:", error);
      });
  };

  useEffect(() => {
    if (!isLoadingStocks && !isLoadingProducts && !isLoadingShops) {
      if (stocksResponse && productsResponse && shopsResponse) {
        const combinedResults = stocksResponse.map((stock) => {
          const product = productsResponse.find(
            (product) => product.id === stock.productId
          );
          const shop = shopsResponse.find((shop) => shop.id === stock.shopId);

          return {
            id: stock.id,
            quantityOnShelf: stock.quantityOnShelf,
            quantityOnOrder: stock.quantityOnOrder,
            productName: product ? product.name : "",
            shopName: shop ? shop.name : "",
          };
        });

        setStocksData(combinedResults);
      }
    }
  }, [stocksResponse, productsResponse, shopsResponse]);

  if (isLoadingStocks || isLoadingProducts || isLoadingShops)
    return <div>Загрузка...</div>;

  if (isLoadingStocks || isLoadingShops || isLoadingProducts) {
    return <div>Загрузка</div>;
  }

  if (isErrorStocks || isErrorShops || isErrorProducts) {
    return <div>Ошибка!</div>;
  }

  return (
    <div className="productTable">
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "21px 0",
          }}
        >
          <Select
            style={{ width: "200px" }}
            options={[
              { value: "", label: "Все" },
              ...(productsResponse
                ? productsResponse.map((product) => ({
                    value: product.plu,
                    label: product.name,
                  }))
                : []),
            ]}
            defaultValue=""
            onChange={handleChangePLU}
          />
          <Select
            style={{ width: "230px" }}
            options={[
              { value: 0, label: "Все" },
              ...(shopsResponse
                ? shopsResponse.map((shop) => ({
                    value: shop.id,
                    label: shop.name,
                  }))
                : []),
            ]}
            defaultValue={0}
            onChange={handleChangeShop}
          />
          <Input
            type="number"
            placeholder="c (на полках)"
            style={{ width: "140px" }}
            onChange={(e) => handleChangeShelfFrom(e)}
          />
          <Input
            type="number"
            placeholder="по (на полках)"
            style={{ width: "140px" }}
            onChange={(e) => handleChangeShelfTo(e)}
          />
          <Input
            type="number"
            placeholder="c (в заказах)"
            style={{ width: "140px" }}
            onChange={(e) => handleChangeOrderFrom(e)}
          />
          <Input
            type="number"
            placeholder="по (в заказах)"
            style={{ width: "140px" }}
            onChange={(e) => handleChangeOrderTo(e)}
          />
        </div>
        <Table
          dataSource={stocksData}
          columns={columns}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={(record) =>
            selectedRowData && selectedRowData.id === record.id
              ? styles.selectedRow
              : ""
          }
          pagination={{ pageSize: 10 }}
        />
        {selectedRowData === null ? (
          <div style={{ fontSize: "24px" }}>Выберите строку из таблицы</div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginRight: "21px",
                }}
              >
                Остаток
              </p>
              <Select
                style={{ width: "121px" }}
                options={[
                  { value: "shelf", label: "на полках" },
                  { value: "order", label: "в заказах" },
                ]}
                defaultValue="shelf"
                onChange={handleChangeSelect}
              />
            </div>
            <div>
              <Button
                type="default"
                style={{ borderRadius: "10px 0px 0px 10px" }}
                onClick={() => {
                  handleIncrease(selectedRowData.id, input, select);
                }}
              >
                Увеличить
              </Button>
              <Input
                type="number"
                value={input}
                style={{ width: "84px", borderRadius: "0px 0px 0px 0px" }}
                onChange={(e) => handleChangeInput(Number(e.target.value))}
              />
              <Button
                type="default"
                style={{ borderRadius: "0px 10px 10px 0px" }}
                onClick={() =>
                  handleDecrease(selectedRowData.id, input, select)
                }
              >
                Уменьшить
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
