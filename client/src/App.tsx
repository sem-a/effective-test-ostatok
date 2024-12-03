import React, { useState } from "react";
import { Button } from "antd";
import { ProductsTable } from "./components/products-table";
import { StocksTable } from "./components/stocks-table";
import { AddProducts } from "./components/add-products";
import { AddStocks } from "./components/add-stocks";

type Menu = "products" | "stocks" | "add-products" | "add-stocks";

const App: React.FC = () => {
  const [menu, setMenu] = useState<Menu>("stocks");

  return (
    <div className="App">
      <div style={{ margin: "42px 0", textAlign: "center" }}>
        <Button
          style={{ borderRadius: "10px 0px 0px 10px" }}
          onClick={() => setMenu("products")}
          type={menu === "products" ? "primary" : undefined}
        >
          Показать Продукты
        </Button>
        <Button
          style={{ borderRadius: "0px 0px 0px 0px" }}
          onClick={() => setMenu("stocks")}
          type={menu === "stocks" ? "primary" : undefined}
        >
          Показать Запасы
        </Button>
        <Button
          style={{ borderRadius: "0px 0px 0px 0px" }}
          onClick={() => setMenu("add-products")}
          type={menu === "add-products" ? "primary" : undefined}
        >
          Добавить товар
        </Button>
        <Button
          style={{ borderRadius: "0px 10px 10px 0px" }}
          onClick={() => setMenu("add-stocks")}
          type={menu === "add-stocks" ? "primary" : undefined}
        >
          Добавить остаток
        </Button>
      </div>

      {(() => {
        switch (menu) {
          case "products":
            return <ProductsTable />;
          case "stocks":
            return <StocksTable />;
          case "add-products":
            return <AddProducts />;
          case "add-stocks":
            return <AddStocks />;
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default App;
