import Order from "../models/order.js";

export const createOrderService = async (userId, items) => {
  try {
    if (!items || items.length === 0) {
      return {
        EC: 1,
        EM: "Cart is empty",
      };
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      userId,
      items,
      total,
      status: "paid",
    });

    return {
      EC: 0,
      EM: "Order created successfully",
      DT: newOrder,
    };
  } catch (error) {
    console.error("OrderService error:", error);
    return {
      EC: -1,
      EM: "Server error",
    };
  }
};
