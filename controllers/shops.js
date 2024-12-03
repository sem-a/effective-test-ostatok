const { prisma } = require("../prisma/prisma-client");

/**
 * @route POST /api/shops/get
 * @desc Получение Магазинов
 * @access Public
 */
const get = async (req, res) => {
  try {
    const shops = await prisma.shops.findMany();

    return res.status(200).json(shops);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "На сервере возникла ошибка!" });
  }
};

module.exports = {
  get,
};
