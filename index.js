const env = process.env.NODE_ENV || 'development';
const bodyParser = require('body-parser');

require('./config/database')().then(()=>{
    const config = require('./config/config');
    const app = require('express')();
    app.use(bodyParser.urlencoded({extended:true}))
    require('./config/express')(app);
    require('./config/routes')(app);

    app.listen(config.port, console.log(`Server is up and running on port ${config.port}`))
})