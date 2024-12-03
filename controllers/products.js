const { default: axios } = require("axios");
const { prisma } = require("../prisma/prisma-client");

/**
 * @route POST /api/product/create
 * @desc Создание товара
 * @access Public
 */
const create = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ message: "Заполните все обязательные поля!" });

  try {
    const product = await prisma.products.create({
      data: {
        name,
      },
    });

    if (!product)
      return res.status(400).json({ message: "Не удалось создать товар!" });

    const service = await fetch("http://localhost:7999/api/history/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "Создан товар",
        productId: product.id,
        plu: product.plu,
      }),
    });

    return res.status(200).json({ message: "Товар успешно создан!" });
  } catch (error) {
    return res.status(500).json({
      message: `Произошла ошибка на сервере! Ошибка: ${error.message}`,
    });
  }
};

/**
 * @route POST /api/product/get
 * @desc Получение товара (с фильтрами)
 * @access Public
 */
const get = async (req, res) => {
  const { name, plu } = req.query;

  try {
    const filters = {};
    if (name) filters.name = name;
    if (plu) filters.plu = plu;

    const products = await prisma.products.findMany({
      where: filters,
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "На сервере возникла ошибка!" });
  }
};

module.exports = {
  create,
  get,
};
