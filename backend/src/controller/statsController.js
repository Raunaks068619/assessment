const StatsService = require('../services/satsService');

class StatsController {
    constructor() {
        this.statsService = new StatsService();
    }

    getStats = async (req, res, next) => {
        try {
            const stats = await this.statsService.getStats();
            res.json(stats);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StatsController;