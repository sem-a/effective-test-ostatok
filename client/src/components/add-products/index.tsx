import React, { useState } from "react";
import { Container } from "../container";
import { Button, Input, Table } from "antd";
import { useCreateProductMutation } from "../../app/services/products";
import { columns } from "../products-table/column";

export const AddProducts = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<boolean>(false);

  const [addProducts] = useCreateProductMutation();

  const handleChangeName = (e: any) => {
    setName(e.target.value);
  };

  const handleButtonClick = () => {
    if (name === "") {
      setError("Заполните обязательные поля!");
    } else {
      addProducts({ name: name });
      setSuccess(true);
      setError("");
    }
  };

  return (
    <div className="addProducts">
      <Container>
        <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "21px 0px" }}>
          Добавить товар
        </h2>
        <Input
          placeholder="Название товара"
          onChange={(e) => handleChangeName(e)}
        />
        {error === "" ? null : (
          <div style={{ color: "red", margin: "7px 0px" }}>{error}</div>
        )}
        {success ? (
          <div style={{ color: "green", margin: "7px 0px" }}>
            Товар с названием {name} успешно создан!
          </div>
        ) : null}
        <Button
          onClick={handleButtonClick}
          style={{ margin: "14px 0px", width: "100%" }}
          type="default"
        >
          Создать
        </Button>
      </Container>
    </div>
  );
};
