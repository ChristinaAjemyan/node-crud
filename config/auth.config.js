module.exports = {
    secret: "Pseudopseudohypoparathyroidism_secret_key",

    // For prod

    //1 Hour
    // jwtExpiration: 3600,

    // 24 hours
    // jwtRefreshExpiration: 86400,

    // For Test

    // 1 minute
    jwtExpiration: 60,

    // 2 minutes
    jwtRefreshExpiration: 120,
};
