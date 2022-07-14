const config = require("../config/auth.config");
const User = require("../models/User");
const Role = require("../models/Role");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const verifySignUp = require("../middlewares/verifySignUp.middleware");
const authMiddleware = require("../middlewares/authJWT.middleware");
const router = express.Router();

router.post(
    '/signup',
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    (req, res) => {
        // Creating user object using User Model
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            // hashing password
            password: bcrypt.hashSync(req.body.password, 8)
        });

        // Saving created user
        user.save()
            .then((user) => {
                // If existing roles in request
                if (req.body.roles) {
                    // Finding roles by name
                    Role.find(
                        {
                            name: {$in: req.body.roles}
                        },
                        (err, roles) => {
                            if (err) {
                                res.status(500).send({message: err});
                                return;
                            }
                            // Setting roles to Created user
                            user.roles = roles.map(role => role._id);

                            // Updating user in collection
                            user.save(err => {
                                if (err) {
                                    res.status(500).send({message: err});
                                    return;
                                }

                                // Sending response
                                res.send({message: "User was registered successfully!"});
                            });
                        }
                    );
                } else {
                    // For default setting user's role as 'user'

                    // Finding role by name
                    Role.findOne({name: "user"}, (err, role) => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        // Setting roles to Created user
                        user.roles = [role._id];

                        // Updating user in collection
                        user.save(err => {
                            if (err) {
                                res.status(500).send({message: err});
                                return;
                            }
                            res.send({message: "User was registered successfully!"});
                        });
                    });
                }
            })
            .catch(err => {
                res.status(500).send({message: err});
            });
    }
)

router.post('/signin', (req, res) => {
    // Finding user by username
    User.findOne({
        username: req.body.username,
    })
        // populating roles
        .populate("roles", "-__v")
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            // Handling case if user doesn't exist
            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            // Checking if password valid using bcrypt
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            // Sending 401 error, when password is invalid
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }

            // Generating JWT token
            let token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: config.jwtExpiration,
            });

            // Generating refresh token
            let refreshToken = await RefreshToken.createToken(user);

            // Generating list of roles for user
            let authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            // Sending response with user object
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
            });
        });
});

router.post('/refreshToken', async (req, res) => {
    const {refreshToken: requestToken} = req.body;

    if (requestToken == null) {
        return res.status(403).json({message: "Refresh Token is required!"});
    }

    try {
        // Finding Refresh token in db
        let refreshToken = await RefreshToken.findOne({token: requestToken});

        // Handling case, when refreshToken not provided
        if (!refreshToken) {
            res.status(403).json({message: "Refresh token is not in database!"});
            return;
        }

        // Checking if refresh token has expired
        if (RefreshToken.verifyExpiration(refreshToken)) {
            // Removing expired refresh token from db
            await RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify: false}).exec();

            res.status(403).json({
                message: "Refresh token was expired. Please make a new sign in request",
            });
            return;
        }

        // Generating new access token
        let newAccessToken = jwt.sign({id: refreshToken.user._id}, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        // Sending new access token and refresh token as response
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({message: err});
    }
})

router.get('/testAuth', authMiddleware.verifyToken, (req, res) => {
    res.status(200).send('User is authenticated')
})

router.get('/testAdminAuth', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
    res.status(200).send('Admin is authenticated')
})

module.exports = router
