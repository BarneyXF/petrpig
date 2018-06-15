var Api = require('../Api/Api'), 
	writeError = require('../helpers/response').writeError,
	writeResponse = require('../helpers/response').writeResponse, 
    dbUtils = require('../Utils/DbUtils'), 
    _ = require('lodash');

exports.CreatePig = function (req, res, next) 
{
    var id = req.body.id;
	if(typeof id === "undefined")
    {
        throw {message: 'Pig\'s id undefined.', status: 400};
    }
    Api.CreatePigQuery(dbUtils.GetSession(req), id)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.GetPig = function (req, res, next) 
{
    var id = req.params.id;
	if(typeof id === "undefined")
    {
        throw {message: 'Pig\'s id undefined.', status: 400};
    }
    Api.ReadPigQuery(dbUtils.GetSession(req), id)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.UpdatePig = function (req, res, next) 
{
    var id = req.params.id;
    var newId = req.body.newId;
	if(typeof newId === "undefined" || typeof id === 'undefined')
    {
        throw {message: 'Nothing to update defined.', status: 400};
    }
    Api.UpdatePigQuery(dbUtils.GetSession(req), id, newId)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.DeletePig = function (req, res, next) 
{
    var id = req.params.id;
	if(typeof id === "undefined")
    {
        throw {message: 'Pig\'s id undefined.', status: 400};
    }
    Api.DeletePigQuery(dbUtils.GetSession(req), id)
        .then(response => writeResponse(res, response))
        .catch(next);
};