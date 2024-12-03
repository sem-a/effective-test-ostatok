import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import { useFilterProductsQuery } from "../../app/services/products";
import { columns } from "./column";
import { Container } from "../container";

type Filters = {
  name?: string;
  plu?: string;
};

export const ProductsTable = () => {
  const [filters, setFilters] = useState<Filters>({});

  const {
    data: products,
    isLoading,
    isError,
  } = useFilterProductsQuery(filters);

  const handleChangePLU = (value: string) => {
    setFilters({ ...filters, plu: value });
  };

  const handleChangeName = (value: string) => {
    setFilters({ ...filters, name: value });
  };

  if (isLoading) {
    return <div>Загрузка</div>;
  }

  if (isError) {
    return <div>Ошибка!</div>;
  }

  return (
    <div className="productTable">
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: "21px 0px",
            gap: "21px",
          }}
        >
          <Select
            style={{ width: "150px" }}
            options={
              products
                ? [
                    { value: "", label: "Все" },
                    ...products.map((product) => ({
                      value: product.plu,
                      label: product.plu,
                    })),
                  ]
                : [{ value: "", label: "Все" }]
            }
            defaultValue=""
            onChange={handleChangePLU}
          />
          <Select
            style={{ width: "200px" }}
            options={
              products
                ? [
                    { value: "", label: "Все" },
                    ...products.map((product) => ({
                      value: product.name,
                      label: product.name,
                    })),
                  ]
                : [{ value: "", label: "Все" }]
            }
            defaultValue=""
            onChange={handleChangeName}
          />
        </div>
        <Table
          dataSource={products}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Container>
    </div>
  );
};
