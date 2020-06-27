const config = require('../config/config')
const { Article } = require('../models')
const { User } = require('../models')
const { Expense } = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('new-expense.hbs', { pageTitle: "Add expense" })
        },

        all: (req, res, next) => {
            let { refillAmount } = req.body


            Expense
                .find({ user: req.user._id })
                .lean()
                .then((expenses) => {
                    res.render('expenses.hbs', { expenses, refillAmount, pageTitle: 'Expenses' })
                })
        },

        report: (req, res, next) => {
            const id = req.params.id

            Expense
                .findById(id)
                .lean()
                .then(expense => {
                    console.log(expense);
                    
                    res.render('report.hbs', { expense, id, pageTitle: 'Report' })
                })
        },

        delete: (req, res, next) => {
            const id = req.params.id
            const uid = req.user.id
            Promise.all([
                User.update({ _id: uid }, { $pull: { expenses: id } }),
                Expense.findByIdAndRemove(id)
            ]).then(([user, expense]) => {
                res.redirect('/expense/all')
            })

        }
    },

    post: {
        create: (req, res, next) => {
            let { merchant, description, category, total, report } = req.body;

            var func = new Date();

            var d = func.getDate();
            var m = func.getMonth() + 1
            var y = func.getFullYear()

            var date = y + "-" + m + '-' + d

            if (report === "on") {
                report = true

            }


            Expense
                .create({ merchant, description, category, total: Number(total), report, user: req.user._id, date })
                .then((data) => {

                    req.user.expenses.push(data._id)

                    return User.findByIdAndUpdate({ _id: req.user._id }, req.user,)
                })
                .then((updatedUser) => {
                    res.redirect('/expense/all')
                })
                .catch((err) => {
                    console.log(err);

                    if (err.code === 11000 || err.name === "ValidationError") {
                        const message = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        res.render('new-expense.hbs', { message, oldInput: { merchant, description, category } })
                    }

                })
        },

        edit: (req, res, next) => {
            const { description } = req.body
            const id = req.params.id
            Article.findByIdAndUpdate({ _id: id }, { description })
                .then((article) => {
                    res.redirect(`/article/details/${id}`)
                })
        },

        search: (req, res, next) => {
            const { search } = req.body
            Article
                .find({})
                .select('title')
                .lean()
                .then((articles) => {
                    let searchedArticles = articles.filter(a =>
                        a.title.toLowerCase().includes(search.toLowerCase())
                    )
                    res.render('search-results.hbs', { articles: searchedArticles, search })
                })
        }
    }
}