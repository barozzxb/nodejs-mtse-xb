import Cart from "./cart.js";

export const resolvers = {
  Query: {
    cartItems: async () => {
      return await Cart.find().sort({ createdAt: -1 });
    },
  },
  Mutation: {
    addCartItem: async (_, { input }) => {
      const existing = await Cart.findOne({ productId: input.productId });
      if (existing) {
        existing.quantity += input.quantity;
        await existing.save();
        return existing;
      }
      const cartItem = new Cart(input);
      await cartItem.save();
      return cartItem;
    },
    updateCartItem: async (_, { input }) => {
      const item = await Cart.findById(input.id);
      if (!item) throw new Error("Cart item not found");
      if (input.quantity !== undefined) item.quantity = input.quantity;
      await item.save();
      return item;
    },
    removeCartItem: async (_, { id }) => {
      const deleted = await Cart.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};
