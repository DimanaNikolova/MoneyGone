const jwt = require('./jwt');
const config = require('../config/config');
const { User } = require('../models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        const token = req.cookies[config.cookie] || '';


        jwt.verifyToken(token)
            .then((data) => {
                User.findById(data.id).then(user => {
                    req.user = user;
                    next()
                })
            })
            .catch(err => {
                if (!redirectUnauthenticated) { next(); return; }
                if ([
                    'token expired',
                    'blacklisted token',
                    'jwt must be provided'
                ].includes(err.message)
                ) {
                    res.redirect('/login');
                    return;
                }
                next(err);
            });
    };
}

module.exports = auth