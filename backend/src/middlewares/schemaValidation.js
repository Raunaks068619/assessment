const { VALID_CATEGORIES } = require('../models/ItemModel');

const validateItemSchema = (req, res, next) => {
    const { name, category, price } = req.body;
    const errors = [];
    // 1. Basic type and existence checks
    if (!name || typeof name !== 'string') {
        errors.push("Field 'name' is required and must be a string.");
    }

    // if (!category || typeof category !== 'string' || !VALID_CATEGORIES.includes(category)) {
    //     errors.push(`Field 'category' must be one of: ${VALID_CATEGORIES.join(', ')}.`);
    // }

    // Example of range validation
    if (price === undefined || typeof price !== 'number' || price < 0) {
        errors.push("Field 'price' is required and must be a positive number.");
    }
    // 2. If there are errors, stop the request and send a 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            error: "Validation Failed",
            messages: errors
        });
    }
    // 3. If everything is good, pass control to the Controller
    next();
};

module.exports = validateItemSchema;
