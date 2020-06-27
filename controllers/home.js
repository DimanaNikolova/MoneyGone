module.exports = {
    get: {
        home: (req, res, next) => {

            if (req.cookies['username']) {
                res.render('expenses.hbs')

            } else {
                res.render('home.hbs')

            }
        }
    }
}