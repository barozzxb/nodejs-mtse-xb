import * as prodServ from '../services/ProductService.js';


export const getAllProductsPage = async (req, res) => {
    try {
        const {
            genre, limit = 10, page, sort = "-createdAt"
        } = req.query;

        const result = await prodServ.getAllProductsPageServ(genre, limit, page, sort);
        if (!result.success) {
            return res.status(400).json(result.message);
        }
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', data: null });
    };
};

export const addProduct = async (req, res) => {
    try {
        const dto = {
            name: req.body.name,
            genre: req.body.genre,
            description: req.body.description,
            price: req.body.price,
            images: req.body.images,
            brand: req.body.brand,
        };

        const result = await prodServ.addProductServ(dto);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', data: null });
    };
};

export const searchProducts = async (req, res) => {
    try {
        const { keyword, genre, minPrice, maxPrice, limit, page, sort } = req.query;
        const result = await prodServ.searchProductsServ({ keyword, genre, minPrice, maxPrice, limit, page, sort });
        if (!result.success) return res.status(400).json(result.message);
        return res.status(200).json(result.data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
};
export const searchProductsFuzzy = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const size = Math.max(1, Math.min(100, parseInt(req.query.size) || 10));

    const result = await prodServ.searchProductFuzzyServ({ q, page, size });

    return res.status(200).json(result);
  } catch (err) {
    console.error("search.controller error:", err);
    return res.status(500).json({ EC: 1, EM: "Internal server error", DT: null });
  }
};

export const addFavoriteCtrl = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const result = await prodServ.addFavorite(userId, productId);
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const removeFavoriteCtrl = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const result = await prodServ.removeFavorite(userId, productId);
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const listFavoritesCtrl = async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await prodServ.listFavorites(userId, { page, limit });
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const addCommentCtrl = async (req, res) => {
  const userId = req.user._id;
  const { productId, text, rating } = req.body;
  const result = await prodServ.addComment(userId, productId, text, rating);
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const listCommentsCtrl = async (req, res) => {
  const productId = req.params.productId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await prodServ.listComments(productId, { page, limit });
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const similarProductsCtrl = async (req, res) => {
  const productId = req.params.productId;
  const result = await prodServ.similarProducts(productId, { limit: Number(req.query.limit) || 10 });
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

export const productStatsCtrl = async (req, res) => {
  const productId = req.params.productId;
  const result = await prodServ.productStats(productId);
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};