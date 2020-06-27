const { User } = require('../models')
const { Article } = require('../models')
const jwt = require('../utils/jwt')
const config = require('../config/config')
const Expense = require('../models/Expense')
const e = require('express')

module.exports = {
    get: {
        login: (req, res, next) => {
            if (req.cookies[config.cookie] === undefined) {

                res.render('login.hbs', { pageTitle: "Login" })
            }
            else {
                res.render('404.hbs', { notFound: 'You are already logged in!' })

            }

        },
        register: (req, res, next) => {
            if (req.cookies[config.cookie] === undefined) {
                res.render('register.hbs', { pageTitle: "Register" })
            }
            else {
                res.render('404.hbs', { notFound: 'You are already logged in!' })

            }

        },
        logout: (req, res, next) => {
            res
                .clearCookie(config.cookie)
                .clearCookie('username')
                .redirect('/home/')

        },
        refill: (req, res, next) => {
            const user = req.cookies['username']
            let { refillAmount } = req.body;
            refillAmount = Number(refillAmount)


            User.findOneAndUpdate({ username: user }, { $inc: { amount: refillAmount } })
                .then((currentUser) => {

                    res.redirect(`/expense/all`)

                }).catch((err) => {
                    res.render(`404.hbs`, { message: 'Salary must be a number!' })

                })

        },
        account: (req, res, next) => {
            const user = req.cookies['username']
            var total = 0
            User.findOne({ username: user }).lean().then((currentUser) => {
                Expense.find({ user: currentUser._id }).then((expense) => {

                    expense.forEach(e => {
                        total += e.total
                    });

                }).then(() => {
                    currentUser.merchants = currentUser.expenses.length
                    currentUser.total = total

                    res.render('account-info.hbs', currentUser)
                })
            }).catch(()=> res.redirect('/user/login'))



        }
    },
    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;
            User.findOne({ username }).then((user) => {
                Promise.all([user, user.matchPassword(password)])
                    .then(([user, match]) => {
                        if (!match) {
                            res.message = "Invalid username!"
                            redirect('/user/login')
                            return;

                        }
                        const token = jwt.createToken({ id: user._id })
                        res.cookie('x-auth-token', token)
                            .cookie('username', username)
                            .redirect('/expense/all')
                    }).catch((err) => {

                        res.render('login.hbs', {
                            message: "Username or password is invalid!"
                        });
                    })
            }).catch((err) => {
                res.render('login.hbs', {
                    message: "Username or password is invalid!",
                    oldInput: { username, password }
                });
            })

        },
        register: (req, res, next) => {
            const { username, password, repeatPassword, amount } = req.body;

            if (password !== repeatPassword) {
                res.render('register.hbs', {
                    message: "Passwords do not match!",
                    oldInput: { username, password, repeatPassword }
                });
                return;
            }

            User.create({ username, password, amount })
                .then((registeredUser) => {

                    res.redirect('/user/login')

                }).catch((err) => {

                    if (err.code === 11000) {
                        const message = "This username is already taken!"
                        return res.render('register.hbs', { message, oldInput: { username, password, repeatPassword, amount } })
                    }

                    if (err.code === 11000 || err.name === "ValidationError") {
                        const message = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        res.render('register.hbs', { message, oldInput: { username, password, repeatPassword, amount } })
                    }

                })


        },

    }
}