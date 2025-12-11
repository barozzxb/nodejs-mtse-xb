import Product from '../models/Product.js';
import Favorite from '../models/favouriteProduct.js';
import Fuse from 'fuse.js';

export const getAllProductsServ = async () => {
  try {
    let result = await Product.find();
    return { success: true, message: 'Get product list sucessfully', data: result };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Unexpected error', data: null };
  }
};

export const getAllProductsPageServ = async (genre, limit = 10, page, sort = "-createdAt") => {
  try {
    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const filters = {};
    if (genre) filters.genre = genre;

    const p = Math.max(parseInt(page, 10), 1);
    const skip = (p - 1) * parsedLimit;

    const [items, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Product.countDocuments(filters)
    ]);
    const totalPages = Math.ceil(total / parsedLimit);
    return { success: true, message: "Get products page successfully", data: { page: p, totalPages, limit: parsedLimit, total: total, items: items } };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Unexpected error', data: null };
  }
};

export const searchProductsServ = async ({ keyword = '', genre, minPrice, maxPrice, limit = 10, page = 1, sort = '-createdAt' }) => {
  try {
    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const p = Math.max(parseInt(page, 10), 1);
    const skip = (p - 1) * parsedLimit;

    const filters = {};
    if (genre && genre.trim() !== '') filters.genre = genre;
    if (minPrice) filters.price = { ...filters.price, $gte: minPrice };
    if (maxPrice) filters.price = { ...filters.price, $lte: maxPrice };

    const searchRegex = keyword ? { $regex: keyword, $options: 'i' } : null;
    if (searchRegex) {
      filters.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Product.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / parsedLimit);
    return { success: true, message: 'Search products successfully', data: { page: p, totalPages, limit: parsedLimit, total, items } };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Unexpected error', data: null };
  }
};

export const searchProductFuzzyServ = async ({ q = "", page = 1, size = 5 }) => {
  try {
    const candidateLimit = 2000;
    const candidates = await Product.find().sort({ createdAt: -1 }).limit(candidateLimit).lean();

    if (!q || q.trim() === "") {
      const total = await Product.countDocuments();
      const items = candidates.slice((page - 1) * size, page * size);
      return { EC: 0, EM: "OK", DT: { total, items } };
    }

    const options = {
      keys: ["name", "brand", "genre", "description"],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2
    };

    const fuse = new Fuse(candidates, options);
    const raw = fuse.search(q);
    const total = raw.length;
    const pageStart = (page - 1) * size;
    const pageItems = raw.slice(pageStart, pageStart + size).map(r => ({ score: r.score, ...r.item }));

    return { EC: 0, EM: "OK", DT: { total, items: pageItems } };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Fuse search error", DT: null };
  }
};

export const addProductServ = async (dto) => {
  if (!dto) return { success: false, message: 'Null error', data: null };
  console.log(dto.genre);

  const prod = new Product({
    name: dto.name,
    genre: dto.genre,
    description: dto.description,
    price: dto.price,
    images: dto.images,
    brand: dto.brand,
  });

  try {
    await prod.save();
    return { success: true, message: 'Created product', data: prod.sku };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Unexpected error', data: null };
  }
}


export const addFavorite = async (userId, productId) => {
  try {
    await Favorite.create({ userId, productId });
    return { EC: 0, EM: "Added to favorites", DT: null };
  } catch (err) {
    if (err.code === 11000) {
      return { EC: 2, EM: "Already in favorites", DT: null };
    }
    console.error(err);
    return { EC: 1, EM: "Error adding favorite", DT: null };
  }
};

export const removeFavorite = async (userId, productId) => {
  try {
    await Favorite.deleteOne({ userId, productId });
    return { EC: 0, EM: "Removed from favorites", DT: null };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error removing favorite", DT: null };
  }
};

export const listFavorites = async (userId, { page = 1, limit = 20 } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const favs = await Favorite.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("productId");
    const total = await Favorite.countDocuments({ userId });
    return { EC: 0, EM: "OK", DT: { items: favs.map(f=>f.productId), total } };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error listing favorites", DT: null };
  }
};

export const addComment = async (userId, productId, text, rating = null) => {
  try {
    const c = await Comment.create({ userId, productId, text, rating });
    await c.populate("userId", "name email");
    return { EC: 0, EM: "Comment added", DT: c };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error adding comment", DT: null };
  }
};

export const listComments = async (productId, { page = 1, limit = 20 } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const items = await Comment.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name");
    const total = await Comment.countDocuments({ productId });
    return { EC: 0, EM: "OK", DT: { items, total } };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error listing comments", DT: null };
  }
};

export const similarProducts = async (productId, { limit = 10 } = {}) => {
  try {
    const prod = await Product.findById(productId).select("genre");
    if (!prod) return { EC: 2, EM: "Product not found", DT: null };
    const items = await Product.find({ genre: prod.genre, _id: { $ne: productId } })
      .sort({ createdAt: -1 })
      .limit(limit);
    return { EC: 0, EM: "OK", DT: items };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error getting similar products", DT: null };
  }
};

export const productStats = async (productId) => {
  try {
    const buyersAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.productId": mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$userId" } },
      { $count: "uniqueBuyers" }
    ]);
    const uniqueBuyers = buyersAgg[0]?.uniqueBuyers || 0;

    const commentersAgg = await Comment.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$userId" } },
      { $count: "uniqueCommenters" }
    ]);
    const uniqueCommenters = commentersAgg[0]?.uniqueCommenters || 0;

    return { EC: 0, EM: "OK", DT: { uniqueBuyers, uniqueCommenters } };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Error getting product stats", DT: null };
  }
};