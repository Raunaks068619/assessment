const fs = require('fs');
const path = require('path');
const DataRepository = require('../repositories/dataRepository');
const DATA_PATH = path.join(__dirname, '../../../data/output.json');

class ItemsService {

    constructor() {
        this.dataRepository = new DataRepository();
    }

    #getPagination({ data, limit, page }) {
        // This will help us create a comprehensive pagionaion response for UI
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedData = data.slice((page - 1) * limit, page * limit); // slice(start, end)
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            pagination: {
                totalItems,
                totalPages,
                hasNextPage,
                hasPrevPage,
                currentPage: page,
                limit
            },
            paginatedData
        };
    }

    async getItems({ limit, page, q = '' }) {
        let data = await this.dataRepository.readData();
        const searchQuery = q.toLowerCase();
        // Checking if q string is not emptystring
        if (searchQuery.length > 0) {
            // Simple substring search (sub‑optimal)
            data = data.filter(item => item.name.toLowerCase().includes(searchQuery));
        }
        const { pagination, paginatedData } = this.#getPagination({ data, limit, page });

        let items = paginatedData;

        return {
            pagination,
            items
        };
    }

    async getItemById({ id }) {
        const data = await this.dataRepository.readData();

        const itemDetail = data.find(i => i.id === parseInt(id));

        if (!itemDetail) {
            const err = new Error('Item not found');
            err.status = 404;
            throw err;
        }

        return itemDetail;
    }

    async createItem({ name, category, price }) {
        //********************
        // TODO: Validate payload (intentional omission) 
        // const item = req.body;
        // const data = readData();
        // item.id = Date.now();
        // data.push(item);
        // fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        //********************

        // ISSUE:  with the above implementation is that it is not async
        // and it will fetch all the data regardless of the size update the array
        // and write it back to the file this will halt the event loop
        // and will not be able to handle concurrent requests 

        // SOLUTION: We can instead open the file asyncronously and write the data 
        // directly at the end of the file that way we dont have to read the whole file
        // and we can handle concurrent requests

        const item = { name, category, price, id: Date.now() };
        await this.dataRepository.appendItemToFile(item);
        return item;
    }

    // async createCategory({ category }) {
    //     await this.dataRepository.addNewCategory(category);
    //     return category;
    // }
}

module.exports = ItemsService;