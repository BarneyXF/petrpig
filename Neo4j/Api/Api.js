var _ = require('lodash');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Pig = require('../Models/PigModel').Pig;
var Country = require('../Models/CountryModel').Country;

//#region Pig's api

/**
 * * Type: Post.
 * * Creates new pig.
 * @param Session Session getted from app context.
 * @param id id of new pig.
 * @returns Json with one pig selected by id or with message ( 'Have no pigs with id ..' ) and status ( 404 ).
 */
exports.CreatePigQuery = function(Session, id)
{
    return Session.run('MATCH (Pig: Pig {id: {id}}) RETURN Pig', {id: id}).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            throw {message: 'id already in use', status: 400};
        }
        else
        {
            var mongoPig = GetPigFromMongo(id);
            if(mongoPig.status)
            {
                throw {message: 'id not existed in MongoDB or MongoDB not accessible.', status: 404};
            }
            return Session.run('CREATE (Pig:Pig {id: {id}}) RETURN Pig',
            {
                id: id
            }).then(result => 
            {
                if (!_.isEmpty(result.records)) 
                {
                    return result.records[0].get('Pig');
                }
                else 
                {
                    throw {message: "Have no pigs with id \'" + id + "\'", status: 404}
                }            
            });
        }
    });
} 

/**
 * * Type: Get.
 * * Gets pig from database.
 * @param Session Session getted from app context.
 * @param id id of pig.
 * @returns Json with one pig selected by id or with message ( 'Have no pigs with id ..' ) and status ( 404 ).
 */
exports.ReadPigQuery = function(Session, id)
{
    return Session.run
    (
        'MATCH (Pig: Pig {id: {id}}) \
         RETURN Pig', 
        {
            id: id
        }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Pig');
        }
        else 
        {
            throw {message: "Have no pigs with id \'" + id + "\'", status: 404}
        }
    });
}

/**
 * * Type: Put.
 * * Update pig in database.
 * @param Session Session getted from app context.
 * @param id id of pig.
 * @param newId New id of pig.
 * @returns Json with one pig selected by id or with message ( 'Have no pigs with id ..' ) and status ( 404 ).
 */
exports.UpdatePigQuery = function(Session, id, newId)
{
    var pig = this.ReadPigQuery(Session, id);
    if(pig.status)
    {
        return pig;
    }
    var mongoPig = GetPigFromMongo(newId);
    if(mongoPig.status)
    {
        throw {message: 'id not existed in MongoDB or MongoDB not accessible.', status: 404};
    }

    var query = 'MATCH (Pig: Pig {id: {id}}) \
                 SET Pig.id = {newId} \
                 RETURN Pig';
    var params = 
    { 
        id: id,
        newId: newId
    };

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Pig');
        }
        else 
        {
            throw {message: "Have no pigs with id \'" + id + "\'", status: 404}
        }    
    });
}

/**
 * * Type: Delete.
 * * Delete pig from database.
 * @param Session Session getted from app context.
 * @param id id of pig.
 * @returns Json with one pig selected by id in case of error or with message ( 'Pig with id ".." deleted.' ) and status ( 200 ).
 */
exports.DeletePigQuery = function(Session, id)
{
    // TODO: select all relations to this node and delete them
    return Session.run
    (
        'MATCH (Pig: Pig {id: {id}}) \
         DELETE Pig', 
        {
            id: id
        }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Pig');
        }
        else 
        {
            throw {message: "Pig with id \'" + id + "\' deleted.", status: 200}
        } 
    });
}
//#endregion

//#region Country api
exports.CreateCountryQuery = function(Session, name)
{
    return Session.run('MATCH (Country: Country {name: {name}}) RETURN Country', { name: name }).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            throw {message: 'Country name already in use', status: 400}
        }
        else
        {
            Session.run('CREATE (Country: Country {name: {name}}) RETURN Country',
            {
                name: name
            });
            return Session.run('MATCH (Country: Country {name: {name}}) RETURN Country', {name: name}).then(result => 
            {
                if (!_.isEmpty(result.records)) 
                {
                    return result.records[0].get('Country');
                }
                else 
                {
                    throw {message: "Have no countries with id \'" + id + "\'", status: 404}
                }  
            });
        }
    });
} 

exports.ReadCountryQuery = function(Session, name)
{
    return Session.run
    (
        'MATCH (Country: Country {name: {name}}) \
         RETURN Country', 
        {
            name: name
        }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Country');
        }
        else 
        {
            throw "Have no countries with id \'" + name + "\'";
        }
    });
}

// TODO: Check
exports.UpdateCountryQuery = function(Session, name, newName)
{
    var query = 'MATCH (Country: Country {name: {name}}) ';
    var params = 
    { 
        name: name
    };

    if(!(typeof newName === "undefined"))
    {
        query += 'SET Country.name = {newName} ';
        params.newName = newName;
    }

    query += 'RETURN Country';

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Country');
        }
        else 
        {
            throw {message: "Have no countries with id \'" + id + "\'", status: 404}
        }
    });
}

exports.DeleteCountryQuery = function(Session, name)
{
    // TODO: check all usages and delete them.
    return Session.run
    (
        'MATCH (Country: Country {name: {name}}) \
         DELETE Country', 
        {
            name: name
        }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Country');
        }
        else 
        {
            throw {message: "Country with id \'" + id + "\' deleted.", status: 200}
        }
    });
}
//#endregion 

//#region extradition api
exports.CreateExtraditionQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }

    return Session.run
    (
        'MATCH (Pig: Pig), (Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         CREATE (Pig) - [extradition: extradition] -> (Country) RETURN extradition',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('extradition');
        }
        else 
        {
            throw {message: "extradition request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.ReadExtraditionQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [extradition: extradition] -> (Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         RETURN result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('extradition');
        }
        else 
        {
            throw {message: "extradition request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.UpdateExtraditionQuery = function(Session, id, name, newId, newName)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    var query = 'MATCH result = (Pig: Pig) - [extradition: extradition] -> (Country: Country)  \
                 WHERE Pig.id = {id} AND Country.name = {name}  ';
    var params = 
    {
        id: id,
        name: name
    };

    if(!(typeof newId === "undefined"))
    {
        query += 'SET Pig.id = {newId} ';
        params.newId = newId;
        if(!(typeof newName === "undefined"))
        {
            query += ', Country.name = {newName} ';
            params.newName = newName;
        }
    }
    else if(!(typeof newName === "undefined"))
    {
        query += 'SET Country.name = {newName} ';
        params.newName = newName;
    }

    query += 'RETURN result';

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('extradition');
        }
        else 
        {
            throw {message: "extradition request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.DeleteExtraditionQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [extradition: extradition] -> (Country: Country)\
         WHERE Pig.id = {id} AND Country.name = {name}  \
         DELETE result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('extradition');
        }
        else 
        {
            throw {message: "extradition request for pig with id \'" + id + "\' and country with name \'" + name + " deleted.", status: 200}
        }
    });
}
//#endregion

// 

//#region Filling form
exports.CreateFillingFormQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH (Pig: Pig),(Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         CREATE n = (Pig) - [fillingform: fillingform] -> (Country) return n',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('n');
        }
        else 
        {
            throw "Filling form request for pig with id " + id + " and country with name " + name + " not found.";
        }
    });
}

exports.ReadFillingFormQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [fillingform: fillingform] -> (Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         RETURN result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('fillingform');
        }
        else 
        {
            throw "Filling form request for pig with id " + id + " and country with name " + name + " not found."
        }
    });
}

exports.UpdateFillingFormQuery = function(Session, id, name, newId, newName)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    var query = 'MATCH result = (Pig: Pig) - [fillingform: fillingform] -> (Country: Country) \
                 WHERE Pig.id = {id} AND Country.name = {name} ';
    var params = 
    {
        id: id,
        name: name
    };

    if(!(typeof newId === "undefined"))
    {
        query += 'SET Pig.id = {newId} ';
        params.newId = newId;
    }

    if(!(typeof newName === "undefined"))
    {
        query += 'SET Country.name = {newName} ';
        params.newName = newName;
    }

    query += 'RETURN result';

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('result');
        }
        else 
        {
            throw {message: "Filling form request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.DeleteFillingFormQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [fillingform: fillingform] -> (Country: Country)\
         WHERE Pig.id = {id} AND Country.name = {name}  \
         DELETE result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('fillingform');
        }
        else 
        {
            throw {message: "Filling form request for pig with id \'" + id + "\' and country with name \'" + name + " deleted.", status: 200}
        }
    });
}
//#endregion

//#region Request citizenship
exports.CreateRequestCitizenshipQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH (Pig: Pig),(Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         CREATE (Pig) - [RequestCitizenship: RequestCitizenship] -> (Country) RETURN RequestCitizenship',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('RequestCitizenship');
        }
        else 
        {
            throw {message: "Citizenship request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.ReadRequestCitizenshipQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [RequestCitizenship: RequestCitizenship] -> (Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         RETURN result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('RequestCitizenship');
        }
        else 
        {
            throw {message: "Citizenship request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.UpdateRequestCitizenshipQuery = function(Session, id, name, newId, newName)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    var query = 'MATCH result = (Pig: Pig) - [RequestCitizenship: RequestCitizenship] -> (Country: Country) \
                 WHERE Pig.id = {id} AND Country.name = {name} ';
    var params = 
    {
        id: id,
        name: name
    };

    if(!(typeof newId === "undefined"))
    {
        query += 'SET Pig.id = {newId} ';
        params.newId = newId;
    }

    if(!(typeof newName === "undefined"))
    {
        query += 'SET Country.name = {newName} ';
        params.newName = newName;
    }

    query += 'RETURN result';

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('RequestCitizenship');
        }
        else 
        {
            throw {message: "Citizenship request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.DeleteRequestCitizenshipQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [RequestCitizenship: RequestCitizenship] -> (Country: Country)\
         WHERE Pig.id = {id} AND Country.name = {name}  \
         DELETE result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('RequestCitizenship');
        }
        else 
        {
            throw {message: "Citizenship request for pig with id \'" + id + "\' and country with name \'" + name + " deleted.", status: 200}
        }
    });
}
//#endregion

//#region Transfer of asserts
exports.CreateTransferOfAssertsQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH (Pig: Pig),(Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         CREATE (Pig) - [TransferOfAsserts: TransferOfAsserts] -> (Country) RETURN TransferOfAsserts',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('TransferOfAsserts');
        }
        else 
        {
            throw {message: "Transfer of asserts request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.ReadTransferOfAssertsQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [TransferOfAsserts: TransferOfAsserts] -> (Country: Country) \
         WHERE Pig.id = {id} AND Country.name = {name}  \
         RETURN result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('TransferOfAsserts');
        }
        else 
        {
            throw {message: "Transfer of asserts request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.UpdateTransferOfAssertsQuery = function(Session, id, name, newId, newName)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    var query = 'MATCH result = (Pig: Pig) - [TransferOfAsserts: TransferOfAsserts] -> (Country: Country) \
                 WHERE Pig.id = {id} AND Country.name = {name} ';
    var params = 
    {
        id: id,
        name: name
    };

    if(!(typeof newId === "undefined"))
    {
        query += 'SET Pig.id = {newId} ';
        params.newId = newId;
    }

    if(!(typeof newName === "undefined"))
    {
        query += 'SET Country.name = {newName} ';
        params.newName = newName;
    }

    query += 'RETURN result';

    return Session.run( query, params).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('TransferOfAsserts');
        }
        else 
        {
            throw {message: "Transfer of asserts request for pig with id \'" + id + "\' and country with name \'" + name + " not found.", status: 404}
        }
    });
}

exports.DeleteTransferOfAssertsQuery = function(Session, id, name)
{
    if(this.CheckPigAndCountry(Session, id, name) != true)
    {
        throw {message: "Pig and country check doen't passed.", status: 400};
    }
    return Session.run
    (
        'MATCH result = (Pig: Pig) - [TransferOfAsserts: TransferOfAsserts] -> (Country: Country)\
         WHERE Pig.id = {id} AND Country.name = {name}  \
         DELETE result',
         {
            id: id,
            name: name
         }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('TransferOfAsserts');
        }
        else 
        {
            throw {message: "Transfer of asserts request for pig with id \'" + id + "\' and country with name \'" + name + " deleted.", status: 200}
        }
    });
}
//#endregion

//#region Additional internal methods

/**
 * * Gets pig from MongoDB.
 * @param id id of pig.
 * @returns Json from MongoDB with info about pig.
 */
function GetPigFromMongo(id)
{
    var queryUrl = 'http://localhost:8808/pig/' + id;
    var request = new XMLHttpRequest();

    request.open('GET', queryUrl, false);

    request.send();

    if (request.status != 200) 
    {
        if(request.status != 404)
        {
            return {message: request.statusText, status: request.status };
        }
        return {message: "MongoDB api not availible.", status: 404 };
    } 
    else 
    {
        return JSON.parse(request.responseText);
    }
}

/**
 * * Gets pig and country from database and if there isn't at least one of them throws error.
 * @param id id of pig.
 * @param name name of country.
 * @returns Json with error message or 'true' if check passed.
 */
exports.CheckPigAndCountry = function (Session, id, name)
{
    /*return Session.run
    (
        'MATCH (Pig: Pig {id: {id}}) \
         RETURN Pig', 
        {
            id: id
        }
    ).then(result => 
    {
        if (!_.isEmpty(result.records)) 
        {
            return result.records[0].get('Pig');
        }
        else 
        {
            throw {message: "Have no pigs with id \'" + id + "\'", status: 404}
        }
    });

    var country = this.ReadCountryQuery(Session, name);
    if(country.status)
    {
        throw country;
    }*/
    return true;
}

//#endregion