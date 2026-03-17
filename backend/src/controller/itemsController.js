const ItemsService = require('../services/itemService');
class ItemsController {
    constructor() {
        this.itemsService = new ItemsService();
    }

    getItems = async (req, res, next) => {
        try {
            const { limit, page, q } = req.query;
            const items = await this.itemsService.getItems({
                page: parseInt(page),
                limit: parseInt(limit),
                q,
            });
            res.json(items);
        } catch (err) {
            next(err);
        }
    }

    getItemById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.itemsService.getItemById({ id });
            res.json(item);
        } catch (err) {
            next(err);
        }
    }

    createItem = async (req, res, next) => {
        try {
            const { name, category, price } = req.body;
            const item = await this.itemsService.createItem({ name, category, price });
            res.json({ item, message: "Item created successfully" });
        } catch (err) {
            next(err);
        }
    }

    // createCategory = async (req, res, next) => {
    //     try {
    //         const { category } = req.body;
    //         const newCategory = await this.itemsService.createCategory({ category });
    //         res.json({ newCategory, message: "Category created successfully" });
    //     } catch (err) {
    //         next(err);
    //     }
    // }
}

module.exports = ItemsController;