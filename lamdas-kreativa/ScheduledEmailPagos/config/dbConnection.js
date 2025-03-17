const { MongoClient } = require("mongodb");

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            serverSelectionTimeoutMS: 10000,
        });

        cachedDb = client.db();
        console.log("Conectado a la db");
        return cachedDb;
    } catch (error) {
        throw new Error("Error de conexión a MongoDB");
    }
};

module.exports = connectDB;
