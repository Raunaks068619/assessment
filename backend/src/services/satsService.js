const path = require('path');
const DataRepository = require('../repositories/dataRepository');
const DATA_PATH = path.join(__dirname, '../../../data/output.json');

class StatsService {

    constructor() {
        this.dataRepository = new DataRepository();
    }

    async getStats() {
        const data = await this.dataRepository.readData();

        // GOAL: The goal here is to provide total item count and average price of all items

        // ISSUE: The current implementation is blocking the event loop

        // fs.readFile(DATA_PATH, (err, raw) => {
        //     if (err) return next(err);
        //     const items = JSON.parse(raw);
        //     // Intentional heavy CPU calculation
        //     const stats = {
        //         total: items.length,
        //         averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
        //     };
        //     res.json(stats);
        // });

        // SOLUTION: We can read the whole file once and then store the stats in a cache
        //           and then return the stats from the cache, until there is a modification to the file

        // IMP: Then we will update both the file and the cache simultaneously without reading the file again
        //      and thiw will make the fetches faster without reading the file after modification

        return await this.dataRepository.getStats();

    }

}

module.exports = StatsService;