const mongoose = require("mongoose");
const crypto = require("crypto");

const PostSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

    token: String,

});

module.exports = mongoose.model("Post", PostSchema);
