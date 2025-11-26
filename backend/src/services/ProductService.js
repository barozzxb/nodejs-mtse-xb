import Product from '../models/Product.js';

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
