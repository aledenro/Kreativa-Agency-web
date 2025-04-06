const Config = require("../models/configModel");

class ConfigService {
    async getConfig(key) {
        const config = await Config.findOne({ key });
        return config ? config.value : null;
    }

    async setConfig(key, value, description = "") {
        return await Config.findOneAndUpdate(
            { key },
            { value, description, updatedAt: new Date() },
            { upsert: true, new: true }
        );
    }
}

module.exports = new ConfigService();
