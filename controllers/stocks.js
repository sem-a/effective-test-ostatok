const { prisma } = require("../prisma/prisma-client");

/**
 * @route POST /api/stock/create
 * @desc  Создание остатка
 * @access Public
 */

const create = async (req, res) => {
  const { productId, shopId, quantityOnShelf, quantityOnOrder } = req.body;

  if (!productId || !shopId || !quantityOnShelf || !quantityOnOrder) {
    return res.status(400).json({ message: "Заполните обязательные поля!" });
  }

  try {
    const stock = await prisma.stocks.create({
      data: {
        productId: Number(productId),
        shopId: Number(shopId),
        quantityOnShelf: Number(quantityOnShelf),
        quantityOnOrder: Number(quantityOnOrder),
      },
    });

    if (!stock) {
      return res.status(400).json({ message: "Не удалось создать остаток!" });
    }
    const { plu } = await prisma.products.findFirst({
      where: {
        id: stock.productId,
      },
      select: {
        plu: true,
      },
    });

    const service = await fetch("http://localhost:7999/api/history/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "Создан остаток",
        productId: stock.productId,
        plu: plu,
        shopId: stock.shopId,
        stockId: stock.id,
      }),
    });

    return res.status(200).json({ message: "Остаток успешно создан!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `На сервере возникла ошибка!` });
  }
};

/**
 * @route PUT /api/stock/increase
 * @desc  увеличение остатка
 * @access Public
 */
const increase = async (req, res) => {
  const { id, amount } = req.body;
  const remains = req.query.remains;

  if (!remains)
    return res
      .status(400)
      .json({ message: "Укажите все обязательные параметры!" });

  if (!amount)
    return res
      .status(400)
      .json({ message: "Заполните все обязательные поля!" });

  try {
    const stock = await prisma.stocks.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!stock)
      return res.status(404).json({ message: "Такой товар не найден!" });

    let stockUpdate = null;

    if (remains === "shelf") {
      const updateQuantity = Number(stock.quantityOnShelf) + Number(amount);
      stockUpdate = await prisma.stocks.update({
        where: {
          id: stock.id,
        },
        data: {
          quantityOnShelf: updateQuantity,
        },
      });
    }

    if (remains === "order") {
      const updateQuantity = Number(stock.quantityOnOrder) + Number(amount);
      stockUpdate = await prisma.stocks.update({
        where: {
          id: stock.id,
        },
        data: {
          quantityOnOrder: updateQuantity,
        },
      });
    }

    if (stockUpdate === null)
      return res.status(404).json({ message: "Остаток с таким id не найден" });

    const { plu } = await prisma.products.findFirst({
      where: {
        id: stock.productId,
      },
      select: {
        plu: true,
      },
    });

    const service = await fetch("http://localhost:7999/api/history/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: `Остаток увеличен (${remains === "shelf" ? "полки" : "заказ"})`,
        productId: stock.productId,
        plu: plu,
        shopId: stock.shopId,
        stockId: stock.id,
      }),
    });

    return res.status(200).json({ message: "Остаток успешно увеличен" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `На сервере возникла ошибка!` });
  }
};

/**
 * @route PUT /api/stock/decrease
 * @desc  увеличение остатка
 * @access Public
 */
const decrease = async (req, res) => {
  const { id, amount } = req.body;
  const remains = req.query.remains;

  if (!remains)
    return res
      .status(400)
      .json({ message: "Укажите все обязательные параметры!" });

  if (!amount)
    return res
      .status(400)
      .json({ message: "Заполните все обязательные поля!" });

  try {
    const stock = await prisma.stocks.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!stock)
      return res.status(404).json({ message: "Такой товар не найден!" });

    let stockUpdate = null;

    if (remains === "shelf") {
      const updateQuantity = Number(stock.quantityOnShelf) - Number(amount);
      stockUpdate = await prisma.stocks.update({
        where: {
          id: stock.id,
        },
        data: {
          quantityOnShelf: updateQuantity,
        },
      });
    }

    if (remains === "order") {
      const updateQuantity = Number(stock.quantityOnOrder) - Number(amount);
      stockUpdate = await prisma.stocks.update({
        where: {
          id: stock.id,
        },
        data: {
          quantityOnOrder: updateQuantity,
        },
      });
    }

    if (stockUpdate === null)
      return res.status(404).json({ message: "Остаток с таким id не найден" });

    const { plu } = await prisma.products.findFirst({
      where: {
        id: stock.productId,
      },
      select: {
        plu: true,
      },
    });

    const service = await fetch("http://localhost:7999/api/history/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: `Остаток уменьшен (${remains === "shelf" ? "полки" : "заказ"})`,
        productId: stock.productId,
        plu: plu,
        shopId: stock.shopId,
        stockId: stock.id,
      }),
    });

    return res.status(200).json({ message: "Остаток успешно увеличен" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `На сервере возникла ошибка!` });
  }
};

const get = async (req, res) => {
  const {
    plu,
    shopId,
    shelfQuantityFrom,
    shelfQuantityTo,
    orderQuantityFrom,
    orderQuantityTo,
  } = req.query;

  const filters = {};

  if (shopId) filters.shopId = Number(shopId);

  if (shelfQuantityFrom || shelfQuantityTo) {
    filters.quantityOnShelf = {};
    if (shelfQuantityFrom)
      filters.quantityOnShelf.gte = Number(shelfQuantityFrom);
    if (shelfQuantityTo) filters.quantityOnShelf.lte = Number(shelfQuantityTo);
  }

  if (orderQuantityFrom || orderQuantityTo) {
    filters.quantityOnOrder = {};
    if (orderQuantityFrom)
      filters.quantityOnOrder.gte = Number(orderQuantityFrom);
    if (orderQuantityTo) filters.quantityOnOrder.lte = Number(orderQuantityTo);
  }

  try {
    if (plu) {
      const productId = await prisma.products.findFirst({
        where: {
          plu,
        },
        select: {
          id: true,
        },
      });
      filters.productId = productId.id;
    }

    const stocks = await prisma.stocks.findMany({
      where: filters,
    });

    return res.status(200).json(stocks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "На сервере возникла ошибка!" });
  }
};

module.exports = {
  create,
  increase,
  decrease,
  get,
};
