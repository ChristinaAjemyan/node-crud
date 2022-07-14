const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require("../models/User");
const Role = require("../models/Role");

const {TokenExpiredError} = jwt;
/**
 * Checks if user has Admin role
 * @param req
 * @param res
 * @param next
 */
isAdmin = (req, res, next) => {
    // Finding user by id
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        // Finding user's roles from collection
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                // Checking if user has admin role
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                // If user hasn't admin role
                res.status(403).send({message: "Require Admin Role!"});
            }
        );
    });
};

/**
 * Error handler
 * @param err
 * @param res
 * @returns {*}
 */
const catchError = (err, res) => {
    // If error is about expired token
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({message: "Unauthorized! Access Token was expired!"});
    }
    // Other cases
    return res.sendStatus(401).send({message: "Unauthorized!"});
}

/**
 * Verifying token using jwt
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifyToken = (req, res, next) => {
    // Getting token from headers
    let token = req.headers["x-access-token"];
    // Checking if token in headers exist
    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }
    // Verifying token using jwt secret key
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken,
    isAdmin
};
module.exports = authJwt;
