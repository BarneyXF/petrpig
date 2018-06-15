//const Pig = require('../Mongo/app/models').Pig;
//const Profile = require('../Mongo/app/models').Profile;
var mongoose = require('mongoose');

var Country = require('../Neo4j/routes/Countries'), 
    Pigs = require('../Neo4j/routes/Pigs'), 
    Extraditions = require('../Neo4j/routes/Extraditions'), 
    FillingForms = require('../Neo4j/routes/FillingForms'), 
    RequestCitizenships = require('../Neo4j/routes/RequestCitizenships'), 
    TransferOfAsserts = require('../Neo4j/routes/TransferOfAsserts');

const Names = require('./Dictionaries').NamesDict;
const Places = require('./Dictionaries').PlacesDict;
const Actives = require('./Dictionaries').ActivesDict;
const Countries = require('./Dictionaries').CountriesDict;
const Connections = require('./Dictionaries').Connections;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const NumberOfDataElements = 20;

// Create data model

// Try insert it

InsertPigIntoMongo(null);

function randomDate()
{
    var startDate = new Date(1975, 0, 1).getTime();
    var endDate =  new Date(2018, 6, 1).getTime();
    var spaces = (endDate - startDate);
    var timestamp = Math.round(Math.random() * spaces);
    timestamp += startDate;
    return new Date(timestamp);
}

/**
 * * Insert pig into MongoDB.
 * @param node json object pig.
 */
function InsertPigIntoMongo(node)
{
    mongoose.connect('mongodb://localhost:27017/PetrPigLeavingRussia');
    console.log("\nPetr pig is trying to leave Russia!\n\nConnecting to PetrPigLeavingRussia...");

    var DataBase = mongoose.connection;
    DataBase.on('error', console.error.bind(console, 'connection error:'));
    var props = {};
    DataBase.once('open', function () 
    {
        console.log("Connected to PetrPigLeavingRussia!");

        for(var i = 0; i < NumberOfDataElements; i++)
        {
            console.log(i);
            var date = new Date(
                Math.floor(Math.random() * 2018) + 0, 
                Math.floor(Math.random() * 12) + 1, 
                Math.floor(Math.random() * 31) + 1);
            var regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/;
            var token_array = regex.exec(date.toJSON());
            var pig = new Pig(
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
            var waiting = true;
            pig.save(function (err, pig) 
            {
                waiting = false;
                if (err)
                    return console.error(err.message);
                console.log("Writing pig to PetrPigLeavingRussia ended. Petr id is: " + pig._id);
            });

            while(waiting)
            {
                sleep(2000);
                console.log(i);
            }

            var reason = "";
            for(var j = 0; j < Math.floor(Math.random() * 100) + 1; j++)
            {
                reason += (String)(Math.floor(Math.random() * 100) + 1);
            }

            date = new Date(
                Math.floor(Math.random() * 2018) + 0, 
                Math.floor(Math.random() * 12) + 1, 
                Math.floor(Math.random() * 31) + 1);
            var regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/;
            var token_array = regex.exec(date.toJSON());

            var PetrsProfile = new Profile(    
            {
                Pig: pig._id,
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
                console.log("Writing pig's profile to PetrPigLeavingRussia ended. pig id is: " + PetrsProfile._id);
            });

            props = 
            {
                id: pig._id,
            };

            pig = Pigs.CreatePig(props);

            props.name = Countries[Math.floor(Math.random() * 262) + 0];

            country = Country.CreateCountry(props);
            switch(Connections[Math.floor(Math.random() * 4) + 0])
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
            
        }
    });   
}

/**
 * * Insert profile into MongoDB.
 * @param node json object profile.
 */


/**
 * * Insert pig, country and connection into Neo4j.
 * @param node json object profile.
 */
function InsertIntoNeo(node, type)
{
    var queryUrl = 'http://localhost:8809/';
    var request = new XMLHttpRequest();

    var pig = 
    {
        id: node.id
    };

    var country = 
    {
        name: node.name
    };

    request.open('POST', queryUrl + 'pig', false);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(pig));

    if (request.status != 200) 
    {
        if(request.status != 404)
        {
            return {message: request.statusText, status: request.status };
        }
        return {message: "Neo4j api not availible.", status: 404 };
    } 
    request = new XMLHttpRequest();
    request.open('POST', queryUrl + 'country', false);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(country));
    if (request.status != 200 && request.status != 400) 
    {
        if(request.status != 404)
        {
            return {message: request.statusText, status: request.status };
        }
        return {message: "Neo4j api not availible.", status: 404 };
    }
    request = new XMLHttpRequest();
    request.open('POST', queryUrl + type, false);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(node));
    if (request.status != 200) 
    {
        if(request.status != 404)
        {
            return {message: request.statusText, status: request.status };
        }
        return {message: "Neo4j api not availible.", status: 404 };
    }
}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}