const { promises } = require('fs');
const { join } = require('path');
const { VALID_CATEGORIES } = require('../models/ItemModel');
const fs = require('fs');

const DATA_PATH = join(__dirname, '../../../data/output.json');
const modelFile = join(__dirname, '../models/ItemModel.js');

class DataRepository {

    constructor() {
        this.statsCache = null; // This will be used to track the state of the stats
        this.totalSum = 0; // This will be used to track the sum of prices
        this.categories = VALID_CATEGORIES;
        this.totalCategories = VALID_CATEGORIES.length;
    }

    // This methods will mimic a db get call and will be used wherever get is needed 
    async readData() {
        const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(raw);
    }

    // NOTE: This method will be used to get stats from the cache
    async getStats() {
        if (!this.statsCache) {
            console.log("Calculating stats and cache it");
            const data = await this.readData();

            this.totalSum = data.reduce((acc, cur) => acc + cur.price, 0);
            this.totalItems = data.length;
            const uniqueCategories = new Set(data.map(item => item.category));

            const categoryCounts = {};
            data.forEach(item => {
                categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
            });

            this.statsCache = {
                total: this.totalItems,
                averagePrice: this.totalSum / this.totalItems,
                categories: [...uniqueCategories],
                totalCategories: uniqueCategories.size,
                categoryCounts
            };
        }
        return this.statsCache;
    }

    // async addNewCategory(category) {
    //     // TODO: have to update the itemModel as well so we can add a new Category type

    //     const modelContent = await promises.readFile(modelFile, 'utf-8');
    //     const updatedModelContent = modelContent.replace(/VALID_CATEGORIES = \[.*\]/, `VALID_CATEGORIES = [...VALID_CATEGORIES, '${category}']`);

    //     await promises.writeFile(modelFile, updatedModelContent);

    //     console.log(this.categories);


    //     if (!this.categories.includes(category)) {
    //         this.categories.push(category);
    //         this.totalCategories++;
    //     }
    //     else {
    //         throw new Error('Category already exists');
    //     }
    // }

    async appendItemToFile(item) {
        const fileHandle = await fs.promises.open(DATA_PATH, 'r+');
        try {
            const stat = await fileHandle.stat();
            console.log({ stat });

            let position = stat.size - 1;
            let buffer = Buffer.alloc(1);

            // 1. Read backwards from the end of the file to find the closing ']'
            while (position >= 0) {
                await fileHandle.read(buffer, 0, 1, position);
                if (buffer.toString('utf-8') === ']') {
                    break; // Found it!
                }
                position--;
            }
            if (position < 0) throw new Error("Invalid JSON file: Closing bracket not found");
            // 2. Format our new item nicely
            const itemString = JSON.stringify(item, null, 2);

            // 3. Overwrite the ']' with a comma, the new item, and a new ']'
            // Note: We use .replace to keep the indentation pretty
            const appendString = `,\n  ${itemString.replace(/\n/g, '\n  ')}\n]`;
            // Write it starting exactly at the position where the old ']' was
            await fileHandle.write(appendString, position, 'utf-8');


            // **********************************
            if (this.statsCache) {
                // Update the cache for the Stats to work smoothly
                this.totalItems = this.totalItems + 1;
                this.totalSum = this.totalSum + item.price;

                if (!this.statsCache.categories.includes(item.category)) {
                    this.statsCache.categories.push(item.category);
                    this.statsCache.totalCategories++;
                }

                if (this.statsCache.categoryCounts) {
                    this.statsCache.categoryCounts[item.category] = (this.statsCache.categoryCounts[item.category] || 0) + 1;
                }

                this.statsCache = {
                    ...this.statsCache,
                    total: this.totalItems,
                    averagePrice: this.totalSum / this.totalItems
                };
            }
            // **********************************

        } finally {
            // Always close the file handle to prevent memory/filedescriptor leaks!
            await fileHandle.close();
        }
    }
}

module.exports = DataRepository;