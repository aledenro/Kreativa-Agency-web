const configService = require("../services/configService");

class ConfigController {
    async getFormStatus(req, res) {
        try {
            const isFormActive =
                await configService.getConfig("landingFormActive");
            res.json({ active: isFormActive !== null ? isFormActive : true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async toggleFormStatus(req, res) {
        try {
            const currentStatus =
                await configService.getConfig("landingFormActive");
            const newStatus = currentStatus !== null ? !currentStatus : false;
            await configService.setConfig(
                "landingFormActive",
                newStatus,
                "Controla si el form esta activo"
            );
            res.json({ active: newStatus });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ConfigController();
