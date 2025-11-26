import { addProductServ, getAllProductsPageServ, searchProductsServ } from '../services/ProductService.js';


export const getAllProductsPage = async (req, res) => {
    try {
        const {
            genre, limit = 10, page, sort = "-createdAt"
        } = req.query;

        const result = await getAllProductsPageServ(genre, limit, page, sort);
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

        const result = await addProductServ(dto);
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
        const result = await searchProductsServ({ keyword, genre, minPrice, maxPrice, limit, page, sort });
        if (!result.success) return res.status(400).json(result.message);
        return res.status(200).json(result.data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
};
