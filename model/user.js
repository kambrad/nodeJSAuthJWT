const MongoDB = require('mongoose');

const Users = new MongoDB.Schema(
    {
        name: { type: String, default: null },
        email: { type: String, unique: true },
        password: { type: String }
    }
)

module.exports = MongoDB.model("user", Users);