var Api = require('../Api/Api'), 
	writeError = require('../helpers/response').writeError,
	writeResponse = require('../helpers/response').writeResponse, 
    dbUtils = require('../Utils/DbUtils'), 
    _ = require('lodash');

exports.CreateCountry = function (req, res, next) 
{
	var name = req.body.name;
	if(typeof name === "undefined")
    {
        throw {message: 'Country name undefined.', status: 400};
    }
	  Api.CreateCountryQuery(dbUtils.GetSession(req), name)
	  	.then(response => writeResponse(res, response))
	  	.catch(next);
};

exports.GetCountry = function (req, res, next) 
{
    var name = req.params.name;
	if(typeof name === "undefined")
    {
        throw {message: 'Country\'s name undefined.', status: 400};
    }
    Api.ReadCountryQuery(dbUtils.GetSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.UpdateCountry = function (req, res, next) 
{
    var name = req.params.name;
    var newName = req.body.newName;
	if(typeof newName === "undefined" || typeof name === 'undefined')
    {
        throw {message: 'Nothing to update defined.', status: 400};
    }
    Api.UpdateCountryQuery(dbUtils.GetSession(req), name, newName)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.DeleteCountry = function (req, res, next) 
{
    var name = req.params.name;
	if(typeof name === "undefined")
    {
        throw {message: 'Country\'s name undefined.', status: 400};
    }
    Api.DeleteCountryQuery(dbUtils.GetSession(req), name)
        .then(response => writeResponse(res, response))
        .catch(next);
};