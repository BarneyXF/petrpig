var ObjectId = require('mongodb').ObjectID;
var Pig = require('../models').Pig;
var Profile = require('../models').Profile;
var moment = require('moment');

module.exports = function(Application, Database)
{
    const Constants = require('../../config/Constants');
    
    Application.post('/pig', (Request, Response) => 
    {
        console.log(Request.body.DateOfBirth + " : " + Request.body.Name);
        var DateOfBirth = new Date(moment().format(Request.body.DateOfBirth, 'YYYY.MM.DD'));
        var pig = new Pig(
            {
                Name: Request.body.Name,
                DateOfBirth: DateOfBirth,
                PlaceOfBirth: Request.body.PlaceOfBirth,
                PlaceOfLiving: Request.body.PlaceOfLiving,
                ListOfActives: Request.body.ListOfActives
            }
        );
        pig.save((Error, Result) =>
        {
            Response.set("Content-Type", "application/json");
            Response.set("Access-Control-Allow-Origin", "*");
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send(Result);
                console.log(Request.body.Name + " writed to " + Constants.PigCollectionName);
            }
        });
    });

    Application.get('/pig/:id', (Request, Response) => 
    {
        const id = Request.params.id;
        const request = { '_id': new ObjectId(id) };

        Pig.findById(request, (Error, Result) => 
        {
            Response.set("Content-Type", "application/json");
            Response.set("Access-Control-Allow-Origin", "*");
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send(Result);
                console.log(Request.body.Name + " getted from " + Constants.PigCollectionName);
            }
        });
    });

    Application.delete('/pig/:id', (Request, Response) => 
    {
        const id = Request.params.id;
        const request = { '_id': new ObjectId(id) };

        Pig.findByIdAndRemove(request, (Error, Result) => 
        {
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send('Information about pig with id: ' + id + " deleted.");
                console.log('Information about pig with id: ' + id + " deleted from " + Constants.PigCollectionName);
            }
        });
    });

    Application.put('/pig/:id', (Request, Response) => 
    {
        
        const id = Request.params.id;
        const request = { '_id': new ObjectId(id) };

        var pig = {};

        if(Request.body.Name != "")
        {
            pig.Name = Request.body.Name;
        }
        if(Request.body.DateOfBirth != "")
        {
            var DateOfBirth = new Date(Request.body.DateOfBirth);
            pig.DateOfBirth = DateOfBirth;
        }
        if(Request.body.PlaceOfBirth != "")
        {
            pig.PlaceOfBirth = Request.body.PlaceOfBirth
        }
        if(Request.body.PlaceOfLiving != "")
        {
            pig.PlaceOfLiving = Request.body.PlaceOfLiving;
        }
        if(Request.body.PlaceOfLiving != "")
        {
            pig.PlaceOfLiving = Request.body.PlaceOfLiving;
        }
        if(Request.body.ListOfActives != "")
        {
            pig.ListOfActives = Request.body.ListOfActives;
        }

        Pig.update(request, pig, {new: true}, (Error, Result) => 
        {
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send(Result + " updated in " + Constants.PigCollectionName);
            }
        });
    });

    // Create profile route
    Application.post('/profile', (Request, Response) => 
    {
        var DateOfLeaving = new Date(Request.body.DateOfLeaving);
        const request = { '_id': new ObjectId(Request.body.Pig) };
        var result = Pig.findById(request, (Error, Result) => 
        {
            if(!Result)
            {
                Response.send({ 'Error': "Pig doesn't exists." });
            }
            else
            {
                var profile = new Profile(
                    {
                        Pig: Request.body.Pig,
                        Reason: Request.body.Reason,
                        Destination: Request.body.Destination,
                        DateOfLeaving: DateOfLeaving,
                        SecondCitizenship: Request.body.SecondCitizenship,
                        HaveExitPermit: Request.body.HaveExitPermit
                    }
                );
                profile.save((Error, Result) =>
                {
                    if(Error)
                    {
                        Response.send({ 'Error': Error });
                    }
                    else
                    {
                        Response.send(Result);
                        console.log(Request.body.Pig + " writed to " + Constants.ProfilesCollectionName);
                    }
                });
            }
        });
    });

    Application.get('/profile/:id', (Request, Response) => 
    {
        const id = Request.params.id;
        var request;
        try
        {
            request = { '_id': new ObjectId(id) };
        }
        catch(Exception)
        {
            console.log(Exception);
            Response.send({'Error': { 'message': Exception.toString() }  });
            return;
        }

        Profile.findById(request, (Error, Result) => 
        {
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send(Result);
                console.log(Request.body.Pig + " getted from " + Constants.ProfilesCollectionName);
            }
        });
    });

    Application.delete('/profile/:id', (Request, Response) => 
    {
        const id = Request.params.id;
        const request = { '_id': new ObjectId(id) };

        Profile.findByIdAndRemove(request, (Error, Result) => 
        {
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send('Information about profile with id: ' + id + " deleted.");
                console.log('Information about profile with id: ' + id + " deleted from " + Constants.ProfilesCollectionName);
            }
        });
    });

    Application.put('/profile/:id', (Request, Response) => 
    { 
        const id = Request.params.id;
        const request = { '_id': new ObjectId(id) };

        var profile = {};

        if(Request.body.Pig != "")
        {
            profile.Pig = Request.body.Pig;
        }
        if(Request.body.Reason != "")
        {
            profile.Reason = Request.body.Reason;
        }
        if(Request.body.Destination != "")
        {
            profile.Destination = Request.body.Destination;
        }
        if(!Request.body.DateOfLeaving)
        {
            var DateOfLeaving = new Date(Request.body.DateOfLeaving);
            profile.DateOfLeaving = DateOfLeaving;
        }
        if(!Request.body.DateOfReturning)
        {
            var DateOfReturning = new Date(Request.body.DateOfReturning);
            profile.DateOfReturning= DateOfReturning;
        }
        if(Request.body.SecondCitizenship != "")
        {
            profile.SecondCitizenship = Request.body.SecondCitizenship;
        }
        if(Request.body.HaveExitPermit != "")
        {
            profile.HaveExitPermit = Request.body.HaveExitPermit;
        }
        console.log(profile);
        Profile.findByIdAndUpdate(request, profile, (Error, Result) => 
        {
            console.log(Result);
            if(Error)
            {
                Response.send({ 'Error': Error });
            }
            else
            {
                Response.send(Result._id + " updated in " + Constants.ProfilesCollectionName);
            }
        });
    });
};