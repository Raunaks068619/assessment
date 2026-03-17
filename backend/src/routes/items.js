const express = require('express');
const fs = require('fs');
const path = require('path');
const ItemsController = require('../controller/itemsController');
const validateItemSchema = require('../middlewares/schemaValidation');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/output.json');

const itemsController = new ItemsController();

// GET /api/items
router.get('/', itemsController.getItems);

// router.get('/', (req, res, next) => {
// try {
//   const data = readData(); // In a real scenario this is mostly going to be a DB call to get the data and it must be async calle inside a controller
//   console.log(data);
//   const { limit, q } = req.query;
//   let results = data;
//   if (q) {
//     // Simple substring search (sub‑optimal)
//     results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
//   }
//   if (limit) {
//     results = results.slice(0, parseInt(limit));
//   }
//   res.json(results);
// } catch (err) {
//   next(err);
//   console.log(err);
// }
// });

// GET /api/items/:id
router.get('/:id', itemsController.getItemById);

// router.get('/:id', (req, res, next) => {
//   try {
//     const data = readData();
//     const item = data.find(i => i.id === parseInt(req.params.id));
//     if (!item) {
//       const err = new Error('Item not found');
//       err.status = 404;
//       throw err;
//     }
//     res.json(item);
//   } catch (err) {
//     next(err);
//   }
// });



// POST /api/items
router.post('/', validateItemSchema, itemsController.createItem); 
// Added validation middleware for schema validation
// IMPLEMENTED: Validate payload (intentional omission)


// router.post('/', (req, res, next) => {
//   try {
//     // TODO: Validate payload (intentional omission)
//     const item = req.body;
//     const data = readData();
//     item.id = Date.now();
//     data.push(item);
//     fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
//     res.status(201).json(item);
//   } catch (err) {
//     next(err);
//   }
// });

// router.put('/category', itemsController.createCategory);

module.exports = router;