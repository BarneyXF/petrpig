const Express = require('express');
//const MongoClient = require('mongodb').MongoClient;
//const Mongoose = require('mongoose');
const cassandra = require('cassandra-driver');
const bodyParser = require('body-parser');
var ExpressCassandra = require('express-cassandra');

var cors = require('cors');

const app = Express();
const port = 8807;
//var routes = require('./app/routes');


app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());
app.use(cors());
//app.use('/', routes);
let client;

var models = ExpressCassandra.createClient({
    clientOptions: {
        contactPoints: ['127.0.0.1'],
        keyspace: 'petr_pig',
        queryOptions: {consistency: ExpressCassandra.consistencies.one}
    },
    ormOptions: {
        defaultReplicationStrategy : {
            class: 'SimpleStrategy',
            replication_factor: 1
        },
        migration: 'safe',
    }
});

var Departure= models.loadSchema('departure',  {
    fields:{
        name    : "text",
        time_of_departure : "date",
        country    : "text",
        amount: "int"
    },
    key:["country","name"]
}) ;

console.log(models.instance.departure === Departure);

app.listen(port, () =>
    {
        console.log('API listening on ' + port);
    });


app.get('/departure/:name',(req,res) => {

        const nameR = req.params.name;

        models.instance.departure.findOne(
            {name: nameR}, 
            { raw: true, allow_filtering: true}, 
            (error, departure) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
            
                res.send(departure);
                console.log(departure.name +" "+departure.time_of_departure+" "+ departure.country+" "+departure.amount);

                
            }
        });
});

app.delete('/departure/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;
        var query_object = {name: nameR, country: countryR};
        models.instance.departure.delete(
            query_object, 
            { raw: true, allow_filtering: true}, 
            (error, departure) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись была удалена" );
            }   


        });
});

app.put('/departure/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;

        var Departure = new models.instance.departure({name: nameR, country: countryR });

        if(req.body.amount != "")
        {
            Departure.amount = Number(req.body.amount);
        }

        if(req.body.time_of_departure!= "")
        {
            Departure.time_of_departure= new cassandra.types.LocalDate.fromString(
               req.body.time_of_departure
            );
        }

        Departure.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});

app.post('/departure',(req,res) => {

        const nameR = req.body.name;
        const countryR = req.body.country;
        const amountR = req.body.amount;
        const timeR = req.body.time_of_departure;

        var Departure = new models.instance.departure({name: nameR, country: countryR });

        Departure.amount = Number(amountR);
        
        Departure.time_of_departure= new cassandra.types.LocalDate.fromString(
               timeR
            );
        

        Departure.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});



var Transplatation_of_assets= models.loadSchema('transplatation_of_assets',  {
    fields:{
        name    : "text",
        time_of_transplatation : "date",
        country    : "text",
        type: "text",
        amount: "int",
        lost_percent :"int",
    },
    key:["country","name"]
}) ;

console.log(models.instance.transplatation_of_assets=== Transplatation_of_assets);


app.get('/assets/:name',(req,res) => {

        const nameR = req.params.name;

        models.instance.transplatation_of_assets.findOne(
            {name: nameR}, 
            { raw: true, allow_filtering: true}, 
            (error, transplatation_of_assets) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
            
                res.send(transplatation_of_assets);
                           
            }
        });
});


app.delete('/assets/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;
        var query_object = {name: nameR, country: countryR};
        models.instance.transplatation_of_assets.delete(
            query_object, 
            { raw: true, allow_filtering: true}, 
            (error, transplatation_of_assets) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись была удалена" );
            }   


        });
});

app.put('/assets/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;

        var Transplatation_of_assets = new models.instance.transplatation_of_assets({name: nameR, country: countryR });

        if(req.body.amount != "")
        {
            Transplatation_of_assets.amount = Number(req.body.amount);
        }

        if(req.body.time_of_transplatation!= "")
        {
            Transplatation_of_assets.time_of_transplatation= new cassandra.types.LocalDate.fromString(
               req.body.time_of_transplatation
            );
        }
        if(req.body.type != "")
        {
            Transplatation_of_assets.type = req.body.type;
        }

        if(req.body.lost_percent != "")
        {
            Transplatation_of_assets.lost_percent = Number(req.body.lost_percent);
        }

        Transplatation_of_assets.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице" );
            }    


        });
});


app.post('/assets',(req,res) => {

        const nameR = req.body.name;
        const countryR = req.body.country;
        const amountR = req.body.amount;
        const timeR = req.body.time_of_transplatation;
        const typeR = req.body.type;
        const lost_percentR  = req.body.lost_percent;

        var Transplatation_of_assets = new models.instance.transplatation_of_assets({name: nameR, country: countryR });

        Transplatation_of_assets.amount = Number(amountR);
        
        Transplatation_of_assets.time_of_transplatation= new cassandra.types.LocalDate.fromString(
               timeR
            );
        Transplatation_of_assets.type= typeR;
        Transplatation_of_assets.lost_percent = Number(lost_percentR);

        Transplatation_of_assets.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});



var Asylum_application= models.loadSchema('asylum_application',  {
    fields:{
        name    : "text",
        time_of_asylum : "date",
        country    : "text",
        consent : "boolean",
        reason : "text"
    },
    key:["country","name"]
}) ;

console.log(models.instance.asylum_application === Asylum_application);


app.get('/asylum/:name',(req,res) => {

        const nameR = req.params.name;

        models.instance.asylum_application.findOne(
            {name: nameR}, 
            { raw: true, allow_filtering: true}, 
            (error, asylum_application) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
            
                res.send(asylum_application);
                           
            }
        });
});

app.delete('/asylum/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;
        var query_object = {name: nameR, country: countryR};
        models.instance.asylum_application.delete(
            query_object, 
            { raw: true, allow_filtering: true}, 
            (error, asylum_application) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись была удалена" );
            }   


        });
});


app.put('/asylum/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;

        var Asylum_application = new models.instance.asylum_application({name: nameR, country: countryR });

        
        if(req.body.time_of_asylum != "")
        {
            Asylum_application.time_of_asylum = new cassandra.types.LocalDate.fromString(
               req.body.time_of_asylum 
            );
        }
        if(req.body.consent != "")
        {
            Asylum_application.type = Boolean(req.body.consent);
        }

        if(req.body.reason != "")
        {
            Asylum_application.reason= req.body.reason;
        }

        Asylum_application.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице" );
            }    


        });
});

app.post('/asylum',(req,res) => {

        const nameR = req.body.name;
        const countryR = req.body.country;
        const timeR = req.body.time_of_asylum;
        const consentR = req.body.consent;
        const reasonR  = req.body.reason;

        var Asylum_application = new models.instance.asylum_application({name: nameR, country: countryR , reason: reasonR});

        
        Asylum_application.time_of_asylum= new cassandra.types.LocalDate.fromString(
               timeR
            );
        
        Asylum_application.consent = Boolean(consentR);

        Asylum_application.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});



var Сitizenship= models.loadSchema('citizenship',  {
    fields:{
        name    : "text",
        time_of_inquiry : "date",
        country    : "text",
        consent : "boolean",
        type : "text"
    },
    key:["country","name"]
}) ;

console.log(models.instance.citizenship === Сitizenship);

app.get('/citizenship/:name',(req,res) => {

        const nameR = req.params.name;

        models.instance.citizenship.findOne(
            {name: nameR}, 
            { raw: true, allow_filtering: true}, 
            (error, citizenship) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
            
                res.send(citizenship);
                           
            }
        });
});

app.delete('/citizenship/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;
        var query_object = {name: nameR, country: countryR};
        models.instance.citizenship.delete(
            query_object, 
            { raw: true, allow_filtering: true}, 
            (error, citizenship) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись была удалена" );
            }   


        });
});



app.put('/citizenship/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;

        var Сitizenship = new models.instance.citizenship({name: nameR, country: countryR });

        
        if(req.body.time_of_inquiry != "")
        {
            Сitizenship.time_of_inquiry = new cassandra.types.LocalDate.fromString(
               req.body.time_of_inquiry
            );
        }
        if(req.body.consent != "")
        {
            Сitizenship.type = Boolean(req.body.consent);
        }

        if(req.body.type!= "")
        {
            Сitizenship.type= req.body.type;
        }

        Сitizenship.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице" );
            }    


        });
});



app.post('/citizenship',(req,res) => {

        const nameR = req.body.name;
        const countryR = req.body.country;
        const timeR = req.body.time_of_inquiry;
        const consentR = req.body.consent;
        const typeR  = req.body.type;

        var Сitizenship = new models.instance.citizenship({name: nameR, country: countryR , type: typeR});

        
        Сitizenship.time_of_inquiry= new cassandra.types.LocalDate.fromString(
               timeR
            );
        
        Сitizenship.consent = Boolean(consentR);

        Сitizenship.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});


var Inquiry_departure= models.loadSchema('inquiry_departure',  {
    fields:{
        name    : "text",
        time_of_inquiry : "date",
        country    : "text",
        consent : "boolean"
    },
    key:["country","name"]
}) ;

console.log(models.instance.inquiry_departure === Inquiry_departure);


app.get('/inquiry_departure/:name',(req,res) => {

        const nameR = req.params.name;

        models.instance.inquiry_departure.findOne(
            {name: nameR}, 
            { raw: true, allow_filtering: true}, 
            (error, inquiry_departure) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
            
                res.send(inquiry_departure);
                           
            }
        });
});


app.delete('/inquiry_departure/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;
        var query_object = {name: nameR, country: countryR};
        models.instance.inquiry_departure.delete(
            query_object, 
            { raw: true, allow_filtering: true}, 
            (error, inquiry_departure) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись была удалена" );
            }   


        });
});


app.put('/inquiry_departure/:name/:country',(req,res) => {

        const nameR = req.params.name;
        const countryR = req.params.country;

        var Inquiry_departure = new models.instance.inquiry_departure({name: nameR, country: countryR });

        
        if(req.body.time_of_inquiry != "")
        {
            Inquiry_departure.time_of_inquiry = new cassandra.types.LocalDate.fromString(
               req.body.time_of_inquiry
            );
        }
        if(req.body.consent != "")
        {
            Inquiry_departure.type = Boolean(req.body.consent);
        }

       

        Inquiry_departure.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице" );
            }    


        });
});

app.post('/inquiry_departure',(req,res) => {

        const nameR = req.body.name;
        const countryR = req.body.country;
        const timeR = req.body.time_of_inquiry;
        const consentR = req.body.consent;
       

        var Inquiry_departure= new models.instance.inquiry_departure({name: nameR, country: countryR });

        
        Inquiry_departure.time_of_inquiry= new cassandra.types.LocalDate.fromString(
               timeR
            );
        
        Inquiry_departure.consent = Boolean(consentR);

        Inquiry_departure.save(
            (error) => 
        {
            res.set("Content-Type", "application/json");
            res.set("Access-Control-Allow-Origin", "*");
            if (error)
            {
                res.send({ 'error': error.message });
            }
            else
            {
                res.send("Запись появилась в таблице");
            }    


        });
});

