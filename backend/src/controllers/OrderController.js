import { createOrderService } from "../services/orderService.js";

export const createOrderController = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const result = await createOrderService(userId, items);

    return res.status(200).json(result);
  } catch (error) {
    console.error("OrderController error:", error);

    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
    });
  }
};
