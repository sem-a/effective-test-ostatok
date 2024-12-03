import React, { useState } from "react";
import { Container } from "../container";
import { useFilterProductsQuery } from "../../app/services/products";
import { useFilterShopsQuery } from "../../app/services/shops";
import { Button, Input, Select } from "antd";
import { useCreateStockMutation } from "../../app/services/stocks";

export const AddStocks = () => {
  const [shop, setShop] = useState<number>();
  const [product, setProduct] = useState<number>();
  const [quantityOnShelf, setQuantityOnShelf] = useState<number>();
  const [quantityOnOrder, setQuantityOnOrder] = useState<number>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useFilterProductsQuery({});
  const {
    data: shops,
    isLoading: isLoadingShops,
    isError: isErrorShops,
  } = useFilterShopsQuery();

  const [addStocks] = useCreateStockMutation();

  const handleChangeShop = (value: number) => {
    setShop(value);
  };
  const handleChangeProduct = (value: number) => {
    setProduct(value);
  };
  const handleChangeShelf = (e: any) => {
    setQuantityOnShelf(e.target.value);
  };
  const handleChangeOrder = (e: any) => {
    setQuantityOnOrder(e.target.value);
  };

  const handleButton = () => {
    if (!shop || !product || !quantityOnShelf || !quantityOnOrder) {
      setError("Заполните все обязательные поля!");
    } else {
      const stock = {
        productId: product,
        shopId: shop,
        quantityOnShelf,
        quantityOnOrder,
      };
      addStocks(stock);
      setSuccess(true);
      setError("");
    }
  };

  if (isLoadingProducts || isLoadingShops) {
    return <div>Загрузка</div>;
  }

  if (isErrorProducts || isErrorShops) {
    return <div>Ошибка!</div>;
  }

  return (
    <div className="addStocks">
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%" }}>
            <p>Выберите магазин</p>
            <Select
              style={{ width: "100%", marginTop: "7px" }}
              options={shops?.map((shop) => ({
                value: shop.id,
                label: shop.name,
              }))}
              onChange={handleChangeShop}
            />
          </div>
          <div style={{ width: "49%" }}>
            <p>Выберите товар</p>
            <Select
              style={{ width: "100%", marginTop: "7px" }}
              options={products?.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              onChange={handleChangeProduct}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "21px",
          }}
        >
          <div style={{ width: "49%" }}>
            <p>Остаток на полках</p>
            <Input
              type="number"
              style={{ width: "100%", marginTop: "7px" }}
              onChange={(e) => handleChangeShelf(e)}
            />
          </div>
          <div style={{ width: "49%" }}>
            <p>Остаток в заказе</p>
            <Input
              type="number"
              style={{ width: "100%", marginTop: "7px" }}
              onChange={(e) => handleChangeOrder(e)}
            />
          </div>
        </div>
        {error === "" ? null : (
          <div style={{ color: "red", margin: "7px 0px" }}>{error}</div>
        )}
        {success ? (
          <div style={{ color: "green", margin: "7px 0px" }}>
            Остаток для продукта с ID: {product} успешно создан!
          </div>
        ) : null}
        <Button
          style={{ width: "100%", margin: "21px 0px" }}
          onClick={handleButton}
        >
          Создать
        </Button>
      </Container>
    </div>
  );
};
