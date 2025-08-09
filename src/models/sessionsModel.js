const mongoose = require("mongoose")

const SessionsModel = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "usuarios"
    },
    estado: {
        type: Boolean,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    }
}, {collection: "sessions"})

module.exports = mongoose.model("sessions", SessionsModel)