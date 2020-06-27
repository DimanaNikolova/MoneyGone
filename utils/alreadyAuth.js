const jwt = require('./jwt');
const config = require('../config/config');
const { User } = require('../models');

function notAuth(redirectAuthenticated = true){
    return function (req, res, next) {
        const token = req.cookies[config.cookie] || '';


        jwt.verifyToken(token)
            .then((data) => {
                User.findById(data.id).then(user => {
                    req.user = user;
                    res.redirect('/')
                    next()
                })
            })
    };
}

module.exports = notAuth