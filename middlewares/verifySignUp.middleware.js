const User = require("../models/User");
const {ROLES} = require("../models/Role");

/**
 * Checks if already exist user with username or email from request.
 * @param req
 * @param res
 * @param next
 */
checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Finding user by username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        // If user with same username exist sending 400 error
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        // If user with same username doesn't exist, trying to find user by email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            // If user with same email found
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
            next();
        });
    });
};

/**
 * Checking if roles in request exist in database.
 * @param req
 * @param res
 * @param next
 */
checkRolesExisted = (req, res, next) => {
    // If roles exist in request
    if (req.body.roles) {
        // Getting every role using cycle
        for (let i = 0; i < req.body.roles.length; i++) {
            // Checking if role from request exist in role list on server
            if (!ROLES.includes(req.body.roles[i])) {
                // When role doesn't exist
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }
    next();
};

const verifySignUpMiddleware = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};
module.exports = verifySignUpMiddleware;
