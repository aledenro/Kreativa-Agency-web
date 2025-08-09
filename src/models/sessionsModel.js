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
    token: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    motivoFinalizacion: {
        type: String,
        required: false
    }
}, {collection: "sessions"})

module.exports = mongoose.model("sessions", SessionsModel)