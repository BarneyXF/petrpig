var Api = require('../Api/Api'), 
	writeError = require('../helpers/response').writeError,
	writeResponse = require('../helpers/response').writeResponse, 
    dbUtils = require('../Utils/DbUtils'), 
    _ = require('lodash');

exports.CreateTransferOfAsserts = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.CreateTransferOfAssertsQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.GetTransferOfAsserts = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.ReadTransferOfAssertsQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.UpdateTransferOfAsserts = function (req, res, next) 
{
    var id = req.body.id;
    var name = req.body.name;
    var newId = req.body.newId;
	var newName = req.body.newName;
	if(typeof name === "undefined" || typeof id ===  "undefined" || (typeof newName === "undefined" && typeof newId ===  "undefined"))
    {
        throw {message: 'Nothing to update defined.', status: 400};
    }
    Api.UpdateTransferOfAssertsQuery(dbUtils.GetSession(req), id, name, newId, newName)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.DeleteTransferOfAsserts = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to delete defined.', status: 400};
    }
    Api.DeleteTransferOfAssertsQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};