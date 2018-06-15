var mongoose = require('mongoose');
//var async = require("async");

//const Pig = require('../app/models').Pig;
//const Profile = require('../app/models').Profile;

var Country = require('../../Neo4j/routes/Countries'), 
    Pigs = require('../../Neo4j/routes/Pigs'), 
    Extraditions = require('../../Neo4j/routes/Extraditions'), 
    FillingForms = require('../../Neo4j/routes/FillingForms'), 
    RequestCitizenships = require('../../Neo4j/routes/RequestCitizenships'), 
    TransferOfAsserts = require('../../Neo4j/routes/TransferOfAsserts');

const Names = require('../../DataGen/Dictionaries').NamesDict;
const Places = require('../../DataGen/Dictionaries').PlacesDict;
const Actives = require('../../DataGen/Dictionaries').ActivesDict;
const Countries = require('../../DataGen/Dictionaries').CountriesDict;
const Connections = require('../../DataGen/Dictionaries').Connections;
const Types = require('../../DataGen/Dictionaries').type;

mongoose.connect('mongodb://localhost:27017/PetrPigLeavingRussia');
console.log("\nPetr pig is trying to leave Russia!\n\nConnecting to PetrPigLeavingRussia...");

var DataBase = mongoose.connection;
DataBase.on('error', console.error.bind(console, 'connection error:'));

var PigSchema = mongoose.Schema(
{
    Name: 
    {
        type: String, 
        required: [true, "Name of element of 5th column reqired!"]
    },
    DateOfBirth: 
    {
        type: Date, 
        required: [true, "Every pig has date of birth, so please let us know it."]
    },
    PlaceOfBirth: 
    {
        type: String,
        reqired: [true, "Where does pig born? Big brother must know."]
    },
    ListOfActives: 
    [
        {
            Type: 
            {
                type: String, 
                enum: ["Bitcoins", "Rubles"]
            },
            Value: 
            {
                type: Number,
                default: 0,
                min: 0
            }
        }
    ],
    PlaceOfLiving: 
    {
        type: String,
        reqired: [true, "You can mark your tractor as place of living."]
    }
});
console.log("Pig schema created!");

var ProfileSchema = mongoose.Schema(
{
    Pig: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pig",
        reqired: [true, "Profile without pig? Originally, but it won't work.('Pig' not filled)"]
    },
    Reason:
    {
        type: String,
        reqired: [true, "If you have no reasons for leave, then stay here.('Reason' not filled)"]
    }, 
    Destination:
    {
        type: String,
        reqired: [true, "'Destination unknown - tu tu du du' - that's song, and you must tell us where do you go.('Destination' not filled)"]
    },
    DateOfLeaving:
    {
        type: Date
    },
    DateOfReturning:
    {
        type: Date,
        reqired: [false, "We're looking forward to see you and your nologi again."]
    },
    SecondCitizenship:
    {
        type: Boolean,
        reqired: [true, "Can you be nice and try not to get it?^^(Fill 'SecondCitizenship' field with 'FALSE' 'FALSE' 'FALSE'...)"]
    },
    HaveExitPermit:
    {
        type: Boolean,
        reqired:[true, "Hey, you must fill it.('HaveExitPermit' not filled)"]
    }
});
console.log("Pig's profile schema created!");

const cassandra = require('cassandra-driver');
var ExpressCassandra = require('express-cassandra');
var models = ExpressCassandra.createClient(
{
    clientOptions: 
    {
        contactPoints: ['127.0.0.1'],
        keyspace: 'petr_pig',
        queryOptions: 
        {
            consistency: ExpressCassandra.consistencies.one
        }
    },
    ormOptions: 
    {
        defaultReplicationStrategy : 
        {
            class: 'SimpleStrategy',
            replication_factor: 1
        },
        migration: 'safe',
    }
});

var Departure= models.loadSchema('departure', 
{
    fields:
    {
        name : "text",
        time_of_departure : "date",
        country : "text",
        id: "int"
    },
    key:["country","name","id"]
}) ;
var Transplatation_of_assets= models.loadSchema('transplatation_of_assets', 
{
    fields:
    {
        name : "text",
        time_of_transplatation : "date",
        country : "text",
        type: "text",
        amount: "int",
        lost_percent :"int",
        id: "int"
    },
    key:["country","name","id"]
}) ;

var Asylum_application= models.loadSchema('asylum_application', 
{
    fields:
    {
        name : "text",
        time_of_asylum : "date",
        country : "text",
        consent : "boolean",
        reason : "text",
        id: "int"
    },
    key:["country","name","id"]
}) ;

var Сitizenship= models.loadSchema('citizenship', 
{
    fields:
    {
        name : "text",
        time_of_inquiry : "date",
        country : "text",
        consent : "boolean",
        type : "text",
        id: "int"
    },
    key:["country","name","id"]
}) ;

var Inquiry_departure= models.loadSchema('inquiry_departure', 
{
    fields:
    {
        name : "text",
        time_of_inquiry : "date",
        country : "text",
        consent : "boolean",
        id: "int"
    },
    key:["country","name","id"]
}) ;

var Pig = mongoose.model('Pig', PigSchema);
var Profile = mongoose.model('Profile', ProfileSchema);
console.log("Models created!");

for(var i = 0; i < 10; i++)
{
    DataBase.once('open', function () 
    {
        //console.log("Connected to PetrPigLeavingRussia!");
        var date = new Date(
            Math.floor(Math.random() * 2018) + 0, 
            Math.floor(Math.random() * 12) + 1, 
            Math.floor(Math.random() * 31) + 1);
        var regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/;
        var token_array = regex.exec(date.toJSON());
        var Petr = new Pig(
        {
            Name: Names[Math.floor(Math.random() * 174) + 0],
            DateOfBirth: token_array[0],
            PlaceOfBirth: Places[Math.floor(Math.random() * 77) + 0],
            PlaceOfLiving: Places[Math.floor(Math.random() * 77) + 0],
            ListOfActives: 
            [
                {
                    Type: Actives[Math.floor(Math.random() * 2) + 0],
                    Value: Math.floor(Math.random() * 1000000) + 1
                }
            ]
        });
        Petr.save(function (err, Petr) 
        {
            if (err)
                return console.error(err.message);
            console.log("Mongo pig id is: " + Petr._id);
            props = 
            {
                body:
                {
                    id: Petr._id,
                }
            };

            pig = Pigs.CreatePig(props);
            console.log("Neo pig id is: " + props.body.id);
            props.body.name = Countries[Math.floor(Math.random() * 262) + 0];

            country = Country.CreateCountry(props);
            console.log("Neo country name is: " + props.body.name);
            var conn =Connections[Math.floor(Math.random() * 4) + 0];
            switch(conn)
            {
                case "Extradition":
                {
                    Extraditions.CreateExtradition(props);
                    break;
                }
                case "FillingForm":
                {
                    FillingForms.CreateFillingForm(props);
                    break;
                }
                case "RequestCitizenship":
                {
                    RequestCitizenships.CreateRequestCitizenship(props);
                    break;
                }
                case "TransferOfAsserts":
                {
                    TransferOfAsserts.CreateTransferOfAsserts(props);
                    break;
                }
            }
            console.log("Neo connection is: " + conn);

            console.log('_____________Cassandra_____________');


            switch(Math.floor(Math.random() * 5) + 0)
            {
                case 0:
                {
                    const nameR = Petr.Name;//Names[Math.floor(Math.random() * 173) + 0];
                    const countryR = country//Countries[Math.floor(Math.random() * 261) + 0];

                    const timeR = (Math.floor(Math.random() * 2018) + 0).toString() + "-" + (Math.floor(Math.random() * 12) + 1).toString() + "-" + 
                        (Math.floor(Math.random() * 31) + 1).toString();
                    const idR = Petr._id;
                    var Departure = new models.instance.departure({name: nameR, country: countryR });

                    Departure.id = Number(idR);

                    Departure.time_of_departure = new cassandra.types.LocalDate.fromString(timeR);
                    Departure.save((error) => 
                    {
                        if (error)
                        {
                            console.log({ 'error': error.message });
                        }
                    });
                    break;
                }
                case 1:
                {
                    const nameR = Petr.Name;
                    const countryR = country;
                    const amountR = Math.floor(Math.random() * 10000) + 0;
                    const timeR = (Math.floor(Math.random() * 2018) + 0).toString() + "-" + (Math.floor(Math.random() * 12) + 1).toString() + "-" + 
                        (Math.floor(Math.random() * 31) + 1).toString();
                        
                    const typeR = Types[Math.floor(Math.random() * 3) + 0];
                    const lost_percentR  = Math.floor(Math.random() * 100) + 0;

                    var Transplatation_of_assets = new models.instance.transplatation_of_assets({name: nameR, country: countryR });

                    Transplatation_of_assets.amount = Number(amountR);
                    
                    Transplatation_of_assets.time_of_transplatation= new cassandra.types.LocalDate.fromString(timeR);
                    Transplatation_of_assets.type= typeR;
                    Transplatation_of_assets.lost_percent = Number(lost_percentR);

                    Transplatation_of_assets.save(
                        (error) => 
                    {
                        if (error)
                        {
                            console.log({ 'error': error.message });
                        }  
                    });
                    break;
                }
                case 2:
                {
                    break;
                }
                case 3:
                {
                    break;
                }
                case 4:
                {
                    break;
                }
            }
/*
            const nameR = Petr.Name;//Names[Math.floor(Math.random() * 173) + 0];
            const countryR = country//Countries[Math.floor(Math.random() * 261) + 0];

            const timeR = new Date(
                Math.floor(Math.random() * 2018) + 0, 
                Math.floor(Math.random() * 12) + 1, 
                Math.floor(Math.random() * 31) + 1);
            const idR = Petr._id;
            var Departure = new models.instance.departure({name: nameR, country: countryR });

            Departure.id = Number(idR);

            Departure.time_of_departure = new cassandra.types.LocalDate.fromString(timeR);
            Departure.save((error) => 
            {
                if (error)
                {
                    console.log({ 'error': error.message });
                }
            });*/

        });

        var date = new Date(
            Math.floor(Math.random() * 2018) + 0, 
            Math.floor(Math.random() * 12) + 1, 
            Math.floor(Math.random() * 31) + 1);
        var regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/;
        var token_array = regex.exec(date.toJSON());
        var reason = "";
        for(var j = 0; j < Math.floor(Math.random() * 100) + 1; j++)
        {
            reason += (String)(Math.floor(Math.random() * 100) + 1);
        }
        var PetrsProfile = new Profile(    
        {
            Pig: Petr._id,
            Reason: reason,
            Destination: Countries[Math.floor(Math.random() * 262) + 0],
            DateOfLeaving: token_array[0],
            SecondCitizenship: (Boolean)(Math.floor(Math.random() * 2) + 0),
            HaveExitPermit: (Boolean)(Math.floor(Math.random() * 2) + 0)
        });
        PetrsProfile.save(function (err, PetrsProfile) 
        {
            if (err)
                return console.error(err.message);
            console.log("Writing Petr's profile to PetrPigLeavingRussia ended. Petr id is: " + PetrsProfile._id);
        });

        
        //console.log("\nScript ended.\n"); 
    });
}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}