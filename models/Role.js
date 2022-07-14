const mongoose = require("mongoose");
const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: String
    })
);

module.exports = Role;
// Roles list is constant. Exporting list of Existing Roles
module.exports.ROLES = ["user", "admin"];
