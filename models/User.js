const {Schema, model} = require("mongoose");

const User = model(
    "User",
    new Schema({
        username: String,
        email: String,
        password: String,
        // Pno to many relation with roles collection
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);
module.exports = User;
