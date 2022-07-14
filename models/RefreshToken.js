const {Schema, model} = require("mongoose");
const config = require("../config/auth.config");
const {v4: uuidv4} = require('uuid');

// Creating Schema
const RefreshTokenSchema = new Schema({
    token: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});
/**
 * Create new token using uuid v4
 * @param user
 * @returns {Promise<*>}
 */
RefreshTokenSchema.statics.createToken = async function (user) {
    // Setting expiration date
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + config.jwtRefreshExpiration
    );
    // Generating token using uuid v4
    let _token = uuidv4();
    // Creating refresh token model
    let _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt.getTime(),
    });
    // TODO: Remove log
    console.log(_object);
    // Saving refresh token in collection
    let refreshToken = await _object.save();
    return refreshToken.token;
};

/**
 * Checking if token expired or not
 * @param token
 * @returns {boolean}
 */
RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

// Registering model
const RefreshToken = model("RefreshToken", RefreshTokenSchema);

// Exporting model
module.exports = RefreshToken;
