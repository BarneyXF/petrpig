const Express = require('express');
const Mongoose = require('mongoose');
const BodyParser = require('body-parser');
const Database = require('./config/Database');
const cors = require('cors');
const Application = Express();
const Port = 8808;

Application.use(BodyParser.json());
Application.use(cors());

Mongoose.connect(Database.url, (Error,   database) => 
{
    if(Error)
    {
        return console.log(Error);
    }
    console.log('Connected(Mongoose) to Database on url ' + Database.url);

    require('./app/routes')(Application, database);

    Application.listen(Port, () =>
    {
        console.log('MongoDB API listening on ' + Port);
    });
});